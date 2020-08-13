import { expect } from "chai";
import { $$append } from "../append/append.index.js";
import { $$el } from "../el/el.index.js";
import { $$qsa } from "./qsa.index.js";

export default ({ describe, it }) => [
  describe(`$$qsa`, function () {
    it(`The function returns a NodeList that contains elements matched with the selector.`, function () {
      // given
      const g_el = $$el(`<g></g>`)();
      const class_name = "test";
      const a_el = $$el(
        `<circle class="${class_name}" cx="10" cy="10" r="20"></circle>`
      )();
      $$append(a_el)(g_el);
      const b_el = $$el(
        `<rect class="${class_name}" x="20" y="20" width="100" height="40"></rect>`
      )();
      $$append(b_el)(g_el);

      // when
      const received = $$qsa(`.${class_name}`, g_el);

      // then
      expect(received).instanceof(NodeList);
      expect(received.length).equal(2);
      expect(received).include(a_el);
      expect(received).include(b_el);
    });

    it(`The function returns an empty NodeList when there is no matched elements with the selector.`, function () {
      // given
      const g_el = $$el(`<g></g>`)();
      $$append($$el(`<circle cx="10" cy="10" r="20"></circle>`)())(g_el);
      $$append($$el(`<rect x="20" y="20" width="100" height="40"></rect>`)())(
        g_el
      );

      // when
      const received = $$qsa(`#test`, g_el);

      // then
      expect(received).instanceof(NodeList);
      expect(received.length).equal(0);
    });
  }),
];
