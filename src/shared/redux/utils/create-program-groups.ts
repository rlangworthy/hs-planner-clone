import {
  Program,
  ProgramDictionary,
  ProgramGroupDictionary,
} from "../../../shared/types";

/*
 * Creates a data structure that groups programs together.
 * */
export const createProgramGroupDictionary = (hsPrograms: ProgramDictionary): ProgramGroupDictionary => {
  let programGroups: ProgramGroupDictionary = {};
  Object.keys(hsPrograms).forEach( programID => {
    
    const program: Program = hsPrograms[programID];
    const programType = program.programType;
    //hs id
    const hs = program.schoolID

    // if this program group does not already exist, 
    // create a new program group and add it to the program group dict.
    //2020: base groups off hs not program type
    if (programGroups[hs] === undefined) {

      const newProgramGroup = {
        id: hs,
        name: program.schoolNameLong,
        programIDs: [program.id]
      };
      programGroups[hs] = newProgramGroup;

    // otherwise, add this program's id to the existing group.
    } else {
      programGroups[hs].programIDs.push(program.id);
    }
  });
  return programGroups;
};
