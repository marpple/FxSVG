# \$\$createSVGTransformRotate

- [source](./createSVGTransformRotate.index.js)

`type`이 `SVGTransform.SVG_TRANSFORM_ROTATE`인 `SVGTransform` 객체를 생성합니다.
`cx`, `cy`로 회전할 중심의 좌포를 설정하고 `angle`로 회전할 각도(`deg` 단위)를 설정합니다.
`cx`, `cy`를 설정하지 않으면 `(0, 0)`으로 설정합니다.

[`<svg></svg>` 커링](../../svg_currying.md)이 적용된 함수입니다.

```javascript
console.log($$createSVGTransformRotate()());
// SVGTransform {type: 4, matrix: SVGMatrix, angle: 0}
```

```javascript
console.log($$createSVGTransformRotate()({ angle: 45 }));
// SVGTransform {type: 4, matrix: SVGMatrix, angle: 45}
```

```javascript
console.log($$createSVGTransformRotate()({ cx: 10, cy: 10, angle: 30 }));
// SVGTransform {type: 4, matrix: SVGMatrix, angle: 30}
```