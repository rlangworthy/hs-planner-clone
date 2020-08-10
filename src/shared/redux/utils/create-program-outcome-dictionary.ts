import {
  ProgramDictionary,
  ProgramOutcome,
  ProgramOutcomeDictionary,
  StudentData,
} from "../../../shared/types";

import { SuccessChance } from "../../../shared/enums";

import { getOverallSuccessChance } from "../../../shared/util/get-overall-success-chance";

export const createProgramOutcomeDictionary = (studentData: StudentData, programDict: ProgramDictionary): ProgramOutcomeDictionary => {
  let outcomeDict: ProgramOutcomeDictionary = {};
  Object.keys(programDict).forEach( programID => {
    const program = programDict[programID];

    // if the program's application or selection requirement functions are not defined,
    // set the application and selection chances to SuccessChance.NOTIMPLEMENTED.
    // --
    let applicationChance: SuccessChance;
    if (program.applicationReqFn === undefined) {
      //console.warn(`Missing application requirement function for program ${program.programName}`);
      applicationChance = SuccessChance.NOTIMPLEMENTED;
    } else {
      applicationChance = program.applicationReqFn(studentData, program);
    }

    let selectionChance: SuccessChance;
    if (program.selectionReqFn === undefined) {
      //console.warn(`Missing selection requirement function for program ${program.programName}`);
      selectionChance = SuccessChance.NOTIMPLEMENTED;
    } else {
      selectionChance = program.selectionReqFn(studentData, program);
    }
    // --

    const outcome: ProgramOutcome = {
      programID: programID,
      applicationChance: applicationChance,
      selectionChance: selectionChance,
      overallChance: getOverallSuccessChance({application: applicationChance, selection: selectionChance})
    }
    outcomeDict[programID] = outcome;
  });
  return outcomeDict;
};

export const createInitialProgramOutcomeDictionary = (programDict: ProgramDictionary) => {
  let initialOutcomes = {};
  Object.keys(programDict).forEach( programID => {
    const outcome: ProgramOutcome = {
      programID: programID,
      applicationChance: SuccessChance.NOTIMPLEMENTED,
      selectionChance: SuccessChance.NOTIMPLEMENTED,
      overallChance: SuccessChance.NOTIMPLEMENTED
    }
    initialOutcomes[programID] = outcome;
  });
  return initialOutcomes;
};
