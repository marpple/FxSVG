const makeCombinations = (l1, l2, result) => {
  result.push(l1);
  for (let i = 0; i < l2.length; i++) {
    const x = l2[i];
    makeCombinations([...l1, x], l2.slice(i + 1), result);
  }
};

export const makeAllCombinations = (list) => {
  const result = [];
  makeCombinations([], list, result);
  return result.slice(1);
};
