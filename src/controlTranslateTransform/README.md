# \$\$controlTranslateTransform

- [source](./controlTranslateTransform.index.js)

`$$initTranslateTransform`, `$$updateTranslateTransform`, `$$appendTranslateTransform`, `$$mergeTranslateTransform` 함수들을
쉽게 사용할 수 있는 `controller` 를 생성합니다.

`update`, `append`, `end` 메소드를 체이닝하여 안전하게 조작할 수 있습니다.

`x_name`, `y_name` 설정을 인자로 전달하지 않는 경우 `end` 메소드에서 `$$mergeTranslateTransform` 를 실행하지 않습니다.

[`<svg></svg>` 커링](../../svg_currying.md)이 적용된 함수입니다.

```javascript
const $el = $$el()(
  `<circle cx="10" cy="20" r="100" transform="scale(2, 4)"></circle>`
);
const { controller } = $$controlTranslateTransform()($el, {
  x_name: "cx",
  y_name: "cy",
});
controller.update({ tx: 30, ty: 60 }).append({ tx: 70, ty: 40 }).end();

console.log($el);
// <circle cx="110" cy="120" r="100" transform="matrix(2 0 0 4 -100 -300)"></circle>
```
