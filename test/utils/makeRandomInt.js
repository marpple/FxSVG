import { makeRandomNumber } from "./makeRandomNumber.js";

export const makeRandomInt = (min = 0, max = 1000) =>
  Math.floor(makeRandomNumber(Math.ceil(min), max));
