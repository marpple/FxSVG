# \$\$updateMatrixTransform

- [source](./updateMatrixTransform.index.js)
- [test](./updateMatrixTransform.spec.js)

`SVGTransform.SVG_TRANSFORM_MATRIX` 타입의 `SVGTransform` 의 `matrix` 값을 수정합니다.
기존 `matrix`를 입력받은 `matrix`로 수정합니다.
수정한 `SVGTransform` 객체를 반환합니다.
이 함수는 인자로 받은 `SVGTransform` 객체를 직접 수정합니다.

입력한 `tx`, `ty` 값과 실제 Transform 에 적용된 값은 정확도 차이가 발생할 수 있습니다.

```javascript
const t = $$createSVGTransformMatrix()(
  $$createSVGMatrix()({ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6 })
);
console.log(t);
// SVGTransform {type: 1, matrix: SVGMatrix, angle: 0}
// matrix: SVGMatrix {a: 1, b: 2, c: 3, d: 4, e: 5, f: 6}
$$updateMatrixTransform(t, {
  matrix: $$createSVGMatrix()({ a: 7, b: 8, c: 9, d: 10, e: 11, f: 12 }),
});
console.log(t);
// SVGTransform {type: 1, matrix: SVGMatrix, angle: 0}
// matrix: SVGMatrix {a: 7, b: 8, c: 9, d: 10, e: 11, f: 12}
```
