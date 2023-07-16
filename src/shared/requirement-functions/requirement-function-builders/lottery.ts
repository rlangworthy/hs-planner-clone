import {
  StudentData,
  Program,
  RequirementFunction,
  ReqFnFilter,
} from "../../../shared/types";

import {SuccessChance} from "../../../shared/enums/success-chance";

import {
  ifInProximity,
  ifSiblingAttends,
  everyone,
  ifAttends,
} from "./filters";

export enum LotteryStageSize {
  SMALL,
  LARGE
}

export interface LotteryStage {
  filter: ReqFnFilter
  size: LotteryStageSize
}


export const PROXIMITY_LOTTERY_STAGE = {
  // TODO confirm that this is how this works
  filter: ifInProximity,
  size: LotteryStageSize.LARGE
};

export const SIBLING_LOTTERY_STAGE = {
  filter: ifSiblingAttends,
  size: LotteryStageSize.SMALL
};

export const GENERAL_LOTTERY_STAGE = {
  filter: everyone,
  size: LotteryStageSize.LARGE
};

// Staff preference lottery is for students with a parent
// or guardian who works at the school.
// FIXME implement
export const STAFF_PREFERENCE_LOTTERY_STAGE = {
  filter: (s,p) => false,
  size: LotteryStageSize.SMALL
}

// an Attendance Area lottery stage is a stage that accepts students
// who live in the school's attendance boundary.
// FIXME implement
export const ATTENDANCE_AREA_LOTTERY_STAGE = {
  filter: (s,p) => false,
  size: LotteryStageSize.LARGE
}

// Continuing Students lottery stage is a lottery stage that accepts
// students currently enrolled in schools' 8th grade who wish to continue
// through to the schools' 9th grade
export const CONTINUING_STUDENTS_LOTTERY_STAGE = {
  filter: ifAttends,
  size: LotteryStageSize.LARGE
}

// We're treating tiered lottery stage (where even numbers of applicants are
// accepted by tier) like general lottery stages (where applicants are 
// accepted purely randomly). Because we don't have any way of saying
// how likely students are to get in in tiered vs general lotteries,
// this is OK.
export const TIER_LOTTERY_STAGE = {
  filter: everyone,
  size: LotteryStageSize.LARGE
};


export const lottery = (...stages: LotteryStage[]): RequirementFunction => {
  // stage logic:
  // SMALL stage and no previous LARGE stages => LIKELY.
  // SMALL stage and prev LARGE stage => UNLIKELY
  // LARGE stage and no previous LARGE stages => UNCERTAIN;
  // LARGE stage and prev LARGE stage => UNLIKELY
  
  return (student: StudentData, program: Program) => {
    let prevLargeStage = false;
    for (let i=0; i<stages.length; i++) {

      // if student matches this stage, determine
      // how likely the student is to be accepted
      // based on how large the previous lottery stages were.
      const stage = stages[i];
      if (stage.filter(student, program)) {
        if (prevLargeStage) {
          return SuccessChance.UNLIKELY;
        } else {
          if (stage.size === LotteryStageSize.SMALL) {
            return SuccessChance.LIKELY;
          } else if (stage.size === LotteryStageSize.LARGE) {
            return SuccessChance.UNCERTAIN;
          }
        }
      }
      // if student does not match this stage, record if
      // this stage was LARGE.
      if (stage.size === LotteryStageSize.LARGE) {
        prevLargeStage = true;
      }
    }

    // if student does not match any stage of lottery, return NONE
    return SuccessChance.NONE;
  }
};
