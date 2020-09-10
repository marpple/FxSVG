# API

[EN](./API.md) | [KR](./API_KR.md)

[SVG 주입](FUNCTION_INTERFACE_KR.md)

---

## \$\$appendRotateTransform

- [source](../src/appendRotateTransform/appendRotateTransform.index.js)
- [detail](../src/appendRotateTransform/README.md)

`SVGTransform.SVG_TRANSFORM_ROTATE` 타입의 `SVGTransform` 의 `angle` 값에 입력받은 `angle`을 더합니다.

## \$\$appendTranslateTransform

- [source](../src/appendTranslateTransform/appendTranslateTransform.index.js)
- [detail](../src/appendTranslateTransform/README.md)

`SVGTransform.SVG_TRANSFORM_TRANSLATE` 타입의 `SVGTransform` 의 `tx`, `ty` 에 입력받은 `tx`, `ty`를 더합니다.

## \$\$consolidateTransformList

- [source](../src/consolidateTransformList/consolidateTransformList.index.js)
- [detail](../src/consolidateTransformList/README.md)

`SVGTransformList` 객체의 모든 `SVGTransform` 객체를 하나로 통합합니다.

## \$\$convertClientToUserCoords

- [source](../src/convertClientToUserCoords/convertClientToUserCoords.index.js)
- [detail](../src/convertClientToUserCoords/README.md)

CSSOM 의 client coordinate system 좌표를 SVG 의 user coordinate system 좌표로 변환합니다.

## \$\$createSVGMatrix

- [source](../src/createSVGMatrix/createSVGMatrix.index.js)
- [detail](../src/createSVGMatrix/README.md)

`SVGMatrix` 객체를 생성합니다.

## \$\$createSVGPoint

- [source](../src/createSVGPoint/createSVGPoint.index.js)
- [detail](../src/createSVGPoint/README.md)

`SVGPoint` 객체를 생성합니다.

## \$\$createSVGRect

- [source](../src/createSVGRect/createSVGRect.index.js)
- [detail](../src/createSVGRect/README.md)

`SVGRect` 객체를 생성합니다.

## \$\$createSVGTransform

- [source](../src/createSVGTransform/createSVGTransform.index.js)
- [detail](../src/createSVGTransform/README.md)

`SVGTransform` 객체를 생성합니다.

## \$\$createSVGTransformMatrix

- [source](../src/createSVGTransformMatrix/createSVGTransformMatrix.index.js)
- [detail](../src/createSVGTransformMatrix/README.md)

`type`이 `SVGTransform.SVG_TRANSFORM_MATRIX`인 `SVGTransform` 객체를 생성합니다.

## \$\$createSVGTransformRotate

- [source](../src/createSVGTransformRotate/createSVGTransformRotate.index.js)
- [detail](../src/createSVGTransformRotate/README.md)

`type`이 `SVGTransform.SVG_TRANSFORM_ROTATE`인 `SVGTransform` 객체를 생성합니다.

## \$\$createSVGTransformScale

- [source](../src/createSVGTransformScale/createSVGTransformScale.index.js)
- [detail](../src/createSVGTransformScale/README.md)

`type`이 `SVGTransform.SVG_TRANSFORM_SCALE`인 `SVGTransform` 객체를 생성합니다.

## \$\$createSVGTransformTranslate

- [source](../src/createSVGTransformTranslate/createSVGTransformTranslate.index.js)
- [detail](../src/createSVGTransformTranslate/README.md)

`type`이 `SVGTransform.SVG_TRANSFORM_TRANSLATE`인 `SVGTransform` 객체를 생성합니다.

## \$\$el

- [source](../src/el/el.index.js)
- [detail](../src/el/README.md)

`SVGElement` 를 생성합니다.

## \$\$els

- [source](../src/els/els.index.js)
- [detail](../src/els/README.md)

`SVGElement` 를 담은 배열을 생성합니다.

## \$\$getAnimTransformList

- [source](../src/getAnimTransformList/getAnimTransformList.index.js)
- [detail](../src/getAnimTransformList/README.md)

입력받은 svg 객체의 `transform.animVal` 값을 반환합니다.

# \$\$getAttrNS

- [source](../src/getAttrNS/getAttrNS.index.js)
- [detail](../src/getAttrNS/README.md)

SVG 엘리먼트의 속성에 해당하는 값을 반환합니다. 해당하는 속성이 없으면 `null`을 반환합니다.

## \$\$getBaseTransformList

- [source](../src/getBaseTransformList/getBaseTransformList.index.js)
- [detail](../src/getBaseTransformList/README.md)

입력받은 svg 객체의 `transform.baseVal` 값을 반환합니다.

## \$\$getBoundingPoints

- [source](../src/getBoundingPoints/getBoundingPoints.index.js)
- [detail](../src/getBoundingPoints/README.md)

입력한 point 목록에서 x, y 의 개별 최솟값, 최댓값으로 이루어진 min, max point 를 반환합니다.
x, y 는 독립적으로 비교됩니다. 따라서 반환된 point 는 입력한 point 목록에 없을 수 있습니다.

## \$\$getBoxPoints

- [source](../src/getBoxPoints/getBoxPoints.index.js)
- [detail](../src/getBoxPoints/README.md)

svg 객체의 영역에 해당하는 `SVGPoint`들을 반환합니다.

## \$\$getCenterPoint

- [source](../src/getCenterPoint/getCenterPoint.index.js)
- [detail](../src/getCenterPoint/README.md)

svg 객체의 중심에 해당하는 `SVGPoint`를 반환합니다.

## \$\$getConsolidatedTransformMatrix

- [source](../src/getConsolidatedTransformMatrix/getConsolidatedTransformMatrix.index.js)
- [detail](../src/getConsolidatedTransformMatrix/README.md)

입력받은 `SVGTransformList` 의 모든 `SVGTransform` 의 변환 행렬을 곱한 행렬을 반환합니다.
`SVGTransformList.consolidate` 와 비슷한 동작을 수행하지만 `SVGTransformList` 를 변형하지 않습니다.

## \$\$getSVG

- [source](../src/getSetSVG/getSetSVG.index.js)
- [detail](../src/getSetSVG/README.md)

`<svg></svg>` 엘리먼트를 반환합니다.

## \$\$setSVG

- [source](../src/getSetSVG/getSetSVG.index.js)
- [detail](../src/getSetSVG/README.md)

내부적으로 사용하는 `<svg></svg>` 엘리먼트를 설정합니다.

## \$\$hasAttrNS

- [source](../src/hasAttrNS/hasAttrNS.index.js)
- [detail](../src/hasAttrNS/README.md)

SVG 엘리먼트가 속성을 가지고 있는지 여부를 판단합니다.

## \$\$initMatrixTransform

- [source](../src/initMatrixTransform/initMatrixTransform.index.js)
- [detail](../src/initMatrixTransform/README.md)

svg 엘리먼트에 `SVGTransform.SVG_TRANSFORM_MATRIX` 타입의 `SVGTransform` 을 추가합니다.

## \$\$initRotateTransform

- [source](../src/initRotateTransform/initRotateTransform.index.js)
- [detail](../src/initRotateTransform/README.md)

svg 엘리먼트에 총 3개의 `SVGTransform`을 순서대로 추가합니다.

1. `SVGTransform.SVG_TRANSFORM_TRANSLATE` 타입의 `SVGTransform` (`index`: `0`)
2. `SVGTransform.SVG_TRANSFORM_ROTATE` 타입의 `SVGTransform` (`index`: `1`)
3. `SVGTransform.SVG_TRANSFORM_TRANSLATE` 타입의 `SVGTransform` (`index`: `2`)

2번 `SVGTransform` 객체를 반환합니다.
1번, 3번 `SVGTranform` 객체는 회전 중심을 설정합니다.

## \$\$initScaleTransform

- [source](../src/initScaleTransform/initScaleTransform.index.js)
- [detail](../src/initScaleTransform/README.md)

svg 엘리먼트에 총 3개의 `SVGTransform`을 순서대로 추가합니다.

1. `SVGTransform.SVG_TRANSFORM_TRANSLATE` 타입의 `SVGTransform` (`index`: `0`)
2. `SVGTransform.SVG_TRANSFORM_SCALE` 타입의 `SVGTransform` (`index`: `1`)
3. `SVGTransform.SVG_TRANSFORM_TRANSLATE` 타입의 `SVGTransform` (`index`: `2`)

2번 `SVGTransform` 객체를 반환합니다.
1번, 3번 `SVGTranform` 객체는 scale 중심을 설정합니다.

## \$\$initTranslateTransform

- [source](../src/initTranslateTransform/initTranslateTransform.index.js)
- [detail](../src/initTranslateTransform/README.md)

svg 엘리먼트에 `SVGTransform.SVG_TRANSFORM_TRANSLATE` 타입의 `SVGTransform` 을 추가합니다.

## \$\$isIdentityMatrix

- [source](../src/isIdentityMatrix/isIdentityMatrix.index.js)
- [detail](../src/isIdentityMatrix/README.md)

입력한 matrix 가 단위행렬인지 여부를 판단합니다.
단위행렬의 각 요소와 `Number.EPSILON` 이내로 차이나는 경우 올바른 값으로 판정합니다.

## \$\$isMatrixSVGTransform

- [source](../src/isMatrixSVGTransform/isMatrixSVGTransform.index.js)
- [detail](../src/isMatrixSVGTransform/README.md)

해당 `SVGTransform`의 `type`이 `SVGTransform.SVG_TRANSFORM_MATRIX`인지 여부를 판단합니다.

## \$\$isRotateSVGTransform

- [source](../src/isRotateSVGTransform/isRotateSVGTransform.index.js)
- [detail](../src/isRotateSVGTransform/README.md)

해당 `SVGTransform`의 `type`이 `SVGTransform.SVG_TRANSFORM_ROTATE`인지 여부를 판단합니다.

## \$\$isScaleSVGTransform

- [source](../src/isScaleSVGTransform/isScaleSVGTransform.index.js)
- [detail](../src/isScaleSVGTransform/README.md)

해당 `SVGTransform`의 `type`이 `SVGTransform.SVG_TRANSFORM_SCALE`인지 여부를 판단합니다.

## \$\$isSVGTransform

- [source](../src/isSVGTransform/isSVGTransform.index.js)
- [detail](../src/isSVGTransform/README.md)

해당 객체가 `SVGTransform` 인지 여부를 판단합니다.

## \$\$isTranslateSVGTransform

- [source](../src/isTranslateSVGTransform/isTranslateSVGTransform.index.js)
- [detail](../src/isTranslateSVGTransform/README.md)

해당 `SVGTransform`의 `type`이 `SVGTransform.SVG_TRANSFORM_TRANSLATE`인지 여부를 판단합니다.

## \$\$isValidFxScaleSVGTransformList

- [source](../src/isValidFxScaleSVGTransformList/isValidFxScaleSVGTransformList.index.js)
- [detail](../src/isValidFxScaleSVGTransformList/README.md)

`$$initScaleTransform` 함수를 적용한 `SVGTransformList`인지 여부를 판단합니다.

## \$\$LiveRotateTransform

- [source](../src/LiveRotateTransform/LiveRotateTransform.index.js)
- [detail](../src/LiveRotateTransform/README.md)

SVG Rotate Transform 을 다루기 위한 `$$LiveTransform` 인터페이스의 구현체입니다.

## \$\$LiveScaleTransform

- [source](../src/LiveScaleTransform/LiveScaleTransform.index.js)
- [detail](../src/LiveScaleTransform/README.md)

SVG Scale Transform 을 다루기 위한 `$$LiveTransform` 인터페이스의 구현체입니다.

## \$\$LiveScaleTransform2

- [source](../src/LiveScaleTransform2/LiveScaleTransform2.index.js)
- [detail](../src/LiveScaleTransform2/README.md)

SVG Scale Transform 을 다루기 위한 `$$LiveTransform` 인터페이스의 구현체입니다.
`$$mergeScaleTransform2` 를 사용하는 버전입니다.

## \$\$LiveTransform

- [source](../src/LiveTransform/LiveTransform.index.js)
- [detail](../src/LiveTransform/README.md)

`FxSVG` 에서 SVG Transform 을 쉽게 다루기 위한 인터페이스입니다.

## \$\$LiveTransformHandler

- [source](../src/LiveTransformHandler/LiveTransformHandler.index.js)
- [detail](../src/LiveTransformHandler/README.md)

`$$LiveTransform` 타입의 객체를 함수형 스타일로 쉽게 다루기 위한 보조 클래스입니다.

## \$\$LiveTranslateTransform

- [source](../src/LiveTranslateTransform/LiveTranslateTransform.index.js)
- [detail](../src/LiveTranslateTransform/README.md)

SVG Translate Transform 을 다루기 위한 `$$LiveTransform` 인터페이스의 구현체입니다.

## \$\$mergeRotateTransform

- [source](../src/mergeRotateTransform/mergeRotateTransform.index.js)
- [detail](../src/mergeRotateTransform/README.md)

`$$initRotateTransform` 으로 적용된 3개의 `SVGTransform` 객체를 하나의 `SVGTransform` 으로 병합합니다.

## \$\$mergeScaleTransform

- [source](../src/mergeScaleTransform/mergeScaleTransform.index.js)
- [detail](../src/mergeScaleTransform/README.md)

`$$initScaleTransform` 으로 적용된 3개의 `SVGTransform` 객체를 하나의 `SVGTransform` 으로 병합합니다.

## \$\$mergeScaleTransform2

- [source](../src/mergeScaleTransform2/mergeScaleTransform2.index.js)
- [detail](../src/mergeScaleTransform2/README.md)

`$$initScaleTransform` 으로 적용된 3개의 `SVGTransform` 객체를 해당 svg 엘리먼트의 `x`, `y`, `width`, `height` 속성
(혹은 그에 준하는 속성) 에 반영합니다.

## \$\$mergeTranslateTransform

- [source](../src/mergeTranslateTransform/mergeTranslateTransform.index.js)
- [detail](../src/mergeTranslateTransform/README.md)

svg 엘리먼트에 가장 마지막으로 적용된 `SVGTransform` 이 `SVGTransform.SVG_TRANSFORM_TRANSLATE` 타입인 경우
해당 `SVGTransform` 을 svg 엘리먼트의 `x`, `y` 속성 (혹은 그에 준하는 속성) 에 반영합니다.
svg 엘리먼트에 다른 `SVGTransform` 이 있는 경우 각 `SVGTransform` 을 업데이트합니다.

## \$\$isValidPathData

- [source](../src/parsePathData/parsePathData.index.js)
- [detail](../src/parsePathData/parsePathData.spec.js)

유효한 path data 문자열인지 여부를 판단합니다.

## \$\$splitPathDataByCommandL

- [source](../src/parsePathData/parsePathData.index.js)
- [detail](../src/parsePathData/parsePathData.spec.js)

path data 문자열을 command 단위로 잘라냅니다.
제너레이터는 command 와 해당 command 의 parameters 를 yield 합니다.
command 와 parameters 는 문자열입니다.

## \$\$removeAttrNS

- [source](../src/removeAttrNS/removeAttrNS.index.js)
- [detail](../src/removeAttrNS/README.md)

SVG 엘리먼트의 속성을 제거합니다. 필요한 경우 namespace 를 지정하여 사용할 수 있습니다.

## \$\$setAttrNS

- [source](../src/setAttrNS/setAttrNS.index.js)
- [detail](../src/setAttrNS/README.md)

SVG 엘리먼트에 속성과 값을 추가합니다. 필요한 경우 namespace 를 지정하여 사용할 수 있습니다.

## \$\$updateMatrixTransform

- [source](../src/updateMatrixTransform/updateMatrixTransform.index.js)
- [detail](../src/updateMatrixTransform/README.md)

`SVGTransform.SVG_TRANSFORM_TRANSLATE` 타입의 `SVGTransform` 의 `tx`, `ty` 값을 수정합니다.

## \$\$updateRotateTransform

- [source](../src/updateRotateTransform/updateRotateTransform.index.js)
- [detail](../src/updateRotateTransform/README.md)

`SVGTransform.SVG_TRANSFORM_ROTATE` 타입의 `SVGTransform` 의 `angle` 값을 수정합니다.

## \$\$updateScaleTransform

- [source](../src/updateScaleTransform/updateScaleTransform.index.js)
- [detail](../src/updateScaleTransform/README.md)

`SVGTransform.SVG_TRANSFORM_TRANSLATE` 타입의 `SVGTransform` 의 `tx`, `ty` 값을 수정합니다.

## \$\$updateTranslateTransform

- [source](../src/updateTranslateTransform/updateTranslateTransform.index.js)
- [detail](../src/updateTranslateTransform/README.md)

`SVGTransform.SVG_TRANSFORM_TRANSLATE` 타입의 `SVGTransform` 의 `tx`, `ty` 값을 수정합니다.
