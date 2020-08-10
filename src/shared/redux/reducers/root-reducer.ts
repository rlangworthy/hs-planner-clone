import * as Redux from "redux";

import { 
  AppState,
  ProgramOutcomeDictionary
} from "../../../shared/types";

import { 
  createProgramOutcomeDictionary,
  programOutcomesAreDifferent
} from "../utils";

import { initialState } from "./initial-state";

import { studentDataReducer } from "./student-data-reducer";
import { loadingStatusReducer } from "./loading-status-reducer";
import { dataReducer } from "./data-reducer";
import { programModalStateReducer } from "./program-modal-state-reducer";

//export const rootReducer: Redux.Reducer<AppState> = Redux.combineReducers({
//  studentData: studentDataReducer,
//  programOutcomes: programOutcomesReducer,
//  loadingStatus: loadingStatusReducer,
//  data: dataReducer
//});

export const rootReducer: Redux.Reducer<AppState> = (state = initialState, action): AppState => {

  const nextStudentData = studentDataReducer(state.studentData, action);
  const nextLoadingStatus = loadingStatusReducer(state.loadingStatus, action);
  const nextData = dataReducer(state.data, action);

  /* 
   * If student data or data has changed, calculate new program outcomes with new
   * student data.
   *
   * If new program outcomes are the same as the old program outcomes, keep the old
   * program outcomes.
   * */
  const studentDataChanged = nextStudentData !== state.studentData;
  const dataChanged = nextData !== state.data;
  let nextProgramOutcomes: ProgramOutcomeDictionary;
  if (studentDataChanged || dataChanged) {
    const newOutcomes = createProgramOutcomeDictionary(nextStudentData, nextData.hsPrograms);
    if (programOutcomesAreDifferent(newOutcomes, state.programOutcomes)) {
      nextProgramOutcomes = newOutcomes;
    } else {
      nextProgramOutcomes = state.programOutcomes;
    }
  } else {
    nextProgramOutcomes = state.programOutcomes;
  }

  const nextProgramModalState = programModalStateReducer(state.programModalState, action)

  return {
    studentData: nextStudentData,
    loadingStatus: nextLoadingStatus,
    data: nextData,
    programOutcomes: nextProgramOutcomes,
    programModalState: nextProgramModalState
  };
};

