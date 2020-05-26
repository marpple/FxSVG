export const makeRandomNumber = (size = 1000) => {
  const n = Math.random() * size;
  return Math.round(Math.random()) ? n : -n;
};
