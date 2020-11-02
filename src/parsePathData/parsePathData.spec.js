import chai from "chai";
import {
  chunkL,
  concatL,
  deepFlatL,
  dropL,
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
  $$splitPathDataByCommandL,
  $$parsePathCommandParameters,
  $$convertPathCommandParametersRelativeToAbsoluteL,
  $$compressPathCommandL,
  $$flatPathCommandParametersL,
  $$parsePathDateL,
} from "./parsePathData.index.js";

const { expect } = chai;

export default ({ describe, it }) => [
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
  describe(`$$compressPathCommandL`, function () {
    describe(`Convert "H" to "L".`, function () {
      it(`When following "M".`, function () {
        // given
        const [dummy_x, dummy_y, ipx, ipy, x] = mapL(
          () => makeRandomInt(-100, 100),
          rangeL(Infinity)
        );
        const path_data = `
          M ${dummy_x} ${dummy_y}
          M ${ipx} ${ipy}
          H ${x}
        `;

        // when
        const [, , { command, parameters }] = go(
          path_data,
          $$splitPathDataByCommandL,
          mapL($$parsePathCommandParameters),
          $$convertPathCommandParametersRelativeToAbsoluteL,
          $$compressPathCommandL
        );

        // then
        expect(command).equal("L");
        expect(parameters).deep.equal([[x, ipy]]);
      });

      it(`When following "L".`, function () {
        // given
        const [ipx, ipy, cpx, cpy, x] = mapL(
          () => makeRandomInt(-100, 100),
          rangeL(Infinity)
        );
        const path_data = `
          M ${ipx} ${ipy}
          L ${cpx} ${cpy}
          H ${x}
        `;

        // when
        const [, , { command, parameters }] = go(
          path_data,
          $$splitPathDataByCommandL,
          mapL($$parsePathCommandParameters),
          $$convertPathCommandParametersRelativeToAbsoluteL,
          $$compressPathCommandL
        );

        // then
        expect(command).equal("L");
        expect(parameters).deep.equal([[x, cpy]]);
      });

      it(`When following "H".`, function () {
        // given
        const [ipx, ipy, cpx, x] = mapL(
          () => makeRandomInt(-100, 100),
          rangeL(Infinity)
        );
        const path_data = `
          M ${ipx} ${ipy}
          H ${cpx}
          H ${x}
        `;

        // when
        const [, , { command, parameters }] = go(
          path_data,
          $$splitPathDataByCommandL,
          mapL($$parsePathCommandParameters),
          $$convertPathCommandParametersRelativeToAbsoluteL,
          $$compressPathCommandL
        );

        // then
        expect(command).equal("L");
        expect(parameters).deep.equal([[x, ipy]]);
      });

      it(`When following "V".`, function () {
        // given
        const [ipx, ipy, cpy, x] = mapL(
          () => makeRandomInt(-100, 100),
          rangeL(Infinity)
        );
        const path_data = `
          M ${ipx} ${ipy}
          V ${cpy}
          H ${x}
        `;

        // when
        const [, , { command, parameters }] = go(
          path_data,
          $$splitPathDataByCommandL,
          mapL($$parsePathCommandParameters),
          $$convertPathCommandParametersRelativeToAbsoluteL,
          $$compressPathCommandL
        );

        // then
        expect(command).equal("L");
        expect(parameters).deep.equal([[x, cpy]]);
      });

      it(`When following "C".`, function () {
        // given
        const [ipx, ipy, old_x1, old_y1, old_x2, old_y2, cpx, cpy, x] = mapL(
          () => makeRandomInt(-100, 100),
          rangeL(Infinity)
        );
        const path_data = `
          M ${ipx} ${ipy}
          C ${old_x1} ${old_y1} ${old_x2} ${old_y2} ${cpx} ${cpy}
          H ${x}
        `;

        // when
        const [, , { command, parameters }] = go(
          path_data,
          $$splitPathDataByCommandL,
          mapL($$parsePathCommandParameters),
          $$convertPathCommandParametersRelativeToAbsoluteL,
          $$compressPathCommandL
        );

        // then
        expect(command).equal("L");
        expect(parameters).deep.equal([[x, cpy]]);
      });

      it(`When following "S".`, function () {
        // given
        const [ipx, ipy, old_x2, old_y2, cpx, cpy, x] = mapL(
          () => makeRandomInt(-100, 100),
          rangeL(Infinity)
        );
        const path_data = `
          M ${ipx} ${ipy}
          S ${old_x2} ${old_y2} ${cpx} ${cpy}
          H ${x}
        `;

        // when
        const [, , { command, parameters }] = go(
          path_data,
          $$splitPathDataByCommandL,
          mapL($$parsePathCommandParameters),
          $$convertPathCommandParametersRelativeToAbsoluteL,
          $$compressPathCommandL
        );

        // then
        expect(command).equal("L");
        expect(parameters).deep.equal([[x, cpy]]);
      });

      it(`When following "Q".`, function () {
        // given
        const [ipx, ipy, old_x1, old_y1, cpx, cpy, x] = mapL(
          () => makeRandomInt(-100, 100),
          rangeL(Infinity)
        );
        const path_data = `
          M ${ipx} ${ipy}
          Q ${old_x1} ${old_y1} ${cpx} ${cpy}
          H ${x}
        `;

        // when
        const [, , { command, parameters }] = go(
          path_data,
          $$splitPathDataByCommandL,
          mapL($$parsePathCommandParameters),
          $$convertPathCommandParametersRelativeToAbsoluteL,
          $$compressPathCommandL
        );

        // then
        expect(command).equal("L");
        expect(parameters).deep.equal([[x, cpy]]);
      });

      it(`When following "T".`, function () {
        // given
        const [ipx, ipy, cpx, cpy, x] = mapL(
          () => makeRandomInt(-100, 100),
          rangeL(Infinity)
        );
        const path_data = `
          M ${ipx} ${ipy}
          T ${cpx} ${cpy}
          H ${x}
        `;

        // when
        const [, , { command, parameters }] = go(
          path_data,
          $$splitPathDataByCommandL,
          mapL($$parsePathCommandParameters),
          $$convertPathCommandParametersRelativeToAbsoluteL,
          $$compressPathCommandL
        );

        // then
        expect(command).equal("L");
        expect(parameters).deep.equal([[x, cpy]]);
      });

      it(`When following "A".`, function () {
        // given
        const [ipx, ipy, rx, ry, x_axis_rotation, cpx, cpy, x] = mapL(
          () => makeRandomInt(-100, 100),
          rangeL(Infinity)
        );
        const [large_arc_flag, sweep_flag] = mapL(
          () => Math.round(Math.random()),
          rangeL(Infinity)
        );
        const path_data = `
          M ${ipx} ${ipy}
          A ${rx} ${ry} ${x_axis_rotation} ${large_arc_flag} ${sweep_flag} ${cpx} ${cpy}
          H ${x}
        `;

        // when
        const [, , { command, parameters }] = go(
          path_data,
          $$splitPathDataByCommandL,
          mapL($$parsePathCommandParameters),
          $$convertPathCommandParametersRelativeToAbsoluteL,
          $$compressPathCommandL
        );

        // then
        expect(command).equal("L");
        expect(parameters).deep.equal([[x, cpy]]);
      });

      it(`When following "Z".`, function () {
        // given
        const [ipx, ipy, x] = mapL(
          () => makeRandomInt(-100, 100),
          rangeL(Infinity)
        );
        const path_data = `
          M ${ipx} ${ipy}
          Z
          H ${x}
        `;

        // when
        const [, , { command, parameters }] = go(
          path_data,
          $$splitPathDataByCommandL,
          mapL($$parsePathCommandParameters),
          $$convertPathCommandParametersRelativeToAbsoluteL,
          $$compressPathCommandL
        );

        // then
        expect(command).equal("L");
        expect(parameters).deep.equal([[x, ipy]]);
      });
    });

    describe(`Convert "V" to "L".`, function () {
      it(`When following "M".`, function () {
        // given
        const [dummy_x, dummy_y, ipx, ipy, y] = mapL(
          () => makeRandomInt(-100, 100),
          rangeL(Infinity)
        );
        const path_data = `
          M ${dummy_x} ${dummy_y}
          M ${ipx} ${ipy}
          V ${y}
        `;

        // when
        const [, , { command, parameters }] = go(
          path_data,
          $$splitPathDataByCommandL,
          mapL($$parsePathCommandParameters),
          $$convertPathCommandParametersRelativeToAbsoluteL,
          $$compressPathCommandL
        );

        // then
        expect(command).equal("L");
        expect(parameters).deep.equal([[ipx, y]]);
      });

      it(`When following "L".`, function () {
        // given
        const [ipx, ipy, cpx, cpy, y] = mapL(
          () => makeRandomInt(-100, 100),
          rangeL(Infinity)
        );
        const path_data = `
          M ${ipx} ${ipy}
          L ${cpx} ${cpy}
          V ${y}
        `;

        // when
        const [, , { command, parameters }] = go(
          path_data,
          $$splitPathDataByCommandL,
          mapL($$parsePathCommandParameters),
          $$convertPathCommandParametersRelativeToAbsoluteL,
          $$compressPathCommandL
        );

        // then
        expect(command).equal("L");
        expect(parameters).deep.equal([[cpx, y]]);
      });

      it(`When following "H".`, function () {
        // given
        const [ipx, ipy, cpx, y] = mapL(
          () => makeRandomInt(-100, 100),
          rangeL(Infinity)
        );
        const path_data = `
          M ${ipx} ${ipy}
          H ${cpx}
          V ${y}
        `;

        // when
        const [, , { command, parameters }] = go(
          path_data,
          $$splitPathDataByCommandL,
          mapL($$parsePathCommandParameters),
          $$convertPathCommandParametersRelativeToAbsoluteL,
          $$compressPathCommandL
        );

        // then
        expect(command).equal("L");
        expect(parameters).deep.equal([[cpx, y]]);
      });

      it(`When following "V".`, function () {
        // given
        const [ipx, ipy, cpy, y] = mapL(
          () => makeRandomInt(-100, 100),
          rangeL(Infinity)
        );
        const path_data = `
          M ${ipx} ${ipy}
          V ${cpy}
          V ${y}
        `;

        // when
        const [, , { command, parameters }] = go(
          path_data,
          $$splitPathDataByCommandL,
          mapL($$parsePathCommandParameters),
          $$convertPathCommandParametersRelativeToAbsoluteL,
          $$compressPathCommandL
        );

        // then
        expect(command).equal("L");
        expect(parameters).deep.equal([[ipx, y]]);
      });

      it(`When following "C".`, function () {
        // given
        const [ipx, ipy, old_x1, old_y1, old_x2, old_y2, cpx, cpy, y] = mapL(
          () => makeRandomInt(-100, 100),
          rangeL(Infinity)
        );
        const path_data = `
          M ${ipx} ${ipy}
          C ${old_x1} ${old_y1} ${old_x2} ${old_y2} ${cpx} ${cpy}
          V ${y}
        `;

        // when
        const [, , { command, parameters }] = go(
          path_data,
          $$splitPathDataByCommandL,
          mapL($$parsePathCommandParameters),
          $$convertPathCommandParametersRelativeToAbsoluteL,
          $$compressPathCommandL
        );

        // then
        expect(command).equal("L");
        expect(parameters).deep.equal([[cpx, y]]);
      });

      it(`When following "S".`, function () {
        // given
        const [ipx, ipy, old_x2, old_y2, cpx, cpy, y] = mapL(
          () => makeRandomInt(-100, 100),
          rangeL(Infinity)
        );
        const path_data = `
          M ${ipx} ${ipy}
          S ${old_x2} ${old_y2} ${cpx} ${cpy}
          V ${y}
        `;

        // when
        const [, , { command, parameters }] = go(
          path_data,
          $$splitPathDataByCommandL,
          mapL($$parsePathCommandParameters),
          $$convertPathCommandParametersRelativeToAbsoluteL,
          $$compressPathCommandL
        );

        // then
        expect(command).equal("L");
        expect(parameters).deep.equal([[cpx, y]]);
      });

      it(`When following "Q".`, function () {
        // given
        const [ipx, ipy, old_x1, old_y1, cpx, cpy, y] = mapL(
          () => makeRandomInt(-100, 100),
          rangeL(Infinity)
        );
        const path_data = `
          M ${ipx} ${ipy}
          Q ${old_x1} ${old_y1} ${cpx} ${cpy}
          V ${y}
        `;

        // when
        const [, , { command, parameters }] = go(
          path_data,
          $$splitPathDataByCommandL,
          mapL($$parsePathCommandParameters),
          $$convertPathCommandParametersRelativeToAbsoluteL,
          $$compressPathCommandL
        );

        // then
        expect(command).equal("L");
        expect(parameters).deep.equal([[cpx, y]]);
      });

      it(`When following "T".`, function () {
        // given
        const [ipx, ipy, cpx, cpy, y] = mapL(
          () => makeRandomInt(-100, 100),
          rangeL(Infinity)
        );
        const path_data = `
          M ${ipx} ${ipy}
          T ${cpx} ${cpy}
          V ${y}
        `;

        // when
        const [, , { command, parameters }] = go(
          path_data,
          $$splitPathDataByCommandL,
          mapL($$parsePathCommandParameters),
          $$convertPathCommandParametersRelativeToAbsoluteL,
          $$compressPathCommandL
        );

        // then
        expect(command).equal("L");
        expect(parameters).deep.equal([[cpx, y]]);
      });

      it(`When following "A".`, function () {
        // given
        const [ipx, ipy, rx, ry, x_axis_rotation, cpx, cpy, y] = mapL(
          () => makeRandomInt(-100, 100),
          rangeL(Infinity)
        );
        const [large_arc_flag, sweep_flag] = mapL(
          () => Math.round(Math.random()),
          rangeL(Infinity)
        );
        const path_data = `
          M ${ipx} ${ipy}
          A ${rx} ${ry} ${x_axis_rotation} ${large_arc_flag} ${sweep_flag} ${cpx} ${cpy}
          V ${y}
        `;

        // when
        const [, , { command, parameters }] = go(
          path_data,
          $$splitPathDataByCommandL,
          mapL($$parsePathCommandParameters),
          $$convertPathCommandParametersRelativeToAbsoluteL,
          $$compressPathCommandL
        );

        // then
        expect(command).equal("L");
        expect(parameters).deep.equal([[cpx, y]]);
      });

      it(`When following "Z".`, function () {
        // given
        const [ipx, ipy, y] = mapL(
          () => makeRandomInt(-100, 100),
          rangeL(Infinity)
        );
        const path_data = `
          M ${ipx} ${ipy}
          Z
          V ${y}
        `;

        // when
        const [, , { command, parameters }] = go(
          path_data,
          $$splitPathDataByCommandL,
          mapL($$parsePathCommandParameters),
          $$convertPathCommandParametersRelativeToAbsoluteL,
          $$compressPathCommandL
        );

        // then
        expect(command).equal("L");
        expect(parameters).deep.equal([[ipx, y]]);
      });
    });

    describe(`Convert "S" to "C".`, function () {
      it(`When following "M".`, function () {
        // given
        const [dummy_x, dummy_y, ipx, ipy, x2, y2, x, y] = mapL(
          () => makeRandomInt(-100, 100),
          rangeL(Infinity)
        );
        const path_data = `
          M ${dummy_x} ${dummy_y}
          M ${ipx} ${ipy}
          S ${x2} ${y2} ${x} ${y}
        `;

        // when
        const [, , { command, parameters }] = go(
          path_data,
          $$splitPathDataByCommandL,
          mapL($$parsePathCommandParameters),
          $$convertPathCommandParametersRelativeToAbsoluteL,
          $$compressPathCommandL
        );

        // then
        expect(command).equal("C");
        expect(parameters).deep.equal([
          [
            [ipx, ipy],
            [x2, y2],
            [x, y],
          ],
        ]);
      });

      it(`When following "L".`, function () {
        // given
        const [ipx, ipy, cpx, cpy, x2, y2, x, y] = mapL(
          () => makeRandomInt(-100, 100),
          rangeL(Infinity)
        );
        const path_data = `
          M ${ipx} ${ipy}
          L ${cpx} ${cpy}
          S ${x2} ${y2} ${x} ${y}
        `;

        // when
        const [, , { command, parameters }] = go(
          path_data,
          $$splitPathDataByCommandL,
          mapL($$parsePathCommandParameters),
          $$convertPathCommandParametersRelativeToAbsoluteL,
          $$compressPathCommandL
        );

        // then
        expect(command).equal("C");
        expect(parameters).deep.equal([
          [
            [cpx, cpy],
            [x2, y2],
            [x, y],
          ],
        ]);
      });

      it(`When following "H".`, function () {
        // given
        const [ipx, ipy, cpx, x2, y2, x, y] = mapL(
          () => makeRandomInt(-100, 100),
          rangeL(Infinity)
        );
        const path_data = `
          M ${ipx} ${ipy}
          H ${cpx}
          S ${x2} ${y2} ${x} ${y}
        `;

        // when
        const [, , { command, parameters }] = go(
          path_data,
          $$splitPathDataByCommandL,
          mapL($$parsePathCommandParameters),
          $$convertPathCommandParametersRelativeToAbsoluteL,
          $$compressPathCommandL
        );

        // then
        expect(command).equal("C");
        expect(parameters).deep.equal([
          [
            [cpx, ipy],
            [x2, y2],
            [x, y],
          ],
        ]);
      });

      it(`When following "V".`, function () {
        // given
        const [ipx, ipy, cpy, x2, y2, x, y] = mapL(
          () => makeRandomInt(-100, 100),
          rangeL(Infinity)
        );
        const path_data = `
          M ${ipx} ${ipy}
          V ${cpy}
          S ${x2} ${y2} ${x} ${y}
        `;

        // when
        const [, , { command, parameters }] = go(
          path_data,
          $$splitPathDataByCommandL,
          mapL($$parsePathCommandParameters),
          $$convertPathCommandParametersRelativeToAbsoluteL,
          $$compressPathCommandL
        );

        // then
        expect(command).equal("C");
        expect(parameters).deep.equal([
          [
            [ipx, cpy],
            [x2, y2],
            [x, y],
          ],
        ]);
      });

      it(`When following "C".`, function () {
        // given
        const [
          ipx,
          ipy,
          old_x1,
          old_y1,
          old_x2,
          old_y2,
          cpx,
          cpy,
          x2,
          y2,
          x,
          y,
        ] = mapL(() => makeRandomInt(-100, 100), rangeL(Infinity));
        const path_data = `
          M ${ipx} ${ipy}
          C ${old_x1} ${old_y1} ${old_x2} ${old_y2} ${cpx} ${cpy}
          S ${x2} ${y2} ${x} ${y}
        `;

        // when
        const [, , { command, parameters }] = go(
          path_data,
          $$splitPathDataByCommandL,
          mapL($$parsePathCommandParameters),
          $$convertPathCommandParametersRelativeToAbsoluteL,
          $$compressPathCommandL
        );

        // then
        expect(command).equal("C");
        expect(parameters).deep.equal([
          [
            [2 * cpx - old_x2, 2 * cpy - old_y2],
            [x2, y2],
            [x, y],
          ],
        ]);
      });

      it(`When following "S".`, function () {
        // given
        const [ipx, ipy, old_x2, old_y2, cpx, cpy, x2, y2, x, y] = mapL(
          () => makeRandomInt(-100, 100),
          rangeL(Infinity)
        );
        const path_data = `
          M ${ipx} ${ipy}
          S ${old_x2} ${old_y2} ${cpx} ${cpy}
          S ${x2} ${y2} ${x} ${y}
        `;

        // when
        const [, , { command, parameters }] = go(
          path_data,
          $$splitPathDataByCommandL,
          mapL($$parsePathCommandParameters),
          $$convertPathCommandParametersRelativeToAbsoluteL,
          $$compressPathCommandL
        );

        // then
        expect(command).equal("C");
        expect(parameters).deep.equal([
          [
            [2 * cpx - old_x2, 2 * cpy - old_y2],
            [x2, y2],
            [x, y],
          ],
        ]);
      });

      it(`When following "Q".`, function () {
        // given
        const [ipx, ipy, old_x1, old_y1, cpx, cpy, x2, y2, x, y] = mapL(
          () => makeRandomInt(-100, 100),
          rangeL(Infinity)
        );
        const path_data = `
          M ${ipx} ${ipy}
          Q ${old_x1} ${old_y1} ${cpx} ${cpy}
          S ${x2} ${y2} ${x} ${y}
        `;

        // when
        const [, , { command, parameters }] = go(
          path_data,
          $$splitPathDataByCommandL,
          mapL($$parsePathCommandParameters),
          $$convertPathCommandParametersRelativeToAbsoluteL,
          $$compressPathCommandL
        );

        // then
        expect(command).equal("C");
        expect(parameters).deep.equal([
          [
            [cpx, cpy],
            [x2, y2],
            [x, y],
          ],
        ]);
      });

      it(`When following "T".`, function () {
        // given
        const [
          ipx,
          ipy,
          old_x1,
          old_y1,
          old_x,
          old_y,
          cpx,
          cpy,
          x2,
          y2,
          x,
          y,
        ] = mapL(() => makeRandomInt(-100, 100), rangeL(Infinity));
        const path_data = `
          M ${ipx} ${ipy}
          Q ${old_x1} ${old_y1} ${old_x} ${old_y}
          T ${cpx} ${cpy}
          S ${x2} ${y2} ${x} ${y}
        `;

        // when
        const [, , , { command, parameters }] = go(
          path_data,
          $$splitPathDataByCommandL,
          mapL($$parsePathCommandParameters),
          $$convertPathCommandParametersRelativeToAbsoluteL,
          $$compressPathCommandL
        );

        // then
        expect(command).equal("C");
        expect(parameters).deep.equal([
          [
            [cpx, cpy],
            [x2, y2],
            [x, y],
          ],
        ]);
      });

      it(`When following "A".`, function () {
        // given
        const [
          ipx,
          ipy,
          rx,
          ry,
          x_axis_rotation,
          cpx,
          cpy,
          x2,
          y2,
          x,
          y,
        ] = mapL(() => makeRandomInt(-100, 100), rangeL(Infinity));
        const [large_arc_flag, sweep_flag] = mapL(
          () => (makeRandomBool() ? 0 : 1),
          rangeL(Infinity)
        );
        const path_data = `
          M ${ipx} ${ipy}
          A ${rx} ${ry} ${x_axis_rotation} ${large_arc_flag} ${sweep_flag} ${cpx} ${cpy}
          S ${x2} ${y2} ${x} ${y}
        `;

        // when
        const [, , { command, parameters }] = go(
          path_data,
          $$splitPathDataByCommandL,
          mapL($$parsePathCommandParameters),
          $$convertPathCommandParametersRelativeToAbsoluteL,
          $$compressPathCommandL
        );

        // then
        expect(command).equal("C");
        expect(parameters).deep.equal([
          [
            [cpx, cpy],
            [x2, y2],
            [x, y],
          ],
        ]);
      });

      it(`When following "Z".`, function () {
        // given
        const [ipx, ipy, l_x, l_y, x2, y2, x, y] = mapL(
          () => makeRandomInt(-100, 100),
          rangeL(Infinity)
        );
        const path_data = `
          M ${ipx} ${ipy}
          L ${l_x} ${l_y}
          Z
          S ${x2} ${y2} ${x} ${y}
        `;

        // when
        const [, , , { command, parameters }] = go(
          path_data,
          $$splitPathDataByCommandL,
          mapL($$parsePathCommandParameters),
          $$convertPathCommandParametersRelativeToAbsoluteL,
          $$compressPathCommandL
        );

        // then
        expect(command).equal("C");
        expect(parameters).deep.equal([
          [
            [ipx, ipy],
            [x2, y2],
            [x, y],
          ],
        ]);
      });
    });

    describe(`Convert "T" to "Q".`, function () {
      it(`When following "M".`, function () {
        // given
        const [dummy_x, dummy_y, ipx, ipy, x, y] = mapL(
          () => makeRandomInt(-100, 100),
          rangeL(Infinity)
        );
        const path_data = `
          M ${dummy_x} ${dummy_y}
          M ${ipx} ${ipy}
          T ${x} ${y}
        `;

        // when
        const [, , { command, parameters }] = go(
          path_data,
          $$splitPathDataByCommandL,
          mapL($$parsePathCommandParameters),
          $$convertPathCommandParametersRelativeToAbsoluteL,
          $$compressPathCommandL
        );

        // then
        expect(command).equal("Q");
        expect(parameters).deep.equal([
          [
            [ipx, ipy],
            [x, y],
          ],
        ]);
      });

      it(`When following "L".`, function () {
        // given
        const [ipx, ipy, cpx, cpy, x, y] = mapL(
          () => makeRandomInt(-100, 100),
          rangeL(Infinity)
        );
        const path_data = `
          M ${ipx} ${ipy}
          L ${cpx} ${cpy}
          T ${x} ${y}
        `;

        // when
        const [, , { command, parameters }] = go(
          path_data,
          $$splitPathDataByCommandL,
          mapL($$parsePathCommandParameters),
          $$convertPathCommandParametersRelativeToAbsoluteL,
          $$compressPathCommandL
        );

        // then
        expect(command).equal("Q");
        expect(parameters).deep.equal([
          [
            [cpx, cpy],
            [x, y],
          ],
        ]);
      });

      it(`When following "H".`, function () {
        // given
        const [ipx, ipy, cpx, x, y] = mapL(
          () => makeRandomInt(-100, 100),
          rangeL(Infinity)
        );
        const path_data = `
          M ${ipx} ${ipy}
          H ${cpx}
          T ${x} ${y}
        `;

        // when
        const [, , { command, parameters }] = go(
          path_data,
          $$splitPathDataByCommandL,
          mapL($$parsePathCommandParameters),
          $$convertPathCommandParametersRelativeToAbsoluteL,
          $$compressPathCommandL
        );

        // then
        expect(command).equal("Q");
        expect(parameters).deep.equal([
          [
            [cpx, ipy],
            [x, y],
          ],
        ]);
      });

      it(`When following "V".`, function () {
        // given
        const [ipx, ipy, cpy, x, y] = mapL(
          () => makeRandomInt(-100, 100),
          rangeL(Infinity)
        );
        const path_data = `
          M ${ipx} ${ipy}
          V ${cpy}
          T ${x} ${y}
        `;

        // when
        const [, , { command, parameters }] = go(
          path_data,
          $$splitPathDataByCommandL,
          mapL($$parsePathCommandParameters),
          $$convertPathCommandParametersRelativeToAbsoluteL,
          $$compressPathCommandL
        );

        // then
        expect(command).equal("Q");
        expect(parameters).deep.equal([
          [
            [ipx, cpy],
            [x, y],
          ],
        ]);
      });

      it(`When following "C".`, function () {
        // given
        const [ipx, ipy, old_x1, old_y1, old_x2, old_y2, cpx, cpy, x, y] = mapL(
          () => makeRandomInt(-100, 100),
          rangeL(Infinity)
        );
        const path_data = `
          M ${ipx} ${ipy}
          C ${old_x1} ${old_y1} ${old_x2} ${old_y2} ${cpx} ${cpy}
          T ${x} ${y}
        `;

        // when
        const [, , { command, parameters }] = go(
          path_data,
          $$splitPathDataByCommandL,
          mapL($$parsePathCommandParameters),
          $$convertPathCommandParametersRelativeToAbsoluteL,
          $$compressPathCommandL
        );

        // then
        expect(command).equal("Q");
        expect(parameters).deep.equal([
          [
            [cpx, cpy],
            [x, y],
          ],
        ]);
      });

      it(`When following "S".`, function () {
        // given
        const [
          ipx,
          ipy,
          c_x1,
          c_y1,
          c_x2,
          c_y2,
          c_x,
          c_y,
          s_x,
          s_y,
          cpx,
          cpy,
          x,
          y,
        ] = mapL(() => makeRandomInt(-100, 100), rangeL(Infinity));
        const path_data = `
          M ${ipx} ${ipy}
          C ${c_x1} ${c_y1} ${c_x2} ${c_y2} ${c_x} ${c_y}
          S ${s_x} ${s_y} ${cpx} ${cpy}
          T ${x} ${y}
        `;

        // when
        const [, , , { command, parameters }] = go(
          path_data,
          $$splitPathDataByCommandL,
          mapL($$parsePathCommandParameters),
          $$convertPathCommandParametersRelativeToAbsoluteL,
          $$compressPathCommandL
        );

        // then
        expect(command).equal("Q");
        expect(parameters).deep.equal([
          [
            [cpx, cpy],
            [x, y],
          ],
        ]);
      });

      it(`When following "Q".`, function () {
        // given
        const [ipx, ipy, old_x1, old_y1, cpx, cpy, x, y] = mapL(
          () => makeRandomInt(-100, 100),
          rangeL(Infinity)
        );
        const path_data = `
          M ${ipx} ${ipy}
          Q ${old_x1} ${old_y1} ${cpx} ${cpy}
          T ${x} ${y}
        `;

        // when
        const [, , { command, parameters }] = go(
          path_data,
          $$splitPathDataByCommandL,
          mapL($$parsePathCommandParameters),
          $$convertPathCommandParametersRelativeToAbsoluteL,
          $$compressPathCommandL
        );

        // then
        expect(command).equal("Q");
        expect(parameters).deep.equal([
          [
            [2 * cpx - old_x1, 2 * cpy - old_y1],
            [x, y],
          ],
        ]);
      });

      it(`When following "T".`, function () {
        // given
        const [ipx, ipy, old_x1, old_y1, old_x, old_y, cpx, cpy, x, y] = mapL(
          () => makeRandomInt(-100, 100),
          rangeL(Infinity)
        );
        const path_data = `
          M ${ipx} ${ipy}
          Q ${old_x1} ${old_y1} ${old_x} ${old_y}
          T ${cpx} ${cpy}
          T ${x} ${y}
        `;

        // when
        const [, , , { command, parameters }] = go(
          path_data,
          $$splitPathDataByCommandL,
          mapL($$parsePathCommandParameters),
          $$convertPathCommandParametersRelativeToAbsoluteL,
          $$compressPathCommandL
        );

        // then
        expect(command).equal("Q");
        expect(parameters).deep.equal([
          [
            [2 * cpx - (2 * old_x - old_x1), 2 * cpy - (2 * old_y - old_y1)],
            [x, y],
          ],
        ]);
      });

      it(`When following "A".`, function () {
        // given
        const [ipx, ipy, rx, ry, x_axis_rotation, cpx, cpy, x, y] = mapL(
          () => makeRandomInt(-100, 100),
          rangeL(Infinity)
        );
        const [large_arc_flag, sweep_flag] = mapL(
          () => (makeRandomBool() ? 0 : 1),
          rangeL(Infinity)
        );
        const path_data = `
          M ${ipx} ${ipy}
          A ${rx} ${ry} ${x_axis_rotation} ${large_arc_flag} ${sweep_flag} ${cpx} ${cpy}
          T ${x} ${y}
        `;

        // when
        const [, , { command, parameters }] = go(
          path_data,
          $$splitPathDataByCommandL,
          mapL($$parsePathCommandParameters),
          $$convertPathCommandParametersRelativeToAbsoluteL,
          $$compressPathCommandL
        );

        // then
        expect(command).equal("Q");
        expect(parameters).deep.equal([
          [
            [cpx, cpy],
            [x, y],
          ],
        ]);
      });

      it(`When following "Z".`, function () {
        // given
        const [ipx, ipy, l_x, l_y, x, y] = mapL(
          () => makeRandomInt(-100, 100),
          rangeL(Infinity)
        );
        const path_data = `
          M ${ipx} ${ipy}
          L ${l_x} ${l_y}
          Z
          T ${x} ${y}
        `;

        // when
        const [, , , { command, parameters }] = go(
          path_data,
          $$splitPathDataByCommandL,
          mapL($$parsePathCommandParameters),
          $$convertPathCommandParametersRelativeToAbsoluteL,
          $$compressPathCommandL
        );

        // then
        expect(command).equal("Q");
        expect(parameters).deep.equal([
          [
            [ipx, ipy],
            [x, y],
          ],
        ]);
      });
    });
  }),
  describe(`$$flatPathCommandParametersL`, function () {
    it(`Flatten "M" command.`, function () {
      // given
      /** @type {Array<Array<number>>} */
      const parameters = map(
        () => map(() => makeRandomInt(-100, 100), rangeL(2)),
        rangeL(makeRandomInt(1, 10))
      );
      const path_command_parameters = {
        command: "M",
        parameters,
      };

      // when
      const flatten_iter = $$flatPathCommandParametersL(
        path_command_parameters
      );

      // then
      expect(flatten_iter.next().value).deep.equal({
        command: "M",
        parameters: parameters[0],
      });
      for (const coordinate_pair of dropL(1, parameters)) {
        expect(flatten_iter.next()).deep.equal({
          value: {
            command: "L",
            parameters: coordinate_pair,
          },
          done: false,
        });
      }
      expect(flatten_iter.next()).deep.equal({ value: undefined, done: true });
    });

    it(`Flatten "m" command.`, function () {
      // given
      /** @type {Array<Array<number>>} */
      const parameters = map(
        () => map(() => makeRandomInt(-100, 100), rangeL(2)),
        rangeL(makeRandomInt(1, 10))
      );
      const path_command_parameters = {
        command: "m",
        parameters,
      };

      // when
      const flatten_iter = $$flatPathCommandParametersL(
        path_command_parameters
      );

      // then
      expect(flatten_iter.next().value).deep.equal({
        command: "m",
        parameters: parameters[0],
      });
      for (const coordinate_pair of dropL(1, parameters)) {
        expect(flatten_iter.next()).deep.equal({
          value: {
            command: "l",
            parameters: coordinate_pair,
          },
          done: false,
        });
      }
      expect(flatten_iter.next()).deep.equal({ value: undefined, done: true });
    });

    it(`Flatten "L" command.`, function () {
      // given
      /** @type {Array<Array<number>>} */
      const parameters = map(
        () => map(() => makeRandomInt(-100, 100), rangeL(2)),
        rangeL(makeRandomInt(1, 10))
      );
      const path_command_parameters = {
        command: "L",
        parameters,
      };

      // when
      const flatten_iter = $$flatPathCommandParametersL(
        path_command_parameters
      );

      // then
      for (const coordinate_pair of parameters) {
        expect(flatten_iter.next()).deep.equal({
          value: { command: "L", parameters: coordinate_pair },
          done: false,
        });
      }
      expect(flatten_iter.next()).deep.equal({ value: undefined, done: true });
    });

    it(`Flatten "l" command.`, function () {
      // given
      /** @type {Array<Array<number>>} */
      const parameters = map(
        () => map(() => makeRandomInt(-100, 100), rangeL(2)),
        rangeL(makeRandomInt(1, 10))
      );
      const path_command_parameters = {
        command: "l",
        parameters,
      };

      // when
      const flatten_iter = $$flatPathCommandParametersL(
        path_command_parameters
      );

      // then
      for (const coordinate_pair of parameters) {
        expect(flatten_iter.next()).deep.equal({
          value: { command: "l", parameters: coordinate_pair },
          done: false,
        });
      }
      expect(flatten_iter.next()).deep.equal({ value: undefined, done: true });
    });

    it(`Flatten "H" command.`, function () {
      // given
      /** @type {Array<number>} */
      const parameters = map(
        () => makeRandomInt(-100, 100),
        rangeL(makeRandomInt(1, 10))
      );
      const path_command_parameters = {
        command: "H",
        parameters,
      };

      // when
      const flatten_iter = $$flatPathCommandParametersL(
        path_command_parameters
      );

      // then
      for (const coordinate of parameters) {
        expect(flatten_iter.next()).deep.equal({
          value: { command: "H", parameters: coordinate },
          done: false,
        });
      }
      expect(flatten_iter.next()).deep.equal({ value: undefined, done: true });
    });

    it(`Flatten "h" command.`, function () {
      // given
      /** @type {Array<number>} */
      const parameters = map(
        () => makeRandomInt(-100, 100),
        rangeL(makeRandomInt(1, 10))
      );
      const path_command_parameters = {
        command: "h",
        parameters,
      };

      // when
      const flatten_iter = $$flatPathCommandParametersL(
        path_command_parameters
      );

      // then
      for (const coordinate of parameters) {
        expect(flatten_iter.next()).deep.equal({
          value: { command: "h", parameters: coordinate },
          done: false,
        });
      }
      expect(flatten_iter.next()).deep.equal({ value: undefined, done: true });
    });

    it(`Flatten "V" command.`, function () {
      // given
      /** @type {Array<number>} */
      const parameters = map(
        () => makeRandomInt(-100, 100),
        rangeL(makeRandomInt(1, 10))
      );
      const path_command_parameters = {
        command: "V",
        parameters,
      };

      // when
      const flatten_iter = $$flatPathCommandParametersL(
        path_command_parameters
      );

      // then
      for (const coordinate of parameters) {
        expect(flatten_iter.next()).deep.equal({
          value: { command: "V", parameters: coordinate },
          done: false,
        });
      }
      expect(flatten_iter.next()).deep.equal({ value: undefined, done: true });
    });

    it(`Flatten "v" command.`, function () {
      // given
      /** @type {Array<number>} */
      const parameters = map(
        () => makeRandomInt(-100, 100),
        rangeL(makeRandomInt(1, 10))
      );
      const path_command_parameters = {
        command: "v",
        parameters,
      };

      // when
      const flatten_iter = $$flatPathCommandParametersL(
        path_command_parameters
      );

      // then
      for (const coordinate of parameters) {
        expect(flatten_iter.next()).deep.equal({
          value: { command: "v", parameters: coordinate },
          done: false,
        });
      }
      expect(flatten_iter.next()).deep.equal({ value: undefined, done: true });
    });

    it(`Flatten "C" command.`, function () {
      // given
      /** @type {Array<Array<Array<number>>>} */
      const parameters = go(
        rangeL(Infinity),
        mapL(() => makeRandomInt(-100, 100)),
        chunkL(2),
        chunkL(3),
        take(makeRandomInt(1, 10))
      );
      const path_command_parameters = {
        command: "C",
        parameters,
      };

      // when
      const flatten_iter = $$flatPathCommandParametersL(
        path_command_parameters
      );

      // then
      for (const coordinate_pair_triplet of parameters) {
        expect(flatten_iter.next()).deep.equal({
          value: { command: "C", parameters: coordinate_pair_triplet },
          done: false,
        });
      }
      expect(flatten_iter.next()).deep.equal({ value: undefined, done: true });
    });

    it(`Flatten "c" command.`, function () {
      // given
      /** @type {Array<Array<Array<number>>>} */
      const parameters = go(
        rangeL(Infinity),
        mapL(() => makeRandomInt(-100, 100)),
        chunkL(2),
        chunkL(3),
        take(makeRandomInt(1, 10))
      );
      const path_command_parameters = {
        command: "c",
        parameters,
      };

      // when
      const flatten_iter = $$flatPathCommandParametersL(
        path_command_parameters
      );

      // then
      for (const coordinate_pair_triplet of parameters) {
        expect(flatten_iter.next()).deep.equal({
          value: { command: "c", parameters: coordinate_pair_triplet },
          done: false,
        });
      }
      expect(flatten_iter.next()).deep.equal({ value: undefined, done: true });
    });

    it(`Flatten "S" command.`, function () {
      // given
      /** @type {Array<Array<Array<number>>>} */
      const parameters = go(
        rangeL(Infinity),
        mapL(() => makeRandomInt(-100, 100)),
        chunkL(2),
        chunkL(2),
        take(makeRandomInt(1, 10))
      );
      const path_command_parameters = {
        command: "S",
        parameters,
      };

      // when
      const flatten_iter = $$flatPathCommandParametersL(
        path_command_parameters
      );

      // then
      for (const coordinate_pair_double of parameters) {
        expect(flatten_iter.next()).deep.equal({
          value: { command: "S", parameters: coordinate_pair_double },
          done: false,
        });
      }
      expect(flatten_iter.next()).deep.equal({ value: undefined, done: true });
    });

    it(`Flatten "s" command.`, function () {
      // given
      /** @type {Array<Array<Array<number>>>} */
      const parameters = go(
        rangeL(Infinity),
        mapL(() => makeRandomInt(-100, 100)),
        chunkL(2),
        chunkL(2),
        take(makeRandomInt(1, 10))
      );
      const path_command_parameters = {
        command: "s",
        parameters,
      };

      // when
      const flatten_iter = $$flatPathCommandParametersL(
        path_command_parameters
      );

      // then
      for (const coordinate_pair_double of parameters) {
        expect(flatten_iter.next()).deep.equal({
          value: { command: "s", parameters: coordinate_pair_double },
          done: false,
        });
      }
      expect(flatten_iter.next()).deep.equal({ value: undefined, done: true });
    });

    it(`Flatten "Q" command.`, function () {
      // given
      /** @type {Array<Array<Array<number>>>} */
      const parameters = go(
        rangeL(Infinity),
        mapL(() => makeRandomInt(-100, 100)),
        chunkL(2),
        chunkL(2),
        take(makeRandomInt(1, 10))
      );
      const path_command_parameters = {
        command: "Q",
        parameters,
      };

      // when
      const flatten_iter = $$flatPathCommandParametersL(
        path_command_parameters
      );

      // then
      for (const coordinate_pair_double of parameters) {
        expect(flatten_iter.next()).deep.equal({
          value: { command: "Q", parameters: coordinate_pair_double },
          done: false,
        });
      }
      expect(flatten_iter.next()).deep.equal({ value: undefined, done: true });
    });

    it(`Flatten "q" command.`, function () {
      // given
      /** @type {Array<Array<Array<number>>>} */
      const parameters = go(
        rangeL(Infinity),
        mapL(() => makeRandomInt(-100, 100)),
        chunkL(2),
        chunkL(2),
        take(makeRandomInt(1, 10))
      );
      const path_command_parameters = {
        command: "q",
        parameters,
      };

      // when
      const flatten_iter = $$flatPathCommandParametersL(
        path_command_parameters
      );

      // then
      for (const coordinate_pair_double of parameters) {
        expect(flatten_iter.next()).deep.equal({
          value: { command: "q", parameters: coordinate_pair_double },
          done: false,
        });
      }
      expect(flatten_iter.next()).deep.equal({ value: undefined, done: true });
    });

    it(`Flatten "T" command.`, function () {
      // given
      /** @type {Array<Array<number>>} */
      const parameters = go(
        rangeL(Infinity),
        mapL(() => makeRandomInt(-100, 100)),
        chunkL(2),
        take(makeRandomInt(1, 10))
      );
      const path_command_parameters = {
        command: "T",
        parameters,
      };

      // when
      const flatten_iter = $$flatPathCommandParametersL(
        path_command_parameters
      );

      // then
      for (const coordinate_pair of parameters) {
        expect(flatten_iter.next()).deep.equal({
          value: { command: "T", parameters: coordinate_pair },
          done: false,
        });
      }
      expect(flatten_iter.next()).deep.equal({ value: undefined, done: true });
    });

    it(`Flatten "t" command.`, function () {
      // given
      /** @type {Array<Array<number>>} */
      const parameters = go(
        rangeL(Infinity),
        mapL(() => makeRandomInt(-100, 100)),
        chunkL(2),
        take(makeRandomInt(1, 10))
      );
      const path_command_parameters = {
        command: "t",
        parameters,
      };

      // when
      const flatten_iter = $$flatPathCommandParametersL(
        path_command_parameters
      );

      // then
      for (const coordinate_pair of parameters) {
        expect(flatten_iter.next()).deep.equal({
          value: { command: "t", parameters: coordinate_pair },
          done: false,
        });
      }
      expect(flatten_iter.next()).deep.equal({ value: undefined, done: true });
    });

    it(`Flatten "A" command.`, function () {
      // given
      /** @type {Array<Array<number>>} */
      const parameters = go(
        rangeL(Infinity),
        mapL(() => makeRandomInt(-100, 100)),
        chunkL(5),
        mapL(([rx, ry, x_axis_rotation, x, y]) => {
          const [large_arc_flag, sweep_flag] = mapL(
            () => Math.round(Math.random()),
            rangeL(2)
          );
          return [rx, ry, x_axis_rotation, large_arc_flag, sweep_flag, x, y];
        }),
        take(makeRandomInt(1, 10))
      );
      const path_command_parameters = {
        command: "A",
        parameters,
      };

      // when
      const flatten_iter = $$flatPathCommandParametersL(
        path_command_parameters
      );

      // then
      for (const arc_args of parameters) {
        expect(flatten_iter.next()).deep.equal({
          value: { command: "A", parameters: arc_args },
          done: false,
        });
      }
      expect(flatten_iter.next()).deep.equal({ value: undefined, done: true });
    });

    it(`Flatten "a" command.`, function () {
      // given
      /** @type {Array<Array<number>>} */
      const parameters = go(
        rangeL(Infinity),
        mapL(() => makeRandomInt(-100, 100)),
        chunkL(5),
        mapL(([rx, ry, x_axis_rotation, x, y]) => {
          const [large_arc_flag, sweep_flag] = mapL(
            () => Math.round(Math.random()),
            rangeL(2)
          );
          return [rx, ry, x_axis_rotation, large_arc_flag, sweep_flag, x, y];
        }),
        take(makeRandomInt(1, 10))
      );
      const path_command_parameters = {
        command: "a",
        parameters,
      };

      // when
      const flatten_iter = $$flatPathCommandParametersL(
        path_command_parameters
      );

      // then
      for (const arc_args of parameters) {
        expect(flatten_iter.next()).deep.equal({
          value: { command: "a", parameters: arc_args },
          done: false,
        });
      }
      expect(flatten_iter.next()).deep.equal({ value: undefined, done: true });
    });

    it(`Flatten "Z" or "z" command.`, function () {
      for (const command of ["Z", "z"]) {
        // given
        const path_command_parameters = {
          command,
          parameters: [],
        };

        // when
        const flatten_iter = $$flatPathCommandParametersL(
          path_command_parameters
        );

        // then
        expect(flatten_iter.next()).deep.equal({
          value: path_command_parameters,
          done: false,
        });
        expect(flatten_iter.next()).deep.equal({
          value: undefined,
          done: true,
        });
      }
    });
  }),
  describe(`$$parsePathDataL`, function () {
    it(`parse path data string.`, function () {
      // given
      const path_data = `
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
      const parsed_path_data = [...$$parsePathDateL(path_data)];

      // then
      expect(parsed_path_data).deep.equal([
        { command: "M", parameters: [1, 2] },
        { command: "L", parameters: [3, 4] },
        { command: "L", parameters: [1, 2] },
        { command: "L", parameters: [3, 4] },
        { command: "L", parameters: [5, 6] },
        { command: "L", parameters: [1, 6] },
        { command: "L", parameters: [2, 6] },
        { command: "L", parameters: [3, 6] },
        { command: "L", parameters: [3, 4] },
        { command: "L", parameters: [3, 5] },
        { command: "L", parameters: [3, 6] },
        {
          command: "C",
          parameters: [
            [1, 2],
            [3, 4],
            [5, 6],
          ],
        },
        {
          command: "C",
          parameters: [
            [7, 8],
            [9, 1],
            [2, 3],
          ],
        },
        {
          command: "C",
          parameters: [
            [-5, 5],
            [1, 2],
            [3, 4],
          ],
        },
        {
          command: "C",
          parameters: [
            [5, 6],
            [5, 6],
            [7, 8],
          ],
        },
        {
          command: "Q",
          parameters: [
            [1, 2],
            [3, 4],
          ],
        },
        {
          command: "Q",
          parameters: [
            [5, 6],
            [7, 8],
          ],
        },
        {
          command: "Q",
          parameters: [
            [9, 10],
            [1, 2],
          ],
        },
        {
          command: "Q",
          parameters: [
            [-7, -6],
            [3, 4],
          ],
        },
        {
          command: "A",
          parameters: [1, 2, 3, 0, 1, 4, 5],
        },
        {
          command: "A",
          parameters: [6, 7, 8, 1, 0, 9, 8],
        },
        { command: "Z", parameters: [] },
        { command: "M", parameters: [2, 4] },
        { command: "L", parameters: [5, 8] },
        { command: "L", parameters: [6, 10] },
        { command: "L", parameters: [9, 14] },
        { command: "L", parameters: [14, 20] },
        { command: "L", parameters: [15, 20] },
        { command: "L", parameters: [17, 20] },
        { command: "L", parameters: [20, 20] },
        { command: "L", parameters: [20, 24] },
        { command: "L", parameters: [20, 29] },
        { command: "L", parameters: [20, 35] },
        {
          command: "C",
          parameters: [
            [21, 37],
            [23, 39],
            [25, 41],
          ],
        },
        {
          command: "C",
          parameters: [
            [32, 49],
            [34, 42],
            [27, 44],
          ],
        },
        {
          command: "C",
          parameters: [
            [20, 46],
            [28, 46],
            [30, 48],
          ],
        },
        {
          command: "C",
          parameters: [
            [32, 50],
            [35, 54],
            [37, 56],
          ],
        },
        {
          command: "Q",
          parameters: [
            [38, 58],
            [40, 60],
          ],
        },
        {
          command: "Q",
          parameters: [
            [45, 66],
            [47, 68],
          ],
        },
        {
          command: "Q",
          parameters: [
            [49, 70],
            [48, 70],
          ],
        },
        {
          command: "Q",
          parameters: [
            [47, 70],
            [51, 74],
          ],
        },
        {
          command: "A",
          parameters: [1, 2, 3, 0, 1, 55, 79],
        },
        {
          command: "A",
          parameters: [6, 7, 8, 1, 0, 64, 87],
        },
        { command: "Z", parameters: [] },
      ]);
    });
  }),
];
