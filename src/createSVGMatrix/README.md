# \$\$createSVGMatrix

- [source](./createSVGMatrix.index.js)
- [test](./createSVGMatrix.spec.js)

`SVGMatrix` 객체를 생성합니다.

[`<svg></svg>` 커링](../../svg_currying.md)이 적용된 함수입니다.

```javascript
console.log($$createSVGMatrix()());
// SVGMatrix {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0}
```

```javascript
console.log($$createSVGMatrix()({ e: 10, f: 20 }));
// SVGMatrix {a: 1, b: 0, c: 0, d: 1, e: 10, f: 20}
```

```javascript
console.log($$createSVGMatrix()({ a: 2, b: 0, c: 0, d: 4, e: 10, f: 20 }));
// SVGMatrix {a: 2, b: 0, c: 0, d: 4, e: 10, f: 20}
```
