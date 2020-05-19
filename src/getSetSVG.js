let $svg;

export const setSVG = ($new_svg) => {
  $svg = $new_svg;
  return $svg;
};

export const getSVG = () => {
  if (!$svg) {
    setSVG(document.createElementNS("http://www.w3.org/2000/svg", "svg"));
  }
  return $svg;
};
