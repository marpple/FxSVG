# \$\$isRotateSVGTransform

- [source](./isRotateSVGTransform.index.js)
- [test](./isRotateSVGTransform.spec.js)

해당 `SVGTransform`의 `type`이 `SVGTransform.SVG_TRANSFORM_ROTATE`인지 여부를 판단합니다.

```javascript
console.log($$isRotateSVGTransform($$createSVGTransformRotate()()));
// true
```

```javascript
console.log($$isRotateSVGTransform($$createSVGTransformTranslate()()));
// false
```
