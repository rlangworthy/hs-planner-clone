import { expect } from "chai";

import { 
  Program,
  ReqFnFilter,
  RequirementFunction,
  StudentData
} from "../../../shared/types";
import { SuccessChance } from "../../../shared/enums";

import { conditional } from "../../../shared/requirement-functions/requirement-function-builders/conditional";

describe( "conditional", () => {

  let s: StudentData = {} as StudentData;
  let p: Program = {} as Program;

  it("should create a requirement function that returns the outcome of the requirement function of the first condition that matches.",  () => {

    // Equivalent to:
    // if false, return SuccessChance.CERTAIN
    // else if true, return SuccessChance.LIKELY
    // else if true, return SuccessChance.UNCERTAIN
    const reqFn = conditional(
      {
        filter: (s,p) => false,
        fn: (s,p) => SuccessChance.CERTAIN
      },
      {
        filter: (s,p) => true,
        fn: (s,p) => SuccessChance.LIKELY
      },
      {
        filter: (s,p) => true,
        fn: (s,p) => SuccessChance.UNCERTAIN
      }
    );

    // we expect outcome to be SuccessChance.LIKELY.
    expect(reqFn(s,p)).to.equal(SuccessChance.LIKELY);
    expect(reqFn(s,p)).not.to.eq(SuccessChance.CERTAIN);

  });

  it("should return SuccessChance.NONE if no conditions match", () => {
    // Equivalent to:
    // if false, return SuccessChance.CERTAIN
    // else if false, return SuccessChance.LIKELY
    // else if false, return SuccessChance.UNCERTAIN
    const reqFn = conditional(
      {
        filter: (s,p) => false,
        fn: (s,p) => SuccessChance.CERTAIN
      },
      {
        filter: (s,p) => false,
        fn: (s,p) => SuccessChance.LIKELY
      },
      {
        filter: (s,p) => false,
        fn: (s,p) => SuccessChance.UNCERTAIN
      }
    );

    // we expect outcome to be SuccessChance.NONE.
    expect(reqFn(s,p)).to.equal(SuccessChance.NONE);
    expect(reqFn(s,p)).not.to.eq(SuccessChance.UNCERTAIN);
  });

});
