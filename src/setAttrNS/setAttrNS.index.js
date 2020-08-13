export const $$setAttrNS = ([key, value], namespace = null) => (el) =>
  el.setAttributeNS(namespace, key, value);
