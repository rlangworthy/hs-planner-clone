import { expect } from "chai";

import {
  StudentData,
  Program
} from "../../../../shared/types";

import { ifStudentAttendsOneOf } from "./";

describe("ifStudentAttendsOneOf requirement function filter", () => {

  let s: StudentData;
  let p: Program;
  beforeEach( () => {
    s = {currESProgramID: {value: ''}} as StudentData;
    p = {} as Program;
  });

  const PROGRAM_A = "a";
  const PROGRAM_B = "b";
  const PROGRAM_C = "c";

  it("should return a function that returns true if the student's current elementary school program is one of the programs passed", () => {
    s.currESProgramID = {value: PROGRAM_A};
    expect(ifStudentAttendsOneOf(PROGRAM_A, PROGRAM_B, PROGRAM_C)(s, p)).to.eq(true);
  });

  it("should return a function that returns false if the student's current elementary school program is not one of the programs passed", () => {
    s.currESProgramID = {value: PROGRAM_A};
    expect(ifStudentAttendsOneOf(PROGRAM_B, PROGRAM_C)(s, p)).to.eq(false);
  });

  it("should return a function that returns false if the student's current elementary school program is undefined or null", () => {
    s.currESProgramID = null;
    expect(ifStudentAttendsOneOf(PROGRAM_A, PROGRAM_B, PROGRAM_C)(s, p)).to.eq(false);
  });

  it("should throw an error if passed no parameters", () => {
    s.currESProgramID = {value: PROGRAM_A};
    expect(() => ifStudentAttendsOneOf()(s, p)).to.throw();
  });

});


