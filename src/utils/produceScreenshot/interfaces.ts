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

export interface screeningTypeType {
  G: string
  S: string
  E: string
}

export const screeningTypes: screeningTypeType = {
  "G": "guest",
  "S": "student",
  "E": "employee"
}

export interface GenerateScreenshotParams {
  firstName: string;
  lastName: string;
  email: string;
  isVaxxed: boolean;
  deviceName?: string;
  type?: keyof screeningTypeType;
}

export interface SubmitParams {
  Type: keyof screeningTypeType;
  IsOther: boolean;
  IsStudent: 0 | 1;
  FirstName: string;
  LastName: string;
  Email: string;
  State: string;
  Location: string;
  Floor: string | null;
  Answer1: 0 | 1;
  Answer2: 0 | 1;
  Answer3?: 0 | 1;
  Answer4?: 0 | 1;
}
