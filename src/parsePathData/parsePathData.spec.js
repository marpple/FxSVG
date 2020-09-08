import { expect } from "chai";
import { mapL, rangeL } from "fxjs2";
import { makeRandomInt } from "../../test/utils/makeRandomInt.js";
import { $$parsePathDate } from "./parsePathData.index.js";

export default ({ describe, it }) => [
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
