import { expect } from "chai";
import { chunkL, deepFlatL, go, join, map, mapL, rangeL, take } from "fxjs2";
import { makeRandomInt } from "../../test/utils/makeRandomInt.js";
import { makeRandomNumber } from "../../test/utils/makeRandomNumber.js";
import { InvalidArgumentsError } from "../Errors/InvalidArgumentsError.js";
import {
  $$joinPathData,
  $$toStringPathCommandParameters,
} from "./joinPathData.index.js";

export default ({ describe, it }) => [
  describe(`$$toStringPathCommandParameters`, function () {
    describe(`If the command is "M" or "m" or "L" or "l" or "T" or "t",`, function () {
      const command_list = ["M", "m", "L", "l"];

      describe(`Make SVG path data string.`, function () {
        it(`When parameters is "[number, number]".`, function () {
          // given
          for (const command of command_list) {
            /** @type {Array<number>} */
            const parameters = map(
              () => makeRandomNumber(-100, 100),
              rangeL(2)
            );
            const expect_str = `${command} ${join(" ", deepFlatL(parameters))}`;

            // when
            const str = $$toStringPathCommandParameters({
              command,
              parameters,
            });

            // then
            expect(str).equal(expect_str);
          }
        });

        it(`When parameters is "Array<[number, number]>".`, function () {
          for (const command of command_list) {
            // given
            /** @type {Array<Array<number>>} */
            const parameters = go(
              rangeL(Infinity),
              mapL(() => makeRandomNumber(-100, 100)),
              chunkL(2),
              take(makeRandomInt(1, 10))
            );
            const expect_str = `${command} ${join(" ", deepFlatL(parameters))}`;

            // when
            const str = $$toStringPathCommandParameters({
              command,
              parameters,
            });

            // then
            expect(str).equal(expect_str);
          }
        });
      });

      describe(`Throw InvalidArgumentsError.`, function () {
        it(`When parameters is an empty list.`, function () {
          for (const command of command_list) {
            // given
            const parameters = [];

            // when
            const f = () =>
              $$toStringPathCommandParameters({ command, parameters });

            // then
            expect(f).throw(InvalidArgumentsError);
          }
        });

        it(`When parameters is "Array<number>{length: odd_natural_number}".`, function () {
          for (const command of command_list) {
            // given
            /** @type {Array<number>} */
            const parameters = map(
              () => makeRandomNumber(-100, 100),
              rangeL(3)
            );

            // when
            const f = () =>
              $$toStringPathCommandParameters({ command, parameters });

            // then
            expect(f).throw(InvalidArgumentsError);
          }
        });

        it(`When parameters is "Array<Array<number>{length: odd_natural_number}>{length: odd_natural_number}".`, function () {
          for (const command of command_list) {
            // given
            /** @type {Array<Array<number>>} */
            const parameters = go(
              rangeL(Infinity),
              mapL(() => makeRandomNumber(-100, 100)),
              chunkL(3),
              take(7)
            );

            // when
            const f = () =>
              $$toStringPathCommandParameters({ command, parameters });

            // then
            expect(f).throw(InvalidArgumentsError);
          }
        });
      });
    });

    describe(`If the command is "Z" or "z",`, function () {
      const command_list = ["Z", "z"];

      describe(`Make SVG path data string.`, function () {
        it(`When parameters is an empty list.`, function () {
          for (const command of command_list) {
            // given
            const parameters = [];
            const expect_str = `${command}`;

            // when
            const receive_str = $$toStringPathCommandParameters({
              command,
              parameters,
            });

            // then
            expect(receive_str).equal(expect_str);
          }
        });
      });

      describe(`Throw InvalidArgumentsError.`, function () {
        it(`When parameters is "Array<number>".`, function () {
          for (const command of command_list) {
            // given
            /** @type {Array<number>} */
            const parameters = go(
              rangeL(Infinity),
              mapL(() => makeRandomNumber(-100, 100)),
              take(makeRandomInt(1, 10))
            );

            // when
            const f = () =>
              $$toStringPathCommandParameters({ command, parameters });

            // then
            expect(f).throw(InvalidArgumentsError);
          }
        });

        it(`When parameters is "Array<Array<number>>".`, function () {
          for (const command of command_list) {
            // given
            /** @type {Array<number>} */
            const parameters = go(
              rangeL(Infinity),
              mapL(() => makeRandomNumber(-100, 100)),
              chunkL(makeRandomInt(1, 10)),
              take(makeRandomInt(1, 10))
            );

            // when
            const f = () =>
              $$toStringPathCommandParameters({ command, parameters });

            // then
            expect(f).throw(InvalidArgumentsError);
          }
        });
      });
    });

    describe(`If the command is "H" or "h" or "V" or "v",`, function () {
      const command_list = ["H", "h", "V", "v"];

      describe(`Make SVG path data string.`, function () {
        it(`When parameters is "number".`, function () {
          for (const command of command_list) {
            // given
            const parameters = makeRandomNumber(-100, 100);
            const expect_str = `${command} ${parameters}`;

            // when
            const receive_str = $$toStringPathCommandParameters({
              command,
              parameters,
            });

            // then
            expect(receive_str).equal(expect_str);
          }
        });

        it(`When parameters is "Array<number>".`, function () {
          for (const command of command_list) {
            // given
            /** @type {Array<number>} */
            const parameters = map(
              () => makeRandomNumber(-100, 100),
              rangeL(makeRandomInt(1, 10))
            );
            const expect_str = `${command} ${join(" ", deepFlatL(parameters))}`;

            // when
            const receive_str = $$toStringPathCommandParameters({
              command,
              parameters,
            });

            // then
            expect(receive_str).equal(expect_str);
          }
        });
      });

      describe(`Throw InvalidArgumentsError.`, function () {
        it(`When parameters is an empty list.`, function () {
          for (const command of command_list) {
            // given
            const parameters = [];

            // when
            const f = () =>
              $$toStringPathCommandParameters({ command, parameters });

            // then
            expect(f).throw(InvalidArgumentsError);
          }
        });
      });
    });

    describe(`If the command is "C" or "c",`, function () {
      const command_list = ["C", "c"];

      describe(`Make SVG path data string.`, function () {
        it(`When parameters is "Array<[number, number]>{length: 3}".`, function () {
          for (const command of command_list) {
            // given
            /** @type {Array<Array<number>>} */
            const parameters = go(
              rangeL(Infinity),
              mapL(() => makeRandomNumber(-100, 100)),
              chunkL(2),
              take(3)
            );
            const expect_str = `${command} ${join(" ", deepFlatL(parameters))}`;

            // when
            const receive_str = $$toStringPathCommandParameters({
              command,
              parameters,
            });

            // then
            expect(receive_str).equal(expect_str);
          }
        });

        it(`When parameters is "Array<Array<[number, number]>{length: 3}>".`, function () {
          for (const command of command_list) {
            // given
            /** @type {Array<Array<number>>} */
            const parameters = go(
              rangeL(Infinity),
              mapL(() => makeRandomNumber(-100, 100)),
              chunkL(2),
              chunkL(3),
              take(makeRandomInt(1, 10))
            );
            const expect_str = `${command} ${join(" ", deepFlatL(parameters))}`;

            // when
            const receive_str = $$toStringPathCommandParameters({
              command,
              parameters,
            });

            // then
            expect(receive_str).equal(expect_str);
          }
        });
      });

      describe(`Throw InvalidArgumentsError.`, function () {
        it(`When parameters is an empty list.`, function () {
          for (const command of command_list) {
            // given
            const parameters = [];

            // when
            const f = () =>
              $$toStringPathCommandParameters({ command, parameters });

            // then
            expect(f).throw(InvalidArgumentsError);
          }
        });

        it(`When parameters is "Array<[number, number]>{length: 1}".`, function () {
          for (const command of command_list) {
            // given
            /** @type {Array<Array<number>>} */
            const parameters = go(
              rangeL(Infinity),
              mapL(() => makeRandomNumber(-100, 100)),
              chunkL(2),
              take(1)
            );

            // when
            const f = () =>
              $$toStringPathCommandParameters({ command, parameters });

            // then
            expect(f).throw(InvalidArgumentsError);
          }
        });

        it(`When parameters is "Array<[number, number]>{length: 2}".`, function () {
          for (const command of command_list) {
            // given
            /** @type {Array<Array<number>>} */
            const parameters = go(
              rangeL(Infinity),
              mapL(() => makeRandomNumber(-100, 100)),
              chunkL(2),
              take(2)
            );

            // when
            const f = () =>
              $$toStringPathCommandParameters({ command, parameters });

            // then
            expect(f).throw(InvalidArgumentsError);
          }
        });
      });
    });

    describe(`If the command is "S" or "s" or "Q" or "q",`, function () {
      const command_list = ["S", "s", "Q", "q"];

      describe(`Make SVG path data string.`, function () {
        it(`When parameters is "Array<[number, number]>{length: 2}".`, function () {
          for (const command of command_list) {
            // given
            /** @type {Array<Array<number>>} */
            const parameters = go(
              rangeL(Infinity),
              mapL(() => makeRandomNumber(-100, 100)),
              chunkL(2),
              take(2)
            );
            const expect_str = `${command} ${join(" ", deepFlatL(parameters))}`;

            // when
            const receive_str = $$toStringPathCommandParameters({
              command,
              parameters,
            });

            // then
            expect(receive_str).equal(expect_str);
          }
        });

        it(`When parameters is "Array<Array<[number, number]>{length: 2}>".`, function () {
          for (const command of command_list) {
            // given
            /** @type {Array<Array<number>>} */
            const parameters = go(
              rangeL(Infinity),
              mapL(() => makeRandomNumber(-100, 100)),
              chunkL(2),
              chunkL(2),
              take(makeRandomInt(1, 10))
            );
            const expect_str = `${command} ${join(" ", deepFlatL(parameters))}`;

            // when
            const receive_str = $$toStringPathCommandParameters({
              command,
              parameters,
            });

            // then
            expect(receive_str).equal(expect_str);
          }
        });
      });

      describe(`Throw InvalidArgumentsError.`, function () {
        it(`When parameters is an empty list.`, function () {
          for (const command of command_list) {
            // given
            const parameters = [];

            // when
            const f = () =>
              $$toStringPathCommandParameters({ command, parameters });

            // then
            expect(f).throw(InvalidArgumentsError);
          }
        });

        it(`When parameters is "[[number, number]]".`, function () {
          for (const command of command_list) {
            // given
            /** @type {Array<Array<number>>} */
            const parameters = go(
              rangeL(Infinity),
              mapL(() => makeRandomNumber(-100, 100)),
              chunkL(2),
              take(1)
            );

            // when
            const f = () =>
              $$toStringPathCommandParameters({ command, parameters });

            // then
            expect(f).throw(InvalidArgumentsError);
          }
        });
      });
    });

    describe(`If the command is "A" or "a",`, function () {
      const command_list = ["A", "a"];

      describe(`Make SVG path data string.`, function () {
        it(`When parameters is "[number, number, number, 0|1, 0|1, number, number]".`, function () {
          for (const command of command_list) {
            // given
            const [rx, ry, x_axis_rotation, x, y] = mapL(
              () => makeRandomNumber(-100, 100),
              rangeL(Infinity)
            );
            const [large_arc_flag, sweep_flag] = mapL(
              () => Math.round(Math.random()),
              rangeL(Infinity)
            );
            const parameters = [
              rx,
              ry,
              x_axis_rotation,
              large_arc_flag,
              sweep_flag,
              x,
              y,
            ];
            const expect_str = `${command} ${join(" ", deepFlatL(parameters))}`;

            // when
            const receive_str = $$toStringPathCommandParameters({
              command,
              parameters,
            });

            // then
            expect(receive_str).equal(expect_str);
          }
        });

        it(`When parameters is "Array<[number, number, number, 0|1, 0|1, number, number]>"`, function () {
          for (const command of command_list) {
            // given
            const parameters = map(() => {
              const [rx, ry, x_axis_rotation, x, y] = mapL(
                () => makeRandomNumber(-100, 100),
                rangeL(Infinity)
              );
              const [large_arc_flag, sweep_flag] = mapL(
                () => Math.round(Math.random()),
                rangeL(Infinity)
              );
              return [
                rx,
                ry,
                x_axis_rotation,
                large_arc_flag,
                sweep_flag,
                x,
                y,
              ];
            }, rangeL(makeRandomInt(1, 10)));
            const expect_str = `${command} ${join(" ", deepFlatL(parameters))}`;

            // when
            const receive_str = $$toStringPathCommandParameters({
              command,
              parameters,
            });

            // then
            expect(receive_str).equal(expect_str);
          }
        });
      });

      describe(`Throw InvalidArgumentsError.`, function () {
        it(`When parameters is an empty list.`, function () {
          for (const command of command_list) {
            // given
            const parameters = [];

            // when
            const f = () =>
              $$toStringPathCommandParameters({ command, parameters });

            // then
            expect(f).throw(InvalidArgumentsError);
          }
        });
      });
    });
  }),
  describe(`$$joinPathData`, function () {
    it(`Make SVG path data string from input list.`, function () {
      this.slow(3000);

      // given
      const path_data_list = [
        { command: "M", parameters: [1, 2] },
        { command: "L", parameters: [3, 4] },
        { command: "H", parameters: [5] },
        { command: "V", parameters: [6] },
        {
          command: "C",
          parameters: [
            [7, 8],
            [9, 10],
            [11, 12],
          ],
        },
        {
          command: "S",
          parameters: [
            [13, 14],
            [15, 16],
          ],
        },
        {
          command: "Q",
          parameters: [
            [17, 18],
            [19, 20],
          ],
        },
        { command: "T", parameters: [21, 22] },
        { command: "A", parameters: [23, 24, 25, 0, 1, 26, 27] },
        { command: "Z", parameters: [] },
        { command: "m", parameters: [28, 29] },
        { command: "l", parameters: [30, 31] },
        { command: "h", parameters: [32] },
        { command: "v", parameters: [33] },
        {
          command: "c",
          parameters: [
            [34, 35],
            [36, 37],
            [38, 39],
          ],
        },
        {
          command: "s",
          parameters: [
            [40, 41],
            [42, 43],
          ],
        },
        {
          command: "q",
          parameters: [
            [44, 45],
            [46, 47],
          ],
        },
        { command: "t", parameters: [48, 49] },
        { command: "a", parameters: [50, 51, 52, 1, 0, 53, 54] },
        { command: "z", parameters: [] },
      ];
      const expect_path_data_str = `
        M 1 2
        L 3 4
        H 5
        V 6
        C 7 8 9 10 11 12
        S 13 14 15 16
        Q 17 18 19 20
        T 21 22
        A 23 24 25 0 1 26 27
        Z
        m 28 29
        l 30 31
        h 32
        v 33
        c 34 35 36 37 38 39
        s 40 41 42 43
        q 44 45 46 47
        t 48 49
        a 50 51 52 1 0 53 54
        z
      `
        .split(/\s+/g)
        .join(" ")
        .trim();

      // when
      const receive_path_data_str = $$joinPathData(path_data_list);

      // then
      expect(receive_path_data_str).equal(expect_path_data_str);
    });

    it(`Throw InvalidArgumentsError when the first command is not "M" or "m".`, function () {
      // when
      const path_data = [
        { command: "L", parameters: [1, 2] },
        {
          command: "C",
          parameters: [
            [3, 4],
            [5, 6],
            [7, 8],
          ],
        },
      ];

      // then
      const f = () => $$joinPathData(path_data);

      // when
      expect(f).throw(InvalidArgumentsError);
    });
  }),
];
