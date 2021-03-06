import { go, map, rangeL } from "fxjs/es";
import { makeRandomInt } from "./makeRandomInt.js";
import { makeRandomNumber } from "./makeRandomNumber.js";
import { makeRandomTransformString } from "./makeRandomTransformString.js";

export const makeRandomTransformStringList = (
  min,
  max,
  random = makeRandomNumber
) =>
  go(
    makeRandomInt(min, max),
    rangeL,
    map(() => makeRandomTransformString(random))
  );
