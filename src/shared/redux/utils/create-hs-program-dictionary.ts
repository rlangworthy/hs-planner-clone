import {
  Program,
  ProgramDictionary,
  RawProgram,
  RequirementFunctionDictionary
} from "../../../shared/types";


export const createHSProgramDictionary = (rawProgramData: RawProgram[], requirementFunctions: RequirementFunctionDictionary): ProgramDictionary => {
  let programDictionary: ProgramDictionary = {};

  let missing: any = {};
  let unused: any = [];

  rawProgramData.forEach( p => {

    const applicationReqFn = requirementFunctions[p.applicationReqFnID];
    const selectionReqFn = requirementFunctions[p.selectionReqFnID];

    if (applicationReqFn === undefined) {
      if (missing[p.applicationReqFnID] === undefined) {
        missing[p.applicationReqFnID] = {
          id: p.applicationReqFnID,
          programs: [p.programName],
          desc: p.applicationReqDescription,
          fn: ''
        };
      } else {
        missing[p.applicationReqFnID].programs.push(p.programName);
      }
    }
    if (selectionReqFn === undefined) {
      if (missing[p.selectionReqFnID] === undefined) {
        missing[p.selectionReqFnID] = {
          id: p.selectionReqFnID,
          programs: [p.programName],
          desc: p.selectionReqDescription,
          fn: ''
        };
      } else {
        missing[p.selectionReqFnID].programs.push(p.programName);
      }
    }

    // create a Program object from p by removing requirement
    // function ids and replacing them with the actual requirement functions
    const program: Program = Object.assign({}, p, {
      applicationReqFnID: undefined,
      selectionReqFnID: undefined,
      applicationReqFn: applicationReqFn,
      selectionReqFn: selectionReqFn
    });

    // make an entry in programDictionary for each program
    programDictionary[program.id] = program;
  });

  if (process.env.NODE_ENV === 'development') {
    // find orphaned requirement functions, which are requirement functions
    // that exist in the requirement function dictionary but are not needed by
    // any of the programs in rawProgramData.
    const reqFnIDs = Object.keys(requirementFunctions);
    reqFnIDs.forEach( id => {
      const isOrphaned = !rawProgramData.some(program => program.applicationReqFnID === id || program.selectionReqFnID === id);
      if (isOrphaned) {
        unused.push(id);
      }
    });
    
    if (unused.length > 0) {
      console.warn(`There are ${unused.length} unused requirement functions.\n\nYou can safely remove them from the list of requirement functions in src/shared/requirement-functions/requirement-functions.ts. The IDs of the unused requirement functions are printed below:`);
      console.log("Orphaned:");
      console.log(JSON.stringify(unused, null, 2));
    }
    const numMissingReqFns = Object.keys(missing).length;
    if (numMissingReqFns > 0) {
      console.error(`There are ${numMissingReqFns} MISSING requirement functions.\n\nYou must write new implementations for these requirement functions in src/shared/requirement-functions/requirement-functions.ts. A template for the missing requirement functions is printed below.`);
      console.log("Missing:");
      console.log(JSON.stringify(missing, null, 2));
    }
  }
  
  return programDictionary;
};
