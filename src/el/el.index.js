import { $$els } from "../els/els.index.js";
import { $$getSVG } from "../getSetSVG/getSetSVG.index.js";

export const $$el = ($svg = $$getSVG()) => (svg) => $$els($svg)(svg)[0];
