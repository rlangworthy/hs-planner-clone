import {
  StudentData,
  ProgramDictionary
} from "../../../shared/types";

import { ActionType } from "../../../shared/enums";
import { createProgramOutcomeDictionary } from "../utils";

export const updateProgramOutcomes = (studentData: StudentData, programDict: ProgramDictionary) => {
  return {
    type: ActionType.UpdateProgramOutcomes,
    payload: createProgramOutcomeDictionary(studentData, programDict)
  };
};
