# \$\$splitPathDataByCommandL

- [source](./parsePathData.index.js)
- [test](./parsePathData.spec.js)

path data 문자열을 command 단위로 잘라냅니다.
제너레이터는 command 와 해당 command 의 parameters 를 yield 합니다.
command 와 parameters 는 문자열입니다.

이 함수는 입력 데이터의 유효성을 검사하지 않습니다!

# \$\$parsePathCommandParameters

- [source](./parsePathData.index.js)
- [test](./parsePathData.spec.js)

parameters 문자열을 숫자 배열로 변환합니다.
제너레이터는 command 와 해당 command 의 변환된 parameters 를 yield 합니다.

# \$\$convertPathCommandParametersRelativeToAbsoluteL

- [source](./parsePathData.index.js)
- [test](./parsePathData.spec.js)

path 의 command-parameters 이터러블을 relative 좌표에서 absolute 좌표로 변환합니다.

이 함수는 입력 데이터의 유효성을 검사하지 않습니다!

# \$\$compressPathCommandL

- [source](./parsePathData.index.js)
- [test](./parsePathData.spec.js)

다른 command 에 의존적인 command 를 변환합니다.

- "H", "V" -> "L"
- "S" -> "C"
- "T" -> "Q"

이 함수는 입력 데이터의 유효성을 검사하지 않습니다!

# \$\$flatPathCommandParametersL

- [source](./parsePathData.index.js)
- [test](./parsePathData.spec.js)

path 의 command-parameter 를 각 parameter 별로 펼칩니다.
"command + parameter 시퀸스" 를 "command + parameter" 의 시퀸스로 평탄화합니다.

이 함수는 입력 데이터의 유효성을 검사하지 않습니다!

# \$\$parsePathData

- [source](./parsePathData.index.js)
- [test](./parsePathData.spec.js)

`<path></path>` 엘리먼트의 `d` 속성의 값을 파싱하여 `{command, parameters}` 객체의 이터레이터를 반환합니다.
위의 splitting, parsing, converting, compressing, flattening 작업을 모두 진행합니다.
