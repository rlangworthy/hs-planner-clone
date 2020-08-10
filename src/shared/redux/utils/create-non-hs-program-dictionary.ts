import {
  Program,
  ProgramDictionary
} from "../../../shared/types";
import { SuccessChance } from "../../../shared/enums";

const emptyRequirementFunction = (student, program) => SuccessChance.NOTIMPLEMENTED;

export const createNonHSProgramDictionary = (rawProgramData): ProgramDictionary => {
  let programDictionary: ProgramDictionary = {};
  rawProgramData.forEach( rawProgram => {

    const applicationReqFn = emptyRequirementFunction;
    const selectionReqFn = emptyRequirementFunction;

    // create Program object from rawProgram by adding no-op requirement functions.
    const program: Program = Object.assign({}, rawProgram, {
      applicationReqFnID: undefined,
      selectionReqFnID: undefined,
      applicationReqFn: applicationReqFn,
      selectionReqFn: selectionReqFn
    });

    // make an entry in programDictionary for each program
    programDictionary[program.id] = program;
  });
  
  return programDictionary;
};
