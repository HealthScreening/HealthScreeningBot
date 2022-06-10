import { Model, WhereOptions } from "sequelize";

// eslint-disable-next-line no-use-before-define -- Looks really ugly if order is changed
export default async function createOrUpdate<M extends Model<MT, MCT>, MT, MCT>(
  model,
  newValues: MCT,
  condition: WhereOptions<MCT>
): Promise<M> {
  const record = await model.findOne({ where: condition });
  if (record) {
    await record.update(newValues);
    return record;
  }

  return model.create(newValues);
}
