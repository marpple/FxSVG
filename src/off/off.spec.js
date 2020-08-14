import { expect } from "chai";
import { $$el } from "../el/el.index.js";
import { $$on } from "../on/on.index.js";
import { $$off } from "./off.index.js";

const waitFor = (ms = 0) =>
  new Promise((resolve) => setTimeout(() => resolve(), ms));

export default ({ describe, it }) => [
  describe(`$off`, function () {
    it(`The function removes the event handler of the event from the element.`, async function () {
      this.timeout(3000);
      this.slow(1500);

      // given
      let count = 0;
      const event_name = "click";
      const f = () => (count += 1);
      const el = $$el(`<circle cx="0" cy="0" r="10"></circle>`)();
      $$on(event_name, f)(el);
      await waitFor(300);
      el.dispatchEvent(new Event(event_name));

      // when
      $$off(event_name, f)(el);
      await waitFor(300);
      el.dispatchEvent(new Event(event_name));
      await waitFor(300);

      // then
      expect(count).equal(1);
    });
  }),
];
