# Contributing

## Test Code

테스트 코드를 작성할 때 `mocha` 테스트 러너의 실행 함수는 모두 `function() {}` 으로 작성해주세요.
`mocha`의 `context`에 접근하기 위해서는 `this` 키워드를 사용해야 합니다.
화살표 함수를 사용하면 `this` 키워드를 사용할 수 없어요!
