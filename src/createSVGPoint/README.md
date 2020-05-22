# \$\$createSVGPoint

- [source](./createSVGPoint.index.js)
- [test](./createSVGPoint.spec.js)

`SVGPoint` 객체를 생성합니다.
입력받은 `x`, `y` 값을 설정합니다.

[`<svg></svg>` 커링](../../svg_currying.md)이 적용된 함수입니다.

```javascript
console.log($$createSVGPoint()());
// SVGPoint {x: 0, y: 0}
```

```javascript
console.log($$createSVGPoint()({ x: 10 }));
// SVGPoint {x: 10, y: 0}
```

```javascript
console.log($$createSVGPoint()({ y: 10 }));
// SVGPoint {x: 0, y: 10}
```

```javascript
console.log($$createSVGPoint()({ x: 10, y: 10 }));
// SVGPoint {x: 10, y: 10}
```
