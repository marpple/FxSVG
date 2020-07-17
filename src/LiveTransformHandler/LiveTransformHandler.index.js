export class $$LiveTransformHandler {
  static $$update(option) {
    return (live_transform_handler) => live_transform_handler.$$update(option);
  }

  static $$append(option) {
    return (live_transform_handler) => live_transform_handler.$$append(option);
  }

  static $$merge(option) {
    return (live_transform_handler) => live_transform_handler.$$merge(option);
  }

  static $$wrap(live_transform) {
    return new $$LiveTransformHandler(live_transform);
  }

  static $$unwrap(live_transform_handler) {
    if (!live_transform_handler.live_transform) {
      return;
    }

    live_transform_handler.live_transform.$$done();
    return live_transform_handler.live_transform;
  }

  constructor(live_transform) {
    this.live_transform = live_transform;
  }

  $$update(option) {
    if (this.live_transform.$$getIsDone()) {
      return this;
    }

    this.live_transform.$$update(option);
    return this;
  }

  $$append(option) {
    if (this.live_transform.$$getIsDone()) {
      return this;
    }

    this.live_transform.$$append(option);
    return this;
  }

  $$merge(option) {
    if (this.live_transform.$$getIsDone()) {
      return this;
    }

    this.live_transform.$$merge(option);
    this.live_transform.$$done();
    return this;
  }
}
