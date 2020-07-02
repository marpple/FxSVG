# \$\$createSVGMatrix

- [source](./createSVGMatrix.index.js)
- [test](./createSVGMatrix.spec.js)

`SVGMatrix` 객체를 생성합니다.

```javascript
console.log($$createSVGMatrix()());
// SVGMatrix {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0}
```

```javascript
console.log($$createSVGMatrix({ e: 10, f: 20 })());
// SVGMatrix {a: 1, b: 0, c: 0, d: 1, e: 10, f: 20}
```

```javascript
console.log($$createSVGMatrix({ a: 2, b: 0, c: 0, d: 4, e: 10, f: 20 })());
// SVGMatrix {a: 2, b: 0, c: 0, d: 4, e: 10, f: 20}
```

```javascript
const $svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
console.log($$createSVGMatrix({ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6 })($svg));
// SVGMatrix {a: 1, b: 2, c: 3, d: 4, e: 5, f: 6}
```
