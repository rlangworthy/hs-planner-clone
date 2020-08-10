import { LatLong } from "../../shared/types";

import { GEO_APPROX_DEG_MI_CONVERSION_FACTOR } from "../../shared/constants";


// returns distance between geocoordinates, in miles
const distanceBetweenCoords = (a: LatLong, b: LatLong) => {
  const x = a.latitude - b.latitude ;
  const y = (a.longitude - b.longitude) * Math.cos(b.longitude);
  const dstDegrees = Math.sqrt((x * x) + (y * y));
  return GEO_APPROX_DEG_MI_CONVERSION_FACTOR * dstDegrees;
};

export default distanceBetweenCoords;
