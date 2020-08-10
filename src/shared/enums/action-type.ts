export enum ActionType {

  /* student data */
  UpdateStudentGender,
    //UpdateStudentLocation,
  UpdateStudentAddress,
  UpdateStudentTier,
  UpdateStudentGeo,

  UpdateStudentGradeLevel,
  UpdateStudentPrevGradeLevel,
  UpdateStudentSkip7OrRepeated8,
  UpdateStudentELLStatus,
  UpdateStudentIEPStatus,
  UpdateStudentAttendPercentage,
  UpdateStudentCurrESProgram,
  UpdateStudentSiblingHSSchools,

  UpdateStudentNWEAPercentileMath,
  UpdateStudentNWEAPercentileRead,

  UpdateStudentSubjGradeMath,
  UpdateStudentSubjGradeRead,
  UpdateStudentSubjGradeSci,
  UpdateStudentSubjGradeSocStudies,

  UpdateStudentSETestPercentile,

  /* outcomes */
  UpdateProgramOutcomes,

  /* ui state */
  SelectHSProgram,
  OpenProgramModal,
  CloseProgramModal,

  /* data loading */
  LoadingData,
  DataLoaded, 
  LoadingTier,
  TierLoaded,

  /* data */
  UpdateHSPrograms,
  UpdateNonHSPrograms,
  UpdateHSSchools,
  UpdateHSProgramGroups,

  UpdateSECutoffScores,
  UpdateNonSECutoffScores,
  UpdateTractTierTable,
  UpdateSchoolAttendanceBoundaryTable
}
