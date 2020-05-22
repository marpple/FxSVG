# \$\$getSVG

- [source](./getSetSVG.index.js)
- [test](./getSetSVG.spec.js)

내부적으로 사용하는 `<svg></svg>` 엘리먼트를 반환합니다.
`$$setSVG` 함수로 설정하지 않은 경우 `document.createElementNS` 를 실행합니다.
해당 함수를 실행하지 못하는 환경인 경우 `$$setSVG` 함수로 사용할 `<svg></svg>` 엘리먼트를 설정해주세요.

```javascript
console.log($$getSVG());
// <svg></svg>
```

# \$\$setSVG

- [source](./getSetSVG.index.js)
- [test](./getSetSVG.spec.js)

내부적으로 사용하는 `<svg></svg>` 엘리먼트를 설정합니다.

```javascript
console.log(
  $$setSVG(document.createElementNS("http://www.w3.org/2000/svg", "svg"))
);
// <svg></svg>
```
