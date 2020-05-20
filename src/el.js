import { $$els } from "./els.js";
import { $$getSVG } from "./getSetSVG.js";

export const $$el = ($svg = $$getSVG()) => (svg) => $$els($svg)(svg)[0];
