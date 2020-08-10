import {
  ProgramOutcome,
  ProgramOutcomeDictionary
} from "../../../shared/types";

/* 
 * Returns true if there is some programID in a whose value is not the same in a and b.
 * Otherwise, returns false.
 * */
export const programOutcomesAreDifferent = (a: ProgramOutcomeDictionary, b: ProgramOutcomeDictionary): boolean => {
  return  Object.keys(a).some( programID => {
    const outcomeA: ProgramOutcome | undefined = a[programID];
    const outcomeB: ProgramOutcome | undefined = b[programID];
    // If both outcomes are undefined, they are the same.
    // If only one outcome is undefined, they are different.
    // If both outcomes are not undefined, compare each of their
    // properties.
    if (outcomeA === undefined && outcomeB === undefined) {
      return false;
    } else if (outcomeA === undefined || outcomeB === undefined) {
      return true;
    } else {

      const propertiesDifferent = outcomeA.applicationChance !== outcomeB.applicationChance ||
        outcomeA.selectionChance !== outcomeB.selectionChance ||
        outcomeA.overallChance !== outcomeB.overallChance ||
        outcomeA.distance !== outcomeB.distance;

      if (propertiesDifferent) {
        return true;
      } else {
        return false;
      }
    }
  });
};


