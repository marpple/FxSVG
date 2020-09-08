import { equals2 } from "fxjs2";
import { parseCoordinatePairDoubleSeq } from "./parseCoordinatePairDoubleSeq.js";
import { parseCoordinatePairSeq } from "./parseCoordinatePairSeq.js";
import { parseCoordinatePairTripletSeq } from "./parseCoordinatePairTripletSeq.js";
import { parseCoordinateSeq } from "./parseCoordinateSeq.js";
import { parseEllipticalArcArgSeq } from "./parseEllipticalArcArgSeq.js";

/**
 * @typedef {(Coordinate|CoordinatePair|CoordinatePairTriplet|CoordinatePairDouble|EllipticalArcArg)} Parameter
 */

/**
 * @param {string} command
 * @param {string} parameters
 * @returns {{command: string, parameters: Array<Parameter>}}
 */
export const parseParameters = ({ command, parameters }) => {
  if (equals2(command.toLowerCase(), "m")) {
    return { command, parameters: parseCoordinatePairSeq(parameters) };
  }

  if (equals2(command.toLowerCase(), "l")) {
    return { command, parameters: parseCoordinatePairSeq(parameters) };
  }

  if (equals2(command.toLowerCase(), "h")) {
    return { command, parameters: parseCoordinateSeq(parameters) };
  }

  if (equals2(command.toLowerCase(), "v")) {
    return { command, parameters: parseCoordinateSeq(parameters) };
  }

  if (equals2(command.toLowerCase(), "c")) {
    return { command, parameters: parseCoordinatePairTripletSeq(parameters) };
  }

  if (equals2(command.toLowerCase(), "s")) {
    return { command, parameters: parseCoordinatePairDoubleSeq(parameters) };
  }

  if (equals2(command.toLowerCase(), "q")) {
    return { command, parameters: parseCoordinatePairDoubleSeq(parameters) };
  }

  if (equals2(command.toLowerCase(), "t")) {
    return { command, parameters: parseCoordinatePairSeq(parameters) };
  }

  if (equals2(command.toLowerCase(), "a")) {
    return { command, parameters: parseEllipticalArcArgSeq(parameters) };
  }

  // command === "z" or "Z"
  return { command, parameters: [] };
};
