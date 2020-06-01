# \$\$isMatrixSVGTransform

- [source](./isMatrixSVGTransform.index.js)
- [test](./isMatrixSVGTransform.spec.js)

해당 `SVGTransform`의 `type`이 `SVGTransform.SVG_TRANSFORM_MATRIX`인지 여부를 판단합니다.

```javascript
console.log($$isMatrixSVGTransform($$createSVGTransformMatrix()()));
// true
```

```javascript
console.log($$isMatrixSVGTransform($$createSVGTransformTranslate()()));
// false
```
