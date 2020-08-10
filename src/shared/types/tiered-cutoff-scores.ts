import { CutoffScores } from "./";

export interface TieredCutoffScores {
  rank: CutoffScores
  tier1: CutoffScores
  tier2: CutoffScores
  tier3: CutoffScores
  tier4: CutoffScores
};
