# \$\$mergeScaleTransform2

- [source](./mergeScaleTransform2.index.js)
- [test](./mergeScaleTransform2.spec.js)

`$$initScaleTransform` 으로 적용된 3개의 `SVGTransform` 객체를 해당 svg 엘리먼트의 `x`, `y`, `width`, `height` 속성
(혹은 그에 준하는 속성) 에 반영합니다.

`index` 값을 통해 `SVGTransform.SVG_TRANSFORM_SCALE` 타입의 `SVGTransform` 의 위치를 설정할 수 있습니다.
지정하지 않을 경우 `1` 로 초기화됩니다.

`direction` 값을 통해 scale 의 방향을 설정할 수 있습니다.
기본값을 설정하지 않기 때문에 필수 입력사항입니다.

`is_need_correction` 값을 통해 `x`, `y` 값을 `s` 가 음수일 경우 조절할 것인지 여부를 설정할 수 있습니다.
지정하지 않을 경우 `true` 로 초기화됩니다.

```javascript
const $el = $$el()(`
  <rect
    x="10"
    y="20"
    width="100"
    height="200"
    transform="translate(200 400)"
  >
  </rect>
`);

console.log($$getBaseTransformList($el));
// SVGTransformList {0: SVGTransform, length: 1, numberOfItems: 1}
// 0: SVGTransform {type: 2, matrix: SVGMatrix, angle: 0}
//   matrix: SVGMatrix {a: 1, b: 0, c: 0, d: 1, e: 200, f: 400}

$$initScaleTransform()($el, { sx: 2, sy: 3, cx: 60, cy: 120, index: 1 });
// SVGTransformList 의 가장 뒤쪽에 추가
// transform 이 적용되는 순서로는 가장 먼저 적용됨

console.log($$getBaseTransformList($el));
// SVGTransformList {0: SVGTransform, 1: SVGTransform, 2: SVGTransform, 3: SVGTransform, length: 4, numberOfItems: 4}
// 0: SVGTransform {type: 2, matrix: SVGMatrix, angle: 0}
//   matrix: SVGMatrix {a: 1, b: 0, c: 0, d: 1, e: 200, f: 400}
// 1: SVGTransform {type: 2, matrix: SVGMatrix, angle: 0}
//   matrix: SVGMatrix {a: 1, b: 0, c: 0, d: 1, e: 60, f: 120}
// 2: SVGTransform {type: 3, matrix: SVGMatrix, angle: 0}
//   matrix: SVGMatrix {a: 2, b: 0, c: 0, d: 3, e: 0, f: 0}
// 3: SVGTransform {type: 2, matrix: SVGMatrix, angle: 0}
//   matrix: SVGMatrix {a: 1, b: 0, c: 0, d: 1, e: -60, f: -120}

$$mergeScaleTransform2($el, { index: 2, direction: "se" });
// 인덱스 2 에 SVGTransform.SVG_TRANSFORM_SCALE 타입의 SVGTransform 위치

console.log($$getBaseTransformList($el));
// SVGTransformList {0: SVGTransform, length: 1, numberOfItems: 1}
// 0: SVGTransform {type: 2, matrix: SVGMatrix, angle: 0}
//   matrix: SVGMatrix {a: 1, b: 0, c: 0, d: 1, e: 200, f: 400}

console.log($el);
// <rect x="-40" y="-180" width="200" height="600" transform="translate(200 400)"></rect>
```
