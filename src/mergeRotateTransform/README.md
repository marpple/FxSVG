# \$\$mergeRotateTransform

- [source](./mergeRotateTransform.index.js)
- [test](./mergeRotateTransform.spec.js)

`$$initRotateTransform` 으로 적용된 3개의 `SVGTransform` 객체를 하나의 `SVGTransform` 으로 병합합니다.
한 번 병합한 `SVGTransform`을 `$$updateRotateTransform` 이나 `$$appendRotateTransform` 으로 변경하는 것은 안전하지 않습니다.
`cx`, `cy`가 `0` 이 아닌 경우 회전 변환 중심이 의도치 않게 수정될 수 있습니다.

[`<svg></svg>` 커링](../../svg_currying.md)이 적용된 함수입니다.

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
