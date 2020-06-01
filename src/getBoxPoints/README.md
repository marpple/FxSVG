# \$\$getBoxPoints

- [source](./getBoxPoints.index.js)
- [test](./getBoxPoints.spec.js)

svg 객체의 영역에 해당하는 `SVGPoint`들을 반환합니다. 해당 svg 객체는 DOM 트리의 `<svg></svg>` 태그에 속해 있어야 합니다.

`original` 속성은 svg 객체가 `transform` 하기 전 영역입니다.
`transformed` 속성은 svg 객체가 `transform` 한 후 영역입니다.
`bounding` 속성은 svg 객체가 `transform` 한 후 영역을 덮는 최소 직사각형 영역입니다.

[`<svg></svg>` 커링](../../doc/SVG_CURRYING.md)이 적용된 함수입니다.

```javascript
const $el = $$el()(`
  <rect
    x="10"
    y="20"
    width="100"
    height="200"
    transform="translate(400, 500)" 
  >
  </rect>
`);
$svg.appendChild($el);
console.log($$getBoxPoints()($el));
// {original: {...}, transformed: {...}, bounding: {...}}
// original:
//   top_left: SVGPoint {x: 10, y: 20}
//   top_right: SVGPoint {x: 110, y: 20}
//   bottom_left: SVGPoint {x: 10, y: 220}
//   bottom_right: SVGPoint {x: 110, y: 220}
// transformed:
//   top_left: SVGPoint {x: 410, y: 520}
//   top_right: SVGPoint {x: 510, y: 520}
//   bottom_left: SVGPoint {x: 410, y: 720}
//   bottom_right: SVGPoint {x: 510, y: 720}
// bounding:
//   min: SVGPoint {x: 410, y: 520}
//   max: SVGPoint {x: 510, y: 720}
```
