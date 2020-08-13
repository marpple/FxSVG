# \$\$qs

- [source](./qs.index.js)
- [test](./qs.spec.js)

부모 엘리먼트에서 가장 먼저 셀렉터에 해당하는 자손 엘리먼트를 찾아 반환합니다. `querySelector` 와 동일한 함수입니다.

```javascript
const el = $$el(`
  <g>
    <circle cx="10" cy="10" r="20"></circle>
    <rect x="20" y="20" width="200" height="120"></rect>
  </g>
`)();
const child = $$qs("*", el);

console.log(child);
// <circle cx="10" cy="10" r="20"></circle>
```
