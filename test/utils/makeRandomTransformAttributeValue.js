import { join } from "fxjs2";
import { makeRandomNumber } from "./makeRandomNumber.js";
import { makeRandomTransformStringList } from "./makeRandomTransformStringList.js";

export const makeRandomTransformAttributeValue = (
  min = 0,
  max = 100,
  random = makeRandomNumber
) => join(" ", makeRandomTransformStringList(min, max, random));
