import {expect} from "chai";

import {
  StudentData,
  ReqFnFilter,
  Program
} from "../../../../shared/types";

import {
  either
} from "./";

const succeed: ReqFnFilter = (student, program) => true;
const fail: ReqFnFilter = (student, program) => false;

const s = {} as StudentData;
const p = {} as Program;

describe("either filter composer", () => {
  it("should create a filter that returns true if all filters return true", () => {
    const combined = either(fail, succeed, succeed);
    expect(combined(s,p)).to.equal(true);
  });

  it("should create a filter that returns true if some filters return false and some filters return true", () => {
    const combined = either(fail, succeed, succeed);
    expect(combined(s,p)).to.equal(true);
  });

  it("should create a filter that returns false if all filters fail", () => {
    const combined = either(fail, fail, fail);
    expect(combined(s,p)).to.equal(false);
  });
});
