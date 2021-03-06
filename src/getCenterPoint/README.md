# \$\$getCenterPoint

- [source](./getCenterPoint.index.js)
- [test](./getCenterPoint.spec.js)

svg 객체의 중심에 해당하는 `SVGPoint`를 반환합니다. 해당 svg 객체는 DOM 트리의 `<svg></svg>` 태그에 속해 있어야 합니다.

`original` 속성은 svg 객체가 `transform` 하기 전 중심입니다.
`transformed` 속성은 svg 객체가 `transform` 한 후 중심입니다.

```javascript
const $svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
document.body.appendChild($svg);

const str = `
<rect
  x="10"
  y="20"
  width="100"
  height="200"
  transform="translate(400, 500)" 
>
</rect>
`;
const $el = $$el(str)();
$$append($el)($svg);

console.log($$getCenterPoint($el));
// {original: SVGPoint, transformed: SVGPoint}
// original: SVGPoint {x: 60, y: 120}
// transformed: SVGPoint {x: 460, y: 620}
```
