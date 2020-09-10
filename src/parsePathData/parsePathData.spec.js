import { expect } from "chai";
import { mapL, rangeL } from "fxjs2";
import { makeRandomInt } from "../../test/utils/makeRandomInt.js";
import { $$isValidPathData, $$parsePathDate } from "./parsePathData.index.js";

export default ({ describe, it }) => [
  describe(`$$isValidPathData`, function () {
    it(`The function returns true if the input value is a valid path data string.`, function () {
      // given
      const d_str = `
        M 1 2, 3 4
        L 1 2, 3 4, 5 6
        H 1, 2, 3
        V 4, 5, 6
        C 1 2 3 4 5 6, 7 8 9 1 2 3
        S 1 2 3 4, 5 6 7 8
        Q 1 2 3 4, 5 6 7 8
        T 1 2, 3 4
        A 1 2 3 0 1 4 5, 6 7 8 1 0 9 8
        Z
        m 1 2, 3 4
        l 1 2, 3 4, 5 6
        h 1, 2, 3
        v 4, 5, 6
        c 1 2 3 4 5 6, 7 8 9 1 2 3
        s 1 2 3 4, 5 6 7 8
        q 1 2 3 4, 5 6 7 8
        t 1 2, 3 4
        a 1 2 3 0 1 4 5, 6 7 8 1 0 9 8
        z
      `;

      // when
      const is_valid = $$isValidPathData(d_str);

      // then
      expect(is_valid).true;
    });

    it(`The function returns false if the input value has invalid command.`, function () {
      // given
      const d_str = `
        M 1 2, 3 4
        L 1 2, 3 4, 5 6
        H 1, 2, 3
        V 4, 5, 6
        C 1 2 3 4 5 6, 7 8 9 1 2 3
        S 1 2 3 4, 5 6 7 8
        Q 1 2 3 4, 5 6 7 8
        T 1 2, 3 4
        A 1 2 3 0 1 4 5, 6 7 8 1 0 9 8
        Z
        m 1 2, 3 4
        l 1 2, 3 4, 5 6
        h 1, 2, 3
        v 4, 5, 6
        c 1 2 3 4 5 6, 7 8 9 1 2 3
        s 1 2 3 4, 5 6 7 8
        q 1 2 3 4, 5 6 7 8
        t 1 2, 3 4
        a 1 2 3 0 1 4 5, 6 7 8 1 0 9 8
        z
        K
      `;

      // when
      const is_valid = $$isValidPathData(d_str);

      // then
      expect(is_valid).false;
    });
  }),
  describe(`$$parsePathData`, function () {
    describe(`parse "move to" command`, function () {
      it(`command "M" with a single parameter`, function () {
        // given
        const [x, y] = mapL(() => makeRandomInt(-100, 100), rangeL(2));
        const path_data = `M ${x},${y}`;

        // when
        const parsed_data = $$parsePathDate(path_data);

        // then
        expect(parsed_data).length(1);
        expect(parsed_data[0].command).equal("M");
        expect(parsed_data[0].parameters).deep.equal([[x, y]]);
      });
    });

    describe(`parse "line to" command`, function () {
      it(`command "L" with a single parameter`, function () {
        // given
        const [x, y] = mapL(() => makeRandomInt(-100, 100), rangeL(2));
        const path_data = `L ${x} ${y}`;

        // when
        const parsed_data = $$parsePathDate(path_data);

        // then
        expect(parsed_data).length(1);
        expect(parsed_data[0].command).equal("L");
        expect(parsed_data[0].parameters).deep.equal([[x, y]]);
      });
    });
  }),
];
