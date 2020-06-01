import { makeRandomInt } from "./makeRandomInt.js";
import { makeRandomNumber } from "./makeRandomNumber.js";
import { makeRandomTransformString } from "./makeRandomTransformString.js";

export const makeRandomTransformStringList = (
  min,
  max,
  random = makeRandomNumber
) =>
  [...Array(makeRandomInt(min, max))].map(() =>
    makeRandomTransformString(random)
  );
