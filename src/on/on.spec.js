import { expect } from "chai";
import { $$el } from "../el/el.index.js";
import { $$on } from "./on.index.js";

export default ({ describe, it }) => [
  describe(`$$on`, function () {
    it(`The function add the function as an event listener of the event to the element.`, async function () {
      // given
      let flag = false;
      const f = () => (flag = true);
      const el = $$el(`<circle cx="0" cy="0" r="10"></circle>`)();
      const event_name = "click";

      // when
      $$on(event_name, f)(el);
      await new Promise((resolve) => setTimeout(() => resolve(), 300));
      el.dispatchEvent(new Event(event_name));

      // then
      expect(flag).true;
    });
  }),
];
