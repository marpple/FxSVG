# \$\$qsa

- [source](./qsa.index.js)
- [test](./qsa.spec.js)

부모 엘리먼트에서 셀렉터에 해당하는 자손 엘리먼트 목록을 찾아 반환합니다. `querySelectorAll` 과 동일한 함수입니다.

```javascript
const el = $$el(`
  <g>
    <circle cx="10" cy="10" r="20"></circle>
    <rect x="20" y="20" width="200" height="120"></rect>
  </g>
`)();
const list = $$qsa("*", el);

console.log(list);
// NodeList(2) [circle, rect]
```
