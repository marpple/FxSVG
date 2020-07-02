# FxSVG

[EN](./README.md) | [KR](./README_KR.md)

Functional SVG Handling Library

## Installation

FxSVG use the ECMAScript Module system.

There are two type packages provided.

- ECMAScript Module
- bundle file for using in browser environment

### ECMAScript Module

```shell script
npm install fxsvg
```

```javascript
import { $$createSVGTransformTranslate } from "fxsvg";
import FxSVG from "fxsvg";

const $el = document.querySelector("svg rect");
const transform = $$createSVGTransformTranslate({ tx: 10, ty: 20 });
FxSVG.getBaseTransformList($el).initialize(transform);
```

### In a Browser

FxSVG supports only modern browsers that follow the ECMAScript 6+ spec and SVG 1.1+ spec.

FxSVG uses `$$` property of `window` object as a namespace for itself.

```shell script
npm install fxsvg
```

```html
<script src="path/to/node_modules/fxsvg/dist/fxsvg.js"></script>
```

```javascript
const { $$el } = $$;

const $rect = $$el(`<rect x="10" y="10" width="100" height="100"></rect>`);
const { controller } = $$.controlTranslateTransform()($rect);
controller.append({ tx: 10 }).append({ ty: 10 }).end();
```

## Documentation

- [Function Interface](./doc/FUNCTION_INTERFACE.md)
- [API Reference](./doc/API.md)
- [Test](./doc/TEST.md)

## Contributing

FxSVG always welcome all the developers who want to join in.
Please following the guide when you contribute.

- [Contributing Guide](./doc/CONTRIBUTING.md)
