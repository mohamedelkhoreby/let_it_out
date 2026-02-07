export const create = async ({ model, data, session }) => {
  return await model.create([data], { session });
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
  session,
}) => {
  return model.updateOne(filter, updateData, { ...options, session });
};



export const findByIdAndDelete = ({ id, options = {}, model }) => {
  return model.findByIdAndDelete(id, options);
};

export const findOne = ({ filter = {}, model, session }) => {
  return model.findOne(filter).session(session);
};

export const findByIdAndUpdate = ({
  id,
  updateData = {},
  options = {},
  model,
  session,
}) => {
  return model.findByIdAndUpdate(id, updateData, { ...options, session });
};
