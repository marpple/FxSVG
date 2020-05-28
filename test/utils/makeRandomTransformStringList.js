import {makeRandomNumber} from "./makeRandomNumber.js";
import { makeRandomTransformString } from "./makeRandomTransformString.js";

export const makeRandomTransformStringList = (min, max, random = makeRandomNumber) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  const l = min + Math.floor(Math.random() * (max - min));

  return [...Array(l)].map(() => makeRandomTransformString(random));
};
