import { ReqFnFilter } from "../../../../shared/types";

import {
  isValidNwea, 
  isValidCombinedNwea, 
  isValidGPA, 
  isValidAttendance
} from "../../../../shared/util/grade-validate";

interface StudentGrades {
  nweaMath?: number
  nweaRead?: number
  nweaBoth?: number
  nweaCombined?: number
  gpa?: number
  attendance?: number
}

export const ifHasGrades = (grades: StudentGrades): ReqFnFilter => {

  const hasNweaMath = grades.nweaMath !== undefined 
  const hasNweaRead = grades.nweaRead !== undefined;
  const hasNweaMathOrRead = hasNweaMath || hasNweaRead;
  const hasNweaBoth = grades.nweaBoth !== undefined;
  const hasNweaCombined = grades.nweaCombined !== undefined;
  const hasGpa = grades.gpa !== undefined;
  const hasAttendance = grades.attendance !== undefined;

  const illegalCombination = (hasNweaMathOrRead && hasNweaBoth) || (hasNweaBoth && hasNweaCombined) || (hasNweaMathOrRead && hasNweaCombined);
  if (illegalCombination) {
    throw new Error("ifHasGrades: only one of (nweaMath/nweaRead), nweaBoth, and nweaCombined may be set in the grades argument.");
  }

  // check to make sure grades isn't missing all properties
  const hasAny = hasNweaMath || hasNweaRead || hasNweaBoth || hasNweaCombined || hasGpa || hasAttendance;
  if (!hasAny) {
    throw new Error("No grade thresholds found in grades argument.");
  }

  // check to make sure passed grades are valid 
  if (hasNweaMath) {
    if (!isValidNwea(grades.nweaMath)) {
      throw new Error("Invalid value for nweaMath");
    }
  }
  if (hasNweaRead) {
    if (!isValidNwea(grades.nweaRead)) {
      throw new Error("Invalid value for nweaRead");
    }
  }
  if (hasNweaBoth) {
    if (!isValidNwea(grades.nweaBoth)) {
      throw new Error("Invalid value for nweaBoth");
    }
  }
  if (hasNweaCombined) {
    if (!isValidCombinedNwea(grades.nweaCombined)) {
      throw new Error("Invalid value for nweaCombined");
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

    // If we recieved either(/both) the nweaMath and nweaRead options,
    // check the student's nweaMath or(/and) nweaRead scores.
    if (grades.nweaMath !== undefined || grades.nweaRead !== undefined) {

      if (grades.nweaMath !== undefined) {
        if (student.nweaPercentileMath === null) {
          return false;
        } else if (student.nweaPercentileMath < grades.nweaMath) {
          return false;
        }
      }
      if (grades.nweaRead !== undefined) {
        if (student.nweaPercentileRead === null) {
          return false;
        } else if (student.nweaPercentileRead < grades.nweaRead) {
          return false;
        }
      }

      // Else if we recieved the nweaBoth argument, check the student's
      // nweaRead and nweaMath scores against the value of nweaBoth.
    } else if (grades.nweaBoth !== undefined) {
      if (student.nweaPercentileMath === null || student.nweaPercentileRead === null) {
        return false;
      } else if (student.nweaPercentileMath < grades.nweaBoth || student.nweaPercentileRead < grades.nweaBoth) {
        return false;
      }

      // Else if we recieved the nweaCombined argument, check the student's
      // nweaRead + nweaMath scores added together against the value of nweaCombined.
    } else if (grades.nweaCombined !== undefined) {
      if (student.nweaPercentileMath === null || student.nweaPercentileRead === null) {
        return false;
      } else if (student.nweaPercentileMath + student.nweaPercentileRead < grades.nweaCombined) {
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
