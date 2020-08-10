import {
  ProgramDictionary,
  SchoolDictionary
} from "../../../shared/types";

/*
 * Creates a dictionary mapping school IDs to school names.
 * 
 * The relationship between schools and programs is that one school
 * has many programs. This function reads the list of all programs and
 * extracts the unique school names and ids from them.
 * */
export const createHSSchoolDict = (hsProgramDict: ProgramDictionary): SchoolDictionary => {
  let hsSchoolDict: SchoolDictionary = {};
  Object.keys(hsProgramDict).forEach( programID => {
    const program = hsProgramDict[programID];
    // Many programs share the same schoolID and schoolName properties.
    // Only add the schoolID/schoolName to hsSchoolDict if we have not
    // already encountered this schoolID as we iterate through programs.
    if (hsSchoolDict[program.schoolID] === undefined) {
      hsSchoolDict[program.schoolID] = {
        id: program.schoolID,
        longName: program.schoolNameLong,
        shortName: program.schoolNameShort
      }
    }
  });
  return hsSchoolDict;
};
