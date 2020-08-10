import { expect } from "chai";

import { StudentData, Program } from "../../../shared/types";
import { SuccessChance } from "../../../shared/enums";

import { lottery, LotteryStageSize } from "../../../shared/requirement-functions/requirement-function-builders/lottery";

describe( "lottery", () => {

  const s: StudentData = {} as StudentData; 
  const p: Program = {} as Program;

  it("should return a req fn that returns the outcome of the first lottery stage that matches", () => {
    const reqFn = lottery(
      {
        filter: (s,p) => false,
        size: LotteryStageSize.SMALL // => LIKELY
      },
      {
        filter: (s,p) => true,
        size: LotteryStageSize.LARGE // => UNCERTAIN
      },
      {
        filter: (s,p) => true,
        size: LotteryStageSize.LARGE // => UNLIKELY
      }
    );
    expect(reqFn(s,p)).to.eq(SuccessChance.UNCERTAIN);
    expect(reqFn(s,p)).not.to.eq(SuccessChance.NONE);
  });

  it("should return a req fn that follows the rule: a SMALL stage that follows any number of SMALL stages is LIKELY", () => {
    const reqFnFirstSmall = lottery(
      {
        filter: (s,p) => true,
        size: LotteryStageSize.SMALL
      }
    );
    expect(reqFnFirstSmall(s,p)).to.eq(SuccessChance.LIKELY);
    expect(reqFnFirstSmall(s,p)).not.to.eq(SuccessChance.UNLIKELY);

    const reqFnSecondSmall = lottery(
      {
        filter: (s,p) => false,
        size: LotteryStageSize.SMALL // => LIKELY
      },
      {
        filter: (s,p) => true,
        size: LotteryStageSize.SMALL // => LIKELY
      },
    );
    expect(reqFnSecondSmall(s,p)).to.eq(SuccessChance.LIKELY);
    expect(reqFnSecondSmall(s,p)).not.to.eq(SuccessChance.UNLIKELY);
  });

  it("should return a req fn that follow the rule: a SMALL stage that follows any number of LARGE stages is UNLIKELY", () => {
    const reqFn = lottery(
      {
        filter: (s,p) => false,
        size: LotteryStageSize.LARGE // => UNCERTAIN
      },
      {
        filter: (s,p) => true,
        size: LotteryStageSize.SMALL // => UNLIKELY
      },
    );
    expect(reqFn(s,p)).to.eq(SuccessChance.UNLIKELY);
    expect(reqFn(s,p)).not.to.eq(SuccessChance.NONE);
  });

  it("should return a req fn that follow the rule: a LARGE stage that follows any number of SMALL stages is UNCERTAIN", () => {
    const reqFn = lottery(
      {
        filter: (s,p) => false,
        size: LotteryStageSize.SMALL // => LIKELY
      },
      {
        filter: (s,p) => true,
        size: LotteryStageSize.LARGE // => UNCERTAIN
      },
    );
    expect(reqFn(s,p)).to.eq(SuccessChance.UNCERTAIN);
    expect(reqFn(s,p)).not.to.eq(SuccessChance.NONE);
  });

  it("should return a req fn that follow the rule: a LARGE stage that follows any number of LARGE stages is UNLIKELY", () => {
    const reqFn = lottery(
      {
        filter: (s,p) => false,
        size: LotteryStageSize.LARGE // => UNCERTAIN
      },
      {
        filter: (s,p) => true,
        size: LotteryStageSize.LARGE // => UNLIKELY
      },
    );
    expect(reqFn(s,p)).to.eq(SuccessChance.UNLIKELY);
    expect(reqFn(s,p)).not.to.eq(SuccessChance.NONE);
  });

  it("should return SuccessChance.NONE if the participant does not match any lottery stage.", () => { 
    const reqFn = lottery(
      {
        filter: (s,p) => false,
        size: LotteryStageSize.LARGE // => UNCERTAIN
      },
      {
        filter: (s,p) => false,
        size: LotteryStageSize.LARGE // => UNLIKELY
      },
    );
    expect(reqFn(s,p)).to.eq(SuccessChance.NONE);
    expect(reqFn(s,p)).not.to.eq(SuccessChance.CERTAIN);

  });

});
