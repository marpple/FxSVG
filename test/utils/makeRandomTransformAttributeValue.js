import { makeRandomTransformStringList } from "./makeRandomTransformStringList.js";

export const makeRandomTransformAttributeValue = (min = 0, max = 100) =>
  makeRandomTransformStringList(min, max).join(" ");
