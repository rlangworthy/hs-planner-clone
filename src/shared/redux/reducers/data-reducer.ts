import * as Redux from "redux";

import { AppData } from "../../../shared/types";
import { ActionType } from "../../../shared/enums";

import { initialData } from "./initial-state";

export const dataReducer: Redux.Reducer<AppData> = (appData = initialData, action): AppData => {

  switch(action.type) {

    case ActionType.UpdateHSPrograms:
      return Object.assign({}, appData, {hsPrograms: action.payload});
    case ActionType.UpdateNonHSPrograms:
      return Object.assign({}, appData, {nonHSPrograms: action.payload});
    case ActionType.UpdateHSSchools:
      return Object.assign({}, appData, {hsSchools: action.payload});
    case ActionType.UpdateHSProgramGroups:
      return Object.assign({}, appData, {hsProgramGroups: action.payload});

    case ActionType.UpdateSECutoffScores:
      return Object.assign({}, appData, {seCutoffScores: action.payload});
    case ActionType.UpdateNonSECutoffScores:
      return Object.assign({}, appData, {nonSECutoffScores: action.payload});
    case ActionType.UpdateSchoolAttendanceBoundaryTable:
      return Object.assign({}, appData, {schoolAttendanceBoundaryTable: action.payload});
    case ActionType.UpdateTractTierTable:
      return Object.assign({}, appData, {tractTierTable: action.payload});

    default:
        return appData;
  }

};
