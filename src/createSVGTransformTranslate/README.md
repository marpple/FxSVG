# \$\$createSVGTransformTranslate

- [source](./createSVGTransformTranslate.index.js)

`type`이 `SVGTransform.SVG_TRANSFORM_TRANSLATE`인 `SVGTransform` 객체를 생성합니다.
`tx`로 x축 방향으로 이동할 값, `ty`로 y축 방향으로 이동할 값을 설정합니다.

[`<svg></svg>` 커링](../../svg_currying.md)이 적용된 함수입니다.

```javascript
console.log($$createSVGTransformTranslate()());
// SVGTransform {type: 2, matrix: SVGMatrix, angle: 0}
```

```javascript
console.log($$createSVGTransformTranslate()({ tx: 10 }));
// SVGTransform {type: 2, matrix: SVGMatrix, angle: 0}
//   SVGMatrix {a: 1, b: 0, c: 0, d: 1, e: 10, f: 0}
```

```javascript
console.log($$createSVGTransformTranslate()({ tx: 10, ty: 20 }));
// SVGTransform {type: 2, matrix: SVGMatrix, angle: 0}
//   SVGMatrix {a: 1, b: 0, c: 0, d: 1, e: 10, f: 20}
```
