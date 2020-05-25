# \$\$updateTranslateTransform

- [source](./updateTranslateTransform.index.js)

`SVGTransform.SVG_TRANSFORM_TRANSLATE` 타입의 `SVGTransform` 의 `tx`, `ty` 값을 수정합니다.
기존 `tx`, `ty`를 입력받은 `tx`, `ty`로 수정합니다.
수정한 `SVGTransform` 객체를 반환합니다.
이 함수는 인자로 받은 `SVGTransform` 객체를 직접 수정합니다.

```javascript
const t = $$createSVGTransformTranslate()({ tx: 10, ty: 20 });
console.log(t);
// SVGTransform {type: 2, matrix: SVGMatrix, angle: 0}
// matrix: SVGMatrix {a: 1, b: 0, c: 0, d: 1, e: 10, f: 20}
$$updateTranslateTransform(t, { tx: 100, ty: 200 });
console.log(t);
// SVGTransform {type: 2, matrix: SVGMatrix, angle: 0}
// matrix: SVGMatrix {a: 1, b: 0, c: 0, d: 1, e: 100, f: 200}
```
