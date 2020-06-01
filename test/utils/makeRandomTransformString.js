import { makeRandomInt } from "./makeRandomInt.js";
import { makeRandomNumber } from "./makeRandomNumber.js";

export const makeRandomTransformString = (random = makeRandomNumber) =>
  [
    `translate(${random()} ${random()})`,
    `rotate(${random()} ${random()} ${random()})`,
    `scale(${random()} ${random()})`,
    `matrix(${[...Array(6)].map(() => random()).join(" ")})`,
  ][makeRandomInt(0, 4)];
