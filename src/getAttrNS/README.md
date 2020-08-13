# \$\$getAttrNS

- [source](./getAttrNS.index.js)
- [test](./getAttrNS.spec.js)

SVG 엘리먼트의 속성에 해당하는 값을 반환합니다. 해당하는 속성이 없으면 `null`을 반환합니다.
필요한 경우 namespace 를 지정하여 사용할 수 있습니다.

```javascript
const el = $$el(`<circle cx="10" cy="10" r="20" data-foo="bar"></circle>`)();

console.log($$hasAttrNS("data-foo")(el));
// "bar"

console.log($$hasAttrNS("data-baz")(el));
// null
```
