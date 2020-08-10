import { ProgramOutcome } from "../../shared/types";

export interface ProgramOutcomeDictionary {
  [programID: string]: ProgramOutcome | undefined
};
