import { Program, ProgramOutcome } from "../../shared/types";

export interface ProgramModalState {
  open: boolean
  program: Program | null
  outcome: ProgramOutcome | null
}

