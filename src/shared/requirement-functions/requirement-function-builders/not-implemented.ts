import { SuccessChance } from "../../../shared/enums";
import { RequirementFunction } from "../../../shared/types";

export const notImplemented: RequirementFunction = (student, program) => {
  return SuccessChance.NOTIMPLEMENTED;
};
