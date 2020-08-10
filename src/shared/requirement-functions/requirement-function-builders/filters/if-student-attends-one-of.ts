import { ReqFnFilter } from "../../../../shared/types";

export const ifStudentAttendsOneOf = (...programIDs): ReqFnFilter => {
  return (student, program) => {
    return programIDs.some( programID => {
      if (student.currESProgramID === null) {
        return false;
      }
      return programID === student.currESProgramID.value 
    });
  }
};
