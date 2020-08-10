import { expect } from "chai";

import {
  StudentData,
  Program
} from "../../../../shared/types";

import { ifHasGrades } from "../../../../shared/requirement-functions/requirement-function-builders/filters";

describe("ifHasGrades hsReqFilter", () => {

  let s: StudentData;
  let p: Program;

  beforeEach( () => {
    s = {
      ell: false,
      iep: false,
      gender: 0,
      gradeLevel: 8,
      prevGradeLevel: 7,
      skippedGrade7OrRepeatedGrade8: false,
      address: "",
      tier: "",
      geo: {
        latitude: 0,
        longitude: 0
      },
      currESProgramID: "",
      siblingHSSchoolIDs: [],

      gpa: 0,
      attendancePercentage: 0,
      nweaPercentileMath: 0,
      nweaPercentileRead: 0,
      seTestPercentile: 1,
      subjGradeSci: 'A',
      subjGradeMath: 'B',
      subjGradeRead: 'C',
      subjGradeSocStudies: 'D' 
    } as StudentData;

    p = {} as Program;
  });

  it("should return true if the student grades are all greater than or equal to the specified grades", () => {
    s.attendancePercentage = 50;
    s.gpa = 2.5;
    s.nweaPercentileMath = 39;
    s.nweaPercentileRead = 40;

    const gradeFilterLessThan = ifHasGrades({
      attendance: 40,
      gpa: 1.0, 
      nweaMath: 24, 
      nweaRead: 24
    });
    const gradeFilterEqual = ifHasGrades({
      attendance: 50, 
      gpa: 2.5, 
      nweaMath: 39, 
      nweaRead: 40
    });
    const gradeFilterGreaterThan = ifHasGrades({
      attendance: 51, 
      gpa: 2.51, 
      nweaMath: 40, 
      nweaRead: 41
    });

    expect(gradeFilterLessThan(s,p)).to.equal(true);
    expect(gradeFilterEqual(s,p)).to.equal(true);
    expect(gradeFilterGreaterThan(s,p)).to.equal(false);
  });

  it("should treat the nweaBoth specified property as though both the nweaMath and nweaRead properties were specified as the same number", () => {
    s.nweaPercentileMath = 40;
    s.nweaPercentileRead = 59;

    const gradeFilterLessThan = ifHasGrades({
      nweaBoth: 24
    });
    const gradeFilterEqual = ifHasGrades({
      nweaBoth: 40 
    });
    const gradeFilterGreaterThan = ifHasGrades({
      nweaBoth: 41 
    });

    expect(gradeFilterLessThan(s,p)).to.equal(true);
    expect(gradeFilterEqual(s,p)).to.equal(true);
    expect(gradeFilterGreaterThan(s,p)).to.equal(false);
  });

  it("should treat the nweaCombined property as though the nweaMath and nweaRead properties were added together to create a combined number", () => {
    s.nweaPercentileMath = 24;
    s.nweaPercentileRead = 24;

    const gradeFilterLessThan = ifHasGrades({
      nweaCombined: 24 
    });
    const gradeFilterEqual = ifHasGrades({
      nweaCombined: 48 
    });
    const gradeFilterGreaterThan = ifHasGrades({
      nweaBoth: 49 
    });

    expect(gradeFilterLessThan(s,p)).to.equal(true);
    expect(gradeFilterEqual(s,p)).to.equal(true);
    expect(gradeFilterGreaterThan(s,p)).to.equal(false);
  });

  it("should return false if the student's grades compared to are NaN", () => {
    s.nweaPercentileMath = NaN;
    s.nweaPercentileRead = 40;

    const gradeFilterRead = ifHasGrades({nweaRead: 40});
    const gradeFilterMath = ifHasGrades({nweaMath: 40});
    const gradeFilterBoth = ifHasGrades({nweaBoth: 40});
    const gradeFilterCombined = ifHasGrades({nweaCombined: 40});

    expect(gradeFilterRead(s,p)).to.equal(true);
    expect(gradeFilterMath(s,p)).to.equal(false);
    expect(gradeFilterBoth(s,p)).to.equal(false);
    expect(gradeFilterCombined(s,p)).to.equal(false);
  });

  it("should return false if the student's grades compared to are null", () => {
    s.nweaPercentileMath = null;
    s.nweaPercentileRead = 40;

    const gradeFilterRead = ifHasGrades({nweaRead: 40});
    const gradeFilterMath = ifHasGrades({nweaMath: 40});
    const gradeFilterBoth = ifHasGrades({nweaBoth: 40});
    const gradeFilterCombined = ifHasGrades({nweaCombined: 40});

    expect(gradeFilterRead(s,p)).to.equal(true);
    expect(gradeFilterMath(s,p)).to.equal(false);
    expect(gradeFilterBoth(s,p)).to.equal(false);
    expect(gradeFilterCombined(s,p)).to.equal(false);
  });

  it("should throw an error if any combination of the 'nweaBoth', ('nweaMath' or 'nweaRead'), or 'nweaCombined' properties are set in the specified grades", () => {

    expect( () => ifHasGrades({nweaMath: 40, nweaRead: 40})).not.to.throw();
    expect( () =>  ifHasGrades({nweaBoth: 40})).not.to.throw();
    expect( () => ifHasGrades({nweaMath: 40, nweaBoth: 40})).to.throw();
    expect( () => ifHasGrades({nweaMath: 20, nweaRead: 20, nweaCombined: 40})).to.throw();
    expect( () => ifHasGrades({nweaBoth: 40, nweaCombined: 80})).to.throw();
  });

  it("should throw an error if any of the specified grades have unexpected values", () => {
    expect(() => ifHasGrades({attendance: 50})).not.to.throw();
    expect(() => ifHasGrades({attendance: -1})).to.throw();
    expect(() => ifHasGrades({attendance: 101})).to.throw();
    expect(() => ifHasGrades({attendance: NaN})).to.throw();

    expect(() => ifHasGrades({nweaMath: 100})).to.throw();
    expect(() => ifHasGrades({nweaCombined: 200})).to.throw();
    expect(() => ifHasGrades({nweaCombined: NaN})).to.throw();
  });


});

