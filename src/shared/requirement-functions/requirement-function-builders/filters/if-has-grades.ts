import { ReqFnFilter } from "../../../../shared/types";

import {
  isValidHsat, 
  isValidCombinedHsat, 
  isValidGPA, 
  isValidAttendance
} from "../../../../shared/util/grade-validate";

interface StudentGrades {
  hsatMath?: number
  hsatRead?: number
  hsatBoth?: number
  hsatCombined?: number
  gpa?: number
  attendance?: number
}

export const ifHasGrades = (grades: StudentGrades): ReqFnFilter => {

  const hasHsatMath = grades.hsatMath !== undefined 
  const hasHsatRead = grades.hsatRead !== undefined;
  const hasHsatMathOrRead = hasHsatMath || hasHsatRead;
  const hasHsatBoth = grades.hsatBoth !== undefined;
  const hasHsatCombined = grades.hsatCombined !== undefined;
  const hasGpa = grades.gpa !== undefined;
  const hasAttendance = grades.attendance !== undefined;

  const illegalCombination = (hasHsatMathOrRead && hasHsatBoth) || (hasHsatBoth && hasHsatCombined) || (hasHsatMathOrRead && hasHsatCombined);
  if (illegalCombination) {
    throw new Error("ifHasGrades: only one of (hsatMath/hsatRead), hsatBoth, and hsatCombined may be set in the grades argument.");
  }

  // check to make sure grades isn't missing all properties
  const hasAny = hasHsatMath || hasHsatRead || hasHsatBoth || hasHsatCombined || hasGpa || hasAttendance;
  if (!hasAny) {
    throw new Error("No grade thresholds found in grades argument.");
  }

  // check to make sure passed grades are valid 
  if (hasHsatMath) {
    if (!isValidHsat(grades.hsatMath)) {
      throw new Error("Invalid value for hsatMath");
    }
  }
  if (hasHsatRead) {
    if (!isValidHsat(grades.hsatRead)) {
      throw new Error("Invalid value for hsatRead");
    }
  }
  if (hasHsatBoth) {
    if (!isValidHsat(grades.hsatBoth)) {
      throw new Error("Invalid value for hsatBoth");
    }
  }
  if (hasHsatCombined) {
    if (!isValidCombinedHsat(grades.hsatCombined)) {
      throw new Error("Invalid value for hsatCombined");
    }
  }
  if (hasGpa) {
    if (!isValidGPA(grades.gpa)) {
      throw new Error("Invalid value for gpa");
    }
  }
  if (hasAttendance) {
    if(!isValidAttendance(grades.attendance)) {
      throw new Error("Invalid value for attendance");
    }
  }

  return (student, program) => {

    // If we recieved either(/both) the hsatMath and hsatRead options,
    // check the student's hsatMath or(/and) hsatRead scores.
    if (grades.hsatMath !== undefined || grades.hsatRead !== undefined) {

      if (grades.hsatMath !== undefined) {
        if (student.hsatPercentileMath === null) {
          return false;
        } else if (student.hsatPercentileMath < grades.hsatMath) {
          return false;
        }
      }
      if (grades.hsatRead !== undefined) {
        if (student.hsatPercentileRead === null) {
          return false;
        } else if (student.hsatPercentileRead < grades.hsatRead) {
          return false;
        }
      }

      // Else if we recieved the hsatBoth argument, check the student's
      // hsatRead and hsatMath scores against the value of hsatBoth.
    } else if (grades.hsatBoth !== undefined) {
      if (student.hsatPercentileMath === null || student.hsatPercentileRead === null) {
        return false;
      } else if (student.hsatPercentileMath < grades.hsatBoth || student.hsatPercentileRead < grades.hsatBoth) {
        return false;
      }

      // Else if we recieved the hsatCombined argument, check the student's
      // hsatRead + hsatMath scores added together against the value of hsatCombined.
    } else if (grades.hsatCombined !== undefined) {
      if (student.hsatPercentileMath === null || student.hsatPercentileRead === null) {
        return false;
      } else if (student.hsatPercentileMath + student.hsatPercentileRead < grades.hsatCombined) {
        return false;
      }
    }


    // If we received the gpa option, check gpa.
    if (grades.gpa !== undefined) {
      if (student.gpa === null) {
        return false;
      } else if (student.gpa < grades.gpa) {
        return false;
      }
    }

    // If we recieved the attendance option, check attendance.
    if (grades.attendance !== undefined) {
      if (student.attendancePercentage === null) {
        return false;
      } else if (student.attendancePercentage < grades.attendance) {
        return false;
      }
    }

    // fallthrough: student has passed all tests.
    return true;
  }
};
