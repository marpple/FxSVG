# FxSVG

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

## API

[`<svg></svg>` 엘리먼트 커링](./svg_currying.md)

---

### \$\$getSVG

- [source](./src/getSetSVG/getSetSVG.index.js)
- [detail](./src/getSetSVG/README.md)

`<svg></svg>` 엘리먼트를 반환합니다.

### \$\$setSVG

- [source](./src/getSetSVG/getSetSVG.index.js)
- [detail](./src/getSetSVG/README.md)

내부적으로 사용하는 `<svg></svg>` 엘리먼트를 설정합니다.

### \$\$els

- [source](./src/els/els.index.js)
- [detail](./src/els/README.md)

`SVGElement` 를 담은 배열을 생성합니다.

### \$\$el

- [source](./src/el/el.index.js)
- [detail](./src/el/README.md)

`SVGElement` 를 생성합니다.

### \$\$createSVGPoint

- [source](./src/createSVGPoint/createSVGPoint.index.js)
- [detail](./src/createSVGPoint/README.md)

`SVGPoint` 객체를 생성합니다.

### \$\$createSVGRect

- [source](./src/createSVGRect/createSVGRect.index.js)
- [detail](./src/createSVGRect/README.md)

`SVGRect` 객체를 생성합니다.

### \$\$createSVGMatrix

- [source](./src/createSVGMatrix/createSVGMatrix.index.js)
- [detail](./src/createSVGMatrix/README.md)

`SVGMatrix` 객체를 생성합니다.

### \$\$createSVGTransform

- [source](./src/createSVGTransform/createSVGTransform.index.js)
- [detail](./src/createSVGTransform/README.md)

`SVGTransform` 객체를 생성합니다.

### \$\$createSVGTransformTranslate

- [source](./src/createSVGTransformTranslate/createSVGTransformTranslate.index.js)
- [detail](./src/createSVGTransformTranslate/README.md)

`type`이 `SVGTransform.SVG_TRANSFORM_TRANSLATE`인 `SVGTransform` 객체를 생성합니다.

### \$\$createSVGTransformRotate

- [source](./src/createSVGTransformRotate/createSVGTransformRotate.index.js)
- [detail](./src/createSVGTransformRotate/README.md)

`type`이 `SVGTransform.SVG_TRANSFORM_ROTATE`인 `SVGTransform` 객체를 생성합니다.

### \$\$createSVGTransformScale

`type`이 `SVGTransform.SVG_TRANSFORM_SCALE`인 `SVGTransform` 객체를 생성합니다.
`sx`로 x축 방향으로 확대할 비율을, `sy`로 y축 방향으로 확대할 비율을 설정합니다.
`sx`, `sy`가 음수일 경우 해당 축을 기준으로 대칭이동합니다.

```javascript
console.log($$createSVGTransformScale()());
// SVGTransform {type: 3, matrix: SVGMatrix, angle: 0}
//   SVGMatrix {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0}
```

```javascript
console.log($$createSVGTransformScale()({ sx: 2 }));
// SVGTransform {type: 3, matrix: SVGMatrix, angle: 0}
//   SVGMatrix {a: 2, b: 0, c: 0, d: 1, e: 0, f: 0}
```

```javascript
console.log($$createSVGTransformScale()({ sx: 2, sy: 4 }));
// SVGTransform {type: 3, matrix: SVGMatrix, angle: 0}
//   SVGMatrix {a: 2, b: 0, c: 0, d: 4, e: 0, f: 0}
```

### \$\$createSVGTransformMatrix

`type`이 `SVGTransform.SVG_TRANSFORM_MATRIX`인 `SVGTransform` 객체를 생성합니다.
`SVGTransform`에 인자로 받은 `SVGMatrix`를 설정합니다.

```javascript
console.log($$createSVGTransformMatrix()($$createSVGMatrix()()));
// SVGTransform {type: 1, matrix: SVGMatrix, angle: 0}
//   SVGMatrix {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0}
```

```javascript
console.log(
  $$createSVGTransformMatrix()(
    $$createSVGMatrix()({ a: 2, b: 3, c: 4, d: 5, e: 6, f: 7 })
  )
);
// SVGTransform {type: 1, matrix: SVGMatrix, angle: 0}
//   SVGMatrix {a: 2, b: 3, c: 4, d: 5, e: 6, f: 7}
```

### \$\$isTranslateSVGTransform

해당 `SVGTransform`의 `type`이 `SVGTransform.SVG_TRANSFORM_TRANSLATE`인지 여부를 판단합니다.

```javascript
console.log($$isTranslateSVGTransform($$createSVGTransformTranslate()()));
// true
```

```javascript
console.log($$isTranslateSVGTransform($$createSVGTransformRotate()()));
// false
```

### \$\$isRotateSVGTransform

해당 `SVGTransform`의 `type`이 `SVGTransform.SVG_TRANSFORM_ROTATE`인지 여부를 판단합니다.

```javascript
console.log($$isRotateSVGTransform($$createSVGTransformRotate()()));
// true
```

```javascript
console.log($$isRotateSVGTransform($$createSVGTransformTranslate()()));
// false
```

### \$\$isScaleSVGTransform

해당 `SVGTransform`의 `type`이 `SVGTransform.SVG_TRANSFORM_SCALE`인지 여부를 판단합니다.

```javascript
console.log($$isScaleSVGTransform($$createSVGTransformScale()()));
// true
```

```javascript
console.log($$isScaleSVGTransform($$createSVGTransformTranslate()()));
// false
```

### \$\$getBaseTransformList

입력받은 svg 객체의 `transform.baseVal` 값을 반환합니다.

`SVGGraphicsElement` 인터페이스는 `transform` 속성으로 `SVGAnimatedTransformList` 객체를 가지고 있고
해당 객체는 `baseVal` 속성으로 `SVGTransformList` 객체를 가지고 있습니다.

```javascript
const $el = $$el()(`
  <rect
    x="0"
    y="0"
    width="10"
    height="20"
    transform="translate(10, 20) rotate(45, 100, 200) scale(2, 3)"
  ></rect>
`);
console.log($$getBaseTransformList($el));
// SVGTransformList {0: SVGTransform, 1: SVGTransform, 2: SVGTransform, length: 3, numberOfItems: 3}
//   0: SVGTransform - type: SVG_TRANSFORM_TRANSLATE
//   1: SVGTransform - type: SVG_TRANSFORM_ROTATE
//   2: SVGTransform - type: SVG_TRANSFORM_SCALE
```

### \$\$getAnimTransformList

입력받은 svg 객체의 `transform.animVal` 값을 반환합니다.

`SVGGraphicsElement` 인터페이스는 `transform` 속성으로 `SVGAnimatedTransformList` 객체를 가지고 있고
해당 객체는 `animVal` 속성으로 `SVGTransformList` 객체를 가지고 있습니다.

`animVal`은 SMIL 애니메이션이 적용된 경우에만 `baseVal`과 다릅니다. 특별한 상황이 아닌 한 동일한 값을 가집니다.
하지만 값은 동일해도 다른 래퍼런스를 가리킵니다.

```javascript
const $el = $$el()(`
  <rect
    x="0"
    y="0"
    width="10"
    height="20"
    transform="translate(10, 20) rotate(45, 100, 200) scale(2, 3)"
  ></rect>
`);
console.log($$getAnimTransformList($el));
// SVGTransformList {0: SVGTransform, 1: SVGTransform, 2: SVGTransform, length: 3, numberOfItems: 3}
//   0: SVGTransform - type: SVG_TRANSFORM_TRANSLATE
//   1: SVGTransform - type: SVG_TRANSFORM_ROTATE
//   2: SVGTransform - type: SVG_TRANSFORM_SCALE
```

### \$\$getBoxPoints

svg 객체의 영역에 해당하는 `SVGPoint`들을 반환합니다. 해당 svg 객체는 DOM 트리의 `<svg></svg>` 태그에 속해 있어야 합니다.

`original` 속성은 svg 객체가 `transform` 하기 전 영역입니다.
`transformed` 속성은 svg 객체가 `transform` 한 후 영역입니다.
`bounding` 속성은 svg 객체가 `transform` 한 후 영역을 덮는 최소 직사각형 영역입니다.

```javascript
const $el = $$el()(`
  <rect
    x="10"
    y="20"
    width="100"
    height="200"
    transform="translate(400, 500)" 
  >
  </rect>
`);
$svg.appendChild($el);
console.log($$getBoxPoints()($el));
// {original: {...}, transformed: {...}, bounding: {...}}
// original:
//   top_left: SVGPoint {x: 10, y: 20}
//   top_right: SVGPoint {x: 110, y: 20}
//   bottom_left: SVGPoint {x: 10, y: 220}
//   bottom_right: SVGPoint {x: 110, y: 220}
// transformed:
//   top_left: SVGPoint {x: 410, y: 520}
//   top_right: SVGPoint {x: 510, y: 520}
//   bottom_left: SVGPoint {x: 410, y: 720}
//   bottom_right: SVGPoint {x: 510, y: 720}
// bounding:
//   min: SVGPoint {x: 410, y: 520}
//   max: SVGPoint {x: 510, y: 720}
```

### \$\$getCenterPoint

svg 객체의 중심에 해당하는 `SVGPoint`를 반환합니다. 해당 svg 객체는 DOM 트리의 `<svg></svg>` 태그에 속해 있어야 합니다.

`original` 속성은 svg 객체가 `transform` 하기 전 중심입니다.
`transformed` 속성은 svg 객체가 `transform` 한 후 중심입니다.

```javascript
const $el = $$el()(`
  <rect
    x="10"
    y="20"
    width="100"
    height="200"
    transform="translate(400, 500)" 
  >
  </rect>
`);
$svg.appendChild($el);
console.log($$getCenterPoint()($el));
// {original: SVGPoint, transformed: SVGPoint}
// original: SVGPoint {x: 60, y: 120}
// transformed: SVGPoint {x: 460, y: 620}
```

### \$\$consolidateTransformList

`SVGTransformList` 객체의 모든 `SVGTransform` 객체를 하나로 통합하여 `SVGTransformList` 객체를 새로 초기화합니다.
이 함수는 입력받은 `SVGTransformList`를 수정합니다.

```javascript
const $el = $$el()(`
  <rect
    x="10"
    y="20"
    width="100"
    height="200"
    transform="translate(400, 500) scale(2, 4)"
  >
  </rect>
`);

console.log($$getBaseTransformList($el));
// SVGTransformList {0: SVGTransform, 1: SVGTransform, length: 2, numberOfItems: 2}
// 0: SVGTransform {type: 2, matrix: SVGMatrix, angle: 0}
//   matrix: SVGMatrix {a: 1, b: 0, c: 0, d: 1, e: 400, f: 500}
// 1: SVGTransform {type: 3, matrix: SVGMatrix, angle: 0}
//   matrix: SVGMatrix {a: 2, b: 0, c: 0, d: 4, e: 0, f: 0}

$$consolidateTransformList($$getBaseTransformList($el));

console.log($$getBaseTransformList($el));
// SVGTransformList {0: SVGTransform, length: 1, numberOfItems: 1}
// 0: SVGTransform {type: 1, matrix: SVGMatrix, angle: 0}
//   matrix: SVGMatrix {a: 2, b: 0, c: 0, d: 4, e: 400, f: 500}
```

### \$\$initTranslateTransform

svg 엘리먼트에 `SVGTransform.SVG_TRANSFORM_TRANSLATE` 타입의 `SVGTransform` 을 추가합니다.
`SVGTransform` 은 항상 `transform.baseVal` 에 해당하는 `SVGTransformList` 의 `0` 인덱스에 추가됩니다.
`SVGTransformList` 는 역순으로 적용되기 때문에 추가된 `SVGTransform` 은 가장 마지막에 적용됩니다.

초기 `tx`, `ty` 값을 설정할 수 있으며 설정하지 않는 경우 모두 `0` 으로 초기화됩니다.

```javascript
const $el = $$el()(`
  <rect
    x="10"
    y="20"
    width="100"
    height="200"
  >
  </rect>
`);

console.log($$getBaseTransformList($el));
// SVGTransformList {length: 0, numberOfItems: 0}

$$initTranslateTransform()($el, { tx: 10, ty: 20 });

console.log($$getBaseTransformList($el));
// SVGTransformList {0: SVGTransform, length: 1, numberOfItems: 1}
// 0: SVGTransform {type: 2, matrix: SVGMatrix, angle: 0}
//   matrix: SVGMatrix {a: 1, b: 0, c: 0, d: 1, e: 10, f: 20}
```

```javascript
const $el = $$el()(`
  <rect
    x="10"
    y="20"
    width="100"
    height="200"
    transform="scale(2, 4)"
  >
  </rect>
`);

console.log($$getBaseTransformList($el));
// SVGTransformList {0: SVGTransform, length: 1, numberOfItems: 1}
// 0: SVGTransform {type: 3, matrix: SVGMatrix, angle: 0}
//   matrix: SVGMatrix {a: 2, b: 0, c: 0, d: 4, e: 0, f: 0}

$$initTranslateTransform()($el, { tx: 10, ty: 20 });

console.log($$getBaseTransformList($el));
// SVGTransformList {0: SVGTransform, 1: SVGTransform, length: 2, numberOfItems: 2}
// 0: SVGTransform {type: 2, matrix: SVGMatrix, angle: 0}
//   matrix: SVGMatrix {a: 1, b: 0, c: 0, d: 1, e: 10, f: 20}
// 1: SVGTransform {type: 3, matrix: SVGMatrix, angle: 0}
//   matrix: SVGMatrix {a: 2, b: 0, c: 0, d: 4, e: 0, f: 0}
```

### \$\$updateTranslateTransform

`SVGTransform.SVG_TRANSFORM_TRANSLATE` 타입의 `SVGTransform` 의 `tx`, `ty` 값을 수정합니다.
기존 `tx`, `ty`를 입력받은 `tx`, `ty`로 수정합니다.
수정한 `SVGTransform` 객체를 반환합니다.
이 함수는 인자로 받은 `SVGTransform` 객체를 직접 수정합니다.

```javascript
const t = $$createSVGTransformTranslate()({ tx: 10, ty: 20 });
console.log(t);
// SVGTransform {type: 2, matrix: SVGMatrix, angle: 0}
// matrix: SVGMatrix {a: 1, b: 0, c: 0, d: 1, e: 10, f: 20}
$$updateTranslateTransform(t, { tx: 100, ty: 200 });
console.log(t);
// SVGTransform {type: 2, matrix: SVGMatrix, angle: 0}
// matrix: SVGMatrix {a: 1, b: 0, c: 0, d: 1, e: 100, f: 200}
```

### \$\$appendTranslateTransform

`SVGTransform.SVG_TRANSFORM_TRANSLATE` 타입의 `SVGTransform` 의 `tx`, `ty` 값을 수정합니다.
기존 `tx`, `ty`에 입력받은 `tx`, `ty`를 더한 결과로 수정합니다.
수정한 `SVGTransform` 객체를 반환합니다.
이 함수는 인자로 받은 `SVGTransform` 객체를 직접 수정합니다.

```javascript
const t = $$createSVGTransformTranslate()({ tx: 10, ty: 20 });
console.log(t);
// SVGTransform {type: 2, matrix: SVGMatrix, angle: 0}
// matrix: SVGMatrix {a: 1, b: 0, c: 0, d: 1, e: 10, f: 20}
$$appendTranslateTransform(t, { tx: 100, ty: 200 });
console.log(t);
// SVGTransform {type: 2, matrix: SVGMatrix, angle: 0}
// matrix: SVGMatrix {a: 1, b: 0, c: 0, d: 1, e: 110, f: 220}
```

### \$\$mergeTranslateTransform

svg 엘리먼트에 가장 마지막으로 적용된 `SVGTransform` 이 `SVGTransform.SVG_TRANSFORM_TRANSLATE` 타입인 경우
해당 `SVGTransform` 을 svg 엘리먼트의 `x`, `y` 속성 (혹은 그에 준하는 속성) 에 반영합니다.
svg 엘리먼트에 다른 `SVGTransform` 이 있는 경우 각 `SVGTransform` 을 업데이트합니다.

`cx`, `cy` 처럼 `x`, `y` 위치를 나타내는 속성명이 다른 경우 `x_name`, `y_name` 으로 해당 속성명을 설정할 수 있습니다.

```javascript
const $el = $$el()(`
  <rect
    x="10"
    y="20"
    width="100"
    height="200"
    transform="scale(2, 4)"
  >
  </rect>
`);

console.log($$getBaseTransformList($el));
// SVGTransformList {0: SVGTransform, length: 1, numberOfItems: 1}
// 0: SVGTransform {type: 3, matrix: SVGMatrix, angle: 0}
//   matrix: SVGMatrix {a: 2, b: 0, c: 0, d: 4, e: 0, f: 0}

$$initTranslateTransform()($el, { tx: 500, ty: 600 });

console.log($$getBaseTransformList($el));
// SVGTransformList {0: SVGTransform, 1: SVGTransform, length: 2, numberOfItems: 2}
// 0: SVGTransform {type: 2, matrix: SVGMatrix, angle: 0}
//   matrix: SVGMatrix {a: 1, b: 0, c: 0, d: 1, e: 500, f: 600}
// 1: SVGTransform {type: 3, matrix: SVGMatrix, angle: 0}
//   matrix: SVGMatrix {a: 2, b: 0, c: 0, d: 4, e: 0, f: 0}

$$mergeTranslateTransform()($el);

console.log($$getBaseTransformList($el));
// SVGTransformList {0: SVGTransform, length: 1, numberOfItems: 1}
// 0: SVGTransform {type: 1, matrix: SVGMatrix, angle: 0}
//   matrix: SVGMatrix {a: 2, b: 0, c: 0, d: 4, e: -500, f: -1800}

console.log($el);
// <rect x="510" y="620" width="100" height="200" transform="matrix(2 0 0 4 -500 -1800)"></rect>
```

```javascript
const $el = $$el()(`
  <circle
    cx="10"
    cy="20"
    r="100"
    transform="scale(2, 4)"
  >
  </circle>
`);

console.log($$getBaseTransformList($el));
// SVGTransformList {0: SVGTransform, length: 1, numberOfItems: 1}
// 0: SVGTransform {type: 3, matrix: SVGMatrix, angle: 0}
//   matrix: SVGMatrix {a: 2, b: 0, c: 0, d: 4, e: 0, f: 0}

$$initTranslateTransform()($el, { tx: 500, ty: 600 });

console.log($$getBaseTransformList($el));
// SVGTransformList {0: SVGTransform, 1: SVGTransform, length: 2, numberOfItems: 2}
// 0: SVGTransform {type: 2, matrix: SVGMatrix, angle: 0}
//   matrix: SVGMatrix {a: 1, b: 0, c: 0, d: 1, e: 500, f: 600}
// 1: SVGTransform {type: 3, matrix: SVGMatrix, angle: 0}
//   matrix: SVGMatrix {a: 2, b: 0, c: 0, d: 4, e: 0, f: 0}

$$mergeTranslateTransform()($el, { x_name: "cx", y_name: "cy" });

console.log($$getBaseTransformList($el));
// SVGTransformList {0: SVGTransform, length: 1, numberOfItems: 1}
// 0: SVGTransform {type: 1, matrix: SVGMatrix, angle: 0}
//   matrix: SVGMatrix {a: 2, b: 0, c: 0, d: 4, e: -500, f: -1800}

console.log($el);
// <circle cx="510" cy="620" r="100" transform="matrix(2 0 0 4 -500 -1800)"></circle>
```

### \$\$controlTranslateTransform

`$$initTranslateTransform`, `$$updateTranslateTransform`, `$$appendTranslateTransform`, `$$mergeTranslateTransform` 함수들을
쉽게 사용할 수 있는 `controller` 를 생성합니다.

`update`, `append`, `end` 메소드를 체이닝하여 안전하게 조작할 수 있습니다.

`x_name`, `y_name` 설정을 인자로 전달하지 않는 경우 `end` 메소드에서 `$$mergeTranslateTransform` 를 실행하지 않습니다.

```javascript
const $el = $$el()(
  `<circle cx="10" cy="20" r="100" transform="scale(2, 4)"></circle>`
);
const { controller } = $$controlTranslateTransform()($el, {
  x_name: "cx",
  y_name: "cy",
});
controller.update({ tx: 30, ty: 60 }).append({ tx: 70, ty: 40 }).end();

console.log($el);
// <circle cx="110" cy="120" r="100" transform="matrix(2 0 0 4 -100 -300)"></circle>
```

### \$\$initRotateTransform

svg 엘리먼트에 총 3개의 `SVGTransform`을 순서대로 추가합니다.

1. `SVGTransform.SVG_TRANSFORM_TRANSLATE` 타입의 `SVGTransform` (`index`: `0`)
2. `SVGTransform.SVG_TRANSFORM_ROTATE` 타입의 `SVGTransform` (`index`: `1`)
3. `SVGTransform.SVG_TRANSFORM_TRANSLATE` 타입의 `SVGTransform` (`index`: `2`)

2번 `SVGTransform` 객체를 반환합니다.
1번, 3번 `SVGTranform` 객체는 회전 중심을 설정합니다.

회전 중심 `cx`, `cy` 를 설정할 수 있습니다.
초기 회전 각도 `angle` 을 설정할 수 있습니다. 단위는 `deg` 입니다.
설정하지 않는 경우 모두 `0` 으로 초기화됩니다.

```javascript
const $el = $$el()(`
  <rect
    x="10"
    y="20"
    width="100"
    height="200"
  >
  </rect>
`);

console.log($$getBaseTransformList($el));
// SVGTransformList {length: 0, numberOfItems: 0}

$$initRotateTransform()($el, { tx: 10, ty: 20 });

console.log($$getBaseTransformList($el));
// SVGTransformList {0: SVGTransform, 1: SVGTransform, 2: SVGTransform, length: 3, numberOfItems: 3}
// 0: SVGTransform {type: 2, matrix: SVGMatrix, angle: 0}
//   matrix: SVGMatrix {a: 1, b: 0, c: 0, d: 1, e: 10, f: 20}
// 1: SVGTransform {type: 4, matrix: SVGMatrix, angle: 30}
// 2: SVGTransform {type: 2, matrix: SVGMatrix, angle: 0}
//   matrix: SVGMatrix {a: 1, b: 0, c: 0, d: 1, e: -10, f: -20}
```

```javascript
const $el = $$el()(`
  <rect
    x="10"
    y="20"
    width="100"
    height="200"
    transform="scale(2, 4)"
  >
  </rect>
`);

console.log($$getBaseTransformList($el));
// SVGTransformList {0: SVGTransform, length: 1, numberOfItems: 1}
// 0: SVGTransform {type: 3, matrix: SVGMatrix, angle: 0}
//   matrix: SVGMatrix {a: 2, b: 0, c: 0, d: 4, e: 0, f: 0}

$$initTranslateTransform()($el, { tx: 10, ty: 20 });

console.log($$getBaseTransformList($el));
// SVGTransformList {0: SVGTransform, 1: SVGTransform, 2: SVGTransform, 3: SVGTransform, length: 4, numberOfItems: 4}
// 0: SVGTransform {type: 2, matrix: SVGMatrix, angle: 0}
//   matrix: SVGMatrix {a: 1, b: 0, c: 0, d: 1, e: 10, f: 20}
// 1: SVGTransform {type: 4, matrix: SVGMatrix, angle: 30}
// 2: SVGTransform {type: 2, matrix: SVGMatrix, angle: 0}
//   matrix: SVGMatrix {a: 1, b: 0, c: 0, d: 1, e: -10, f: -20}
// 3: SVGTransform {type: 3, matrix: SVGMatrix, angle: 0}
//   matrix: SVGMatrix {a: 2, b: 0, c: 0, d: 4, e: 0, f: 0}
```

### \$\$updateRotateTransform

`SVGTransform.SVG_TRANSFORM_ROTATE` 타입의 `SVGTransform` 의 `angle` 값을 수정합니다.
기존 `angle`을 입력받은 `angle`로 수정합니다.
`cx`, `cy`는 항상 `0`으로 고정됩니다.
회전 중심을 설정해야 할 경우 `SVGTransform.SVG_TRANSFORM_TRANSLATE` 타입의 `SVGTransform` 을 앞, 뒤로 추가하는 방삭을 사용합니다.
수정한 `SVGTransform` 객체를 반환합니다.
이 함수는 인자로 받은 `SVGTransform` 객체를 직접 수정합니다.

```javascript
const t = $$createSVGTransformRotate()({ angle: 30 });
console.log(t);
// SVGTransform {type: 4, matrix: SVGMatrix, angle: 30}
$$updateRotateTransform(t, { angle: 60 });
console.log(t);
// SVGTransform {type: 4, matrix: SVGMatrix, angle: 60}
```

### \$\$appendRotateTransform

`SVGTransform.SVG_TRANSFORM_ROTATE` 타입의 `SVGTransform` 의 `angle` 값을 수정합니다.
기존 `angle`에 입력받은 `angle`을 더한 값으로 수정합니다.
`cx`, `cy`는 항상 `0`으로 고정됩니다.
회전 중심을 설정해야 할 경우 `SVGTransform.SVG_TRANSFORM_TRANSLATE` 타입의 `SVGTransform` 을 앞, 뒤로 추가하는 방삭을 사용합니다.
수정한 `SVGTransform` 객체를 반환합니다.
이 함수는 인자로 받은 `SVGTransform` 객체를 직접 수정합니다.

```javascript
const t = $$createSVGTransformRotate()({ angle: 45 });
console.log(t);
// SVGTransform {type: 4, matrix: SVGMatrix, angle: 45}
$$appendRotateTransform(t, { angle: 30 });
console.log(t);
// SVGTransform {type: 4, matrix: SVGMatrix, angle: 75}
```

### \$\$mergeRotateTransform

`$$initRotateTransform` 으로 적용된 3개의 `SVGTransform` 객체를 하나의 `SVGTransform` 으로 병합합니다.
한 번 병합한 `SVGTransform`을 `$$updateRotateTransform` 이나 `$$appendRotateTransform` 으로 변경하는 것은 안전하지 않습니다.
`cx`, `cy`가 `0` 이 아닌 경우 회전 변환 중심이 의도치 않게 수정될 수 있습니다.

```javascript
const $el = $$el()(`
  <rect
    x="10"
    y="20"
    width="100"
    height="200"
    transform="scale(2, 4)"
  >
  </rect>
`);

console.log($$getBaseTransformList($el));
// SVGTransformList {0: SVGTransform, length: 1, numberOfItems: 1}
// 0: SVGTransform {type: 3, matrix: SVGMatrix, angle: 0}
//   matrix: SVGMatrix {a: 2, b: 0, c: 0, d: 4, e: 0, f: 0}

$$initRotateTransform()($el, { angle: 30, cx: 10, cy: 20 });

console.log($$getBaseTransformList($el));
// SVGTransformList {0: SVGTransform, 1: SVGTransform, 2: SVGTransform, 3: SVGTransform, length: 4, numberOfItems: 4}
// 0: SVGTransform {type: 2, matrix: SVGMatrix, angle: 0}
//   matrix: SVGMatrix {a: 1, b: 0, c: 0, d: 1, e: 10, f: 20}
// 1: SVGTransform {type: 4, matrix: SVGMatrix, angle: 30}
//   matrix: SVGMatrix {a: 0.8660254037844387, b: 0.49999999999999994, c: -0.49999999999999994, d: 0.8660254037844387, e: 0, f: 0}
// 2: SVGTransform {type: 2, matrix: SVGMatrix, angle: 0}
//   matrix: SVGMatrix {a: 1, b: 0, c: 0, d: 1, e: -10, f: -20}
// 3: SVGTransform {type: 3, matrix: SVGMatrix, angle: 0}
//   matrix: SVGMatrix {a: 2, b: 0, c: 0, d: 4, e: 0, f: 0}

$$mergeRotateTransform()($el);

console.log($$getBaseTransformList($el));
// SVGTransformList {0: SVGTransform, 1: SVGTransform, length: 2, numberOfItems: 2}
// 0: SVGTransform {type: 4, matrix: SVGMatrix, angle: 30}
//   matrix: SVGMatrix {a: 0.8660254037844387, b: 0.49999999999999994, c: -0.49999999999999994, d: 0.8660254037844387, e: 11.339745962155611, f: -2.3205080756887746}
// 1: SVGTransform {type: 3, matrix: SVGMatrix, angle: 0}
//   matrix: SVGMatrix {a: 2, b: 0, c: 0, d: 4, e: 0, f: 0}

console.log($el);
// <rect x="10" y="20" width="100" height="200" transform="rotate(30 10 20) scale(2 4)"></rect>
```

### \$\$controlRotateTransform

`$$initRotateTransform`, `$$updateRotateTransform`, `$$appendRotateTransform`, `$$mergeRotateTransform` 함수들을
쉽게 사용할 수 있는 `controller` 를 생성합니다.

`update`, `append`, `end` 메소드를 체이닝하여 안전하게 조작할 수 있습니다.

```javascript
const $el = $$el()(
  `<rect x="10" y="20" width="100" height="200" transform="scale(2, 4)"></rect>`
);
const { controller } = $$controlTranslateTransform()($el, {
  cx: 10,
  cy: 20,
});
controller.update({ angle: 30 }).append({ angle: 45 }).end();

console.log($el);
// <rect x="10" y="20" width="100" height="200" transform="matrix(0.517638 1.93185 -3.8637 1.03528 26.7303 5.16436)"></rect>
```
