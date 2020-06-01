# \$\$updateScaleTransform

- [source](./updateScaleTransform.index.js)
- [test](./updateScaleTransform.sepc.js)

`SVGTransform.SVG_TRANSFORM_SCALE` 타입의 `SVGTransform` 의 `sx`, `sy` 값을 수정합니다.
기존 `sx`, `sy`를 입력받은 `sx`, `sy`로 수정합니다.
수정한 `SVGTransform` 객체를 반환합니다.
이 함수는 인자로 받은 `SVGTransform` 객체를 직접 수정합니다.

입력한 `sx`, `sy` 값과 실제 Transform 에 적용된 값은 정확도 차이가 발생할 수 있습니다.

```javascript
const t = $$createSVGTransformScale()({ sx: 10, sy: 20 });
console.log(t);
// SVGTransform {type: 3, matrix: SVGMatrix, angle: 0}
// matrix: SVGMatrix {a: 10, b: 0, c: 0, d: 20, e: 0, f: 0}
$$updateScaleTransform(t, { sx: 100, sy: 200 });
console.log(t);
// SVGTransform {type: 3, matrix: SVGMatrix, angle: 0}
// matrix: SVGMatrix {a: 100, b: 0, c: 0, d: 200, e: 0, f: 0}
```
