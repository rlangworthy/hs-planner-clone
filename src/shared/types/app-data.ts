import {
  CutoffScores,
  ProgramDictionary,
  ProgramGroupDictionary,
  ProgramOutcome,
  SchoolDictionary,
  TieredCutoffScores
} from "../../shared/types";

export interface AppData {
    hsPrograms: ProgramDictionary,
    nonHSPrograms: ProgramDictionary,
    hsSchools: SchoolDictionary
    hsProgramGroups: ProgramGroupDictionary

    seCutoffScores: {[programID: string]: TieredCutoffScores}
    nonSECutoffScores: {[programID: string]: CutoffScores}
    schoolAttendanceBoundaryTable: {[schoolID: string]: Array<[number, number]>}
    tractTierTable: {[tract: string]: string}
};
