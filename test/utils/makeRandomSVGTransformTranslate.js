import { go, mapL, rangeL } from "fxjs/esm";
import { $$createSVGTransformTranslate } from "../../src/createSVGTransformTranslate/createSVGTransformTranslate.index.js";
import { makeRandomNumber } from "./makeRandomNumber.js";

export const makeRandomSVGTransformTranslate = (
  random = () => makeRandomNumber(-100, 100)
) =>
  go(rangeL(2), mapL(random), ([tx, ty]) =>
    $$createSVGTransformTranslate({ tx, ty })()
  );
