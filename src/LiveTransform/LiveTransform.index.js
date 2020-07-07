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

    $$append(option) {
      return (live_transform) => {
        const { $$append } = this(live_transform);
        return $$append(option)(live_transform);
      };
    }

    $$merge(option) {
      return (live_transform) => {
        const { $$merge } = this(live_transform);
        return $$merge(option)(live_transform);
      };
    }
  }
);

export const { $$update, $$append, $$merge } = $$LiveTransform.prototype;
