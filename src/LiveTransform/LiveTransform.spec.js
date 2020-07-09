import { expect } from "chai";
import { $$LiveTransform } from "./LiveTransform.index.js";

export default ({ describe, it }) => [
  describe(`$$LiveTransform`, function () {
    it(`An instance has "$$getIsDone", "$$done", "$$update", "$$append", "$$merge" methods.`, function () {
      const live_transform = new $$LiveTransform();

      expect(live_transform.$$getIsDone).a("function");
      expect(live_transform.$$done).a("function");
      expect(live_transform.$$update).a("function");
      expect(live_transform.$$append).a("function");
      expect(live_transform.$$merge).a("function");
    });
  }),
];
