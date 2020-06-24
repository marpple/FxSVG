# `<svg></svg>` 엘리먼트 주입

[EN](./SVG_INJECTION.md) | [KR](./SVG_INJECTION_KR.md)

The functions in list can take a SVG element as a parameter.
If there is no passed argument, the function will use the return value of `$$getSVG`.

The input SVG element only used in the function call.
If want to change the default SVG element, please use `$$setSVG` function.

When there are more parameters needed, the function will take those using currying way.

```javascript
const $svg = document.querySelector("svg");

// Both OK
console.log($$createSVGMatrix()());
// SVGMatrix {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0}
console.log($$createSVGMatrix($svg)());
// SVGMatrix {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0}
```

- `$$controlRotateTransform`
- `$$controlScaleTransform`
- `$$controlTranslateTransform`
- `$$createSVGMatrix`
- `$$createSVGPoint`
- `$$createSVGRect`
- `$$createSVGTransform`
- `$$createSVGTransformMatrix`
- `$$createSVGTransformRotate`
- `$$createSVGTransformScale`
- `$$createSVGTransformTranslate`
- `$$el`
- `$$els`
- `$$getBoxPoints`
- `$$getCenterPoint`
- `$$initMatrixTransform`
- `$$initRotateTransform`
- `$$initScaleTransform`
- `$$initTranslateTransform`
- `$$mergeRotateTransform`
- `$$mergeScaleTransform`
- `$$mergeTranslateTransform`
