# \$\$removeAttrNS

- [source](./removeAttrNS.index.js)
- [test](./removeAttrNS.spec.js)

SVG 엘리먼트의 속성을 제거합니다. 필요한 경우 namespace 를 지정하여 사용할 수 있습니다.

```javascript
const el = $$el(`<circle cx="10" cy="10" r="20" data-foo="bar"></circle>`)();

console.log($$removeAttrNS("data-foo")(el));
// undefined
console.log(el);
// <circle cx="10" cy="10" r="20"></circle>
```
