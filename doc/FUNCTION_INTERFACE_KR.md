# Function Interface

[EN](FUNCTION_INTERFACE.md) | [KR](FUNCTION_INTERFACE_KR.md)

FxSVG 의 함수는 함수형 스타일 인터페이스를 가지고 있습니다.
함수 실행에 필요한 보조 인자를 먼저 받고, 함수 실행의 대상이 되는 객체를 나중에 받습니다.
보조 인자가 필요한 모든 함수는 강제로 커링하여 사용해야 합니다.

내부적으로 svg 엘리먼트가 필요한 경우 두 번째 실행의 마지막 인자로 svg 엘리먼트를 주입할 수 있습니다.

```javascript
const $svg = document.querySelector("svg");
const input = { a: 10, b: 11, c: 12, d: 13, e: 14, f: 15 };

console.log($$createSVGMatrix()());
// SVGMatrix {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0}
console.log($$createSVGMatrix()($svg));
// SVGMatrix {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0}
console.log($$createSVGMatrix(input)($svg));
// SVGMatrix {a: 10, b: 11, c: 12, d: 13, e: 14, f: 15}
```

```javascript
const $svg = document.querySelector("svg");
const transform = $svg.createSVGTransform();
transform.setTranslate(10, 20);
const [tx, ty] = [100, 200];

console.log($$updateTranslateTransform({ tx, ty })(transform));
// SVGTransform {type: 2, matrix: SVGMatrix, angle: 0}
//   matrix: SVGMatrix {a: 1, b: 0, c: 0, d: 1, e: 100, f: 200}
```
