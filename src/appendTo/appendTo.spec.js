import { expect } from "chai";
import { $$el } from "../el/el.index.js";
import { $$appendTo } from "./appendTo.index.js";

export default ({ describe, it }) => [
  describe(`$$appendTo`, function () {
    it(`The function append the element to the parent element as a child element.`, function () {
      // given
      const parent_el = $$el(`<g></g>`)();
      const child_el = $$el(`<circle cx="0" cy="0" r="10"></circle>`)();

      // when
      $$appendTo(parent_el)(child_el);

      // then
      expect(parent_el.contains(child_el)).true;
    });
  }),
];
