import { each, equals2, filterL, go, not } from "fxjs2";

const VERSION = 0;
let uniqueTag = 0;

export function type(Class) {
  const name = Class.name;

  if (!name) {
    throw new Error(`invalid typeclass name: ${name}`);
  }

  const symbolName = `$$fxsvg-${VERSION}/${name}/${uniqueTag++}`;
  const symbol = Symbol[symbolName]
    ? Symbol[symbolName]
    : (Symbol[symbolName] = Symbol(symbolName));

  Class.for = function _for(value) {
    let methods = value[symbol];
    if (!methods) {
      throw new Error(`No instance found on ${value} of typeclass ${name}`);
    }
    return methods;
  };

  Class.instance = function (constructor, methods) {
    Object.defineProperty(constructor.prototype, symbol, {
      value: methods,
      configurable: true,
      // make the prototype non-enumerable to prevent it from showing in Safari debugger
      enumerable: false,
    });
  };

  Class.symbolName = symbolName;
  Class.symbol = symbol;

  const properties = Object.getOwnPropertyDescriptors(Class.prototype);
  go(
    Object.keys(properties),
    filterL((key) => not(equals2(key, "constructor"))),
    each((key) => (Class.prototype[key] = Class.prototype[key].bind(Class.for)))
  );

  return Class;
}
