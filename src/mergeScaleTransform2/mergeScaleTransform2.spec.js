import { expect } from "chai";
import {
  appendL,
  difference,
  each,
  extend,
  flatMapL,
  go,
  go1,
  head,
  isNil,
  join,
  mapL,
  rangeL,
  rejectL,
  takeAll,
} from "fxjs2";
import {
  deepCopyTransformList,
  makeRandomBool,
  makeRandomInt,
  makeRandomNumber,
} from "../../test/utils/index.js";
import { makeMockRectInitiatedScaleTransform } from "../../test/utils/makeMockRectInitializedScaleTransform.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { makeInvalidCases as makeInvalidIsValidFxSVGTransformListCases } from "../isValidFxScaleSVGTransformList/isValidFxScaleSVGTransformList.spec.js";
import { $$mergeScaleTransform2 } from "./mergeScaleTransform2.index.js";

const DIRECTIONS = ["n", "ne", "e", "se", "s", "sw", "w", "nw"];

const expectNotChange = (
  {
    $el: $before,
    transform_list: before_transform_list,
    x: before_x,
    y: before_y,
    width: before_width,
    height: before_height,
  },
  {
    $el: $after,
    transform_list: after_transform_list,
    x: after_x,
    y: after_y,
    width: after_width,
    height: after_height,
  },
  description
) => {
  expect($after, description).equal($before);
  expect(after_transform_list, description).deep.equal(before_transform_list);
  expect(after_x, description).equal(before_x);
  expect(after_y, description).equal(before_y);
  expect(after_width, description).equal(before_width);
  expect(after_height, description).equal(before_height);
};

export default ({ describe, it }) => [
  describe.only(`$$mergeScaleTransform2`, function () {
    it(`The function do nothing but return the input element
        when the input values failed to pass "$$isValidFxScaleSVGTransformList".`, function () {
      this.slow(1500);

      const cases = go(
        makeInvalidIsValidFxSVGTransformListCases(),
        flatMapL((o) =>
          mapL((is_need_correction) => extend({ is_need_correction }, o), [
            true,
            false,
          ])
        ),
        flatMapL((o) =>
          mapL((direction) => extend({ direction }, o), DIRECTIONS)
        )
      );
      for (const {
        description,
        $el: $input,
        index,
        is_need_correction,
        direction,
        x: before_x,
        y: before_y,
        width: before_width,
        height: before_height,
      } of cases) {
        const before_transform_list = deepCopyTransformList(
          $$getBaseTransformList($input)
        );

        const $output = $$mergeScaleTransform2($input, {
          index,
          is_need_correction,
          direction,
          x_name: "x",
          y_name: "y",
          width_name: "width",
          height_name: "height",
        });

        const [after_x, after_y, after_width, after_height] = go(
          ["x", "y", "width", "height"],
          mapL((k) => $output.getAttributeNS(null, k)),
          mapL(parseFloat)
        );
        const after_transform_list = deepCopyTransformList(
          $$getBaseTransformList($input)
        );

        expectNotChange(
          {
            $el: $input,
            transform_list: before_transform_list,
            x: before_x,
            y: before_y,
            width: before_width,
            height: before_height,
          },
          {
            $el: $output,
            transform_list: after_transform_list,
            x: after_x,
            y: after_y,
            width: after_width,
            height: after_height,
          },
          description
        );
      }
    });

    it(`The function do nothing but return the input element
        when the input direction is not in ["n", "ne", "e", "se", "s", "sw", "w", "nw"].`, function () {
      const cases = go1(
        [
          { description: `the direction is null.`, direction: null },
          { description: `the direction is undefined.`, direction: undefined },
          {
            description: `the direction is other string.`,
            direction: go(
              rangeL(2),
              mapL(() =>
                go(
                  rangeL(Infinity),
                  mapL(() => makeRandomInt(97, 123)),
                  mapL((n) => String.fromCharCode(n)),
                  rejectL((s) => new Set(DIRECTIONS).has(s)),
                  head
                )
              ),
              ([a, b]) => [a, makeRandomBool() ? b : null],
              rejectL(isNil),
              join("")
            ),
          },
          {
            description: `the direction is a number.`,
            direction: makeRandomNumber(-100, 100),
          },
          {
            description: `the direction is a boolean.`,
            direction: makeRandomBool(),
          },
          {
            description: `the direction is a symbol.`,
            direction: Symbol(DIRECTIONS[makeRandomInt(0, 8)]),
          },
        ],
        flatMapL(({ direction, description }) =>
          mapL(
            (is_need_correction) => ({
              is_need_correction,
              direction,
              description,
            }),
            [true, false]
          )
        )
      );

      for (const { direction, description, is_need_correction } of cases) {
        const {
          $el: $input,
          index,
          x: before_x,
          y: before_y,
          width: before_width,
          height: before_height,
        } = makeMockRectInitiatedScaleTransform();
        const before_transform_list = deepCopyTransformList(
          $$getBaseTransformList($input)
        );

        const $output = $$mergeScaleTransform2($input, {
          index,
          direction,
          x_name: "x",
          y_name: "y",
          width_name: "width",
          height_name: "height",
          is_need_correction,
        });

        const after_transform_list = deepCopyTransformList(
          $$getBaseTransformList($input)
        );
        const [after_x, after_y, after_width, after_height] = go(
          ["x", "y", "width", "height"],
          mapL((k) => $output.getAttributeNS(null, k)),
          mapL(parseFloat)
        );

        expectNotChange(
          {
            $el: $input,
            transform_list: before_transform_list,
            x: before_x,
            y: before_y,
            width: before_width,
            height: before_height,
          },
          {
            $el: $output,
            transform_list: after_transform_list,
            x: after_x,
            y: after_y,
            width: after_width,
            height: after_height,
          },
          description
        );
      }
    });

    describe(`The input values are valid for the function. (Use $$initScaleTransform)`, function () {
      it(`The three target "SVGTransform"s will be removed from the SVGTransformList.`, function () {
        each((direction) => {
          const { $el, index } = makeMockRectInitiatedScaleTransform();

          const before_list = deepCopyTransformList(
            $$getBaseTransformList($el)
          );

          $$mergeScaleTransform2($el, { index, direction });

          const after_list = deepCopyTransformList($$getBaseTransformList($el));
          expect(
            go(
              rangeL(before_list.length),
              rejectL((i) => i >= index - 1 && i <= index + 1),
              mapL((i) => before_list[i]),
              takeAll
            )
          ).to.deep.equal(after_list);
        }, DIRECTIONS);
      });

      go(
        [
          ["width", "sx"],
          ["height", "sy"],
        ],
        mapL(([length_name, s_name]) => [
          `The element's ${length_name} is calculated by [scaled_${length_name} = original_${length_name} * abs(${s_name})].`,
          length_name,
          s_name,
        ]),
        each(([title, length_name, s_name]) =>
          it(title, function () {
            each((direction) => {
              const [
                $el,
                index,
                s,
                before_length,
              ] = go1(makeMockRectInitiatedScaleTransform(), (mock) =>
                mapL((k) => mock[k], ["$el", "index", s_name, length_name])
              );

              $$mergeScaleTransform2($el, {
                index,
                direction,
                x_name: "x",
                y_name: "y",
                width_name: "width",
                height_name: "height",
              });

              const after_length = parseFloat(
                $el.getAttributeNS(null, length_name)
              );
              expect(after_length).to.equal(before_length * Math.abs(s));
            }, DIRECTIONS);
          })
        )
      );

      go(
        [
          ["x", "cx", "sx", "width", ["n", "s"]],
          ["y", "cy", "sy", "height", ["e", "w"]],
        ],
        mapL((config) => appendL(difference(config[4], DIRECTIONS), config)),
        each(
          ([
            xy_name,
            c_name,
            s_name,
            length_name,
            same_directions,
            change_directions,
          ]) =>
            describe(`The element's ${xy_name} value is calculated by...`, function () {
              describe(`When direction is one of ${JSON.stringify(
                same_directions
              )}...`, function () {
                it(`The scaled ${xy_name} is same with the original ${xy_name}.`, function () {
                  each((direction) => {
                    const [
                      $el,
                      index,
                      before_xy,
                    ] = go1(makeMockRectInitiatedScaleTransform(), (mock) =>
                      mapL((k) => mock[k], ["$el", "index", xy_name])
                    );

                    $$mergeScaleTransform2($el, {
                      index,
                      direction,
                      x_name: "x",
                      y_name: "y",
                      width_name: "width",
                      height_name: "height",
                    });

                    const after_xy = parseFloat(
                      $el.getAttributeNS(null, xy_name)
                    );
                    expect(after_xy).to.equal(before_xy);
                  }, same_directions);
                });
              });

              describe(`When direction is one of ${JSON.stringify(
                change_directions
              )}...`, function () {
                it(`
                  The scaled ${xy_name} is [(${xy_name} - ${c_name}) * ${s_name} + ${c_name}]
                  if [${s_name} >= 0 || is_need_correction = false].
                `, function () {
                  go(
                    change_directions,
                    flatMapL((direction) =>
                      go(
                        [true, false],
                        mapL((is_need_correction) => ({
                          is_need_correction,
                          direction,
                          s: makeRandomNumber(),
                        })),
                        appendL({
                          is_need_correction: false,
                          direction,
                          s: -makeRandomNumber(1),
                        })
                      )
                    ),
                    each(({ direction, is_need_correction, s: mock_s }) => {
                      const [$el, index, before_xy, c, s] = go1(
                        makeMockRectInitiatedScaleTransform({
                          [s_name]: mock_s,
                        }),
                        (mock) =>
                          mapL((k) => mock[k], [
                            "$el",
                            "index",
                            xy_name,
                            c_name,
                            s_name,
                          ])
                      );

                      $$mergeScaleTransform2($el, {
                        index,
                        is_need_correction,
                        direction,
                        x_name: "x",
                        y_name: "y",
                        width_name: "width",
                        height_name: "height",
                      });

                      const after_xy = parseFloat(
                        $el.getAttributeNS(null, xy_name)
                      );
                      expect(after_xy).to.equal((before_xy - c) * s + c);
                    })
                  );
                });

                it(`
                  The scaled ${xy_name} is [((${xy_name} - ${c_name}) * ${s_name} + ${c_name}) + ${length_name} * ${s_name}]
                  if [${s_name} < 0 && is_need_correction = true].
                `, function () {
                  each((direction) => {
                    const [$el, index, before_xy, c, s, length] = go1(
                      makeMockRectInitiatedScaleTransform({
                        [s_name]: -makeRandomNumber(),
                      }),
                      (mock) =>
                        mapL((k) => mock[k], [
                          "$el",
                          "index",
                          xy_name,
                          c_name,
                          s_name,
                          length_name,
                        ])
                    );

                    $$mergeScaleTransform2($el, {
                      index,
                      direction,
                      is_need_correction: true,
                      x_name: "x",
                      y_name: "y",
                      width_name: "width",
                      height_name: "height",
                    });

                    const after_xy = parseFloat(
                      $el.getAttributeNS(null, xy_name)
                    );
                    expect(after_xy).to.equal(
                      (before_xy - c) * s + c + length * s
                    );
                  }, change_directions);
                });
              });
            })
        )
      );
    });
  }),
];
