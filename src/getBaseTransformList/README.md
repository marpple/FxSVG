# \$\$getBaseTransformList

- [source](./getBaseTransformList.index.js)

입력받은 svg 객체의 `transform.baseVal` 값을 반환합니다.

`SVGGraphicsElement` 인터페이스는 `transform` 속성으로 `SVGAnimatedTransformList` 객체를 가지고 있고
해당 객체는 `baseVal` 속성으로 `SVGTransformList` 객체를 가지고 있습니다.

```javascript
const $el = $$el()(`
  <rect
    x="0"
    y="0"
    width="10"
    height="20"
    transform="translate(10, 20) rotate(45, 100, 200) scale(2, 3)"
  ></rect>
`);
console.log($$getBaseTransformList($el));
// SVGTransformList {0: SVGTransform, 1: SVGTransform, 2: SVGTransform, length: 3, numberOfItems: 3}
//   0: SVGTransform - type: SVG_TRANSFORM_TRANSLATE
//   1: SVGTransform - type: SVG_TRANSFORM_ROTATE
//   2: SVGTransform - type: SVG_TRANSFORM_SCALE
```
