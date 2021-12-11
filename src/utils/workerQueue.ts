/**
 * Copyright (C) 2021 PythonCoderAS
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * The item type.
 * @private
 */
interface ItemType<T, RT> {
  item: T;
  resolver: (result: RT) => void;
}

/**
 * Implements a priority worker queue.
 *
 * The internal data structure is an object of priority keys mapping to arrays. This means that shift operations **are**
 * O(n) instead of O(1), but since the queue is small and not expected to be rapidly changing size that doesn't matter.
 *
 * All priorities are supposed to be >=0. This queue will pop the item at the highest priority **first**.
 *
 * The queue has a limit on the number of concurrent operations that can be ran.
 *
 * @property {(item) => Promise} worker The worker function. Must take an item and return a promise.
 * @property {number} concurrency The number of concurrent operations that can be ran.
 *
 * @todo Actually utilize a queue for the values instead of an array, as those are guaranteed to be O(1) on enqueue and dequeue operations.
 * @todo Use a Map instead of an Object.
 */
export class WorkerQueue<T, RT> {
  private _arr: { [item: number]: ItemType<T, RT>[] } = {};
  private _running = 0;
  public readonly worker: (item: T) => Promise<RT>;
  public readonly limit: number;

  public constructor(options: {
    worker: (item: T) => Promise<RT>;
    limit?: number;
  }) {
    this.worker = options.worker;
    this.limit = options.limit || 1;
  }

  public enqueue(item: T, priority: number): Promise<RT> {
    return new Promise((resolve) => {
      this._arr[priority] = this._arr[priority] || [];
      this._arr[priority].push({ item, resolver: resolve });
      this._loop();
    });
  }

  private getHighestPriority(): number {
    let highestPriority = -1;
    for (const priority in this._arr) {
      if (Object.prototype.hasOwnProperty.call(this._arr, priority)) {
        highestPriority = Math.max(highestPriority, parseInt(priority, 10));
      }
    }
    return highestPriority;
  }

  public isEmpty(): boolean {
    return this.getHighestPriority() === -1;
  }

  public determineNextPosition(priority: number): number {
    if (this._running < this.limit) {
      return 0;
    } else {
      // To get the next position, it will be processed after all the items with the same priority or higher
      // priority than the specified number.
      return (
        Object.entries(this._arr)
          // Filter out all the items with lower priority
          .filter((value) => Number.parseInt(value[0], 10) >= priority)
          // Map the key-value pair to the value array's length
          .map((value) => value[1].length)
          // Sum up all the lengths and add 1 to get the next position
          .reduce((a, b) => a + b, 0) + 1
      );
    }
  }

  public willQueue(): boolean {
    return this._running >= this.limit;
  }

  private _loop(): void {
    if (this._running < this.limit && !this.isEmpty()) {
      const highestPriorityArray = this._arr[this.getHighestPriority()];
      const item: ItemType<T, RT> = highestPriorityArray.shift();
      if (highestPriorityArray.length === 0) {
        delete this._arr[this.getHighestPriority()];
      }
      this._running++;
      this.worker(item.item).then((result: RT) => {
        item.resolver(result);
        this._running--;
        this._loop();
      });
    }
  }
}
