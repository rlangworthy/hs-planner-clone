import {
  ActionType,
  Gender,
  ScoreType
}  from "../../../shared/enums";

import { 
  LetterGrade,
  Program,
  ProgramOutcome,
} from "../../../shared/types";

import * as debounce from "lodash.debounce";

import { getTierAndGeo } from "../utils/get-tier-and-geo";
export { loadAllData } from "./data-loading";
export * from "./update-program-outcomes";

const API_REQUEST_DEBOUNCE_DELAY = 1500; //ms

export const updateStudentAttendPercentage = (newValue: number) => {
  return {
    type: ActionType.UpdateStudentAttendPercentage,
    payload: newValue
  }
};

export const updateStudentELLStatus = (newValue: boolean) => {
  return {
    type: ActionType.UpdateStudentELLStatus,
    payload: newValue
  }
};

export const updateStudentGender = (newValue: Gender) => {
  return {
    type: ActionType.UpdateStudentGender,
    payload: newValue
  }
};

export const updateStudentGradeLevel = (newValue: number) => {
  return {
    type: ActionType.UpdateStudentGradeLevel,
    payload: newValue
  }
};

export const updateStudentPrevGradeLevel = (newValue: number) => {
  return {
    type: ActionType.UpdateStudentPrevGradeLevel,
    payload: newValue
  }
};

export const updateStudentIEPStatus = (newValue: boolean) => {
  return {
    type: ActionType.UpdateStudentIEPStatus,
    payload: newValue
  }
};

export const updateStudentCurrESProgram = (newValue: string) => {
  return {
    type: ActionType.UpdateStudentCurrESProgram,
    payload: newValue 
  }
};

export const updateStudentSiblingHSSchools = (newValues: string[]) => {
  return {
    type: ActionType.UpdateStudentSiblingHSSchools,
    payload: newValues
  }
};

export const updateStudentSkip7OrRepeated8 = (newValue: boolean) => {
  return {
    type: ActionType.UpdateStudentSkip7OrRepeated8,
    payload: newValue
  }
};

export const updateStudentNWEAPercentileMath = (newValue: number) => {
  return {
    type: ActionType.UpdateStudentNWEAPercentileMath,
    payload: newValue
  };
};

export const updateStudentNWEAPercentileRead = (newValue: number) => {
  return {
    type: ActionType.UpdateStudentNWEAPercentileRead,
    payload: newValue
  };
};

export const updateStudentSubjGradeMath = (newValue: LetterGrade) => {
  return {
    type: ActionType.UpdateStudentSubjGradeMath,
    payload: newValue
  };
};

export const updateStudentSubjGradeRead = (newValue: LetterGrade) => {
  return {
    type: ActionType.UpdateStudentSubjGradeRead,
    payload: newValue
  };
};

export const updateStudentSubjGradeSci = (newValue: LetterGrade) => {
  return {
    type: ActionType.UpdateStudentSubjGradeSci,
    payload: newValue
  };
};

export const updateStudentSubjGradeSocStudies = (newValue: LetterGrade) => {
  return {
    type: ActionType.UpdateStudentSubjGradeSocStudies,
    payload: newValue
  };
};

export const updateStudentSETestPercentile = (newValue: number) => {
  return {
    type: ActionType.UpdateStudentSETestPercentile,
    payload: newValue
  }
};

export const updateStudentScore = (scoreType: ScoreType, newValue: number) => {
  let actionType;
  switch(scoreType) {
    case ScoreType.nweaPercentileMath:
      actionType = ActionType.UpdateStudentNWEAPercentileMath;
      break;
    case ScoreType.nweaPercentileRead:
      actionType = ActionType.UpdateStudentNWEAPercentileRead;
      break;
    case ScoreType.subjGradeMath:
      actionType = ActionType.UpdateStudentSubjGradeMath;
      break;
    case ScoreType.subjGradeRead:
      actionType = ActionType.UpdateStudentSubjGradeRead;
      break;
    case ScoreType.subjGradeSci:
      actionType = ActionType.UpdateStudentSubjGradeSci;
      break;
    case ScoreType.subjGradeSocStudies:
      actionType = ActionType.UpdateStudentSubjGradeSocStudies;
      break;
    case ScoreType.seTestPercentile:
      actionType = ActionType.UpdateStudentSETestPercentile;
      break;
    default:
      throw new Error(`Unrecognized ScoreType: ${scoreType}`);
  }
  return {
    type: actionType,
    payload: newValue
  };
}

export const openProgramModal = (program: Program, outcome: ProgramOutcome | undefined) => {
  return {
    type: ActionType.OpenProgramModal,
    program: program,
    outcome: outcome === undefined ? null : outcome
  }
};

export const closeProgramModal = () => {
  return {
    type: ActionType.CloseProgramModal
  }
}

export const updateStudentTier = (tier: string) => {
  return {
    type: ActionType.UpdateStudentTier,
    payload: tier
  }
};

export const updateStudentGeo = (geo: {latitude: number, longitude: number}) => {
  return {
    type: ActionType.UpdateStudentGeo,
    payload: geo
  }
}


const __requestTierAndGeoInnerFn = debounce(
  (dispatch, address) => {
    getTierAndGeo(address).then(
      (res) => {
        dispatch(tierLoaded());
        dispatch(updateStudentTier(res.tier));
        dispatch(updateStudentGeo(res.geo));
      }
    );
  }
, API_REQUEST_DEBOUNCE_DELAY);

const requestTierAndGeo = (address: string) => {
  return dispatch => __requestTierAndGeoInnerFn(dispatch, address);
}

export const updateStudentAddress = (address: string) => {
  return (dispatch) => {
    // update address
    dispatch({
      type: ActionType.UpdateStudentAddress,
      payload: address
    });
    // FIXME add deobouncing, error handling
    dispatch(loadingTier());
    dispatch(requestTierAndGeo(address));
  }
}

export const loadingTier = () => {
  return {
    type: ActionType.LoadingTier
  }
}

export const tierLoaded = () => {
  return {
    type: ActionType.TierLoaded
  }
}

