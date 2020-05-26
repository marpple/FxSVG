import { makeRandomNumber } from "./makeRandomNumber.js";

export const makeRandomInt = (size = 1000) =>
  Math.round(makeRandomNumber(size));
