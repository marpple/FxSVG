export const $$consolidateTransformList = (transform_list) => {
  const consolidated_transform = transform_list.consolidate();

  if (!consolidated_transform) return transform_list;

  transform_list.initialize(consolidated_transform);
  return transform_list;
};
