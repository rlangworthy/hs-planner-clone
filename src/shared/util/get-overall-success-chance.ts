import { SuccessChance } from "../../shared/enums";

export const getOverallSuccessChance = (opts: {application: SuccessChance, selection: SuccessChance}): SuccessChance => {
  if (opts.application === SuccessChance.LIKELY) {
    return opts.selection;
  } else {
    return opts.application;
  }
};

