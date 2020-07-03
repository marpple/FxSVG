# \$\$isSVGTransform

- [source](./isSVGTransform.index.js)
- [test](./isSVGTransform.spec.js)

해당 객체가 `SVGTransform` 인지 여부를 판단합니다.

```javascript
const transform = $$createSVGTransformTranslate()();
console.log($$isSVGTransform(transform));
// true
```

```javascript
console.log($$isSVGTransform(null));
// false
```
