# Contributing

[EN](./CONTRIBUTING.md) | [KR](./CONTRIBUTING_KR.md)

## Test Code

Please use `function() {}` when write test runner function for `mocha`.
We have to use `this` to access `mocha`'s `context`.
If you use arrow function, you cannot use `this`.
