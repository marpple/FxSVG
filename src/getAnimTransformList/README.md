# \$\$getAnimTransformList

- [source](./getAnimTransformList.index.js)
- [test](./getAnimTransformList.spec.js)

입력받은 svg 객체의 `transform.animVal` 값을 반환합니다.

`SVGGraphicsElement` 인터페이스는 `transform` 속성으로 `SVGAnimatedTransformList` 객체를 가지고 있고
해당 객체는 `animVal` 속성으로 `SVGTransformList` 객체를 가지고 있습니다.

`animVal`은 SMIL 애니메이션이 적용된 경우에만 `baseVal`과 다릅니다. 특별한 상황이 아닌 한 동일한 값을 가집니다.
하지만 값은 동일해도 다른 래퍼런스를 가리킵니다.

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
console.log($$getAnimTransformList($el));
// SVGTransformList {0: SVGTransform, 1: SVGTransform, 2: SVGTransform, length: 3, numberOfItems: 3}
//   0: SVGTransform - type: SVG_TRANSFORM_TRANSLATE
//   1: SVGTransform - type: SVG_TRANSFORM_ROTATE
//   2: SVGTransform - type: SVG_TRANSFORM_SCALE
```
