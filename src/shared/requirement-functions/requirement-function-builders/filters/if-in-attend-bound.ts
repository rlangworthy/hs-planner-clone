import { 
  ReqFnFilter,
  AttendanceBoundaryDictionary
} from "../../../../shared/types";

import pointInPolygon from "../../../../shared/util/point-in-polygon";

export const createIfInAttendBound = (getAttendBoundDict: () => AttendanceBoundaryDictionary): ReqFnFilter => (student, program) => {
  // return false immediately if student properties are uninitialized
  if (student.geo === null) {
    return false;
  }

  const point: [number, number] = [student.geo.longitude, student.geo.latitude];
  // get geometry from schoolAttendBoundTable by looking up thru ID
  const polygon = getAttendBoundDict()[program.schoolID];
  if (polygon === undefined) {
    console.warn(`No attend bound found for ${program.programName}`);
    return false;
  }

  return pointInPolygon(point, polygon);
};
