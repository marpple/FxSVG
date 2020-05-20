# FxSVG

Functional SVG Handling Library

## API

### `<svg></svg>` 엘리먼트 커링

아래 함수들은 커링 인자로 `<svg></svg>` 엘리먼트를 받을 수 있습니다.
인자를 넘기지 않으면 `$$getSVG` 함수의 반환값을 사용합니다.
커링 인자로 받은 `<svg></svg>` 엘리먼트는 해당 함수 호출에서만 사용합니다.
기본으로 사용하는 `<svg></svg>` 엘리먼트를 변경하기 위해서는 `$$setSVG` 함수를 사용해야 합니다.

```javascript
const $svg = document.querySelector("svg");

// Both OK
console.log($$createSVGMatrix()());
// SVGMatrix {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0}
console.log($$createSVGMatrix($svg)());
// SVGMatrix {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0}
```

- `$$createSVGMatrix`
- `$$createSVGPoint`
- `$$createSVGRect`
- `$$createSVGTransform`
- `$$createSVGTransformMatrix`
- `$$createSVGTransformRotate`
- `$$createSVGTransformScale`
- `$$createSVGTransformTranslate`
- `$$els`
- `$$el`

### \$\$getSVG

내부적으로 사용하는 `<svg></svg>` 엘리먼트를 반환합니다.
`$$setSVG` 함수로 설정하지 않은 경우 `document.createElementNS` 를 실행합니다.
해당 함수를 실행하지 못하는 환경인 경우 `$$setSVG` 함수로 사용할 `<svg></svg>` 엘리먼트를 설정해주세요.

```javascript
console.log($$getSVG());
// <svg></svg>
```

### \$\$setSVG

내부적으로 사용하는 `<svg></svg>` 엘리먼트를 설정합니다.

```javascript
console.log(
  $$setSVG(document.createElementNS("http://www.w3.org/2000/svg", "svg"))
);
// <svg></svg>
```

### \$\$els

svg 문자열을 받아 svg 객체를 담은 배열을 생성합니다.

```javascript
console.log($$els()('<rect x="0" y="0" width="10" height="10"></rect>'));
// [rect]
console.log(
  $$els()(
    '<rect x="0" y="0" width="10" height="10"></rect><circle cx="1" cy="1" r="5"></circle>'
  )
);
// [rect, circle]
```

### \$\$el

svg 문자열을 받아 svg 객체를 생성합니다.

```javascript
console.log($$el()('<rect x="0" y="0" width="10" height="10"></rect>'));
// rect
console.log(
  $$el()(
    '<rect x="0" y="0" width="10" height="10"></rect><circle cx="1" cy="1" r="5"></circle>'
  )
);
// rect
```

### \$\$createSVGPoint

`SVGPoint` 객체를 생성합니다.

```javascript
console.log($$createSVGPoint()());
// SVGPoint {x: 0, y: 0}

console.log($$createSVGPoint()({ x: 10 }));
// SVGPoint {x: 10, y: 0}

console.log($$createSVGPoint()({ y: 10 }));
// SVGPoint {x: 0, y: 10}

console.log($$createSVGPoint()({ x: 10, y: 10 }));
// SVGPoint {x: 10, y: 10}
```

### \$\$createSVGRect

`SVGRect` 객체를 생성합니다.

```javascript
console.log($$createSVGRect()());
// SVGRect {x: 0, y: 0, width: 0, height: 0}

console.log($$createSVGRect()({ x: 10 }));
// SVGRect {x: 10, y: 0, width: 0, height: 0}

console.log($$createSVGRect()({ width: 100 }));
// SVGRect {x: 0, y: 0, width: 100, height: 0}

console.log($$createSVGRect()({ x: 10, y: 10, width: 100, height: 100 }));
// SVGRect {x: 10, y: 10, width: 100, height: 100}
```

### \$\$createSVGMatrix

`SVGMatrix` 객체를 생성합니다.

```javascript
console.log($$createSVGMatrix()());
// SVGMatrix {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0}

console.log($$createSVGMatrix()({ e: 10, f: 20 }));
// SVGMatrix {a: 1, b: 0, c: 0, d: 1, e: 10, f: 20}

console.log($$createSVGMatrix()({ a: 2, b: 0, c: 0, d: 4, e: 10, f: 20 }));
// SVGMatrix {a: 2, b: 0, c: 0, d: 4, e: 10, f: 20}
```

### \$\$createSVGTransform

`SVGTransform` 객체를 생성합니다.

```javascript
console.log($$createSVGTransform()());
// SVGTransform {type: 1, matrix: SVGMatrix, angle: 0}
```

### \$\$createSVGTransformTranslate

`type`이 `SVGTransform.SVG_TRANSFORM_TRANSLATE`인 `SVGTransform` 객체를 생성합니다.
`tx`로 x축 방향으로 이동할 값, `ty`로 y축 방향으로 이동할 값을 설정합니다.

```javascript
console.log($$createSVGTransformTranslate()());
// SVGTransform {type: 2, matrix: SVGMatrix, angle: 0}

console.log($$createSVGTransformTranslate()({ tx: 10 }));
// SVGTransform {type: 2, matrix: SVGMatrix, angle: 0}
//   SVGMatrix {a: 1, b: 0, c: 0, d: 1, e: 10, f: 0}

console.log($$createSVGTransformTranslate()({ tx: 10, ty: 20 }));
// SVGTransform {type: 2, matrix: SVGMatrix, angle: 0}
//   SVGMatrix {a: 1, b: 0, c: 0, d: 1, e: 10, f: 20}
```

### \$\$createSVGTransformRotate

`type`이 `SVGTransform.SVG_TRANSFORM_ROTATE`인 `SVGTransform` 객체를 생성합니다.
`cx`, `cy`로 회전할 중심의 좌포를 설정하고 `angle`로 회전할 각도(`deg` 단위)를 설정합니다.
`cx`, `cy`를 설정하지 않으면 `(0, 0)`으로 설정합니다.

```javascript
console.log($$createSVGTransformRotate()());
// SVGTransform {type: 4, matrix: SVGMatrix, angle: 0}

console.log($$createSVGTransformRotate()({ angle: 45 }));
// SVGTransform {type: 4, matrix: SVGMatrix, angle: 45}

console.log($$createSVGTransformRotate()({ cx: 10, cy: 10, angle: 30 }));
// SVGTransform {type: 4, matrix: SVGMatrix, angle: 30}
```

### \$\$createSVGTransformScale

`type`이 `SVGTransform.SVG_TRANSFORM_SCALE`인 `SVGTransform` 객체를 생성합니다.
`sx`로 x축 방향으로 확대할 비율을, `sy`로 y축 방향으로 확대할 비율을 설정합니다.
`sx`, `sy`가 음수일 경우 해당 축을 기준으로 대칭이동합니다.

```javascript
console.log($$createSVGTransformScale()());
// SVGTransform {type: 3, matrix: SVGMatrix, angle: 0}
//   SVGMatrix {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0}

console.log($$createSVGTransformScale()({ sx: 2 }));
// SVGTransform {type: 3, matrix: SVGMatrix, angle: 0}
//   SVGMatrix {a: 2, b: 0, c: 0, d: 1, e: 0, f: 0}

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

console.log($$isTranslateSVGTransform($$createSVGTransformRotate()()));
// false
```

### \$\$isRotateSVGTransform

해당 `SVGTransform`의 `type`이 `SVGTransform.SVG_TRANSFORM_ROTATE`인지 여부를 판단합니다.

```javascript
console.log($$isRotateSVGTransform($$createSVGTransformRotate()()));
// true

console.log($$isRotateSVGTransform($$createSVGTransformTranslate()()));
// false
```

### \$\$isScaleSVGTransform

해당 `SVGTransform`의 `type`이 `SVGTransform.SVG_TRANSFORM_SCALE`인지 여부를 판단합니다.

```javascript
console.log($$isScaleSVGTransform($$createSVGTransformScale()()));
// true

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
// SVGTransformList {0: SVGTransform, 1: SVGTransform, 2: SVGTransform, length: 3, numberOfItem: 3}
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
// SVGTransformList {0: SVGTransform, 1: SVGTransform, 2: SVGTransform, length: 3, numberOfItem: 3}
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
console.log($$getBoxPoints($el));
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
console.log($$getCenterPoint($el));
// {original: SVGPoint, transformed: SVGPoint}
// original: SVGPoint {x: 60, y: 120}
// transformed: SVGPoint {x: 460, y: 620}
```
