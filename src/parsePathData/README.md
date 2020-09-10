# \$\$isValidPathData

- [source](./parsePathData.index.js)
- [test](./parsePathData.spec.js)

유효한 path data 문자열인지 여부를 판단합니다.

# \$\$splitPathDataByCommandL

- [source](./parsePathData.index.js)
- [test](./parsePathData.spec.js)

path data 문자열을 command 단위로 잘라냅니다.
제너레이터는 command 와 해당 command 의 parameters 를 yield 합니다.
command 와 parameters 는 문자열입니다.

이 함수는 path data 의 유효성을 검사하지 않습니다!
먼저 `$$isValidPathData` 함수로 검사해주세요!

# \$\$parsePathCommandParameters

- [source](./parsePathData.index.js)
- [test](./parsePathData.spec.js)

parameters 문자열을 숫자 배열로 변환합니다.
제너레이터는 command 와 해당 command 의 변환된 parameters 를 yield 합니다.

이 함수는 parameters 문자열의 유효성을 검사하지 않습니다!

# \$\$parsePathData

- [source](./parsePathData.index.js)
- [test](./parsePathData.spec.js)

`<path></path>` 엘리먼트의 `d` 속성의 값을 해석한 자바스크립트 객체(JSON)를 반환합니다.
