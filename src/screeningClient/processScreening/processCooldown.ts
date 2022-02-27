import { ProcessParams } from "../interfaces";

export default function processCooldown(params: ProcessParams) {
  if (params.cooldown?.id) {
    params.cooldown?.container.delete(params.cooldown?.id);
  }
}
