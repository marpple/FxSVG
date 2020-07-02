# \$\$updateTranslateTransform

- [source](./updateTranslateTransform.index.js)
- [test](./updateTranslateTransform.spec.js)

`SVGTransform.SVG_TRANSFORM_TRANSLATE` 타입의 `SVGTransform` 의 `tx`, `ty` 값을 수정합니다.
기존 `tx`, `ty`를 입력받은 `tx`, `ty`로 수정합니다.
수정한 `SVGTransform` 객체를 반환합니다.
이 함수는 인자로 받은 `SVGTransform` 객체를 직접 수정합니다.

입력한 `tx`, `ty` 값과 실제 Transform 에 적용된 값은 정확도 차이가 발생할 수 있습니다.

```javascript
const transform = $$createSVGTransformTranslate({ tx: 10, ty: 20 })();
console.log(transform);
// SVGTransform {type: 2, matrix: SVGMatrix, angle: 0}
// matrix: SVGMatrix {a: 1, b: 0, c: 0, d: 1, e: 10, f: 20}
$$updateTranslateTransform({ tx: 100, ty: 200 })(transform);
console.log(transform);
// SVGTransform {type: 2, matrix: SVGMatrix, angle: 0}
// matrix: SVGMatrix {a: 1, b: 0, c: 0, d: 1, e: 100, f: 200}
```
