import {expect} from "chai";

import {
  StudentData,
  Program
} from "../../../../shared/types";

import { ifSiblingAttends } from "../../../../shared/requirement-functions/requirement-function-builders/filters/if-sibling-attends";

describe("ifSiblingAttends requirement function filter", () => {

  let s: StudentData;
  let p: Program;
  beforeEach( () => {
    s = {} as StudentData;
    p = {} as Program;
  });
  
  it("should return true when sibling attends the same school building as the program", () => {
    const TARGET_SCHOOL_ID = "00000";
    p.schoolID = TARGET_SCHOOL_ID;
    s.siblingHSSchoolIDs = ["", "0010101", "0012981923", "12938102938102938123", TARGET_SCHOOL_ID];

    expect(ifSiblingAttends(s, p)).to.eq(true);
  });

  it("should return false when student does not have a sibling that attends the same school building as the program", () => {
    const TARGET_SCHOOL_ID = "00000";
    p.schoolID = TARGET_SCHOOL_ID;
    s.siblingHSSchoolIDs = ["", "0010101", "0012981923", "12938102938102938123", "00"];

    expect(ifSiblingAttends(s, p)).to.eq(false);
  });

  it("should return false if the student's sibling highschool property is uninitialized", () => {
    const TARGET_SCHOOL_ID = "00000";
    p.schoolID = TARGET_SCHOOL_ID;
    s.siblingHSSchoolIDs = null;

    expect(ifSiblingAttends(s, p)).to.eq(false);

    s.siblingHSSchoolIDs = null;
    expect(ifSiblingAttends(s, p)).to.eq(false);

    s.siblingHSSchoolIDs = [];
    expect(ifSiblingAttends(s, p)).to.eq(false);
  });

});
