import { mapToCommandIndex } from "./mapToCommandIndex.js";

/**
 * Generator yields command and parameters combination of string.
 *
 * @param {string} d_str
 * @returns {Generator<{command: string, parameters: string}, undefined, *>}
 */
export function* splitByPathSeg(d_str) {
  const command_index_iter = mapToCommandIndex(d_str);

  let index1;
  let done1;
  let { value: index2, done: done2 } = command_index_iter.next();
  while (true) {
    index1 = index2;
    done1 = done2;
    ({ value: index2, done: done2 } = command_index_iter.next());

    if (done1) {
      return undefined;
    }

    if (done2) {
      const command = d_str[index1];
      const parameters = d_str.slice(index1 + 1).trim();
      yield { command, parameters };
      return undefined;
    }

    const command = d_str[index1];
    const parameters = d_str.slice(index1 + 1, index2).trim();
    yield { command, parameters };
  }
}
