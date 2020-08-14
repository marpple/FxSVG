import { $qsa } from "fxdom";
import { each, isString } from "fxjs2";

export const _baseOnOff = (method) => (event, f, ...opts) => (el) => (
  isString(f)
    ? each((el) => el[method](event, ...opts), $qsa(f, el))
    : el[method](event, f, ...opts),
  el
);
