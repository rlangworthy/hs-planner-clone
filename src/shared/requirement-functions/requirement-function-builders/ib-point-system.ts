import { 
  CutoffScores,
  Program,
  ReqFnFilter,
  StudentData,
  NonSECutoffDictionary,
} from "../../../shared/types";

import { pointSystem } from "./point-system";

const createIBPointCalc = (ifInAttendBound: ReqFnFilter, ifStudentAttendsOneOf: ReqFnFilter) => (student: StudentData, program: Program): number | null => {

  // if any needed student data is null, return early with null
  if (student.hsatPercentileMath === null ||
    student.hsatPercentileRead === null ||
    student.subjGradeMath === null ||
    student.subjGradeRead === null ||
    student.subjGradeSci === null ||
    student.subjGradeSocStudies === null) {

    return null;
  }

  const IB_HSAT_SCORE_CONSTANT = 2.2727;
  const IB_ATTEND_BOUND_BONUS_PTS = 50;
  const IB_ELEM_PREF_BONUS_PTS = 50;

  // calculate points for HSAT scores
  const hsatMathPoints = Math.round(student.hsatPercentileMath * IB_HSAT_SCORE_CONSTANT);
  const hsatReadPoints = Math.round(student.hsatPercentileRead * IB_HSAT_SCORE_CONSTANT);

  // calculate score component for subj grades
  const gradePointsLookup = {
    "A": 112.5,
    "B": 75,
    "C": 38,
    "D": 0,
    "F": 0,
  }
  const subjGradeMathPoints = gradePointsLookup[student.subjGradeMath];
  const subjGradeReadPoints = gradePointsLookup[student.subjGradeRead];
  const subjGradeSciPoints = gradePointsLookup[student.subjGradeSci];
  const subjGradeSocStudiesPoints = gradePointsLookup[student.subjGradeSocStudies];
  
  // if student is in attendance bound of the IB program's school, the student gets a bonus
  // TODO figure out what to do for schools without attendance bounds, like BACK OF THE YARDS HS
  const attendBonus = ifInAttendBound(student, program) ? IB_ATTEND_BOUND_BONUS_PTS : 0;

  const elemBonus = ifStudentAttendsOneOf(student, program) ? IB_ELEM_PREF_BONUS_PTS : 0;
  console.log(student.currESProgramID?.value);
  if (elemBonus > 1) {
    console.log("got elem bonus for: ");
    console.log(program.id);
  }

  const ibPoints = hsatMathPoints +
    hsatReadPoints +
    subjGradeMathPoints +
    subjGradeReadPoints + 
    subjGradeSciPoints +
    subjGradeSocStudiesPoints +
    attendBonus +
    elemBonus;

  return ibPoints;
};  

const createIBCutoffLookup = (getCutoffDict: () => NonSECutoffDictionary) => (student: StudentData, program: Program): CutoffScores => {
  const cutoff = getCutoffDict()[program.id];
  if (cutoff === undefined) {
    throw new Error(`School ${program.schoolNameLong} with id ${program.id} not found in IB Cutoff scores`); 
  }
  return cutoff;
};
  
export const createIBPointSystem = (getCutoffDict: () => NonSECutoffDictionary, ifInAttendBound: ReqFnFilter, ifStudentAttendsOneOf: ReqFnFilter) => {
  const ibPointCalc = createIBPointCalc(ifInAttendBound, ifStudentAttendsOneOf);
  const ibCutoffLookup = createIBCutoffLookup(getCutoffDict);
  return pointSystem(ibPointCalc, ibCutoffLookup);
}

export const createIbPointSystemWithElemPref = (getCutoffDict: () => NonSECutoffDictionary, ifInAttendBound: ReqFnFilter, ifStudentAttendsOneOf: (...programIDs) => ReqFnFilter) => {
  return ((...programIDs) => {
    const ibPointCalc = createIBPointCalc(ifInAttendBound, ifStudentAttendsOneOf(...programIDs));
    const ibCutoffLookup = createIBCutoffLookup(getCutoffDict);
    return pointSystem(ibPointCalc, ibCutoffLookup);
  })
}