# \$\$appendRotateTransform

- [source](./appendRotateTransform.index.js)

`SVGTransform.SVG_TRANSFORM_ROTATE` 타입의 `SVGTransform` 의 `angle` 값을 수정합니다.
기존 `angle`에 입력받은 `angle`을 더한 값으로 수정합니다.
`cx`, `cy`는 항상 `0`으로 고정됩니다.
회전 중심을 설정해야 할 경우 `SVGTransform.SVG_TRANSFORM_TRANSLATE` 타입의 `SVGTransform` 을 앞, 뒤로 추가하는 방삭을 사용합니다.
수정한 `SVGTransform` 객체를 반환합니다.
이 함수는 인자로 받은 `SVGTransform` 객체를 직접 수정합니다.

```javascript
const t = $$createSVGTransformRotate()({ angle: 45 });
console.log(t);
// SVGTransform {type: 4, matrix: SVGMatrix, angle: 45}
$$appendRotateTransform(t, { angle: 30 });
console.log(t);
// SVGTransform {type: 4, matrix: SVGMatrix, angle: 75}
```
