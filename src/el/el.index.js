import { head } from "fxjs2";
import { $$els } from "../els/els.index.js";
import { $$getSVG } from "../getSetSVG/getSetSVG.index.js";

export const $$el = ($svg = $$getSVG()) => (svg) => head($$els(svg)($svg));

export const $$el2 = (svg) => ($svg = $$getSVG()) => head($$els(svg)($svg));

export const $$el3 = (svg, $svg = $$getSVG()) => head($$els(svg)($svg));
