# \$\$isScaleSVGTransform

- [source](./isScaleSVGTransform.index.js)

해당 `SVGTransform`의 `type`이 `SVGTransform.SVG_TRANSFORM_SCALE`인지 여부를 판단합니다.

```javascript
console.log($$isScaleSVGTransform($$createSVGTransformScale()()));
// true
```

```javascript
console.log($$isScaleSVGTransform($$createSVGTransformTranslate()()));
// false
```
