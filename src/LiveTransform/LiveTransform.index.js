import { type } from "./typeclasses.js";

export const $$LiveTransform = type(
  class $$LiveTransform {
    static get name() {
      return "$$LiveTransform";
    }

    $$update(option) {
      return (live_transform) => {
        const { $$update } = this(live_transform);
        return $$update(option)(live_transform);
      };
    }
  }
);

export const { $$update } = $$LiveTransform.prototype;
