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

- [source](./src/createSVGTransformScale/createSVGTransformScale.index.js)
- [detail](./src/createSVGTransformScale/README.md)

`type`이 `SVGTransform.SVG_TRANSFORM_SCALE`인 `SVGTransform` 객체를 생성합니다.

### \$\$createSVGTransformMatrix

- [source](./src/createSVGTransformMatrix/createSVGTransformMatrix.index.js)
- [detail](./src/createSVGTransformMatrix/README.md)

`type`이 `SVGTransform.SVG_TRANSFORM_MATRIX`인 `SVGTransform` 객체를 생성합니다.

### \$\$isTranslateSVGTransform

- [source](./src/isTranslateSVGTransform/isTranslateSVGTransform.index.js)
- [detail](./src/isTranslateSVGTransform/README.md)

해당 `SVGTransform`의 `type`이 `SVGTransform.SVG_TRANSFORM_TRANSLATE`인지 여부를 판단합니다.

### \$\$isRotateSVGTransform

- [source](./src/isRotateSVGTransform/isRotateSVGTransform.index.js)
- [detail](./src/isRotateSVGTransform/README.md)

해당 `SVGTransform`의 `type`이 `SVGTransform.SVG_TRANSFORM_ROTATE`인지 여부를 판단합니다.

### \$\$isScaleSVGTransform

- [source](./src/isScaleSVGTransform/isScaleSVGTransform.index.js)
- [detail](./src/isScaleSVGTransform/README.md)

해당 `SVGTransform`의 `type`이 `SVGTransform.SVG_TRANSFORM_SCALE`인지 여부를 판단합니다.

### \$\$getBaseTransformList

- [source](./src/getBaseTransformList/getBaseTransformList.index.js)
- [detail](./src/getBaseTransformList/README.md)

입력받은 svg 객체의 `transform.baseVal` 값을 반환합니다.

### \$\$getAnimTransformList

- [source](./src/getAnimTransformList/getAnimTransformList.index.js)
- [detail](./src/getAnimTransformList/README.md)

입력받은 svg 객체의 `transform.animVal` 값을 반환합니다.

### \$\$getBoxPoints

- [source](./src/getBoxPoints/getBoxPoints.index.js)
- [detail](./src/getBoxPoints/README.md)

svg 객체의 영역에 해당하는 `SVGPoint`들을 반환합니다.

### \$\$getCenterPoint

- [source](./src/getCenterPoint/getCenterPoint.index.js)
- [detail](./src/getCenterPoint/README.md)

svg 객체의 중심에 해당하는 `SVGPoint`를 반환합니다.

### \$\$consolidateTransformList

- [source](./src/consolidateTransformList/consolidateTransformList.index.js)
- [detail](./src/consolidateTransformList/README.md)

`SVGTransformList` 객체의 모든 `SVGTransform` 객체를 하나로 통합합니다.

### \$\$initTranslateTransform

- [source](./src/initTranslateTransform/initTranslateTransform.index.js)
- [detail](./src/initTranslateTransform/README.md)

svg 엘리먼트에 `SVGTransform.SVG_TRANSFORM_TRANSLATE` 타입의 `SVGTransform` 을 추가합니다.

### \$\$updateTranslateTransform

- [source](./src/updateTranslateTransform/updateTranslateTransform.index.js)
- [detail](./src/updateTranslateTransform/README.md)

`SVGTransform.SVG_TRANSFORM_TRANSLATE` 타입의 `SVGTransform` 의 `tx`, `ty` 값을 수정합니다.

### \$\$appendTranslateTransform

- [source](./src/appendTranslateTransform/appendTranslateTransform.index.js)
- [detail](./src/appendTranslateTransform/README.md)

`SVGTransform.SVG_TRANSFORM_TRANSLATE` 타입의 `SVGTransform` 의 `tx`, `ty` 에 입력받은 `tx`, `ty`를 더합니다.

### \$\$mergeTranslateTransform

- [source](./src/mergeTranslateTransform/mergeTranslateTransform.index.js)
- [detail](./src/mergeTranslateTransform/README.md)

svg 엘리먼트에 가장 마지막으로 적용된 `SVGTransform` 이 `SVGTransform.SVG_TRANSFORM_TRANSLATE` 타입인 경우
해당 `SVGTransform` 을 svg 엘리먼트의 `x`, `y` 속성 (혹은 그에 준하는 속성) 에 반영합니다.
svg 엘리먼트에 다른 `SVGTransform` 이 있는 경우 각 `SVGTransform` 을 업데이트합니다.

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
