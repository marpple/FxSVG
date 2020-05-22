# \$\$el

- [source](./el.index.js)
- [test](./el.spec.js)

SVG 문자열을 받아 `SVGElement` 를 생성합니다.

[`<svg></svg>` 커링](../../svg_currying.md)이 적용된 함수입니다.

```javascript
console.log($$el()('<rect x="0" y="0" width="10" height="10"></rect>'));
// rect
```

```javascript
console.log(
  $$el()(
    '<rect x="0" y="0" width="10" height="10"></rect><circle cx="1" cy="1" r="5"></circle>'
  )
);
// rect
```