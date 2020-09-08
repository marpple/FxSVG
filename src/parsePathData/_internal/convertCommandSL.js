import { equals2, isNil, not, toIter } from "fxjs2";

/**
 * @param {string} command
 * @param {Array<Parameter>} parameters
 * @returns {Array<number>}
 */
const getFirstControlPoint = (command, parameters) => {
  if (equals2(command.toLowerCase(), "m")) {
  }
};

/**
 * @param {Iterator<{command: string, parameters: Array<Parameter>}, undefined, *>} path_seg_iter
 * @returns {Generator<{command: string, parameters: Array<Parameter>}, undefined, *>}
 */
export function* convertCommandSL(path_seg_iter) {
  path_seg_iter = toIter(path_seg_iter);

  let path_seg1;
  let done1;
  let { value: path_seg2, done: done2 } = path_seg_iter.next();

  if (done2) {
    return undefined;
  }
  yield path_seg2;

  while (true) {
    path_seg1 = path_seg2;
    done1 = done2;
    ({ value: path_seg2, done: done2 } = path_seg_iter.next());

    if (done2) {
      return undefined;
    }

    if (not(equals2(path_seg2.command.toLowerCase(), "s"))) {
      yield path_seg2;
    }
  }
}
