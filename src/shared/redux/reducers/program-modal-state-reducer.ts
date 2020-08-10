import * as Redux from "redux";

import { ProgramModalState } from "../../../shared/types";
import { ActionType } from "../../../shared/enums";

import { initialProgramModalState } from "./initial-state";

export const programModalStateReducer: Redux.Reducer<ProgramModalState> = (modalState = initialProgramModalState, action) => {
  switch(action.type) {
    case ActionType.OpenProgramModal:
      return {
        open: true,
        program: action.program,
        outcome: action.outcome
      };
    case ActionType.CloseProgramModal:
      return Object.assign({}, modalState, {open: false});
    default:
      return modalState;
  }
}
