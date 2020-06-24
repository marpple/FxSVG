import { head } from "fxjs2";
import { $$els, $$els2, $$els3 } from "../els/els.index.js";
import { $$getSVG } from "../getSetSVG/getSetSVG.index.js";

export const $$el = ($svg = $$getSVG()) => (svg) => head($$els($svg)(svg));

export const $$el2 = (svg) => ($svg = $$getSVG()) => head($$els2(svg)($svg));

export const $$el3 = (svg, $svg = $$getSVG()) => head($$els3(svg, $svg));
