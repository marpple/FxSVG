# \$\$consolidateTransformList

- [source](./consolidateTransformList.index.js)
- [test](./consolidateTransformList.spec.js)

`SVGTransformList` 객체의 모든 `SVGTransform` 객체를 하나로 통합하여 `SVGTransformList` 객체를 새로 초기화합니다.
이 함수는 입력받은 `SVGTransformList`를 수정합니다.

```javascript
const str = `
<rect
  x="10"
  y="20"
  width="100"
  height="200"
  transform="translate(400, 500) scale(2, 4)"
>
</rect>
`;
const $el = $$el(str)();

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
