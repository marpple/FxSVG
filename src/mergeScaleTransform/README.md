# \$\$mergeScaleTransform

- [source](./mergeScaleTransform.index.js)
- [test](./mergeScaleTransform.spec.js)

`$$initScaleTransform` 으로 적용된 3개의 `SVGTransform` 객체를 하나의 `SVGTransform` 으로 병합합니다.
병합된 `SVGTransform` 은 `SVGTransform.SVG_TRANSFORM_MATRIX` 타입입니다.
따라서 한 번 병합한 `SVGTransform`을 `$$updateScaleTransform` 이나 `$$appendScaleTransform` 으로 변경할 수 없습니다.

[`<svg></svg>` 커링](../../doc/SVG_CURRYING.md)이 적용된 함수입니다.

```javascript
const $el = $$el()(`
  <rect
    x="10"
    y="20"
    width="100"
    height="200"
    transform="translate(200 400)"
  >
  </rect>
`);

console.log($$getBaseTransformList($el));
// SVGTransformList {0: SVGTransform, length: 1, numberOfItems: 1}
// 0: SVGTransform {type: 2, matrix: SVGMatrix, angle: 0}
//   matrix: SVGMatrix {a: 1, b: 0, c: 0, d: 1, e: 200, f: 400}

$$initScaleTransform()($el, { sx: 2, sy: 3, cx: 60, cy: 70 });

console.log($$getBaseTransformList($el));
// SVGTransformList {0: SVGTransform, 1: SVGTransform, 2: SVGTransform, 3: SVGTransform, length: 4, numberOfItems: 4}
// 0: SVGTransform {type: 2, matrix: SVGMatrix, angle: 0}
//   matrix: SVGMatrix {a: 1, b: 0, c: 0, d: 1, e: 60, f: 70}
// 1: SVGTransform {type: 3, matrix: SVGMatrix, angle: 0}
//   matrix: SVGMatrix {a: 2, b: 0, c: 0, d: 3, e: 0, f: 0}
// 2: SVGTransform {type: 2, matrix: SVGMatrix, angle: 0}
//   matrix: SVGMatrix {a: 1, b: 0, c: 0, d: 1, e: -60, f: -70}
// 3: SVGTransform {type: 2, matrix: SVGMatrix, angle: 0}
//   matrix: SVGMatrix {a: 1, b: 0, c: 0, d: 1, e: 200, f: 400}

$$mergeScaleTransform()($el, { index: 1 });
// 인덱스 1 에 SVGTransform.SVG_TRANSFORM_SCALE 타입의 SVGTransform 위치

console.log($$getBaseTransformList($el));
// SVGTransformList {0: SVGTransform, 1: SVGTransform, length: 2, numberOfItems: 2}
// 0: SVGTransform {type: 1, matrix: SVGMatrix, angle: 0}
//   matrix: SVGMatrix {a: 2, b: 0, c: 0, d: 3, e: -60, -140}
// 1: SVGTransform {type: 2, matrix: SVGMatrix, angle: 0}
//   matrix: SVGMatrix {a: 1, b: 0, c: 0, d: 1, e: 200, f: 400}

console.log($el);
// <rect x="10" y="20" width="100" height="200" transform="matrix(2 0 0 3 -60 -140) translate(200 400)"></rect>
```
