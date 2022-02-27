import { ProcessParams } from "../interfaces";

export default async function logSuccess(
  params: ProcessParams,
  success: boolean,
  timeElapsed?: number
) {
  if (success) {
    await params.auto?.logChannel.send(
      `Finished screening **${params.auto.batchTime[0]}:${
        params.auto.batchTime[1]
      }::${params.auto.itemNumber}** in ${(timeElapsed! / 1000).toFixed(
        2
      )} seconds`
    );
  } else {
    await params.auto?.logChannel.send(
      `Failed screening **${params.auto.batchTime[0]}:${params.auto.batchTime[1]}::${params.auto.itemNumber}**`
    );
  }
}
