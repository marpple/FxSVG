import { makeRandomNumber } from "./makeRandomNumber.js";

export const makeRandomTransformString = () =>
  [
    `translate(${makeRandomNumber()} ${makeRandomNumber()})`,
    `rotate(${makeRandomNumber()} ${makeRandomNumber()} ${makeRandomNumber()})`,
    `scale(${makeRandomNumber()} ${makeRandomNumber()})`,
    `matrix(${[...Array(6)].map(() => makeRandomNumber()).join(" ")})`,
  ][Math.floor(Math.random() * 4)];
