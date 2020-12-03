import {
  entriesL,
  extend,
  flatL,
  go,
  isNil,
  join,
  mapL,
  object,
  rejectL,
} from "fxjs/esm";
import { $$el } from "../../src/el/el.index.js";
import { makeRandomNumber } from "./makeRandomNumber.js";

export const makeMockRect = (attrs = {}) =>
  go(
    [
      mapL((k) => [k, makeRandomNumber(-100, 100)], ["x", "y"]),
      mapL((k) => [k, makeRandomNumber(1)], ["width", "height"]),
    ],
    flatL,
    object,
    (o) => extend(o, attrs),
    entriesL,
    rejectL(([, v]) => isNil(v)),
    mapL(([k, v]) => `${k}="${v}"`),
    join(" "),
    (attr_str) => `<rect ${attr_str}></rect>`,
    (svg_str) => $$el(svg_str)()
  );
