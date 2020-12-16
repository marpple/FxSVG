import { head } from "fxjs/es";
import { $$els } from "../els/els.index.js";
import { $$getSVG } from "../getSetSVG/getSetSVG.index.js";

export const $$el = (svg) => ($svg = $$getSVG()) => head($$els(svg)($svg));
