import chai from "chai";
import { equals2, go, map, mapL, rangeL } from "fxjs";
import { makeRandomInt } from "../../test/utils/makeRandomInt.js";
import { makeRandomNumber } from "../../test/utils/makeRandomNumber.js";
import { $$getBoundingPoints } from "./getBoundingPoints.index.js";

const { expect } = chai;

export default ({ describe, it }) => [
  describe(`$$getBoundingPoints`, function () {
    it(`The function returns two points whose x, y are min and max within the given points.`, function () {
      // given
      const min_x = makeRandomNumber(-700, 700);
      const min_y = makeRandomNumber(-700, 700);
      const max_x = makeRandomNumber(min_x + 1, 1400);
      const max_y = makeRandomNumber(min_y + 1, 1400);
      const points = go(
        makeRandomInt(1),
        rangeL,
        mapL(() => makeRandomInt(0, 5)),
        map((flag) => {
          if (equals2(flag, 1)) {
            const x = min_x;
            const y = makeRandomNumber(min_y, max_y);
            return {
              x,
              y,
            };
          }

          if (equals2(flag, 2)) {
            const x = max_x;
            const y = makeRandomNumber(min_y, max_y);
            return {
              x,
              y,
            };
          }

          if (equals2(flag, 3)) {
            const x = makeRandomNumber(min_x, max_x);
            const y = min_y;
            return {
              x,
              y,
            };
          }

          if (equals2(flag, 4)) {
            const x = makeRandomNumber(min_x, max_x);
            const y = max_y;
            return {
              x,
              y,
            };
          }

          const x = makeRandomNumber(min_x, max_x);
          const y = makeRandomNumber(min_y, max_y);
          return {
            x,
            y,
          };
        })
      );

      // when
      const [min, max] = $$getBoundingPoints(points);

      // then
      expect(min.x).equal(min_x);
      expect(min.y).equal(min_y);
      expect(max.x).equal(max_x);
      expect(max.y).equal(max_y);
    });
  }),
];
