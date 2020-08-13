export const $$getAttrNS = (key, namespace = null) => (el) =>
  el.getAttributeNS(namespace, key);
