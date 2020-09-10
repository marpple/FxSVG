import { expect } from "chai";
import { mapL, rangeL } from "fxjs2";
import { makeRandomInt } from "../../test/utils/makeRandomInt.js";
import {
  $$isValidPathData,
  $$splitPathDataByCommandL,
  $$parsePathDate,
} from "./parsePathData.index.js";

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
        K 1 2
      `;
      // last "K" is invalid command.

      // when
      const is_valid = $$isValidPathData(d_str);

      // then
      expect(is_valid).false;
    });
  }),
  describe(`$$splitPathDataByCommandL`, function () {
    it(`The function yield each command and parameters of the command`, function () {
      // given
      const path_data = `
        M 10 20
        L 10 20 30 40
        C 10 20 30 40 50 60
        Z
      `;

      // when
      const iter = $$splitPathDataByCommandL(path_data);
      const {
        value: { command: command1, parameters: parameters1 },
        done: done1,
      } = iter.next();
      const {
        value: { command: command2, parameters: parameters2 },
        done: done2,
      } = iter.next();
      const {
        value: { command: command3, parameters: parameters3 },
        done: done3,
      } = iter.next();
      const {
        value: { command: command4, parameters: parameters4 },
        done: done4,
      } = iter.next();
      const { value, done: done5 } = iter.next();

      // then
      expect(done1).false;
      expect(command1).equal("M");
      expect(parameters1).equal("10 20");

      expect(done2).false;
      expect(command2).equal("L");
      expect(parameters2).equal("10 20 30 40");

      expect(done3).false;
      expect(command3).equal("C");
      expect(parameters3).equal("10 20 30 40 50 60");

      expect(done4).false;
      expect(command4).equal("Z");
      expect(parameters4).equal("");

      expect(done5).true;
      expect(value).undefined;
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
