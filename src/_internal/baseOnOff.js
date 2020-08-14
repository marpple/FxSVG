import { each, isString } from "fxjs2";
import { $$qsa } from "../qsa/qsa.index.js";

export const _baseOnOff = (method) => (event, f, ...opts) => (el) => (
  isString(f)
    ? each((el) => el[method](event, ...opts), $$qsa(f, el))
    : el[method](event, f, ...opts),
  el
);
