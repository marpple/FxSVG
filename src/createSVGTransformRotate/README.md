# \$\$createSVGTransformRotate

- [source](./createSVGTransformRotate.index.js)
- [test](./createSVGTransformRotate.spec.js)

`type`이 `SVGTransform.SVG_TRANSFORM_ROTATE`인 `SVGTransform` 객체를 생성합니다.
`cx`, `cy`로 회전할 중심의 좌포를 설정하고 `angle`로 회전할 각도(`deg` 단위)를 설정합니다.
`cx`, `cy`를 설정하지 않으면 `(0, 0)`으로 설정합니다.

```javascript
console.log($$createSVGTransformRotate()());
// SVGTransform {type: 4, matrix: SVGMatrix, angle: 0}
```

```javascript
console.log($$createSVGTransformRotate({ angle: 45 })());
// SVGTransform {type: 4, matrix: SVGMatrix, angle: 45}
```

```javascript
console.log($$createSVGTransformRotate({ cx: 10, cy: 10, angle: 30 })());
// SVGTransform {type: 4, matrix: SVGMatrix, angle: 30}
```

```javascript
const $svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
console.log($$createSVGTransformRotate({ cx: 20, cy: 20, angle: 60 })($svg));
// SVGTransform {type: 4, matrix: SVGMatrix, angle: 60}
```
