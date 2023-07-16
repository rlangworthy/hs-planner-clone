import { AppState } from "../../../shared/types";

export const initialStudentData = {
  gender: null,
  address: null,
  tier: null,
  geo: null,
  gradeLevel: null,
  prevGradeLevel: null,
  iep: null,
  ell: null,
  attendancePercentage: null,
  gpa: null,
  skippedGrade7OrRepeatedGrade8: null,

  currESProgramID: null,
  siblingHSSchoolIDs: [],
  seTestPercentile: null,
  hsatPercentileMath: null,
  hsatPercentileRead: null,
  subjGradeMath: null,
  subjGradeRead: null,
  subjGradeSci: null,
  subjGradeSocStudies: null
};
export const initialProgramOutcomes = {};
export const initialLoadingStatus = {
  loadingData: false,
  dataLoaded: false,
  loadingTier: false,
  tierLoaded: false,
};
export const initialData = {
  hsPrograms: {},
  nonHSPrograms: {},
  hsSchools: {},
  hsProgramGroups: {},

  seCutoffScores: {},
  nonSECutoffScores: {},
  programTypeIDTable: {},
  schoolAttendanceBoundaryTable: {},
  tractTierTable: {}
};
export const initialProgramModalState = {
  open: false,
  program: null,
  outcome: null
}

export const initialState: AppState = {
  programModalState: initialProgramModalState,
  studentData: initialStudentData,
  programOutcomes: initialProgramOutcomes,
  loadingStatus: initialLoadingStatus,
  data: initialData
};
