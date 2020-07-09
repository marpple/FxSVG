import { go } from "fxjs2";
import { makeMockRect } from "../../test/utils/makeMockRect.js";
import {
  $$LiveTransform,

} from "../LiveTransform/LiveTransform.index.js";
import {$$LiveTransformHandler} from "../LiveTransformHandler/LiveTransformHandler.index.js";
import { $$LiveTranslateTransform } from "./LiveTranslateTransform.index.js";

export default ({ describe, it }) => [
  describe(`$$LiveTranslateTransform`, function () {
    it(`TEST 1`, function () {
      console.group("TEST 1");

      console.group("init $rect");
      const $rect = makeMockRect({ transform: null });
      console.log($rect.cloneNode());
      console.groupEnd();

      console.group("make $$LiveTransform object");
      const live_transform = $$LiveTranslateTransform.create({
        index: 0,
        tx: 10,
        ty: 10,
        x_name: "x",
        y_name: "y",
      })($rect);
      console.log(live_transform);
      console.groupEnd();

      console.group("transformed $rect");
      console.log($rect.cloneNode());
      console.groupEnd();

      console.groupEnd();
    });

    it(`TEST 2`, function () {
      console.group("TEST 2");

      console.group("init $rect");
      const $rect = makeMockRect({ transform: null });
      console.log($rect.cloneNode());
      console.groupEnd();

      console.group("make $$LiveTransform object");
      const live_transform = $$LiveTranslateTransform.create({
        index: 0,
        tx: 10,
        ty: 10,
        x_name: "x",
        y_name: "y",
      })($rect);
      console.log(live_transform);
      console.groupEnd();

      console.group("execute $$update");
      const temp = $$LiveTransform.$$update({ tx: 200, ty: 120 })(
        live_transform
      );
      console.log(temp);
      console.groupEnd();

      console.group("$$LiveTransform == $$update()");
      console.log(temp === live_transform);
      console.groupEnd();

      console.group("transformed $rect");
      console.log($rect.cloneNode());
      console.groupEnd();

      console.groupEnd();
    });

    it(`TEST 3`, function () {
      console.group("TEST 3");
      const $rect = makeMockRect({ transform: null });
      console.log($rect.cloneNode());
      const live_transform = $$LiveTranslateTransform.create({
        index: 0,
        tx: 10,
        ty: 10,
        x_name: "x",
        y_name: "y",
      })($rect);
      const temp = $$LiveTransform.$$update({ tx: -100, ty: -200 })(
        $$LiveTransform.$$update({ tx: 50, ty: 60 })(live_transform)
      );
      console.log(temp);
      console.log(live_transform);
      console.log(temp === live_transform);
      console.log($rect.cloneNode());
      console.groupEnd();
    });

    it(`TEST 4`, function () {
      console.group("TEST 4");
      const $rect = makeMockRect({ transform: null });
      console.log($rect.cloneNode());
      const live_transform = $$LiveTranslateTransform.create({
        index: 0,
        tx: 10,
        ty: 10,
        x_name: "x",
        y_name: "y",
      })($rect);
      const temp = go(
        live_transform,
        $$LiveTransformHandler.$$wrap,
        $$LiveTransformHandler.$$update({ tx: 2, ty: 3 }),
        $$LiveTransformHandler.$$update({ tx: 12, ty: 13 }),
        $$LiveTransformHandler.$$update({ tx: 22, ty: 23 }),
        $$LiveTransformHandler.$$update({ tx: 32, ty: 33 }),
        $$LiveTransformHandler.$$unwrap
      );
      console.log(temp);
      console.log(live_transform);
      console.log(temp === live_transform);
      console.log($rect.cloneNode());
      console.groupEnd();
    });
  }),
];
