# \$\$createSVGTransform

- [source](./createSVGTransform.index.js)
- [test](./createSVGTransform.spec.js)

`SVGTransform` 객체를 생성합니다.
`SVGTransform.SVG_TRANSFORM_MATRIX` 타입을 가집니다.
`transform.matrix` 값으로 `SVGMatrix {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0}` 을 가집니다.

```javascript
console.log($$createSVGTransform());
// SVGTransform {type: 1, matrix: SVGMatrix, angle: 0}
```
