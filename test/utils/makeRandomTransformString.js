import { makeRandomNumber } from "./makeRandomNumber.js";

export const makeRandomTransformString = (random = makeRandomNumber) =>
  [
    `translate(${random()} ${random()})`,
    `rotate(${random()} ${random()} ${random()})`,
    `scale(${random()} ${random()})`,
    `matrix(${[...Array(6)].map(() => random()).join(" ")})`,
  ][Math.floor(Math.random() * 4)];
