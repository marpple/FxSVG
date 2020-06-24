# \$\$createSVGPoint

- [source](./createSVGPoint.index.js)
- [test](./createSVGPoint.spec.js)

`SVGPoint` 객체를 생성합니다.
입력받은 `x`, `y` 값을 설정합니다.
소수점 값의 정확도 차이가 발생할 수 있습니다.

[SVG 주입](../../doc/SVG_INJECTION.md)이 적용된 함수입니다.

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
