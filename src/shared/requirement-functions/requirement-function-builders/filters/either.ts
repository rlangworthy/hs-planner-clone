import { ReqFnFilter } from "../../../../shared/types";

export const either = (...filters: ReqFnFilter[]): ReqFnFilter => {
  return (student, program) => {
    return filters.some( filter => filter(student, program) );
  }
};
