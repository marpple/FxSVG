# \$\$LiveTransform

- [source](./LiveTransform.index.js)
- [test](./LiveTransform.spec.js)

`FxSVG` 에서 SVG Transform 을 쉽게 다루기 위한 인터페이스입니다.
해당 클래스를 상속받아 각 메소드를 올바르게 구현하면 `$$LiveTransformHandler` 에서 사용이 가능합니다.

## 메소드 명세

### \$\$getIsDone

해당 `$$LiveTransform` 객체가 live 상태인지 여부를 나타내는 불리언 값을 반환합니다.
`true` 를 반환하면 `$$LiveTransformWrapper` 에서 더 이상 해당 객체를 수정하지 않습니다.

### \$\$done

해당 `$$LiveTransform` 객체를 done 상태로 변환합니다.
이 메소드가 호출된 이후부터는 `$$getIsDone` 메소드가 `true` 를 반환해야 합니다.

### $$update, $$append, \$\$merge

해당 `$$LiveTransform` 객체가 가지고 있는 `SVGTransform` 에 `update`, `append`, `merge` 연산을 적용합니다.
인자로 단일 `option` 객체를 받습니다.
