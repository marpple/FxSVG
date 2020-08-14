# \$\$getConsolidatedTransformMatrix

- [source](./getConsolidatedTransformMatrix.index.js)
- [test](./getConsolidatedTransformMatrix.spec.js)

입력받은 `SVGTransformList` 의 모든 `SVGTransform` 의 변환 행렬을 곱한 행렬을 반환합니다.
`SVGTransformList.consolidate` 와 비슷한 동작을 수행하지만 `SVGTransformList` 를 변형하지 않습니다.

```javascript
const el = $$el(`
  <circle cx="0" cy="0" r="10" transform="matrix(2 3 4 5 6 7) matrix(8 9 10 11 12 13)"></circle>
`)();
const transform_list = $$getBaseTransformList(el);

const matrix = $$getConsolidatedTransformMatrix(transform_list);
console.log(matrix);
// {a: 52, b: 69, c: 64, d: 85, e: 82, f: 108}
```
