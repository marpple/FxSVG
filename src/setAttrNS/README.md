# \$\$setAttrNS

- [source](./setAttrNS.index.js)
- [test](./setAttrNS.spec.js)

SVG 엘리먼트에 속성과 값을 추가합니다. 필요한 경우 namespace 를 지정하여 사용할 수 있습니다.

```javascript
const el = $$el(`<circle cx="10" cy="10" r="20"></circle>`)();

$$setAttrNS(["data-foo", "bar"])(el);
console.log(el);
// <circle cx="10" cy="10" r="20" data-foo="bar"></circle>
```
