import { ReqFnFilter } from "../../../../shared/types";

export const ifSkipped7OrRepeated8: ReqFnFilter = (student, program) => {
  if (student.skippedGrade7OrRepeatedGrade8) {
    return true;
  } else {
    return false;
  }
};
