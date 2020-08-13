# \$\$hasAttrNS

- [source](./hasAttrNS.index.js)
- [test](./hasAttrNS.spec.js)

SVG 엘리먼트가 속성을 가지고 있는지 여부를 판단합니다. 필요한 경우 namespace 를 지정하여 사용할 수 있습니다.

```javascript
const el = $$el(`<circle cx="10" cy="10" r="20" data-foo="bar"></circle>`)();

console.log($$hasAttrNS("data-foo")(el));
// true

console.log($$hasAttrNS("data-baz")(el));
// false
```
