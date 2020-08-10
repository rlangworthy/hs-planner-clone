import { ReqFnFilter } from "../../../../shared/types";

export const ifAttends: ReqFnFilter = (student, program) => {
  if (student.currESProgramID === null) {
    return false;
  }
  // FIXME confirm that this is correct
  return student.currESProgramID.value === program.id;
};
