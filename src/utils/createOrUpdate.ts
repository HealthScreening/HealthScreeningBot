import { Model } from "sequelize";

export default async function createOrUpdate<M extends Model<MT, MCT>, MT, MCT>(
  model,
  newValues: MCT,
  condition: object
): Promise<M> {
  const record = await model.findOne({ where: condition });
  if (record) {
    await record.update(newValues);
    return record;
  } else {
    return model.create(newValues);
  }
}
