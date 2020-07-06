# \$\$controlRotateTransform

- [source](./controlRotateTransform.index.js)
- [test](./controlRotateTransform.spec.js)

`$$initRotateTransform`, `$$updateRotateTransform`, `$$appendRotateTransform`, `$$mergeRotateTransform` 함수들을
쉽게 사용할 수 있는 `controller` 를 생성합니다.

`update`, `append`, `end` 메소드를 체이닝하여 안전하게 조작할 수 있습니다.

```javascript
const str = `<rect x="10" y="20" width="100" height="200" transform="scale(2, 4)"></rect>`;
const $el = $$el(str)();
const controller = $$controlTranslateTransform({
  cx: 10,
  cy: 20,
})($el);
controller.update({ angle: 30 }).append({ angle: 45 }).end();

console.log($el);
// <rect x="10" y="20" width="100" height="200" transform="matrix(0.517638 1.93185 -3.8637 1.03528 26.7303 5.16436)"></rect>
```
