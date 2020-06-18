# FxSVG

[EN](./README.md) | [KR](./README_KR.md)

Functional SVG Handling Library

## Installation

FxSVG는 ECMAScript Module 로 작성된 패키지입니다.

다음과 같은 형태로 패키지를 제공합니다.

- ECMAScript Module
- 브라우저에서 사용할 수 있는 번들링 파일

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

FxSVG는 SVG, ECMAScript 6+ 표준을 따르는 모던 브라우저만 지원합니다.

FxSVG는 `window` 객체의 `$$` property를 namespace로 사용합니다.

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

- [API Reference](./doc/API_KR.md)
- [Test](./doc/TEST_KR.md)

## Contributing

FxSVG 개발에 참여하고 싶은 모든 분들을 환영합니다.
FxSVG 코드에 기여하고 싶은 분은 아래 가이드를 참고해주세요.

- [Contributing Guide](./doc/CONTRIBUTING_KR.md)
