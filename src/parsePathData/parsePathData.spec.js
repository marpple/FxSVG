import { expect } from "chai";
import {
  chunkL,
  concatL,
  deepFlatL,
  go,
  join,
  map,
  mapL,
  rangeL,
  take,
  takeAll,
} from "fxjs2";
import { makeRandomBool } from "../../test/utils/makeRandomBool.js";
import { makeRandomInt } from "../../test/utils/makeRandomInt.js";
import {
  $$isValidPathData,
  $$splitPathDataByCommandL,
  $$parsePathDate,
  $$parsePathCommandParameters,
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
  describe(`$$parsePathCommandParameters`, function () {
    it(`The function parse parameters string for "M", "m", "L", "l", "T", "t" commands into the array of coordinate pairs.`, function () {
      const parameters = map(
        () => map(() => makeRandomInt(-100, 100), rangeL(2)),
        rangeL(4)
      );
      for (const command of ["M", "m", "L", "l", "T", "t"]) {
        // given
        const path_data = `${command} ${join(
          ", ",
          mapL(join(" "), parameters)
        )}`;

        // when
        const [
          { command: receive_command, parameters: receive_parameters },
        ] = mapL($$parsePathCommandParameters, $$splitPathDataByCommandL(path_data));

        // then
        expect(receive_command).equal(command);
        expect(receive_parameters).deep.equal(parameters);
      }
    });

    it(`The function parse parameters string for "H", "h", "V", "v" commands into the array of coordinates.`, function () {
      const parameters = map(() => makeRandomInt(-100, 100), rangeL(10));
      for (const command of ["H", "h", "V", "v"]) {
        // given
        const path_data = `${command} ${join(", ", parameters)}`;

        // when
        const [
          { command: receive_command, parameters: receive_parameters },
        ] = mapL($$parsePathCommandParameters, $$splitPathDataByCommandL(path_data));

        // then
        expect(receive_command).equal(command);
        expect(receive_parameters).deep.equal(parameters);
      }
    });

    it(`The function parse parameters string for "C", "c" commands into the array of coordinate pair triplets.`, function () {
      const parameters = go(
        rangeL(Infinity),
        mapL(() => makeRandomInt(-100, 100)),
        chunkL(2),
        chunkL(3),
        take(6)
      );
      for (const command of ["C", "c"]) {
        // given
        const path_data = go(
          parameters,
          mapL(deepFlatL),
          mapL(join(" ")),
          join(", "),
          (parameters) => `${command} ${parameters}`
        );

        // when
        const [
          { command: receive_command, parameters: receive_parameters },
        ] = mapL($$parsePathCommandParameters, $$splitPathDataByCommandL(path_data));

        // then
        expect(receive_command).equal(command);
        expect(receive_parameters).deep.equal(parameters);
      }
    });

    it(`The function parse parameters string for "S", "s", "Q", "q" commands into the array of coordinate pair doubles.`, function () {
      const parameters = go(
        rangeL(Infinity),
        mapL(() => makeRandomInt(-100, 100)),
        chunkL(2),
        chunkL(2),
        take(6)
      );
      for (const command of ["S", "s", "Q", "q"]) {
        // given
        const path_data = go(
          parameters,
          mapL(deepFlatL),
          mapL(join(" ")),
          join(", "),
          (parameters) => `${command} ${parameters}`
        );

        // when
        const [
          { command: receive_command, parameters: receive_parameters },
        ] = mapL($$parsePathCommandParameters, $$splitPathDataByCommandL(path_data));

        // then
        expect(receive_command).equal(command);
        expect(receive_parameters).deep.equal(parameters);
      }
    });

    it(`The function parse parameters string for "A", "a" commands into the array of elliptical arc args.`, function () {
      const parameters = go(
        rangeL(Infinity),
        mapL(() => makeRandomInt(-100, 100)),
        chunkL(3),
        mapL((l) =>
          concatL(
            l,
            mapL(() => (makeRandomBool() ? 0 : 1), rangeL(2))
          )
        ),
        mapL((l) =>
          concatL(
            l,
            mapL(() => makeRandomInt(-100, 100), rangeL(2))
          )
        ),
        mapL(takeAll),
        take(4)
      );
      for (const command of ["A", "a"]) {
        // given
        const path_data = go(
          parameters,
          mapL(join(" ")),
          join(", "),
          (parameters) => `${command} ${parameters}`
        );

        // when
        const [
          { command: receive_command, parameters: receive_parameters },
        ] = mapL($$parsePathCommandParameters, $$splitPathDataByCommandL(path_data));

        // then
        expect(receive_command).equal(command);
        expect(receive_parameters).deep.equal(parameters);
      }
    });

    it(`The function parse parameters string for "Z", "z" commands into the empty array.`, function () {
      for (const command of ["Z", "z"]) {
        // given
        const path_data = command;

        // when
        const [
          { command: receive_command, parameters: receive_parameters },
        ] = mapL($$parsePathCommandParameters, $$splitPathDataByCommandL(path_data));

        // then
        expect(receive_command).equal(command);
        expect(receive_parameters).deep.equal([]);
      }
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
