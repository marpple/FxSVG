# `<svg></svg>` 엘리먼트 커링

아래 함수들은 커링 인자로 `<svg></svg>` 엘리먼트를 받을 수 있습니다.
인자를 넘기지 않으면 `$$getSVG` 함수의 반환값을 사용합니다.
커링 인자로 받은 `<svg></svg>` 엘리먼트는 해당 함수 호출에서만 사용합니다.
기본으로 사용하는 `<svg></svg>` 엘리먼트를 변경하기 위해서는 `$$setSVG` 함수를 사용해야 합니다.

```javascript
const $svg = document.querySelector("svg");

// Both OK
console.log($$createSVGMatrix()());
// SVGMatrix {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0}
console.log($$createSVGMatrix($svg)());
// SVGMatrix {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0}
```

- `$$controlRotateTransform`
- `$$controlTranslateTransform`
- `$$createSVGMatrix`
- `$$createSVGPoint`
- `$$createSVGRect`
- `$$createSVGTransform`
- `$$createSVGTransformMatrix`
- `$$createSVGTransformRotate`
- `$$createSVGTransformScale`
- `$$createSVGTransformTranslate`
- `$$els`
- `$$el`
- `$$getBoxPoints`
- `$$getCenterPoint`
- `$$initRotateTransform`
- `$$initTranslateTransform`
- `$$mergeRotateTransform`
- `$$mergeTranslateTransform`
