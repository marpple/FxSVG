# \$\$els

- [source](./els.index.js)
- [test](./els.spec.js)

SVG 문자열을 받아 `SVGElement` 를 담은 배열을 생성합니다.

```javascript
console.log($$els('<rect x="0" y="0" width="10" height="10"></rect>')());
// [rect]
```

```javascript
const str =
  '<rect x="0" y="0" width="10" height="10"></rect><circle cx="1" cy="1" r="5"></circle>';
console.log($$els(str)());
// [rect, circle]
```
