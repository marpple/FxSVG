# FxSVG

Functional SVG Handling Library

## API

### \$\$getSVG

내부적으로 사용하는 svg 객체를 반환합니다.
`$$setSVG` 함수로 설정하지 않은 경우 `document.createElementNS` 를 실행합니다.
해당 함수를 실행하지 못하는 환경인 경우 `$$setSVG` 함수로 사용할 svg 객체를 설정합니다.

```javascript
console.log($$getSVG());
// <svg></svg>
```

### \$\$setSVG

내부적으로 사용하는 svg 객체를 설정한 후 설정한 svg 객체를 반환합니다.

```javascript
console.log(
  $$setSVG(document.createElementNS("http://www.w3.org/2000/svg", "svg"))
);
// <svg></svg>
```

### \$\$els

svg 문자열을 받아 svg 객체를 담은 배열을 생성합니다.

```javascript
console.log($$els('<rect x="0" y="0" width="10" height="10"></rect>'));
// [rect]
console.log(
  $$els(
    '<rect x="0" y="0" width="10" height="10"></rect><circle cx="1" cy="1" r="5"></circle>'
  )
);
// [rect, circle]
```

### \$\$el

svg 문자열을 받아 svg 객체를 생성합니다.

```javascript
console.log($$el('<rect x="0" y="0" width="10" height="10"></rect>'));
// rect
console.log(
  $$el(
    '<rect x="0" y="0" width="10" height="10"></rect><circle cx="1" cy="1" r="5"></circle>'
  )
);
// rect
```

### \$\$createSVGPoint

`SVGPoint` 객체를 생성합니다.

```javascript
console.log($$createSVGPoint());
// SVGPoint {x: 0, y: 0}

console.log($$createSVGPoint({ x: 10 }));
// SVGPoint {x: 10, y: 0}

console.log($$createSVGPoint({ y: 10 }));
// SVGPoint {x: 0, y: 10}

console.log($$createSVGPoint({ x: 10, y: 10 }));
// SVGPoint {x: 10, y: 10}
```

### \$\$createSVGRect

`SVGRect` 객체를 생성합니다.

```javascript
console.log($$createSVGRect());
// SVGRect {x: 0, y: 0, width: 0, height: 0}

console.log($$createSVGRect({ x: 10 }));
// SVGRect {x: 10, y: 0, width: 0, height: 0}

console.log($$createSVGRect({ width: 100 }));
// SVGRect {x: 0, y: 0, width: 100, height: 0}

console.log($$createSVGRect({ x: 10, y: 10, width: 100, height: 100 }));
// SVGRect {x: 10, y: 10, width: 100, height: 100}
```

### \$\$createSVGMatrix

`SVGMatrix` 객체를 생성합니다.

```javascript
console.log($$createSVGMatrix());
// SVGMatrix {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0}

console.log($$createSVGMatrix({ e: 10, f: 20 }));
// SVGMatrix {a: 1, b: 0, c: 0, d: 1, e: 10, f: 20}

console.log($$createSVGMatrix({ a: 2, b: 0, c: 0, d: 4, e: 10, f: 20 }));
// SVGMatrix {a: 2, b: 0, c: 0, d: 4, e: 10, f: 20}
```

### \$\$createSVGTransform

`SVGTransform` 객체를 생성합니다.

```javascript
console.log($$createSVGTransform());
// SVGTransform {type: 1, matrix: SVGMatrix, angle: 0}
```

### \$\$createSVGTransformTranslate

`type`이 `SVGTransform.SVG_TRANSFORM_TRANSLATE`인 `SVGTransform` 객체를 생성합니다.
`tx`로 x축 방향으로 이동할 값, `ty`로 y축 방향으로 이동할 값을 설정합니다.

```javascript
console.log($$createSVGTransformTranslate());
// SVGTransform {type: 2, matrix: SVGMatrix, angle: 0}

console.log($$createSVGTransformTranslate({ tx: 10 }));
// SVGTransform {type: 2, matrix: SVGMatrix, angle: 0}
//   SVGMatrix {a: 1, b: 0, c: 0, d: 1, e: 10, f: 0}

console.log($$createSVGTransformTranslate({ tx: 10, ty: 20 }));
// SVGTransform {type: 2, matrix: SVGMatrix, angle: 0}
//   SVGMatrix {a: 1, b: 0, c: 0, d: 1, e: 10, f: 20}
```

### \$\$createSVGTransformRotate

`type`이 `SVGTransform.SVG_TRANSFORM_ROTATE`인 `SVGTransform` 객체를 생성합니다.
`cx`, `cy`로 회전할 중심의 좌포를 설정하고 `angle`로 회전할 각도(`deg` 단위)를 설정합니다.
`cx`, `cy`를 설정하지 않으면 `(0, 0)`으로 설정합니다.

```javascript
console.log($$createSVGTransformRotate());
// SVGTransform {type: 4, matrix: SVGMatrix, angle: 0}

console.log($$createSVGTransformRotate({ angle: 45 }));
// SVGTransform {type: 4, matrix: SVGMatrix, angle: 45}

console.log($$createSVGTransformRotate({ cx: 10, cy: 10, angle: 30 }));
// SVGTransform {type: 4, matrix: SVGMatrix, angle: 30}
```

### \$\$createSVGTransformScale

`type`이 `SVGTransform.SVG_TRANSFORM_SCALE`인 `SVGTransform` 객체를 생성합니다.
`sx`로 x축 방향으로 확대할 비율을, `sy`로 y축 방향으로 확대할 비율을 설정합니다.
`sx`, `sy`가 음수일 경우 해당 축을 기준으로 대칭이동합니다.

```javascript
console.log($$createSVGTransformScale());
// SVGTransform {type: 3, matrix: SVGMatrix, angle: 0}
//   SVGMatrix {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0}

console.log($$createSVGTransformScale({ sx: 2 }));
// SVGTransform {type: 3, matrix: SVGMatrix, angle: 0}
//   SVGMatrix {a: 2, b: 0, c: 0, d: 1, e: 0, f: 0}

console.log($$createSVGTransformScale({ sx: 2, sy: 4 }));
// SVGTransform {type: 3, matrix: SVGMatrix, angle: 0}
//   SVGMatrix {a: 2, b: 0, c: 0, d: 4, e: 0, f: 0}
```

### \$\$createSVGTransformMatrix

`type`이 `SVGTransform.SVG_TRANSFORM_MATRIX`인 `SVGTransform` 객체를 생성합니다.
`SVGTransform`에 인자로 받은 `SVGMatrix`를 설정합니다.

```javascript
console.log($$createSVGTransformMatrix($$createSVGMatrix()));
// SVGTransform {type: 1, matrix: SVGMatrix, angle: 0}
//   SVGMatrix {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0}

console.log(
  $$createSVGTransformMatrix(
    $$createSVGMatrix({ a: 2, b: 3, c: 4, d: 5, e: 6, f: 7 })
  )
);
// SVGTransform {type: 1, matrix: SVGMatrix, angle: 0}
//   SVGMatrix {a: 2, b: 3, c: 4, d: 5, e: 6, f: 7}
```

### \$\$isTranslateSVGTransform

해당 `SVGTransform`의 `type`이 `SVGTransform.SVG_TRANSFORM_TRANSLATE`인지 여부를 판단합니다.

```javascript
console.log($$isTranslateSVGTransform($$createSVGTransformTranslate()));
// true

console.log($$isTranslateSVGTransform($$createSVGTransformRotate()));
// false
```

### \$\$isRotateSVGTransform

해당 `SVGTransform`의 `type`이 `SVGTransform.SVG_TRANSFORM_ROTATE`인지 여부를 판단합니다.

```javascript
console.log($$isRotateSVGTransform($$createSVGTransformRotate()));
// true

console.log($$isRotateSVGTransform($$createSVGTransformTranslate()));
// false
```

### \$\$isScaleSVGTransform

해당 `SVGTransform`의 `type`이 `SVGTransform.SVG_TRANSFORM_SCALE`인지 여부를 판단합니다.

```javascript
console.log($$isScaleSVGTransform($$createSVGTransformScale()));
// true

console.log($$isScaleSVGTransform($$createSVGTransformTranslate()));
// false
```
