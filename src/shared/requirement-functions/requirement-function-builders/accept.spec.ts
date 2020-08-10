import { expect } from "chai";

import { SuccessChance } from "../../../shared/enums";
import { 
  Program,
  ReqFnFilter,
  StudentData,
} from "../../../shared/types";

import { accept } from "./accept";

describe( "accept", () => {

  const student: StudentData = {} as StudentData;
  const program: Program = {} as Program;
  const always: ReqFnFilter = (student, program) => true;
  const never: ReqFnFilter = (student, program) => false;
  
  it("should return a function that returns SuccessChance.CERTAIN when passed a student and program that meet the requirement passed to it", () => {
    const alwaysAccept = accept(always);
    expect(alwaysAccept(student, program)).to.eq(SuccessChance.CERTAIN);
  });

  it("should return a function that returns SuccessChance.NONE when passed a student and program that meet the requirement passed to it", () => {
    const neverAccept = accept(never);
    expect(neverAccept(student, program)).to.eq(SuccessChance.NONE);
  });

});

