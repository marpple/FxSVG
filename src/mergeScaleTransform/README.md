# \$\$mergeScaleTransform

- [source](./mergeScaleTransform.index.js)
- [test](./mergeScaleTransform.spec.js)

`$$initScaleTransform` 으로 적용된 3개의 `SVGTransform` 객체를 하나의 `SVGTransform` 으로 병합합니다.
병합된 `SVGTransform` 은 `SVGTransform.SVG_TRANSFORM_MATRIX` 타입입니다.
따라서 한 번 병합한 `SVGTransform`을 `$$updateScaleTransform` 이나 `$$appendScaleTransform` 으로 변경할 수 없습니다.
