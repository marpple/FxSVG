import { expect } from "chai";
import { $$el } from "../el/el.index.js";
import { $$qs } from "./qs.index.js";

export default ({ describe, it }) => [
  describe(`$$qs`, function () {
    it(`The function returns the element matched with the selector.`, function () {
      // given
      const g_el = $$el(`<g></g>`)();
      const a_el = $$el(`<circle cx="10" cy="10" r="20"></circle>`)();
      g_el.appendChild(a_el);

      // when
      const received = $$qs("circle", g_el);

      // then
      expect(received).equal(a_el);
    });

    it(`The function returns "null" when there is no matched element.`, function () {
      // given
      const g_el = $$el(`<g></g>`)();
      const a_el = $$el(`<circle cx="10" cy="10" r="20"></circle>`)();
      g_el.appendChild(a_el);

      // when
      const received = $$qs("rect", g_el);

      // then
      expect(received).null;
    });
  }),
];
