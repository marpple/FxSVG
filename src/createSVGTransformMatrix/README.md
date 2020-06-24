# \$\$createSVGTransformMatrix

- [source](./createSVGTransformMatrix.index.js)
- [test](./createSVGTransformMatrix.spec.js)

`type`이 `SVGTransform.SVG_TRANSFORM_MATRIX`인 `SVGTransform` 객체를 생성합니다.
`SVGTransform`에 인자로 받은 `SVGMatrix`를 설정합니다.

[SVG 주입](../../doc/SVG_INJECTION.md)이 적용된 함수입니다.

```javascript
console.log($$createSVGTransformMatrix()({ matrix: $$createSVGMatrix()() }));
// SVGTransform {type: 1, matrix: SVGMatrix, angle: 0}
//   SVGMatrix {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0}
```

```javascript
console.log(
  $$createSVGTransformMatrix()({
    matrix: $$createSVGMatrix()({ a: 2, b: 3, c: 4, d: 5, e: 6, f: 7 }),
  })
);
// SVGTransform {type: 1, matrix: SVGMatrix, angle: 0}
//   SVGMatrix {a: 2, b: 3, c: 4, d: 5, e: 6, f: 7}
```
