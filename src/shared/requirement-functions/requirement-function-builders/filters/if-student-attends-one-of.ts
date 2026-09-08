import { ReqFnFilter } from "../../../../shared/types";

export const ifStudentAttendsOneOf = (...programIDs: string[]): ReqFnFilter => {
  return (student, program) => {
    return programIDs.concat([program.id]).some( programID=> {
      if (student.currESProgramID === null || typeof programID !== "string") {
        return false;
      }
      // this required program ids to be hardcoded into constants.ts, which was a pain when program id formatting changed
      // now it just tests school ids, which is way easier
      //return programID === student.currESProgramID.value
      return programID.substring && (programID.substring(0, 6) == student.currESProgramID.value.substring(0, 6));
    });
  }
};
