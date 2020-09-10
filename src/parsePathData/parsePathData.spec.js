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
  $$convertPathCommandParametersRelativeToAbsoluteL,
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
        ] = mapL(
          $$parsePathCommandParameters,
          $$splitPathDataByCommandL(path_data)
        );

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
        ] = mapL(
          $$parsePathCommandParameters,
          $$splitPathDataByCommandL(path_data)
        );

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
        ] = mapL(
          $$parsePathCommandParameters,
          $$splitPathDataByCommandL(path_data)
        );

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
        ] = mapL(
          $$parsePathCommandParameters,
          $$splitPathDataByCommandL(path_data)
        );

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
        ] = mapL(
          $$parsePathCommandParameters,
          $$splitPathDataByCommandL(path_data)
        );

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
        ] = mapL(
          $$parsePathCommandParameters,
          $$splitPathDataByCommandL(path_data)
        );

        // then
        expect(receive_command).equal(command);
        expect(receive_parameters).deep.equal([]);
      }
    });
  }),
  describe(`$$convertPathCommandParametersRelativeToAbsoluteL`, function () {
    it(`Convert first "m" to "M".`, function () {
      // given
      const path_data = "m 1 2 3 4 5 6 m 1 2";

      // when
      const [
        { command, parameters },
        {
          parameters: [[cpx, cpy]],
        },
      ] = go(
        path_data,
        $$splitPathDataByCommandL,
        mapL($$parsePathCommandParameters),
        $$convertPathCommandParametersRelativeToAbsoluteL
      );

      // then
      expect(command).equal("M");
      expect(parameters).deep.equal([
        [1, 2],
        [4, 6],
        [9, 12],
      ]);
      expect(cpx).equal(10);
      expect(cpy).equal(14);
    });

    it(`Convert "M".`, function () {
      // given
      const path_data = `M 1 2 M 3 4 5 6 m 7 8`;

      // when
      const [
        ,
        { command, parameters },
        {
          parameters: [[cpx, cpy]],
        },
      ] = go(
        path_data,
        $$splitPathDataByCommandL,
        mapL($$parsePathCommandParameters),
        $$convertPathCommandParametersRelativeToAbsoluteL
      );

      expect(command).equal("M");
      expect(parameters).deep.equal([
        [3, 4],
        [5, 6],
      ]);
      expect(cpx).equal(12);
      expect(cpy).equal(14);
    });

    it(`Convert "m".`, function () {
      // given
      const path_data = `M 11 12 m 1 2 3 4 m 1 2`;

      // when
      const [
        ,
        { command, parameters },
        {
          parameters: [[cpx, cpy]],
        },
      ] = go(
        path_data,
        $$splitPathDataByCommandL,
        mapL($$parsePathCommandParameters),
        $$convertPathCommandParametersRelativeToAbsoluteL
      );

      // then
      expect(command).equal("M");
      expect(parameters).deep.equal([
        [12, 14],
        [15, 18],
      ]);
      expect(cpx).equal(16);
      expect(cpy).equal(20);
    });

    it(`Convert "L".`, function () {
      // given
      const path_data = `
        M 1 2
        L 3 4 5 6
        m 7 8
      `;

      // when
      const [
        ,
        { command, parameters },
        {
          parameters: [[cpx, cpy]],
        },
      ] = go(
        path_data,
        $$splitPathDataByCommandL,
        mapL($$parsePathCommandParameters),
        $$convertPathCommandParametersRelativeToAbsoluteL
      );

      // then
      expect(command).equal("L");
      expect(parameters).deep.equal([
        [3, 4],
        [5, 6],
      ]);
      expect(cpx).equal(12);
      expect(cpy).equal(14);
    });

    it(`Convert "l".`, function () {
      // given
      const path_data = `
        M 1 2
        l 3 4 5 6
        m 7 8
      `;

      // when
      const [
        ,
        { command, parameters },
        {
          parameters: [[cpx, cpy]],
        },
      ] = go(
        path_data,
        $$splitPathDataByCommandL,
        mapL($$parsePathCommandParameters),
        $$convertPathCommandParametersRelativeToAbsoluteL
      );

      // then
      expect(command).equal("L");
      expect(parameters).deep.equal([
        [4, 6],
        [9, 12],
      ]);
      expect(cpx).equal(16);
      expect(cpy).equal(20);
    });

    it(`Convert "H".`, function () {
      // given
      const path_data = `
        M 1 2
        H 3 4 5 6
        m 7 8 
      `;

      // when
      const [
        ,
        { command, parameters },
        {
          parameters: [[cpx, cpy]],
        },
      ] = go(
        path_data,
        $$splitPathDataByCommandL,
        mapL($$parsePathCommandParameters),
        $$convertPathCommandParametersRelativeToAbsoluteL
      );

      // then
      expect(command).equal("H");
      expect(parameters).deep.equal([3, 4, 5, 6]);
      expect(cpx).equal(13);
      expect(cpy).equal(10);
    });

    it(`Convert "h".`, function () {
      // given
      const path_data = `
        M 1 2
        h 3 4 5 6
        m 7 8 
      `;

      // when
      const [
        ,
        { command, parameters },
        {
          parameters: [[cpx, cpy]],
        },
      ] = go(
        path_data,
        $$splitPathDataByCommandL,
        mapL($$parsePathCommandParameters),
        $$convertPathCommandParametersRelativeToAbsoluteL
      );

      // then
      expect(command).equal("H");
      expect(parameters).deep.equal([4, 8, 13, 19]);
      expect(cpx).equal(26);
      expect(cpy).equal(10);
    });

    it(`Convert "V".`, function () {
      // given
      const path_data = `
        M 1 2
        V 3 4 5 6
        m 7 8 
      `;

      // when
      const [
        ,
        { command, parameters },
        {
          parameters: [[cpx, cpy]],
        },
      ] = go(
        path_data,
        $$splitPathDataByCommandL,
        mapL($$parsePathCommandParameters),
        $$convertPathCommandParametersRelativeToAbsoluteL
      );

      // then
      expect(command).equal("V");
      expect(parameters).deep.equal([3, 4, 5, 6]);
      expect(cpx).equal(8);
      expect(cpy).equal(14);
    });

    it(`Convert "v".`, function () {
      // given
      const path_data = `
        M 1 2
        v 3 4 5 6
        m 7 8 
      `;

      // when
      const [
        ,
        { command, parameters },
        {
          parameters: [[cpx, cpy]],
        },
      ] = go(
        path_data,
        $$splitPathDataByCommandL,
        mapL($$parsePathCommandParameters),
        $$convertPathCommandParametersRelativeToAbsoluteL
      );

      // then
      expect(command).equal("V");
      expect(parameters).deep.equal([5, 9, 14, 20]);
      expect(cpx).equal(8);
      expect(cpy).equal(28);
    });

    it(`Convert "C".`, function () {
      // given
      const path_data = `
        M 1 2
        C 3 4 5 6 7 8, 9 10 11 12 13 14
        m 15 16 
      `;

      // when
      const [
        ,
        { command, parameters },
        {
          parameters: [[cpx, cpy]],
        },
      ] = go(
        path_data,
        $$splitPathDataByCommandL,
        mapL($$parsePathCommandParameters),
        $$convertPathCommandParametersRelativeToAbsoluteL
      );

      // then
      expect(command).equal("C");
      expect(parameters).deep.equal([
        [
          [3, 4],
          [5, 6],
          [7, 8],
        ],
        [
          [9, 10],
          [11, 12],
          [13, 14],
        ],
      ]);
      expect(cpx).equal(28);
      expect(cpy).equal(30);
    });

    it(`Convert "c".`, function () {
      // given
      const path_data = `
        M 1 2
        c 3 4 5 6 7 8, 9 10 11 12 13 14
        m 15 16 
      `;

      // when
      const [
        ,
        { command, parameters },
        {
          parameters: [[cpx, cpy]],
        },
      ] = go(
        path_data,
        $$splitPathDataByCommandL,
        mapL($$parsePathCommandParameters),
        $$convertPathCommandParametersRelativeToAbsoluteL
      );

      // then
      expect(command).equal("C");
      expect(parameters).deep.equal([
        [
          [4, 6],
          [6, 8],
          [8, 10],
        ],
        [
          [17, 20],
          [19, 22],
          [21, 24],
        ],
      ]);
      expect(cpx).equal(36);
      expect(cpy).equal(40);
    });

    it(`Convert "S".`, function () {
      // given
      const path_data = `
        M 1 2
        S 3 4 5 6, 7 8 9 10
        m 11 12  
      `;

      // when
      const [
        ,
        { command, parameters },
        {
          parameters: [[cpx, cpy]],
        },
      ] = go(
        path_data,
        $$splitPathDataByCommandL,
        mapL($$parsePathCommandParameters),
        $$convertPathCommandParametersRelativeToAbsoluteL
      );

      // then
      expect(command).equal("S");
      expect(parameters).deep.equal([
        [
          [3, 4],
          [5, 6],
        ],
        [
          [7, 8],
          [9, 10],
        ],
      ]);
      expect(cpx).equal(20);
      expect(cpy).equal(22);
    });

    it(`Convert "s".`, function () {
      // given
      const path_data = `
        M 1 2
        s 3 4 5 6, 7 8 9 10
        m 11 12 
      `;

      // when
      const [
        ,
        { command, parameters },
        {
          parameters: [[cpx, cpy]],
        },
      ] = go(
        path_data,
        $$splitPathDataByCommandL,
        mapL($$parsePathCommandParameters),
        $$convertPathCommandParametersRelativeToAbsoluteL
      );

      // then
      expect(command).equal("S");
      expect(parameters).deep.equal([
        [
          [4, 6],
          [6, 8],
        ],
        [
          [13, 16],
          [15, 18],
        ],
      ]);
      expect(cpx).equal(26);
      expect(cpy).equal(30);
    });

    it(`Convert "Q".`, function () {
      // given
      const path_data = `
        M 1 2
        Q 3 4 5 6, 7 8 9 10
        m 11 12  
      `;

      // when
      const [
        ,
        { command, parameters },
        {
          parameters: [[cpx, cpy]],
        },
      ] = go(
        path_data,
        $$splitPathDataByCommandL,
        mapL($$parsePathCommandParameters),
        $$convertPathCommandParametersRelativeToAbsoluteL
      );

      // then
      expect(command).equal("Q");
      expect(parameters).deep.equal([
        [
          [3, 4],
          [5, 6],
        ],
        [
          [7, 8],
          [9, 10],
        ],
      ]);
      expect(cpx).equal(20);
      expect(cpy).equal(22);
    });

    it(`Convert "q".`, function () {
      // given
      const path_data = `
        M 1 2
        q 3 4 5 6, 7 8 9 10
        m 11 12 
      `;

      // when
      const [
        ,
        { command, parameters },
        {
          parameters: [[cpx, cpy]],
        },
      ] = go(
        path_data,
        $$splitPathDataByCommandL,
        mapL($$parsePathCommandParameters),
        $$convertPathCommandParametersRelativeToAbsoluteL
      );

      // then
      expect(command).equal("Q");
      expect(parameters).deep.equal([
        [
          [4, 6],
          [6, 8],
        ],
        [
          [13, 16],
          [15, 18],
        ],
      ]);
      expect(cpx).equal(26);
      expect(cpy).equal(30);
    });

    it(`Convert "T".`, function () {
      // given
      const path_data = `
        M 1 2
        T 3 4, 5 6
        m 7 8 
      `;

      // when
      const [
        ,
        { command, parameters },
        {
          parameters: [[cpx, cpy]],
        },
      ] = go(
        path_data,
        $$splitPathDataByCommandL,
        mapL($$parsePathCommandParameters),
        $$convertPathCommandParametersRelativeToAbsoluteL
      );

      // then
      expect(command).equal("T");
      expect(parameters).deep.equal([
        [3, 4],
        [5, 6],
      ]);
      expect(cpx).equal(12);
      expect(cpy).equal(14);
    });

    it(`Convert "t".`, function () {
      // given
      const path_data = `
        M 1 2
        t 3 4, 5 6
        m 7 8 
      `;

      // when
      const [
        ,
        { command, parameters },
        {
          parameters: [[cpx, cpy]],
        },
      ] = go(
        path_data,
        $$splitPathDataByCommandL,
        mapL($$parsePathCommandParameters),
        $$convertPathCommandParametersRelativeToAbsoluteL
      );

      // then
      expect(command).equal("T");
      expect(parameters).deep.equal([
        [4, 6],
        [9, 12],
      ]);
      expect(cpx).equal(16);
      expect(cpy).equal(20);
    });

    it(`Convert "A".`, function () {
      // given
      const path_data = `
        M 1 2
        A 3 4 5 1 0 6 7
        m 8 9 
      `;

      // when
      const [
        ,
        { command, parameters },
        {
          parameters: [[cpx, cpy]],
        },
      ] = go(
        path_data,
        $$splitPathDataByCommandL,
        mapL($$parsePathCommandParameters),
        $$convertPathCommandParametersRelativeToAbsoluteL
      );

      // then
      expect(command).equal("A");
      expect(parameters).deep.equal([[3, 4, 5, 1, 0, 6, 7]]);
      expect(cpx).equal(14);
      expect(cpy).equal(16);
    });

    it(`Convert "a".`, function () {
      // given
      const path_data = `
        M 1 2
        a 3 4 5 1 0 6 7
        m 8 9 
      `;

      // when
      const [
        ,
        { command, parameters },
        {
          parameters: [[cpx, cpy]],
        },
      ] = go(
        path_data,
        $$splitPathDataByCommandL,
        mapL($$parsePathCommandParameters),
        $$convertPathCommandParametersRelativeToAbsoluteL
      );

      // then
      expect(command).equal("A");
      expect(parameters).deep.equal([[3, 4, 5, 1, 0, 7, 9]]);
      expect(cpx).equal(15);
      expect(cpy).equal(18);
    });

    it(`Convert "Z" and "z".`, function () {
      // given
      const path_data1 = `
        M 10 10
        L 20 20 50 20
        Z
        m 10 10
      `;
      const path_data2 = `
        M 10 10
        L 20 20 50 20
        z
        m 10 10
      `;

      // when
      const [
        ,
        ,
        { command: command1, parameters: parameters1 },
        {
          parameters: [[cpx1, cpy1]],
        },
      ] = go(
        path_data1,
        $$splitPathDataByCommandL,
        mapL($$parsePathCommandParameters),
        $$convertPathCommandParametersRelativeToAbsoluteL
      );
      const [
        ,
        ,
        { command: command2, parameters: parameters2 },
        {
          parameters: [[cpx2, cpy2]],
        },
      ] = go(
        path_data2,
        $$splitPathDataByCommandL,
        mapL($$parsePathCommandParameters),
        $$convertPathCommandParametersRelativeToAbsoluteL
      );

      // then
      expect(command1).equal("Z");
      expect(command2).equal("Z");
      expect(parameters1).deep.equal([]);
      expect(parameters2).deep.equal([]);
      expect(cpx1).equal(20);
      expect(cpy1).equal(20);
      expect(cpx2).equal(20);
      expect(cpy2).equal(20);
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
