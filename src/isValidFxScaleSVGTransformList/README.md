# \$\$isValidFxScaleSVGTransformList

- [source](./isValidFxScaleSVGTransformList.index.js)
- [test](./isValidFxScaleSVGTransformList.spec.js)

`$$initScaleTransform` 함수를 적용한 `SVGTransformList`인지 여부를 판단합니다.

```javascript
const $el = $$el()(`
<rect x="0" y="0" width="100" height="100"></rect>
`);
$$initScaleTransform({ index: 0 })($el);
const transform_list = $$getBaseTransformList($el);

console.log($$isValidFxScaleSVGTransformList({ index: 1 })(transform_list));
// true
```
