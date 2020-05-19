# FxSVG

Functional SVG Handling Library

## API

### \$\$getSVG

내부적으로 사용하는 svg 객체를 반환합니다.
`$$setSVG` 함수로 설정하지 않은 경우 `document.createElementNS` 를 실행합니다.
해당 함수를 실행하지 못하는 환경인 경우 `$$setSVG` 함수로 사용할 svg 객체를 설정합니다.

```javascript
console.log($$getSVG());
// <svg></svg>
```

### \$\$setSVG

내부적으로 사용하는 svg 객체를 설정한 후 설정한 svg 객체를 반환합니다.

```javascript
console.log(
  $$setSVG(document.createElementNS("http://www.w3.org/2000/svg", "svg"))
);
// <svg></svg>
```

### \$\$els

svg 문자열을 받아 svg 객체를 담은 배열을 생성합니다.

```javascript
console.log($$els('<rect x="0" y="0" width="10" height="10"></rect>'));
// [rect]
console.log(
  $$els(
    '<rect x="0" y="0" width="10" height="10"></rect><circle cx="1" cy="1" r="5"></circle>'
  )
);
// [rect, circle]
```

### \$\$el

svg 문자열을 받아 svg 객체를 생성합니다.

```javascript
console.log($$el('<rect x="0" y="0" width="10" height="10"></rect>'));
// rect
console.log(
  $$el(
    '<rect x="0" y="0" width="10" height="10"></rect><circle cx="1" cy="1" r="5"></circle>'
  )
);
// rect
```

### \$\$createSVGPoint

`SVGPoint` 객체를 생성합니다.

```javascript
console.log($$createSVGPoint());
// SVGPoint {x: 0, y: 0}

console.log($$createSVGPoint({ x: 10 }));
// SVGPoint {x: 10, y: 0}

console.log($$createSVGPoint({ y: 10 }));
// SVGPoint {x: 0, y: 10}

console.log($$createSVGPoint({ x: 10, y: 10 }));
// SVGPoint {x: 10, y: 10}
```

### \$\$createSVGRect

`SVGRect` 객체를 생성합니다.

```javascript
console.log($$createSVGRect());
// SVGRect {x: 0, y: 0, width: 0, height: 0}

console.log($$createSVGRect({ x: 10 }));
// SVGRect {x: 10, y: 0, width: 0, height: 0}

console.log($$createSVGRect({ width: 100 }));
// SVGRect {x: 0, y: 0, width: 100, height: 0}

console.log($$createSVGRect({ x: 10, y: 10, width: 100, height: 100 }));
// SVGRect {x: 10, y: 10, width: 100, height: 100}
```
