import {requirementFunctions as rawReqFns} from "./requirement-functions";

// FIXME literally does this do anything
function minifyRequirementFunctions(reqFns) {
  // shallow copy the original object
  let reqFnsCopy = Object.assign({}, reqFns);

  // for each entry in req fns table,
  // keep only the requirement function itself, dropping
  // the extra data (description, list of programs, etc.)
  Object.keys(reqFnsCopy).forEach( key => {
    let entry = reqFnsCopy[key];
    reqFnsCopy[key] = entry.fn;
  });

  return reqFnsCopy;
}

export const requirementFunctions= minifyRequirementFunctions(rawReqFns);

