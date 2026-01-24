export const create = async ({ model, data }) => {
  return await model.create(data);
};

export const findByEmail = ({ model, email }) => {
  return model.findOne({ email });
};

export const findById = ({ model, id, includeFrozen = false }) => {
  const filter = { _id: id };
  if (!includeFrozen) filter.freezeUser = { $ne: true };
  return model.findOne(filter);
};

export const save = (doc) => doc.save();

export const updateOne = ({
  filter = {},
  updateData = {},
  options = { runValidators: true },
  model,
}) => {
  return model.updateOne(filter, updateData, options);
};

export const findByIdAndUpdate = ({
  id,
  updateData = {},
  options = {},
  model,
}) => {
  return model.findByIdAndUpdate(id, updateData, options);
};

export const findByIdAndDelete = ({ id, options = {}, model }) => {
  return model.findByIdAndDelete(id, options);
};

export const findOne = ({data, model}) => {
  return model.findOne(data);
};
