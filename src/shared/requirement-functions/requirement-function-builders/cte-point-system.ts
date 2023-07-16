import { 
    CutoffScores,
    Program,
    ReqFnFilter,
    StudentData,
    NonSECutoffDictionary,
  } from "../../../shared/types";
  
  import { pointSystem } from "./point-system";
  
  const createCTEPointCalc = () => (student: StudentData, program: Program): number | null => {
  
    // if any needed student data is null, return early with null
    if (student.hsatPercentileMath === null ||
      student.hsatPercentileRead === null ||
      student.subjGradeMath === null ||
      student.subjGradeRead === null ||
      student.subjGradeSci === null ||
      student.subjGradeSocStudies === null) {
  
      return null;
    }
  
    const CTE_HSAT_SCORE_CONSTANT = 1.515;
  
    // calculate points for HSAT scores
    const hsatMathPoints = Math.round(student.hsatPercentileMath * CTE_HSAT_SCORE_CONSTANT);
    const hsatReadPoints = Math.round(student.hsatPercentileRead * CTE_HSAT_SCORE_CONSTANT);
  
    // calculate score component for subj grades
    const gradePointsLookup = {
      "A": 75,
      "B": 50,
      "C": 25,
      "D": 0,
      "F": 0,
    }
    const subjGradeMathPoints = gradePointsLookup[student.subjGradeMath];
    const subjGradeReadPoints = gradePointsLookup[student.subjGradeRead];
    const subjGradeSciPoints = gradePointsLookup[student.subjGradeSci];
    const subjGradeSocStudiesPoints = gradePointsLookup[student.subjGradeSocStudies];
    
    // if student is in attendance bound of the IB program's school, the student gets a bonus
    // TODO figure out what to do for schools without attendance bounds, like BACK OF THE YARDS HS
  
    const ibPoints = hsatMathPoints +
      hsatReadPoints +
      subjGradeMathPoints +
      subjGradeReadPoints + 
      subjGradeSciPoints +
      subjGradeSocStudiesPoints
  
    return ibPoints;
  };  
  
  const createCTECutoffLookup = (getCutoffDict: () => NonSECutoffDictionary) => (student: StudentData, program: Program): CutoffScores => {
    const cutoff = getCutoffDict()[program.id];
    if (cutoff === undefined) {
      throw new Error(`School ${program.schoolNameLong} with id ${program.id} not found in CTE Cutoff scores`); 
    }
    return cutoff;
  };
    
  export const createCTEPointSystem = (getCutoffDict: () => NonSECutoffDictionary) => {
    const ctePointCalc = createCTEPointCalc();
    const cteCutoffLookup = createCTECutoffLookup(getCutoffDict);
    return pointSystem(ctePointCalc, cteCutoffLookup);
  } 
    
  
  