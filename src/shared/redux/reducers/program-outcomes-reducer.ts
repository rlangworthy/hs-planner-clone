import * as Redux from "redux";

import { ProgramOutcomeDictionary } from "../../../shared/types";
import { ActionType } from "../../../shared/enums";

import { initialProgramOutcomes } from "./initial-state";

export const programOutcomesReducer: Redux.Reducer<ProgramOutcomeDictionary> = (outcomeDict = initialProgramOutcomes, action): ProgramOutcomeDictionary => {
  switch(action.type) {
    case ActionType.UpdateProgramOutcomes:
      return action.payload;
    default:
      return outcomeDict;
  }
};
