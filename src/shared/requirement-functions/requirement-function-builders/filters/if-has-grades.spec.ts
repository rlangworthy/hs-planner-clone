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
      currESProgramID: { value: "" },
      siblingHSSchoolIDs: [],

      gpa: 0,
      attendancePercentage: 0,
      hsatPercentileMath: 0,
      hsatPercentileRead: 0,
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
    s.hsatPercentileMath = 39;
    s.hsatPercentileRead = 40;

    const gradeFilterLessThan = ifHasGrades({
      attendance: 40,
      gpa: 1.0, 
      hsatMath: 24, 
      hsatRead: 24
    });
    const gradeFilterEqual = ifHasGrades({
      attendance: 50, 
      gpa: 2.5, 
      hsatMath: 39, 
      hsatRead: 40
    });
    const gradeFilterGreaterThan = ifHasGrades({
      attendance: 51, 
      gpa: 2.51, 
      hsatMath: 40, 
      hsatRead: 41
    });

    expect(gradeFilterLessThan(s,p)).to.equal(true);
    expect(gradeFilterEqual(s,p)).to.equal(true);
    expect(gradeFilterGreaterThan(s,p)).to.equal(false);
  });

  it("should treat the hsatBoth specified property as though both the hsatMath and hsatRead properties were specified as the same number", () => {
    s.hsatPercentileMath = 40;
    s.hsatPercentileRead = 59;

    const gradeFilterLessThan = ifHasGrades({
      hsatBoth: 24
    });
    const gradeFilterEqual = ifHasGrades({
      hsatBoth: 40 
    });
    const gradeFilterGreaterThan = ifHasGrades({
      hsatBoth: 41 
    });

    expect(gradeFilterLessThan(s,p)).to.equal(true);
    expect(gradeFilterEqual(s,p)).to.equal(true);
    expect(gradeFilterGreaterThan(s,p)).to.equal(false);
  });

  it("should treat the hsatCombined property as though the hsatMath and hsatRead properties were added together to create a combined number", () => {
    s.hsatPercentileMath = 24;
    s.hsatPercentileRead = 24;

    const gradeFilterLessThan = ifHasGrades({
      hsatCombined: 24 
    });
    const gradeFilterEqual = ifHasGrades({
      hsatCombined: 48 
    });
    const gradeFilterGreaterThan = ifHasGrades({
      hsatBoth: 49 
    });

    expect(gradeFilterLessThan(s,p)).to.equal(true);
    expect(gradeFilterEqual(s,p)).to.equal(true);
    expect(gradeFilterGreaterThan(s,p)).to.equal(false);
  });

  it("should return false if the student's grades compared to are NaN", () => {
    s.hsatPercentileMath = NaN;
    s.hsatPercentileRead = 40;

    const gradeFilterRead = ifHasGrades({hsatRead: 40});
    const gradeFilterMath = ifHasGrades({hsatMath: 40});
    const gradeFilterBoth = ifHasGrades({hsatBoth: 40});
    const gradeFilterCombined = ifHasGrades({hsatCombined: 40});

    expect(gradeFilterRead(s,p)).to.equal(true);
    expect(gradeFilterMath(s,p)).to.equal(false);
    expect(gradeFilterBoth(s,p)).to.equal(false);
    expect(gradeFilterCombined(s,p)).to.equal(false);
  });

  it("should return false if the student's grades compared to are null", () => {
    s.hsatPercentileMath = null;
    s.hsatPercentileRead = 40;

    const gradeFilterRead = ifHasGrades({hsatRead: 40});
    const gradeFilterMath = ifHasGrades({hsatMath: 40});
    const gradeFilterBoth = ifHasGrades({hsatBoth: 40});
    const gradeFilterCombined = ifHasGrades({hsatCombined: 40});

    expect(gradeFilterRead(s,p)).to.equal(true);
    expect(gradeFilterMath(s,p)).to.equal(false);
    expect(gradeFilterBoth(s,p)).to.equal(false);
    expect(gradeFilterCombined(s,p)).to.equal(false);
  });

  it("should throw an error if any combination of the 'hsatBoth', ('hsatMath' or 'hsatRead'), or 'hsatCombined' properties are set in the specified grades", () => {

    expect( () => ifHasGrades({hsatMath: 40, hsatRead: 40})).not.to.throw();
    expect( () =>  ifHasGrades({hsatBoth: 40})).not.to.throw();
    expect( () => ifHasGrades({hsatMath: 40, hsatBoth: 40})).to.throw();
    expect( () => ifHasGrades({hsatMath: 20, hsatRead: 20, hsatCombined: 40})).to.throw();
    expect( () => ifHasGrades({hsatBoth: 40, hsatCombined: 80})).to.throw();
  });

  it("should throw an error if any of the specified grades have unexpected values", () => {
    expect(() => ifHasGrades({attendance: 50})).not.to.throw();
    expect(() => ifHasGrades({attendance: -1})).to.throw();
    expect(() => ifHasGrades({attendance: 101})).to.throw();
    expect(() => ifHasGrades({attendance: NaN})).to.throw();

    expect(() => ifHasGrades({hsatMath: 100})).to.throw();
    expect(() => ifHasGrades({hsatCombined: 200})).to.throw();
    expect(() => ifHasGrades({hsatCombined: NaN})).to.throw();
  });


});

