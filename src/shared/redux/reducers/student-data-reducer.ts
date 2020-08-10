import * as Redux from "redux";

import { StudentData } from "../../../shared/types";
import { ActionType } from "../../../shared/enums";

import calculateGPA from "../../../shared/util/calculate-gpa";

import { initialStudentData } from "./initial-state";

const sanitizePercentile = (percentile: number): number | null => {
  // if input is NaN, return null
  // if input is less than 1, return 1
  // if input is greater than 99, return 99
  let sanitized;
  if (Number.isNaN(percentile)){
    sanitized = null;
  } else if (percentile < 1) {
    sanitized = 1;
  } else if (percentile > 99) {
    sanitized = 99
  } else {
    sanitized = percentile;
  }
  return sanitized;
};

const sanitizeAttendancePercentage = (percentage: number): number | null => {
  // if input is NaN, return null
  // if input is less than 0, return 0
  // if input is greater than 100, return 100
  let sanitized;
  if (Number.isNaN(percentage)){
    sanitized = null;
  } else if (percentage < 0) {
    sanitized = 0;
  } else if (percentage > 100) {
    sanitized = 100;
  } else {
    sanitized = percentage;
  }
  return sanitized;
};

export const studentDataReducer: Redux.Reducer<StudentData> = (studentData = initialStudentData, action): StudentData => {
  let nextStudentData: StudentData = studentData;
  switch(action.type) {
    case ActionType.UpdateStudentGender:
      nextStudentData = {...studentData, gender: action.payload};
      break;
    case ActionType.UpdateStudentAddress:
      nextStudentData = {...studentData, address: action.payload};
      break;
    case ActionType.UpdateStudentTier:
      nextStudentData = {...studentData, tier: action.payload};
      break;
    case ActionType.UpdateStudentGeo:
      nextStudentData = {...studentData, geo: action.payload};
      break;
    case ActionType.UpdateStudentGradeLevel:
      nextStudentData = {...studentData, gradeLevel: action.payload};
      break;
    case ActionType.UpdateStudentSkip7OrRepeated8:
      nextStudentData = {...studentData, skippedGrade7OrRepeatedGrade8: action.payload};
      break;
    case ActionType.UpdateStudentCurrESProgram:
      nextStudentData = {...studentData, currESProgramID: action.payload};
      break;
    case ActionType.UpdateStudentELLStatus:
      nextStudentData = {...studentData, ell: action.payload};
      break;
    case ActionType.UpdateStudentIEPStatus:
      nextStudentData = {...studentData, iep: action.payload};
      break;
    case ActionType.UpdateStudentAttendPercentage:
      const attendancePercentage = sanitizeAttendancePercentage(action.payload);
      nextStudentData = {...studentData, attendancePercentage: attendancePercentage};
      break;
    case ActionType.UpdateStudentSiblingHSSchools:
      nextStudentData = {...studentData, siblingHSSchoolIDs: action.payload};
      break;
    case ActionType.UpdateStudentSETestPercentile:
      const seTestPercentile = sanitizePercentile(action.payload);
      nextStudentData = {...studentData, seTestPercentile: seTestPercentile};
      break;
    case ActionType.UpdateStudentNWEAPercentileMath:
      const nweaPercentileMath = sanitizePercentile(action.payload);
      nextStudentData = {...studentData, nweaPercentileMath: nweaPercentileMath};
      break;
    case ActionType.UpdateStudentNWEAPercentileRead:
      const nweaPercentileRead = sanitizePercentile(action.payload);
      nextStudentData = {...studentData, nweaPercentileRead: nweaPercentileRead};
      break;
    case ActionType.UpdateStudentSubjGradeMath:
      nextStudentData = {
        ...studentData, 
        subjGradeMath: action.payload,
        gpa: calculateGPA(
          action.payload,
          studentData.subjGradeRead,
          studentData.subjGradeSci,
          studentData.subjGradeSocStudies
        )
      };
      break;
    case ActionType.UpdateStudentSubjGradeRead:
      nextStudentData = {
        ...studentData, 
        subjGradeRead: action.payload,
        gpa: calculateGPA(
          studentData.subjGradeMath,
          action.payload,
          studentData.subjGradeSci,
          studentData.subjGradeSocStudies
        )
      };
      break;
    case ActionType.UpdateStudentSubjGradeSci:
      nextStudentData = {
        ...studentData, 
        subjGradeSci: action.payload,
        gpa: calculateGPA(
          studentData.subjGradeMath,
          studentData.subjGradeRead,
          action.payload,
          studentData.subjGradeSocStudies
        )
      };
      break;
    case ActionType.UpdateStudentSubjGradeSocStudies:
      nextStudentData = {
        ...studentData, 
        subjGradeSocStudies: action.payload,
        gpa: calculateGPA(
          studentData.subjGradeMath,
          studentData.subjGradeRead,
          studentData.subjGradeSci,
          action.payload,
        )
      };
      break;
  }
  return nextStudentData;
};
