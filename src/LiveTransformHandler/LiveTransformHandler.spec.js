import { expect } from "chai";
import { $$LiveTransform } from "../LiveTransform/LiveTransform.index.js";
import { $$LiveTransformHandler } from "./LiveTransformHandler.index.js";

export default ({ describe, it }) => [
  describe(`$$LiveTransformHandler`, function () {
    it(`An instance has live_transform property with the $$LiveTransform instance injected at being created.`, function () {
      const live_transform = new $$LiveTransform();

      const live_transform_handler = new $$LiveTransformHandler(live_transform);

      expect(live_transform_handler.live_transform).equal(live_transform);
    });

    it(`The "$$wrap" static method of the class create a new instance with the input $$LiveTransform instance.`, function () {
      const live_transform = new $$LiveTransform();

      const live_transform_handler = $$LiveTransformHandler.$$wrap(
        live_transform
      );

      expect(live_transform_handler.live_transform).equal(live_transform);
    });

    it(`The "$$unwrap" static method of the class return the $$LiveTransform instance of the input instance.
        Before return, it calls "$$done" method of the $$LiveTransform instance.`, function () {
      let is_called = false;
      const live_transform = new $$LiveTransform();
      live_transform.$$done = () => (is_called = true);
      const live_transform_handler = $$LiveTransformHandler.$$wrap(
        live_transform
      );

      const return_live_transform = $$LiveTransformHandler.$$unwrap(
        live_transform_handler
      );

      expect(return_live_transform).equal(live_transform);
      expect(is_called).true;
    });

    it(`The "$$unwrap" static method of the class do nothing but return undefined
        when the input instance has no $$LiveTransform instance.`, function () {
      const live_transform_handler = new $$LiveTransformHandler();

      const result = $$LiveTransformHandler.$$unwrap(live_transform_handler);

      expect(result).undefined;
    });

    it(`The "$$update" method of an instance return itself
        whether the return value of "$$getIsDone" method of the $$LiveTransform instance is true or false.`, function () {
      let live_transform;
      let live_transform_handler;

      live_transform = new $$LiveTransform();
      live_transform.$$getIsDone = () => true;
      live_transform_handler = $$LiveTransformHandler.$$wrap(live_transform);
      expect(live_transform_handler.$$update({})).equal(live_transform_handler);

      live_transform = new $$LiveTransform();
      live_transform.$$getIsDone = () => false;
      live_transform_handler = $$LiveTransformHandler.$$wrap(live_transform);
      expect(live_transform_handler.$$update({})).equal(live_transform_handler);
    });

    it(`The "$$update" method of an instance calls the "$$update" method of the $$LiveTransform instance with the input option
        if the return value of "$$getIsDone" method of the $$LiveTransform instance is false.`, function () {
      let receive_option = null;
      const option = {};
      const live_transform = new $$LiveTransform();
      live_transform.$$getIsDone = () => false;
      live_transform.$$update = (option) => (receive_option = option);
      const live_transform_handler = $$LiveTransformHandler.$$wrap(
        live_transform
      );

      live_transform_handler.$$update(option);

      expect(receive_option).equal(option);
    });

    it(`The "$$update" method of an instance do nothing
        if the return value of "$$getIsDone" method of the $$LiveTransform instance is true.`, function () {
      let is_called = false;
      const live_transform = new $$LiveTransform();
      live_transform.$$getIsDone = () => true;
      live_transform.$$update = () => (is_called = true);
      const live_transform_handler = $$LiveTransformHandler.$$wrap(
        live_transform
      );

      live_transform_handler.$$update({});

      expect(is_called).false;
    });

    it(`The "$$update" static method of the class call the "$$update" method of the input instance with the input option.`, function () {
      let receive_option = null;
      const option = {};
      const live_transform_handler = new $$LiveTransformHandler();
      live_transform_handler.$$update = (option) => (receive_option = option);

      $$LiveTransformHandler.$$update(option)(live_transform_handler);

      expect(receive_option).equal(option);
    });

    it(`The "$$append" method of an instance return itself
        whether the return value of "$$getIsDone" method of the $$LiveTransform instance is true or false.`, function () {
      let live_transform;
      let live_transform_handler;

      live_transform = new $$LiveTransform();
      live_transform.$$getIsDone = () => true;
      live_transform_handler = $$LiveTransformHandler.$$wrap(live_transform);
      expect(live_transform_handler.$$append({})).equal(live_transform_handler);

      live_transform = new $$LiveTransform();
      live_transform.$$getIsDone = () => false;
      live_transform_handler = $$LiveTransformHandler.$$wrap(live_transform);
      expect(live_transform_handler.$$append({})).equal(live_transform_handler);
    });

    it(`The "$$append" method of an instance calls the "$$append" method of the $$LiveTransform instance with the input option
        if the return value of "$$getIsDone" method of the $$LiveTransform instance is false.`, function () {
      let receive_option = null;
      const option = {};
      const live_transform = new $$LiveTransform();
      live_transform.$$getIsDone = () => false;
      live_transform.$$append = (option) => (receive_option = option);
      const live_transform_handler = $$LiveTransformHandler.$$wrap(
        live_transform
      );

      live_transform_handler.$$append(option);

      expect(receive_option).equal(option);
    });

    it(`The "$$append" method of an instance do nothing
        if the return value of "$$getIsDone" method of the $$LiveTransform instance is true.`, function () {
      let is_called = false;
      const live_transform = new $$LiveTransform();
      live_transform.$$getIsDone = () => true;
      live_transform.$$append = () => (is_called = true);
      const live_transform_handler = $$LiveTransformHandler.$$wrap(
        live_transform
      );

      live_transform_handler.$$append({});

      expect(is_called).false;
    });

    it(`The "$$append" static method of the class call the "$$append" method of the input instance with the input option.`, function () {
      let receive_option = null;
      const option = {};
      const live_transform_handler = new $$LiveTransformHandler();
      live_transform_handler.$$append = (option) => (receive_option = option);

      $$LiveTransformHandler.$$append(option)(live_transform_handler);

      expect(receive_option).equal(option);
    });

    it(`The "$$merge" method of an instance return itself
        whether the return value of "$$getIsDone" method of the $$LiveTransform instance is true or false.`, function () {
      let live_transform;
      let live_transform_handler;

      live_transform = new $$LiveTransform();
      live_transform.$$getIsDone = () => true;
      live_transform_handler = $$LiveTransformHandler.$$wrap(live_transform);
      expect(live_transform_handler.$$merge({})).equal(live_transform_handler);

      live_transform = new $$LiveTransform();
      live_transform.$$getIsDone = () => false;
      live_transform_handler = $$LiveTransformHandler.$$wrap(live_transform);
      expect(live_transform_handler.$$merge({})).equal(live_transform_handler);
    });

    it(`The "$$merge" method of an instance calls the "$$merge" method of the $$LiveTransform instance with the input option
        if the return value of "$$getIsDone" method of the $$LiveTransform instance is false.`, function () {
      let receive_option = null;
      const option = {};
      const live_transform = new $$LiveTransform();
      live_transform.$$getIsDone = () => false;
      live_transform.$$merge = (option) => (receive_option = option);
      const live_transform_handler = $$LiveTransformHandler.$$wrap(
        live_transform
      );

      live_transform_handler.$$merge(option);

      expect(receive_option).equal(option);
    });

    it(`The "$$merge" method of an instance calls the "$$done" method of the $$LiveTransform instance
        if the return value of "$$getIsDone" method of the $$LiveTransform instance is false.`, function () {
      let is_done = false;
      const live_transform = new $$LiveTransform();
      live_transform.$$getIsDone = () => false;
      live_transform.$$done = () => (is_done = true);
      const live_transform_handler = $$LiveTransformHandler.$$wrap(
        live_transform
      );

      live_transform_handler.$$merge({});

      expect(is_done).true;
    });

    it(`The "$$merge" method of an instance do nothing
        if the return value of "$$getIsDone" method of the $$LiveTransform instance is true.`, function () {
      let is_called = false;
      const live_transform = new $$LiveTransform();
      live_transform.$$getIsDone = () => true;
      live_transform.$$merge = () => (is_called = true);
      const live_transform_handler = $$LiveTransformHandler.$$wrap(
        live_transform
      );

      live_transform_handler.$$merge({});

      expect(is_called).false;
    });

    it(`The "$$merge" static method of the class call the "$$merge" method of the input instance with the input option.`, function () {
      let receive_option = null;
      const option = {};
      const live_transform_handler = new $$LiveTransformHandler();
      live_transform_handler.$$merge = (option) => (receive_option = option);

      $$LiveTransformHandler.$$merge(option)(live_transform_handler);

      expect(receive_option).equal(option);
    });
  }),
];
