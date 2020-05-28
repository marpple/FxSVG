export const makeRandomNumber = (min = 0, max = 1000) =>
  min + Math.random() * (max - min);
