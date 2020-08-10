import { 
  AppState,
  ProgramDictionary,
  RequirementFunctionDictionary,
  SchoolDictionary
} from "../../../shared/types";

import { ActionType } from "../../../shared/enums";

import {
  HS_PROGRAMS_URL,
  NON_HS_PROGRAMS_URL,
  SE_CUTOFF_SCORES_URL,
  NON_SE_CUTOFF_SCORES_URL,
  SCHOOL_ATTENDANCE_BOUNDARY_TABLE_URL,
  TRACT_TIER_TABLE_URL
} from "../../../shared/constants";

import { 
  createHSProgramDictionary,
  createNonHSProgramDictionary,
  createProgramGroupDictionary
} from "../utils"

import { updateProgramOutcomes } from "./update-program-outcomes";

import { requirementFunctions } from "../../../shared/requirement-functions";
import { Action } from "redux";

const fetchJSONFrom = (url: string): Promise<any> => {
  return fetch(url).then( 
    res => {
      if (res.ok) {
        return res.json();
      } else {
        console.error(`Request for ${url} failed with ${res.statusText}`);
      }
    },
    err => {
      console.error(err);
      return null;
    }
  );
};

export const updateHSPrograms = (data) => {
  return {
    type: ActionType.UpdateHSPrograms,
    payload: data
  }
}

export const loadHSPrograms = (requirementFunctions: RequirementFunctionDictionary) => {
  return (dispatch) => {
    return fetchJSONFrom(HS_PROGRAMS_URL).then( json => {
      const programDict: ProgramDictionary = createHSProgramDictionary(json, requirementFunctions);
      dispatch( updateHSPrograms(programDict) );
    });
  }
};

export const updateNonHSPrograms = (data) => {
  return {
    type: ActionType.UpdateNonHSPrograms,
    payload: data
  }
};
export const loadNonHSPrograms = () => {
  return (dispatch) => {
    return fetchJSONFrom(NON_HS_PROGRAMS_URL).then( json => {
      const programDict: ProgramDictionary = createNonHSProgramDictionary(json);
      dispatch( updateNonHSPrograms(programDict) );
    });
  }
};

export const updateSECutoffScores = (data) => {
  return {
    type: ActionType.UpdateSECutoffScores,
    payload: data
  }
};
export const loadSECutoffScores = () => {
  return (dispatch) => {
    return fetchJSONFrom(SE_CUTOFF_SCORES_URL).then( json => {
      dispatch( updateSECutoffScores(json) );
    });
  }
};

export const updateNonSECutoffScores = (data) => {
  return {
    type: ActionType.UpdateNonSECutoffScores,
    payload: data
  }
};
export const loadNonSECutoffScores = () => {
  return (dispatch) => {
    return fetchJSONFrom(NON_SE_CUTOFF_SCORES_URL).then( json => {
      dispatch( updateNonSECutoffScores(json) );
    });
  }
};

export const updateSchoolAttendanceBoundaryTable = (data) => {
  return {
    type: ActionType.UpdateSchoolAttendanceBoundaryTable,
    payload: data
  }
};
export const loadSchoolAttendanceBoundaryTable = () => {
  return (dispatch) => {
    return fetchJSONFrom(SCHOOL_ATTENDANCE_BOUNDARY_TABLE_URL).then( json => {
      dispatch( updateSchoolAttendanceBoundaryTable(json) );
    });
  }
};

export const updateTractTierTable = (data) => {
  return {
    type: ActionType.UpdateTractTierTable,
    payload: data
  }
};
export const loadTractTierTable = () => {
  return (dispatch) => {
    return fetchJSONFrom(TRACT_TIER_TABLE_URL).then( json => {
      dispatch( updateTractTierTable(json) );
    });
  }
};

export const loadingData = () => {
  return {
    type: ActionType.LoadingData
  }
};
export const dataLoaded = () => {
  return {
    type: ActionType.DataLoaded
  }
};

export const updateProgramGroups = (hsPrograms: ProgramDictionary) => {
  return {
    type: ActionType.UpdateHSProgramGroups,
    payload: createProgramGroupDictionary(hsPrograms)
  }
};

const createHSSchools = (hsPrograms: ProgramDictionary): SchoolDictionary => {
  let schoolDict: SchoolDictionary = {};
  Object.keys(hsPrograms).map( programID => {
    const program = hsPrograms[programID];
    const school = {id: program.schoolID, shortName: program.schoolNameShort, longName: program.schoolNameLong};
    schoolDict[program.schoolID] = school;
  });
  return schoolDict;
};

export const updateHSSchools = (hsPrograms: ProgramDictionary) => {
  return {
    type: ActionType.UpdateHSSchools,
    payload: createHSSchools(hsPrograms)
  }
};

/**
 * loadAllData is a convenience method for loading or re-loading all app data at once.
 *
 * loadAllData dispatches actions for loading every piece 
 * of app data, and waits for the actions to complete.
 *
 * If the data loading actions all complete successfully, it then 
 * dispatches more actions to update derived data. These are:
 *  1) an action informing the store that all data is loaded,
 *  2) an action to update hsSchoolDictionary based on the new data,
 *  3) an action to update program groups based on the new data
 *  4) an action to update program outcomes based on the new data.
 *
 * If any of the data loading actions fail to complete, 
 * ...
 * TODO figure out how we should do error handling.
 * */
export const loadAllData = (): any /* NOTE can't get the types to work */ => { 
  // dispatch all data loading actions, wrapped
  // by Promise.all().
  // TODO error handling?
  return (dispatch: any, getState: () => AppState) => {
    dispatch( loadingData() );
    return Promise.all([
      dispatch( loadHSPrograms(requirementFunctions) ),
      dispatch( loadNonHSPrograms() ),
      dispatch( loadSECutoffScores() ),
      dispatch( loadNonSECutoffScores() ),
      dispatch( loadSchoolAttendanceBoundaryTable() ),
      dispatch( loadTractTierTable() ),
    ]).then( results => {
      dispatch( dataLoaded() );
      const state: AppState = getState();
      // create hs school dictionary
      dispatch(
        updateHSSchools(state.data.hsPrograms)
      );
      // create program groups
      dispatch( 
        updateProgramGroups(state.data.hsPrograms)
      );
      // create program outcomes
      dispatch(
        updateProgramOutcomes(state.studentData, state.data.hsPrograms)
      );
    });
  }
};
