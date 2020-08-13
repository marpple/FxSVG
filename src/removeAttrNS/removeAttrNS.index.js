export const $$removeAttrNS = (key, namespace = null) => (el) =>
  el.removeAttributeNS(namespace, key);
