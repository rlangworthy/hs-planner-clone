import { 
  RequirementFunction,
  ReqFnFilter 
} from "../../../shared/types";

import { SuccessChance } from "../../../shared/enums/success-chance";

export const accept = (filter: ReqFnFilter): RequirementFunction => {
  return (student, program) => {
    if (filter(student, program)) {
      return SuccessChance.CERTAIN;
    } else {
      return SuccessChance.NONE;
    }
  }
}

