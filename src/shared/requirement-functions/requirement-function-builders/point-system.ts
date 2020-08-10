import {
  CutoffScores,
  Program,
  RequirementFunction,
  StudentData,
} from "../../../shared/types";

import { SuccessChance } from "../../../shared/enums";
import { POINT_SYSTEM_UNCERTAINTY_THRESHOLD } from "../constants";

type PointCalculator = (student: StudentData, program: Program) => number | null;
type PointCutoffLookup = (student: StudentData, program: Program) => CutoffScores;

type PointSystemFn = (calc: PointCalculator, lookup: PointCutoffLookup) => RequirementFunction;

export const pointSystem: PointSystemFn = (calc, lookup) => {
  return (student, program) => {

    const points = calc(student, program);
    // point calculator may return null if called with uninitialized
    // student data; in that case, return NOTIMPLEMENTED as a default
    if (points === null) {
      return SuccessChance.NOTIMPLEMENTED;
    }
    let cutoff;
    try {
      cutoff = lookup(student, program);
    } catch(e) {
      // if cutoff not found, return NOTIMPLEMENTED
      console.error(e);
      return SuccessChance.NOTIMPLEMENTED;
    }
    const pointsFromCutoff = points - cutoff.min;

    // handle failure by returning NOTIMPLEMENTED
    // rather than give inaccurate prediction
    if (isNaN(points) || isNaN(cutoff.min)) {
      return SuccessChance.NOTIMPLEMENTED;
    }

    if (pointsFromCutoff < 0) {
      return SuccessChance.NONE;
    } else if (pointsFromCutoff <= POINT_SYSTEM_UNCERTAINTY_THRESHOLD) {
      return SuccessChance.LIKELY;
    } else {
      return SuccessChance.CERTAIN;
    }
  }
};

