import { 
  LatLong,
  ReqFnFilter
} from "../../../../shared/types";

import distanceBetweenCoords from "../../../../shared/util/distance-between-coords";

import { CPS_PROXIMITY_LOTTERY_RADIUS_MI } from "../../constants";

export const ifInProximity: ReqFnFilter = (student, program) => {
  // return false immediately if student properties are uninitialized
  if (student.geo === null) {
    return false;
  }

  const studentCoords = student.geo as LatLong;
  const schoolCoords = program.schoolLocation;
  const distance = distanceBetweenCoords(studentCoords, schoolCoords);
  return distance <= CPS_PROXIMITY_LOTTERY_RADIUS_MI;
};

