import { ReqFnFilter } from "../../../../shared/types";

export const ifSiblingAttends: ReqFnFilter = (student, program) => {
  if (student.siblingHSSchoolIDs === null) {
    return false;
  }
  return student.siblingHSSchoolIDs.some( school => school === program.schoolID );
};
