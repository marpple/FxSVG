import {entriesL, extend, flatL, go, join, mapL, object} from "fxjs2";
import { $$el } from "../../src/el/el.index.js";
import { makeRandomNumber } from "./makeRandomNumber.js";

export const makeMockRect = (attrs = {}) =>
  go(
    [
      mapL((k) => [k,makeRandomNumber(-100, 100)], ["x", "y"]),
      mapL((k) => [k,makeRandomNumber(1)], ["width", "height"]),
    ],
    flatL,
    object,
    (o) => extend(o, attrs),
    entriesL,
    mapL(([k, v]) => `${k}="${v}"`),
    join(" "),
    (attr_str) => `<rect ${attr_str}></rect>`,
    (svg_str) => $$el()(svg_str)
  );
