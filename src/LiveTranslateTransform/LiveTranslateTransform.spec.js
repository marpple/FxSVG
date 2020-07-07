import { go } from "fxjs2";
import { makeMockRect } from "../../test/utils/makeMockRect.js";
import { $$update } from "../LiveTransform/LiveTransform.index.js";
import { $$LiveTranslateTransform } from "./LiveTranslateTransform.index.js";

export default ({ describe, it }) => [
  describe.only(`$$LiveTranslateTransform`, function () {
    it(`TEST`, function () {
      console.group("1");
      const $rect = makeMockRect({ transform: null });
      console.log($rect.cloneNode());
      console.groupEnd();

      console.group("2");
      const live_transform = $$LiveTranslateTransform.from({
        index: 0,
        tx: 10,
        ty: 10,
        x_name: "x",
        y_name: "y",
      })($rect);
      console.log(live_transform);
      console.log($rect.cloneNode());
      console.groupEnd();

      console.group("3");
      const temp3 = $$update({ tx: 200, ty: 120 })(live_transform);
      console.log(temp3);
      console.log(live_transform);
      console.log(temp3 === live_transform);
      console.log($rect.cloneNode());
      console.groupEnd();

      console.group("4");
      const temp4 = $$update({ tx: -100, ty: -200 })(
        $$update({ tx: 50, ty: 60 })(live_transform)
      );
      console.log(temp4);
      console.log(live_transform);
      console.log(temp4 === live_transform);
      console.log($rect.cloneNode());
      console.groupEnd();

      console.group("5");
      const temp5 = go(
        live_transform,
        $$update({ tx: 2, ty: 3 }),
        $$update({ tx: 12, ty: 13 }),
        $$update({ tx: 22, ty: 23 }),
        $$update({ tx: 32, ty: 33 })
      );
      console.log(temp5);
      console.log(live_transform);
      console.log(temp5 === live_transform);
      console.log($rect.cloneNode());
      console.groupEnd();
    });
  }),
];
