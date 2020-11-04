import { go, head, mapL, rangeL, rejectL } from "fxjs";
import { makeRandomNumber } from "./makeRandomNumber.js";

export const makeRandomNumberExcept = (min = 0, max = 1000, excepts = []) => {
  excepts = new Set(excepts);
  return go(
    rangeL(Infinity),
    mapL(() => makeRandomNumber(min, max)),
    rejectL((a) => excepts.has(a)),
    head
  );
};
