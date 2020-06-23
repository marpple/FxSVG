import { expect } from "chai";
import {
  appendL,
  difference,
  each,
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

export default ({ describe, it }) => [
  describe(`$$mergeScaleTransform2`, function () {
    describe(`The input values are valid for the function. (Use $$initScaleTransform)`, function () {
      it(`The three target "SVGTransform"s will be removed from the SVGTransformList.`, function () {
        each((direction) => {
          const { $el, index } = makeMockRectInitiatedScaleTransform();

          const before_list = deepCopyTransformList(
            $$getBaseTransformList($el)
          );

          $$mergeScaleTransform2($el, { index, direction });

          const after_list = deepCopyTransformList(
            $$getBaseTransformList($el)
          );
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

    describe(`If the input values are invalid for the function, the function do nothing but return the input element.`, function () {
      describe(`When the input direction is not in ["n", "ne", "e", "se", "s", "sw", "w", "nw"]...`, function () {
        each(
          ([title, direction]) =>
            it(title, function () {
              const {
                $el,
                index,
                x: before_x,
                y: before_y,
                width: before_width,
                height: before_height,
              } = makeMockRectInitiatedScaleTransform();
              const before_list = deepCopyTransformList(
                $$getBaseTransformList($el)
              );

              $$mergeScaleTransform2($el, { index, direction });

              const after_list = deepCopyTransformList(
                $$getBaseTransformList($el)
              );
              const [after_x, after_y, after_width, after_height] = go(
                ["x", "y", "width", "height"],
                mapL((name) => $el.getAttributeNS(null, name)),
                mapL(parseFloat)
              );
              expect(after_list).to.deep.equal(before_list);
              expect(after_x).to.equal(before_x);
              expect(after_y).to.equal(before_y);
              expect(after_width).to.equal(before_width);
              expect(after_height).to.equal(before_height);
            }),
          [
            [`If the direction is null...`, null],
            [`If the direction is undefined...`, undefined],
            [
              `If the direction is other string...`,
              go(
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
            ],
            [`If the direction is a number...`, makeRandomNumber(-100, 100)],
            [`If the direction is a boolean...`, makeRandomBool()],
            [
              `If the direction is a symbol...`,
              Symbol(DIRECTIONS[makeRandomInt(0, 8)]),
            ],
          ]
        );
      });

      describe(`When the input element's SVGTransformList and the input index is not pass $$isValidFxScaleSVGTransformList...`, function () {
        go(
          DIRECTIONS,
          flatMapL((direction) =>
            mapL(
              ({ description: title, $el, index }) => [
                `If [[${title}] + [direction=${direction}]]...`,
                $el,
                index,
                direction,
              ],
              makeInvalidIsValidFxSVGTransformListCases()
            )
          ),
          each(([title, $el, index, direction]) =>
            it(title, function () {
              const before_list = deepCopyTransformList(
                $$getBaseTransformList($el)
              );
              const result = $$mergeScaleTransform2($el, { index, direction });
              const after_list = deepCopyTransformList(
                $$getBaseTransformList($el)
              );
              expect(result).to.equal($el);
              expect(after_list).to.deep.equal(before_list);
            })
          )
        );
      });
    });
  }),
];
