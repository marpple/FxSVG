# \$\$initRotateTransform

- [source](./initRotateTransform.index.js)
- [test](./initRotateTransform.spec.js)

svg 엘리먼트에 총 3개의 `SVGTransform`을 순서대로 추가합니다.

1. `SVGTransform.SVG_TRANSFORM_TRANSLATE` 타입의 `SVGTransform` (`index`)
2. `SVGTransform.SVG_TRANSFORM_ROTATE` 타입의 `SVGTransform` (`index + 1`)
3. `SVGTransform.SVG_TRANSFORM_TRANSLATE` 타입의 `SVGTransform` (`index + 2`)

2번 `SVGTransform` 객체를 반환합니다.
1번, 3번 `SVGTranform` 객체는 회전 중심을 설정합니다.

회전 중심 `cx`, `cy` 를 설정할 수 있습니다. 설정하지 않는 경우 모두 `0` 으로 초기화됩니다.
초기 회전 각도 `angle` 을 설정할 수 있습니다. 단위는 `deg` 입니다. 설정하지 않는 경우 `0` 으로 초기화됩니다.
`SVGTransform` 을 추가할 `index` 를 설정할 수 있습니다. 설정하지 않는 경우 `0` 으로 초기화됩니다.

```javascript
const str = `
<rect
  x="10"
  y="20"
  width="100"
  height="200"
>
</rect>
`;
const $el = $$el(str)();

console.log($$getBaseTransformList($el));
// SVGTransformList {length: 0, numberOfItems: 0}

$$initRotateTransform({ angle: 30, cx: 10, cy: 20 })($el);

console.log($$getBaseTransformList($el));
// SVGTransformList {0: SVGTransform, 1: SVGTransform, 2: SVGTransform, length: 3, numberOfItems: 3}
// 0: SVGTransform {type: 2, matrix: SVGMatrix, angle: 0}
//   matrix: SVGMatrix {a: 1, b: 0, c: 0, d: 1, e: 10, f: 20}
// 1: SVGTransform {type: 4, matrix: SVGMatrix, angle: 30}
// 2: SVGTransform {type: 2, matrix: SVGMatrix, angle: 0}
//   matrix: SVGMatrix {a: 1, b: 0, c: 0, d: 1, e: -10, f: -20}
```

```javascript
const str = `
<rect
  x="10"
  y="20"
  width="100"
  height="200"
  transform="scale(2, 4)"
>
</rect>
`;
const $el = $$el(str)();

console.log($$getBaseTransformList($el));
// SVGTransformList {0: SVGTransform, length: 1, numberOfItems: 1}
// 0: SVGTransform {type: 3, matrix: SVGMatrix, angle: 0}
//   matrix: SVGMatrix {a: 2, b: 0, c: 0, d: 4, e: 0, f: 0}

$$initRotateTransform({ cx: 10, cy: 20, angle: 30, index: 1 })($el);
// index 를 1 로 설정할 경우
// 기존 SVGTransformList 의 1 번 인덱스부터 3개의 SVGTransform 이 추가됨
// 즉 1, 2, 3 번 인덱스 사용

console.log($$getBaseTransformList($el));
// SVGTransformList {0: SVGTransform, 1: SVGTransform, 2: SVGTransform, 3: SVGTransform, length: 4, numberOfItems: 4}
// 0: SVGTransform {type: 3, matrix: SVGMatrix, angle: 0}
//   matrix: SVGMatrix {a: 2, b: 0, c: 0, d: 4, e: 0, f: 0}
// 1: SVGTransform {type: 2, matrix: SVGMatrix, angle: 0}
//   matrix: SVGMatrix {a: 1, b: 0, c: 0, d: 1, e: 10, f: 20}
// 2: SVGTransform {type: 4, matrix: SVGMatrix, angle: 30}
// 3: SVGTransform {type: 2, matrix: SVGMatrix, angle: 0}
//   matrix: SVGMatrix {a: 1, b: 0, c: 0, d: 1, e: -10, f: -20}
```
