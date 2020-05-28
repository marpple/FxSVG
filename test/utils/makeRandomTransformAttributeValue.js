import { makeRandomNumber } from "./makeRandomNumber.js";
import { makeRandomTransformStringList } from "./makeRandomTransformStringList.js";

export const makeRandomTransformAttributeValue = (
  min = 0,
  max = 100,
  random = makeRandomNumber
) => makeRandomTransformStringList(min, max, random).join(" ");
