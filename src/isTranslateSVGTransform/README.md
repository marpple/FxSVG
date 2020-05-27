# \$\$isTranslateSVGTransform

- [source](./isTranslateSVGTransform.index.js)
- [test](./isTranslateSVGTransform.spec.js)

해당 `SVGTransform`의 `type`이 `SVGTransform.SVG_TRANSFORM_TRANSLATE`인지 여부를 판단합니다.

```javascript
console.log($$isTranslateSVGTransform($$createSVGTransformTranslate()()));
// true
```

```javascript
console.log($$isTranslateSVGTransform($$createSVGTransformRotate()()));
// false
```
