# \$\$createSVGTransformScale

- [source](./createSVGTransformScale.index.js)
- [test](./createSVGTransformScale.spec.js)

`type`이 `SVGTransform.SVG_TRANSFORM_SCALE`인 `SVGTransform` 객체를 생성합니다.
`sx`로 x축 방향으로 확대할 비율을, `sy`로 y축 방향으로 확대할 비율을 설정합니다.
`sx`, `sy`가 음수일 경우 해당 축을 기준으로 대칭이동합니다.

입력한 `sx`, `sy` 값과 실제 적용된 Transform 값은 정확도 차이가 발생할 수 있습니다.

```javascript
console.log($$createSVGTransformScale()());
// SVGTransform {type: 3, matrix: SVGMatrix, angle: 0}
//   SVGMatrix {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0}
```

```javascript
console.log($$createSVGTransformScale()({ sx: 2 }));
// SVGTransform {type: 3, matrix: SVGMatrix, angle: 0}
//   SVGMatrix {a: 2, b: 0, c: 0, d: 1, e: 0, f: 0}
```

```javascript
console.log($$createSVGTransformScale()({ sx: 2, sy: 4 }));
// SVGTransform {type: 3, matrix: SVGMatrix, angle: 0}
//   SVGMatrix {a: 2, b: 0, c: 0, d: 4, e: 0, f: 0}
```
