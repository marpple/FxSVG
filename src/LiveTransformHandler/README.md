# \$\$LiveTransformHandler

- [source](./LiveTransformHandler.index.js)
- [test](./LiveTransformHandler.spec.js)

`$$LiveTransform` 타입의 객체를 함수형 스타일로 쉽게 다루기 위한 보조 클래스입니다.

`$$LiveTransform` 객체를 등록한 뒤 `static` 메소드를 사용하여 파이프라인 형태로 함수를 실행할 수 있습니다.
마지막엔 `$$LiveTransform` 객체를 다시 꺼내올 수 있습니다.

## 사용 방법

1. `$$wrap` static 메소드를 통해 `$$LiveTransform` 객체를 등록합니다.
2. `option` 객체와 반환된 `$$LiveTransformWrapper` 객체를 인자로 `$$update`, `$$append`, `$$merge` static 메소드를 사용합니다.
3. 각 메소드는 자기 자신을 반환합니다. 따라서 파이프라인에서 사용하거나 함수 인자로 중첩할 수 있습니다.
4. `$$unwrap` static 메소드를 통해 `$$LiveTransform` 객체를 꺼내옵니다.

## 주의 사항

1. `$$LiveTransform` 객체의 `$$getIsDone` 메소드가 `true` 를 반환하면 핸들러는 더 이상 아무 변경을 가하지 않습니다.
2. `$$merge` 메소드는 `$$LiveTransform` 객체의 `$$done` 메소드를 호출하므로 1번에 의해 이후 다른 메소드는 동작하지 않습니다.
