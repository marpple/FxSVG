# FxSVG

Functional SVG Handling Library

## API

### els

svg 문자열을 받아 svg 객체를 담은 배열을 생성합니다.

```javascript
console.log(els('<rect x="0" y="0" width="10" height="10"></rect>'));
// [rect]
console.log(
  els(
    '<rect x="0" y="0" width="10" height="10"></rect><circle cx="1" cy="1" r="5"></circle>'
  )
);
// [rect, circle]
```

### el

svg 문자열을 받아 svg 객체를 생성합니다.

```javascript
console.log(els('<rect x="0" y="0" width="10" height="10"></rect>'));
// rect
console.log(
  els(
    '<rect x="0" y="0" width="10" height="10"></rect><circle cx="1" cy="1" r="5"></circle>'
  )
);
// rect
```
