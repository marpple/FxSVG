# \$\$isValidFxScaleSVGTransformList

- [source](./isValidFxScaleSVGTransformList.index.js)
- [test](./isValidFxScaleSVGTransformList.spec.js)

`$$initScaleTransform` 함수를 적용한 `SVGTransformList`인지 여부를 판단합니다.

```javascript
const $el = $$el()(`
<rect x="0" y="0" width="100" height="100"></rect>
`);
$$initScaleTransform()($el, { index: 0 });
const transform_list = $$getBaseTransformList($el);

console.log($$isValidFxScaleSVGTransformList(transform_list, { index: 1 }));
// true
```
