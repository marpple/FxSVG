# Function Interface

[EN](FUNCTION_INTERFACE.md) | [KR](FUNCTION_INTERFACE_KR.md)

All functions of FxSVG have functional style interface.
It takes sub-arguments first, then takes a target object.
If it needs sub-arguments, you must curry the function.

If you want, you can inject a svg element for the last parameter of the second function call.

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
