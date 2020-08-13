export const $$hasAttrNS = (key, namespace = null) => (el) =>
  el.hasAttributeNS(namespace, key);
