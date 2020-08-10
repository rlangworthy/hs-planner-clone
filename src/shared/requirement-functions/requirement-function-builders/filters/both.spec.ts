import { expect } from "chai";

import {
  Program,
  ReqFnFilter,
  StudentData,
} from "../../../../shared/types";

import {
  both
} from "./";

const succeed: ReqFnFilter = (student, program) => true;
const fail: ReqFnFilter = (student, program) => false;

const s = {} as StudentData;
const p = {} as Program;

describe("combine filters function", () => {
  it("should create a filter that only returns true if all filters return true", () => {
    const combined = both(succeed, succeed, succeed);
    expect(combined(s,p)).to.equal(true);
  });

  it("should create a filter that returns false if any filter fails", () => {
    const combined = both(succeed, fail, succeed);
    expect(combined(s,p)).to.equal(false);
  });

});
