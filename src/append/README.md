# \$\$append

- [source](./append.index.js)
- [test](./append.spec.js)

첫 번째로 받은 엘리먼트를 두 번째로 받은 엘리먼트의 자식 엘리먼트로 추가합니다.
`appendChild` 와 동일한 함수입니다.

```javascript
const parent_el = $$el(`<g></g>`)();
const child_el = $$el(`<circle cx="0" cy="0" r="10"></circle>`)();

$$append(child_el)(parent_el);

console.log(parent_el);
// <g>
//   <circle cx="0" cy="0" r="10"></circle>
// </g>
```
