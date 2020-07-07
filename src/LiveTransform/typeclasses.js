import { each, equals2, filterL, go, not } from "fxjs2";

let uniqueTag = 0;

const $$getMethods = Symbol(`$$fxsvg/LiveTransform/typeclasses/getMethods`);

export function type(Class) {
  const name = Class.name;

  if (!name) {
    throw new Error(`invalid typeclass name: ${name}`);
  }

  const symbolName = `$$fxsvg/LiveTransform/typeclasses/${name}/${uniqueTag++}`;
  const symbol = Symbol[symbolName]
    ? Symbol[symbolName]
    : (Symbol[symbolName] = Symbol(symbolName));

  Object.defineProperty(Class, $$getMethods, {
    value(value) {
      const methods = value[symbol];
      if (!methods) {
        throw new Error(`No instance found on ${value} of typeclass ${name}`);
      }
      return methods;
    },
    configurable: false,
    enumerable: false,
    writable: false,
  });

  Class.instance = function (constructor, methods) {
    Object.defineProperty(constructor.prototype, symbol, {
      value: methods,
      configurable: true,
      enumerable: false,
      writable: false,
    });
    return constructor;
  };

  Class.symbolName = symbolName;
  Class.symbol = symbol;

  const properties = Object.getOwnPropertyDescriptors(Class.prototype);
  go(
    Object.keys(properties),
    filterL((key) => not(equals2(key, "constructor"))),
    each(
      (key) =>
        (Class.prototype[key] = Class.prototype[key].bind(Class[$$getMethods]))
    )
  );

  return Class;
}
