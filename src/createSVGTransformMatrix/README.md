# \$\$createSVGTransformMatrix

- [source](./createSVGTransformMatrix.index.js)
- [test](./createSVGTransformMatrix.spec.js)

`type`이 `SVGTransform.SVG_TRANSFORM_MATRIX`인 `SVGTransform` 객체를 생성합니다.
`SVGTransform`에 인자로 받은 `SVGMatrix`를 설정합니다.

```javascript
const matrix = $$createSVGMatrix()();
console.log($$createSVGTransformMatrix({ matrix })());
// SVGTransform {type: 1, matrix: SVGMatrix, angle: 0}
//   SVGMatrix {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0}
```

```javascript
const matrix = $$createSVGMatrix({ a: 2, b: 3, c: 4, d: 5, e: 6, f: 7 })();
console.log($$createSVGTransformMatrix({ matrix })());
// SVGTransform {type: 1, matrix: SVGMatrix, angle: 0}
//   SVGMatrix {a: 2, b: 3, c: 4, d: 5, e: 6, f: 7}
```

```javascript
const $svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
const matrix = $$createSVGMatrix({
  a: 12,
  b: 13,
  c: 14,
  d: 15,
  e: 16,
  f: 17,
})();
console.log($$createSVGTransformMatrix({ matrix })($svg));
// SVGTransform {type: 1, matrix: SVGMatrix, angle: 0}
//   SVGMatrix {a: 12, b: 13, c: 14, d: 15, e: 16, f: 17}
```
