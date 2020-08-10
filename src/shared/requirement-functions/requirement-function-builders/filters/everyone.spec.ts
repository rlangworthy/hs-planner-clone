import { expect } from "chai";

import { 
  StudentData,
  Program
} from "../../../../shared/types";

import { everyone } from "../../../../shared/requirement-functions/requirement-function-builders/filters";

const s = {} as StudentData;
const p = {} as Program;

describe("everyone filter function", () => {
  it("should always return true, no matter the input", () => {
    expect(everyone(s,p)).to.equal(true);
  });
});

