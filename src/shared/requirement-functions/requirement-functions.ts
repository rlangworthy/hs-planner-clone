import {
  ReqFnFilter,
  RequirementFunction,
} from "../../shared/types";

import {
  SuccessChance,
} from "../../shared/enums";


import {
  accept, 
  lottery,
  LotteryStage,
  SIBLING_LOTTERY_STAGE,
  PROXIMITY_LOTTERY_STAGE,
  CONTINUING_STUDENTS_LOTTERY_STAGE,
  TIER_LOTTERY_STAGE,
  STAFF_PREFERENCE_LOTTERY_STAGE,
  ATTENDANCE_AREA_LOTTERY_STAGE,
  GENERAL_LOTTERY_STAGE,
  LotteryStageSize,
  conditional,
  createIBPointSystem,
  createSEPointSystem,
  createCTEPointSystem,
  notImplemented,
  pointSystem,
  createIbPointSystemWithElemPref
} from "./requirement-function-builders";

import {
  either,
  both,
  everyone,
  ifSiblingAttends, 
  ifStudentAttendsOneOf, 
  ifHasGrades,
  createIfInAttendBound,
  ifIEPorEL,
  ifSkipped7OrRepeated8,
  ifInProximity,
  ifAttends,
} from "./requirement-function-builders/filters";

import {
  AUSL_ES_PROGRAMS,
  GROW_COMMUNITY_SCHOOL_ES_PROGRAMS,
  ACERO_ES_PROGRAMS,
  CICS_ES_PROGRAMS,

  FOUNDATIONS_COLLEGE_PREP_JOINT_ES_HS_PROGRAM,
  CHICAGO_VIRTUAL_GENERAL_EDUCATION_JOINT_ES_HS_PROGRAM,
  CICS_LONGWOOD_GENERAL_EDUCATION_JOINT_ES_HS_PROGRAM,
  CICS_CHICAGOQUEST_GENERAL_EDUCATION_JOINT_ES_HS_PROGRAM,
  CHICAGO_MATH_AND_SCIENCE_GENERAL_EDUCATION_JOINT_ES_HS_PROGRAM,
  U_OF_C_WOODLAWN_GENERAL_EDUCATION_JOINT_ES_HS_PROGRAM,
  CHICAGO_COLLEGIATE_GENERAL_EDUCATION_JOINT_ES_HS_PROGRAM,
  JAMIESON_ES_PROGRAM,
  CLINTON_ES_PROGRAM,
  PETERSON_ES_PROGRAM,
  ROGERS_ES_PROGRAM,
  OGDEN_GENERAL_EDUCATION_ES_PROGRAM,
  OGDEN_MAGNET_CLUSTER_ES_PROGRAM,
  DISNEY_II_ES_PROGRAM,
  GOUDY_ES_PROGRAM,

  ASPIRA_MS_PROGRAM,
  CICS_AVALON_ES_PROGRAM,
  CICS_BASIL_ES_PROGRAM,
  CICS_BUCKTOWN_ES_PROGRAM,
  //CICS_LOOMIS_ES_PROGRAM, //?
  CICS_IRVING_PARK_ES_PROGRAM,
  CICS_PRAIRIE_ES_PROGRAM,
  CICS_WASHINGTON_PARK_ES_PROGRAM,
  CICS_WEST_BELDEN_ES_PROGRAM,
  CICS_WRIGHTWOOD_ES_PROGRAM,
  
  BRENNEMANN_ES_PROGRAM,
  COURTENAY_ES_PROGRAM,
  MCCUTCHEON_ES_PROGRAM,
  CHALMERS_ES_PROGRAM,
  DVORAK_ES_PROGRAM,
  HERZL_ES_PROGRAM,
  JOHNSON_ES_PROGRAM,
  MORTON_ES_PROGRAM,
  TAFT_ACADEMIC_CENTER_PROGRAM,
  MORGAN_PARK_ACADEMIC_CENTER_PROGRAM,
  KENWOOD_ACADEMIC_CENTER_PROGRAM,
  CARNEGIE_ES_PROGRAMS,
  ALCOTT_ES_PROGRAM,
  BOONE_ES_PROGRAM,
  FIELD_ES_PROGRAM,
  GALE_ES_PROGRAM,
  HAYT_ES_PROGRAM,
  JORDAN_ES_PROGRAM,
  KILMER_ES_PROGRAM,
  MCPHERSON_ES_PROGRAM,
  WEST_RIDGE_ES_PROGRAM,
  GREELEY_REGIONAL_GIFTED_CENTER_ES_PROGRAM,
  RAVENSWOOD_ES_PROGRAM,
  GREELEY_MAGNET_CLUSTER_ES_PROGRAM,
  CHICAGO_ACADEMY_ES_PROGRAM,
  
  CPS_NEIGHBORHOOD_HS_PROGRAMS,
  LOCKE_MAGNET_CLUSTER_ES_PROGRAM,
  PEIRCE_ES_PROGRAM,
  ARMSTRONG_G_ES_PROGRAM,
  LANGUAGE_ES_PROGRAMS,
  EDWARDS_LANGUAGE_PROGRAM,
  MARSH_ES_PROGRAM,
  NOBLE_COMER_MS_PROGRAM,
  PERSPECTIVES_MS_PROGRAM,
  ART_IN_MOTION_MS_PROGRAM,
  INTRINSIC_MS_PROGRAM,
  MADERO_MS_PROGRAM,
  ACERO_CISNEROS_ES_PROGRAM,
  ACERO_CLEMENTE_ES_PROGRAM,
  ACERO_DE_LA_CRUZ_ES_PROGRAM,
  ACERO_DE_LAS_CASAS_ES_PROGRAM,
  CURTIS_ES_PROGRAM,
  CURIE_HSGENED,
  MOOS_LANGUAGE_PROGRAM,
  KELVYN_PARK_HSGENED,
  LOCKE_GENERAL_EDUCATION_ES_PROGRAM,
  SPRY_LANGUAGE_PROGRAM,
  AZUELA_LANGUAGE_PROGRAM,
  BARRY_LANGUAGE_PROGRAM,
  BATEMAN_LANGUAGE_PROGRAM,
  BELMONT_CRAGIN_LANGUAGE_PROGRAM,
  CALMECA_LANGUAGE_PROGRAM,
  CALMECA_ES_PROGRAM,
  CARSON_LANGUAGE_PROGRAM,
  CHASE_LANGUAGE_PROGRAM,
  COOPER_LANGUAUGE_PROGRAM,
  DARWIN_LANGUAGE_PROGRAM,
  HURLEY_LANGUAGE_PROGRAM,
  INTER_AMERICAN_ES_PROGRAM,
  MOZART_LANGUAGE_PROGRAM,
  SABIN_LANGUAGE_PROGRAM,
  STOWE_LANGUAGE_PROGRAM,
  AUDUBON_ES_PROGRAM,
  BELL_OPEN_ENROLLMENT_ES_PROGRAM,
  BLAINE_ES_PROGRAM,
  BUDLONG_ES_PROGRAM,
  BURLEY_ES_PROGRAM,
  CHAPPELL_ES_PROGRAM,
  COONLEY_OPEN_ENROLLMENT_ES_PROGRAM,
  HAMILTON_ES_PROGRAM,
  HAWTHORNE_ES_PROGRAM,
  JAHN_ES_PROGRAM,
  NETTELHORST_ES_PROGRAM,
  WATERS_ES_PROGRAM

} from "./constants";
import { store } from "../../shared/redux/store";
import { getOverallSuccessChance } from "../util/get-overall-success-chance";
import { all } from "axios";
import { generateKeyPair } from "crypto";

/**
 * This is a placeholder requirement function. Use it to indicate "I need to write this
 * requirement function, but I need the file to compile first."
 */
const todoImplement = (s,p) => SuccessChance.NOTIMPLEMENTED;

/* 
 * Initialize ibPointSystem, sePointSystem, and getAttendBoundDict.
 *
 * These three functions depend on app data (school cutoff scores and attendance boundary geo data). 
 * We need to initialize these functions by passing them a link
 * to the app's redux store, which holds the data.
 * */
const getAttendBoundDict = () => store.getState().data.schoolAttendanceBoundaryTable;
const getSECutoffScores = () => store.getState().data.seCutoffScores;
const getNonSECutoffScores = () => store.getState().data.nonSECutoffScores;

const ifInAttendBound = createIfInAttendBound(getAttendBoundDict);
const ibPointSystem: RequirementFunction = createIBPointSystem(getNonSECutoffScores, ifInAttendBound, ifStudentAttendsOneOf());
const ibWithElemPref: (...programIDs:string[]) => RequirementFunction = createIbPointSystemWithElemPref(getNonSECutoffScores, ifInAttendBound, ifStudentAttendsOneOf);

console.log(ibWithElemPref(EDWARDS_LANGUAGE_PROGRAM));

const sePointSystem: RequirementFunction = createSEPointSystem(getSECutoffScores);
const ctePointSystem: RequirementFunction = createCTEPointSystem(getNonSECutoffScores);

const ifIsNeighborhoodSchool: ReqFnFilter = (student, program) => {
  const programIsNeighborhood: ReqFnFilter = (student, program) => {
    return CPS_NEIGHBORHOOD_HS_PROGRAMS.includes(program.id)
  }
  return both(programIsNeighborhood, ifInAttendBound)(student, program)
}
const lowerPriority8thGrade = (...stages: LotteryStage[]):LotteryStage[] => {
  return stages
    .map(stage =>{
      return {filter: both(stage.filter, (student, program) => {
        if (student.skippedGrade7OrRepeatedGrade8) {
          return false;
        } else {
          return true;
        }
      }), size: stage.size}
    })
    .concat([GENERAL_LOTTERY_STAGE])
}

// adds a "preference stage" to every lottery stage, which is the same but also
// requires the student to match the provided filter
const filterPreference = (filter: ReqFnFilter, ...stages: LotteryStage[]):LotteryStage[] => {
  let output: LotteryStage[] = [];
  stages.forEach(stage => {
    output.push({
      filter: both(stage.filter, filter),
      size: stage.size
    });
    output.push(stage);
  });
  return output;
}

interface ReqFnTable {
  [reqFnId: string]: {
    id?: string
    name?: string
    desc: string
    programs: string[]
    fn: RequirementFunction
  }
}

const newFNs : ReqFnTable = {
}
export const requirementFunctions: ReqFnTable = 

{
  "5de2e9829ece34a213bae85d691c8ed3": {
    "id": "5de2e9829ece34a213bae85d691c8ed3",
    "programs": [
      "CHICAGO ARTS HS: CHICAGO ARTS HS-Brass & Woodwinds",
      "CHICAGO ARTS HS: CHICAGO ARTS HS-Creative Writing",
      "CHICAGO ARTS HS: CHICAGO ARTS HS-Dance",
      "CHICAGO ARTS HS: CHICAGO ARTS HS-Guitar",
      "CHICAGO ARTS HS: CHICAGO ARTS HS-Musical Theatre",
      "CHICAGO ARTS HS: CHICAGO ARTS HS-Percussion",
      "CHICAGO ARTS HS: CHICAGO ARTS HS-Piano",
      "CHICAGO ARTS HS: CHICAGO ARTS HS-Strings",
      "CHICAGO ARTS HS: CHICAGO ARTS HS-Theatre",
      "CHICAGO ARTS HS: CHICAGO ARTS HS-Visual Arts",
      "CHICAGO ARTS HS: CHICAGO ARTS HS-Vocal Music",
      "CHICAGO VOCATIONAL HS: CHICAGO VOCATIONAL HS-Deaf/Hard of Hearing",
      "CHICAGO VOCATIONAL HS: CHICAGO VOCATIONAL HS-General Education",
      "CHICAGO VOCATIONAL HS: CHICAGO VOCATIONAL HS-Significantly Modified Curriculum w/ Intensive Supports",
      "CHICAGO VOCATIONAL HS: CHICAGO VOCATIONAL HS-Significantly Modified Curriculum w/ Moderate Supports",
      "DUNBAR HS: DUNBAR HS-Significantly Modified Curriculum w/ Moderate Supports",
      "PROSSER HS: PROSSER HS-Deaf/Hard of Hearing",
      "PROSSER HS: PROSSER HS-Significantly Modified Curriculum w/ Moderate Supports",
      "SIMEON HS: SIMEON HS-Significantly Modified Curriculum w/ Intensive Supports",
      "SIMEON HS: SIMEON HS-Significantly Modified Curriculum w/ Moderate Supports",
      "NOBLE - NOBLE HS: NOBLE - NOBLE HS-General Education",
      "NOBLE - COMER: NOBLE - COMER-General Education",
      "NOBLE - GOLDER HS: NOBLE - GOLDER HS-General Education",
      "NOBLE - RAUNER HS: NOBLE - RAUNER HS-General Education",
      "NOBLE - PRITZKER HS: NOBLE - PRITZKER HS-General Education",
      "NOBLE - ROWE CLARK HS: NOBLE - ROWE CLARK HS-STEM",
      "NOBLE - UIC HS: NOBLE - UIC HS-General Education",
      "NLCP - CHRISTIANA HS: NLCP - CHRISTIANA HS-General Education",
      "NLCP - COLLINS HS: NLCP - COLLINS HS-General Education",
      "NOBLE - BULLS HS: NOBLE - BULLS HS-General Education",
      "CICS - ELLISON HS: CICS - ELLISON HS-General Education",
      "NOBLE - JOHNSON HS: NOBLE - JOHNSON HS-General Education",
      "NOBLE - MUCHIN HS: NOBLE - MUCHIN HS-General Education",
      "U OF C - WOODLAWN HS: U OF C - WOODLAWN HS-General Education",
      "PERSPECTIVES - LEADERSHIP HS: PERSPECTIVES - LEADERSHIP HS-General Education",
      "PERSPECTIVES - TECH HS: PERSPECTIVES - TECH HS-STEM",
      "PERSPECTIVES - JOSLIN HS: PERSPECTIVES - JOSLIN HS-General Education",
      "CICS - LONGWOOD: CICS - LONGWOOD-General Education",
      "CICS - NORTHTOWN HS: CICS - NORTHTOWN HS-General Education",
      "CHICAGO MATH & SCIENCE HS: CHICAGO MATH & SCIENCE HS-General Education",
      "INSTITUTO - HEALTH: INSTITUTO - HEALTH-Health Sciences",
      "INSTITUTO - HEALTH: INSTITUTO - HEALTH-General Education",
      "NOBLE - HANSBERRY HS: NOBLE - HANSBERRY HS-International Baccalaureate (IB)",
      "NOBLE - DRW HS: NOBLE - DRW HS-General Education",
      "LEGAL PREP HS: LEGAL PREP HS-Law & Public Safety",
      "PERSPECTIVES - MATH & SCI HS: PERSPECTIVES - MATH & SCI HS-STEM",
      "ACERO - GARCIA HS: ACERO - GARCIA HS-STEM",
      "URBAN PREP HS: URBAN PREP HS-General Education",
      "NOBLE - ITW SPEER HS: NOBLE - ITW SPEER HS-STEM",
      "NOBLE - ACADEMY HS: NOBLE - ACADEMY HS-General Education",
      "CHICAGO COLLEGIATE: CHICAGO COLLEGIATE-General Education",
      "INTRINSIC HS: INTRINSIC HS-General Education",
      "NOBLE - BUTLER HS: NOBLE - BUTLER HS-General Education",
      "NOBLE - BAKER HS: NOBLE - BAKER HS-General Education",
      "ACERO - SOTO HS: ACERO - SOTO HS-General Education",
      "ART IN MOTION: ART IN MOTION-Fine & Performing Arts",
      "NOBLE - MANSUETO HS: NOBLE - MANSUETO HS-International Baccalaureate (IB)",
      "GOODE HS: GOODE HS-Significantly Modified Curriculum w/ Intensive Supports",
      "GOODE HS: GOODE HS-Early College STEM",
      "CHICAGO TECH HS: CHICAGO TECH HS-STEM",
      "CLARK HS: CLARK HS-Significantly Modified Curriculum w/ Moderate Supports",
      "DISNEY II HS: DISNEY II HS-Magnet - Fine & Performing Arts, Technology (7-8)",
      "VON STEUBEN HS: VON STEUBEN HS-Significantly Modified Curriculum w/ Moderate Supports",
      "CHICAGO AGRICULTURE HS: CHICAGO AGRICULTURE HS-Significantly Modified Curriculum w/ Intensive Supports",
      "CHICAGO AGRICULTURE HS: CHICAGO AGRICULTURE HS-Significantly Modified Curriculum w/ Moderate Supports",
      "CURIE HS: CURIE HS-Deaf/Hard of Hearing",
      "CURIE HS: CURIE HS-Magnet - Fine & Performing Arts",
      "CURIE HS: CURIE HS-Visual Impairment",
      "CHICAGO MILITARY HS: CHICAGO MILITARY HS-Military & Service Leadership",
      "MILITARY LEADERSHIP HS: MILITARY LEADERSHIP HS-Military & Service Leadership",
      "DYETT ARTS HS: DYETT ARTS HS-Significantly Modified Curriculum w/ Moderate Supports",
      "SULLIVAN HS: SULLIVAN HS-The English Learner Academy",
      "SULLIVAN HS: SULLIVAN HS-General Education",
      "SULLIVAN HS: SULLIVAN HS-Significantly Modified Curriculum w/ Moderate Supports",
      "TAFT HS: TAFT HS-General Education",
      "TAFT HS: TAFT HS-Significantly Modified Curriculum w/Intensive Supports",
      "TILDEN HS: TILDEN HS-General Education",
      "TILDEN HS: TILDEN HS-Significantly Modified Curriculum w/ Moderate Supports",
      "JUAREZ HS: JUAREZ HS-General Education",
      "JULIAN HS: JULIAN HS-Significantly Modified Curriculum w/ Moderate Support",
      "JULIAN HS: JULIAN HS-Fine & Performing Arts",
      "JULIAN HS: JULIAN HS-General Education",
      "MANLEY HS: MANLEY HS-General Education",
      "MARSHALL HS: MARSHALL HS-General Education",
      "CLEMENTE HS: CLEMENTE HS-Significantly Modified Curriculum w/ Moderate Supports",
      "CORLISS HS: CORLISS HS-Significantly Modified Curriculum w/ Moderate Supports",
      "CORLISS HS: CORLISS HS-Early College STEM",
      "RICHARDS HS: RICHARDS HS-General Education",
      "NORTH-GRAND HS: NORTH-GRAND HS-Early College STEAM",
      "NORTH-GRAND HS: NORTH-GRAND HS-Significantly Modified Curriculum w/Intensive Supports",
      "NORTH-GRAND HS: NORTH-GRAND HS-Significantly Modified Curriculum w/Moderate Supports",
      "AMUNDSEN HS: AMUNDSEN HS-General Education/Grow Community",
      "AMUNDSEN HS: AMUNDSEN HS-Significantly Modified Curriculum w/ Moderate Supports",
      "LINCOLN PARK HS: LINCOLN PARK HS-Theatre",
      "LINCOLN PARK HS: LINCOLN PARK HS-Instrumental Music",
      "LINCOLN PARK HS: LINCOLN PARK HS-Significantly Modified Curriculum w/ Moderate Supports",
      "LINCOLN PARK HS: LINCOLN PARK HS-Visual Arts",
      "LINCOLN PARK HS: LINCOLN PARK HS-Vocal Music",
      "LAKE VIEW HS: LAKE VIEW HS-Grow Community - Early College STEM",
      "MATHER HS: MATHER HS-General Education",
      "MORGAN PARK HS: MORGAN PARK HS-Significantly Modified Curriculum w/Moderate Supports",
      "PHILLIPS HS: PHILLIPS HS-General Education",
      "KENWOOD HS: KENWOOD HS-Significantly Modified Curriculum w/ Moderate Supports",
      "ROOSEVELT HS: ROOSEVELT HS-General Education",
      "ROOSEVELT HS: ROOSEVELT HS-Dual Language",
      "ROOSEVELT HS: ROOSEVELT HS-Significantly Modified Curriculum w/ Moderate Supports",
      "SCHURZ HS: SCHURZ HS-Dual Language",
      "SCHURZ HS: SCHURZ HS-General Education",
      "SCHURZ HS: SCHURZ HS-Significantly Modified Curriculum w/ Moderate Supports",
      "SENN HS: SENN HS-Dance",
      "SENN HS: SENN HS-Music",
      "SENN HS: SENN HS-Theatre",
      "SENN HS: SENN HS-Visual Arts",
      "WASHINGTON HS: WASHINGTON HS-Significantly Modified Curriculum w/ Moderate Supports",
      "WELLS HS: WELLS HS-Fine & Performing Arts",
      "WELLS HS: WELLS HS-General Education",
      "HUBBARD HS: HUBBARD HS-General Education",
      "BOGAN HS: BOGAN HS-Significantly Modified Curriculum w/ Moderate Supports",
      "FARRAGUT HS: FARRAGUT HS-General Education",
      "FARRAGUT HS: FARRAGUT HS-Significantly Modified Curriculum w/ Moderate Supports",
      "FENGER HS: FENGER HS-General Education",
      "FOREMAN HS: FOREMAN HS-General Education",
      "FOREMAN HS: FOREMAN HS-Significantly Modified Curriculum w/ Moderate Supports",
      "GAGE PARK HS: GAGE PARK HS-General Education",
      "GAGE PARK HS: GAGE PARK HS-Significantly Modified Curriculum w/ Moderate Supports",
      "HARLAN HS: HARLAN HS-General Education",
      "HARLAN HS: HARLAN HS-Significantly Modified Curriculum w/ Intensive Supports",
      "HIRSCH HS: HIRSCH HS-General Education",
      "HYDE PARK HS: HYDE PARK HS-Significantly Modified Curriculum w/ Moderate Supports",
      "KELLY HS: KELLY HS-Significantly Modified Curriculum w/ Moderate Supports",
      "KELVYN PARK HS: KELVYN PARK HS-Open Enrollment",
      "KELVYN PARK HS: KELVYN PARK HS-Fine & Performing Arts",
      "KELVYN PARK HS: KELVYN PARK HS-General Education",
      "KENNEDY HS: KENNEDY HS-General Education",
      "KENNEDY HS: KENNEDY HS-Significantly Modified Curriculum w/ Moderate Supports",
      "OGDEN HS: OGDEN HS-Deaf/Hard of Hearing",
      "ENGLEWOOD STEM HS: ENGLEWOOD STEM HS-Significantly Modified Curriculum w/ Moderate Supports",
      "ENGLEWOOD STEM HS: ENGLEWOOD STEM HS-Early College STEM",
      "BACK OF THE YARDS HS: BACK OF THE YARDS HS-Dual Language",
      "BACK OF THE YARDS HS: BACK OF THE YARDS HS-General Education",
      "SOLORIO HS: SOLORIO HS-General Education",
      "SOLORIO HS: SOLORIO HS-Significantly Modified Curriculum w/ Intensive Supports",
      "DOUGLASS HS: DOUGLASS HS-General Education",
      "SPRY HS: SPRY HS-Three-Year; Year-Round High School",
      "ORR HS: ORR HS-General Education",
      "NORTHSIDE PREP HS: NORTHSIDE PREP HS-Significantly Modified Curriculum w/Intensive Supports",
      "KING HS: KING HS-Significantly Modified Curriculum w/ Intensive Supports",
      "KING HS: KING HS-Significantly Modified Curriculum w/ Moderate Supports",
      "LANE TECH HS: LANE TECH HS-Significantly Modified Curriculum w/ Intensive Supports",
      "LANE TECH HS: LANE TECH HS-Significantly Modified Curriculum w/ Moderate Supports",
      "HANCOCK HS: HANCOCK HS-Significantly Modified Curriculum w/ Moderate Supports",
      "WESTINGHOUSE HS: WESTINGHOUSE HS-Significantly Modified Curriculum w/ Intensive Supports",
      "WESTINGHOUSE HS: WESTINGHOUSE HS-Significantly Modified Curriculum w/ Moderate Supports",
      "YOUNG HS: YOUNG HS-Deaf/Hard of Hearing",
      "YOUNG HS: YOUNG HS-Significantly Modified Curriculum w/ Intensive Supports",
      "YOUNG HS: YOUNG HS-Significantly Modified Curriculum w/ Moderate Supports",
      "BROOKS HS: BROOKS HS-Significantly Modified Curriculum w/ Intensive Supports",
      "BROOKS HS: BROOKS HS-Significantly Modified Curriculum w/ Moderate Supports",
      "PAYTON HS: PAYTON HS-Significantly Modified Curriculum w/ Moderate Supports",
      "PAYTON HS: PAYTON HS-Visual Impairment",
      "JONES HS: JONES HS-Significantly Modified Curriculum w/ Intensive Supports",
      "JONES HS: JONES HS-Significantly Modified Curriculum w/ Moderate Supports",
      "LINDBLOM HS: LINDBLOM HS-Significantly Modified Curriculum w/ Intensive Supports",
      "LINDBLOM HS: LINDBLOM HS-Significantly Modified Curriculum w/ Moderate Supports",
      "SOUTH SHORE INTL HS: SOUTH SHORE INTL HS-Significantly Modified Curriculum w/ Moderate Supports",
      "BOWEN HS: BOWEN HS-General Education",
      "BOWEN HS: BOWEN HS-Significantly Modified Curriculum w/ Moderate Supports",
      "RABY HS: RABY HS-Significantly Modified Curriculum w/ Moderate Supports",
      "CHICAGO ACADEMY HS: CHICAGO ACADEMY HS-General Education",
      "WORLD LANGUAGE HS: WORLD LANGUAGE HS-General Education",
      "MULTICULTURAL ARTS HS: MULTICULTURAL ARTS HS-Fine & Performing Arts",
      "SOCIAL JUSTICE HS: SOCIAL JUSTICE HS-General Education",
      "BRONZEVILLE HS: BRONZEVILLE HS-General Education",
      "BRONZEVILLE HS: BRONZEVILLE HS-Significantly Modified Curriculum w/ Moderate Supports",
      "ALCOTT HS: ALCOTT HS-General Education",
      "UPLIFT HS: UPLIFT HS-Early College STEAM",
      "UPLIFT HS: UPLIFT HS-Significantly Modified Curriculum w/ Intensive Supports",
      "UPLIFT HS: UPLIFT HS-Significantly Modified Curriculum w/ Moderate Supports",
      "COLLINS STEAM HS: COLLINS STEAM HS-Fine & Performing Arts",
      "COLLINS STEAM HS: COLLINS STEAM HS-General Education",
      "COLLINS STEAM HS: COLLINS STEAM HS-STEAM",
      "AUSTIN CCA HS: AUSTIN CCA HS-General Education",
      "NORTHSIDE LEARNING HS: NORTHSIDE LEARNING HS-Significantly Modified Curriculum w/ Moderate Supports",
      "VAUGHN HS: VAUGHN HS-Significantly Modified Curriculum w/ Moderate Supports"
    ],
    "desc": "<ul><li>GPA: N/A</li></ul>",
    "fn": accept(everyone)
  },
  "c8d9b77e2fc468dca61148b9cf487317": {
    "id": "c8d9b77e2fc468dca61148b9cf487317",
    "programs": [
      "CHICAGO ARTS HS: CHICAGO ARTS HS-Brass & Woodwinds",
      "CHICAGO ARTS HS: CHICAGO ARTS HS-Creative Writing",
      "CHICAGO ARTS HS: CHICAGO ARTS HS-Dance",
      "CHICAGO ARTS HS: CHICAGO ARTS HS-Guitar",
      "CHICAGO ARTS HS: CHICAGO ARTS HS-Musical Theatre",
      "CHICAGO ARTS HS: CHICAGO ARTS HS-Percussion",
      "CHICAGO ARTS HS: CHICAGO ARTS HS-Piano",
      "CHICAGO ARTS HS: CHICAGO ARTS HS-Strings",
      "CHICAGO ARTS HS: CHICAGO ARTS HS-Theatre",
      "CHICAGO ARTS HS: CHICAGO ARTS HS-Visual Arts",
      "CHICAGO ARTS HS: CHICAGO ARTS HS-Vocal Music",
      "CHICAGO VOCATIONAL HS: CHICAGO VOCATIONAL HS-Health Science",
      "VON STEUBEN HS: VON STEUBEN HS-Scholars",
      "CURIE HS: CURIE HS-Pre-Engineering",
      "SULLIVAN HS: SULLIVAN HS-Health Science",
      "JUAREZ HS: JUAREZ HS-Health Science",
      "JULIAN HS: JULIAN HS-Health Science",
      "CLEMENTE HS: CLEMENTE HS-Health Science",
      "NORTH-GRAND HS: NORTH-GRAND HS-Health Science",
      "NORTH-GRAND HS: NORTH-GRAND HS-Pre-Engineering",
      "MATHER HS: MATHER HS-Pre-Engineering",
      "MATHER HS: MATHER HS-Pre-Law",
      "ROOSEVELT HS: ROOSEVELT HS-Health Science",
      "SCHURZ HS: SCHURZ HS-Health Science",
      "SCHURZ HS: SCHURZ HS-Pre-Engineering",
      "WELLS HS: WELLS HS-Pre-Law",
      "FARRAGUT HS: FARRAGUT HS-Pre-Law",
      "FOREMAN HS: FOREMAN HS-Pre-Engineering",
      "GAGE PARK HS: GAGE PARK HS-Health Science",
      "KELVYN PARK HS: KELVYN PARK HS-Health Science",
      "SOLORIO HS: SOLORIO HS-Scholars",
      "SOLORIO HS: SOLORIO HS-Pre-Engineering",
      "KING HS: KING HS-Pre-Engineering",
      "SOUTH SHORE INTL HS: SOUTH SHORE INTL HS-Health Science",
      "BOWEN HS: BOWEN HS-Pre-Engineering",
      "WORLD LANGUAGE HS: WORLD LANGUAGE HS-Health Science",
      "WILLIAMS HS: WILLIAMS HS-Health Science",
      "MULTICULTURAL ARTS HS: MULTICULTURAL ARTS HS-Health Science",
      "SOCIAL JUSTICE HS: SOCIAL JUSTICE HS-Health Science",
      "ALCOTT HS: ALCOTT HS-Pre-Engineering"
    ],
    "desc": "<ul><li><strong>Priority: </strong>General</li></ul>",
    "fn": lottery(GENERAL_LOTTERY_STAGE)
  },
  "c0eb9bf2387879b885b2af70335bbaae": {
    "id": "c0eb9bf2387879b885b2af70335bbaae",
    "programs": [
      "CHICAGO VOCATIONAL HS: CHICAGO VOCATIONAL HS-Agriculture & Horticulture",
      "CHICAGO VOCATIONAL HS: CHICAGO VOCATIONAL HS-Carpentry",
      "CHICAGO VOCATIONAL HS: CHICAGO VOCATIONAL HS-Cosmetology",
      "CHICAGO VOCATIONAL HS: CHICAGO VOCATIONAL HS-Culinary & Hospitality Management",
      "CHICAGO VOCATIONAL HS: CHICAGO VOCATIONAL HS-Diesel Technology",
      "CHICAGO VOCATIONAL HS: CHICAGO VOCATIONAL HS-Health Science",
      "CHICAGO VOCATIONAL HS: CHICAGO VOCATIONAL HS-Early College STEM",
      "DUNBAR HS: DUNBAR HS-Career Academy",
      "PROSSER HS: PROSSER HS-International Baccalaureate (IB)",
      "CHICAGO TECH HS: CHICAGO TECH HS-Game Programming",
      "CLARK HS: CLARK HS-International Baccalaureate (IB)",
      "CLARK HS: CLARK HS-Magnet - Early College STEM",
      "DISNEY II HS: DISNEY II HS-Magnet - Fine & Performing Arts, Technology",
      "CRANE MEDICAL HS: CRANE MEDICAL HS-Magnet - Early College STEM",
      "VON STEUBEN HS: VON STEUBEN HS-Magnet - STEM College Prep",
      "VON STEUBEN HS: VON STEUBEN HS-Scholars",
      "CHICAGO AGRICULTURE HS: CHICAGO AGRICULTURE HS-Magnet-Agriculture & Horticulture",
      "CURIE HS: CURIE HS-Accounting",
      "CURIE HS: CURIE HS-Architecture",
      "CURIE HS: CURIE HS-Automotive Technology",
      "CURIE HS: CURIE HS-Broadcast",
      "CURIE HS: CURIE HS-Culinary & Hospitality",
      "CURIE HS: CURIE HS-Digital Media",
      "CURIE HS: CURIE HS-Teaching Academy",
      "CURIE HS: CURIE HS-International Baccalaureate (IB)",
      "CURIE HS: CURIE HS-Game Programming & Web Design",
      "CURIE HS: CURIE HS-Pre-Engineering",
      "CARVER MILITARY HS: CARVER MILITARY HS-Military & Service Leadership",
      "MILITARY LEADERSHIP HS: MILITARY LEADERSHIP HS-Military & Service Leadership",
      "HOLMES HS: HOLMES HS-Military & Service Leadership",
      "PHOENIX MILITARY HS: PHOENIX MILITARY HS-Military & Service Leadership",
      "RICKOVER MILITARY HS: RICKOVER MILITARY HS-Military & Service Leadership",
      "DYETT ARTS HS: DYETT ARTS HS-Digital Media",
      "SULLIVAN HS: SULLIVAN HS-Entrepreneurship",
      "SULLIVAN HS: SULLIVAN HS-Health Science",
      "TAFT HS: TAFT HS-International Baccalaureate (IB)",
      "TILDEN HS: TILDEN HS-Culinary & Hospitality Management",
      "JUAREZ HS: JUAREZ HS-Architecture & Construction",
      "JUAREZ HS: JUAREZ HS-Culinary & Hospitality Management",
      "JUAREZ HS: JUAREZ HS-Teaching Academy",
      "JUAREZ HS: JUAREZ HS-Health Science",
      "JUAREZ HS: JUAREZ HS-International Baccalaureate (IB)",
      "JUAREZ HS: JUAREZ HS-Game Programming & Web Design",
      "JULIAN HS: JULIAN HS-Broadcast",
      "JULIAN HS: JULIAN HS-Digital Media",
      "JULIAN HS: JULIAN HS-Entrepreneurship",
      "JULIAN HS: JULIAN HS-Health Science",
      "JULIAN HS: JULIAN HS-Game Programming",
      "MANLEY HS: MANLEY HS-Culinary & Hospitality Management",
      "MARSHALL HS: MARSHALL HS-Agriculture & Horticulture",
      "MARSHALL HS: MARSHALL HS-Culinary & Hospitality Management",
      "CLEMENTE HS: CLEMENTE HS-Broadcast",
      "CLEMENTE HS: CLEMENTE HS-Culinary & Hospitality Management",
      "CLEMENTE HS: CLEMENTE HS-Health Science",
      "CLEMENTE HS: CLEMENTE HS-International Baccalaureate (IB)",
      "RICHARDS HS: RICHARDS HS-Business & Finance-Entrepreneurship",
      "RICHARDS HS: RICHARDS HS-Culinary & Hospitality Management",
      "NORTH-GRAND HS: NORTH-GRAND HS-Culinary & Hospitality Management",
      "NORTH-GRAND HS: NORTH-GRAND HS-Health Science",
      "NORTH-GRAND HS: NORTH-GRAND HS-Pre-Engineering",
      "AMUNDSEN HS: AMUNDSEN HS-International Baccalaureate (IB)",
      "LINCOLN PARK HS: LINCOLN PARK HS-Advanced College Prep",
      "LINCOLN PARK HS: LINCOLN PARK HS-International Baccalaureate (IB) - MYP Diploma Program",
      "MATHER HS: MATHER HS-Digital Media",
      "MATHER HS: MATHER HS-Game Programming & Web Design",
      "MATHER HS: MATHER HS-Pre-Engineering",
      "MATHER HS: MATHER HS-Pre-Law",
      "MORGAN PARK HS: MORGAN PARK HS-International Baccalaureate (IB)",
      "PHILLIPS HS: PHILLIPS HS-Digital Media",
      "ROOSEVELT HS: ROOSEVELT HS-Computer Networking",
      "ROOSEVELT HS: ROOSEVELT HS-Culinary & Hospitality Management",
      "ROOSEVELT HS: ROOSEVELT HS-Teaching Academy",
      "ROOSEVELT HS: ROOSEVELT HS-Health Science",
      "ROOSEVELT HS: ROOSEVELT HS-Game Programming",
      "SCHURZ HS: SCHURZ HS-Accounting & Entrepreneurship",
      "SCHURZ HS: SCHURZ HS-Automotive Technology",
      "SCHURZ HS: SCHURZ HS-Digital Media",
      "SCHURZ HS: SCHURZ HS-Health Science",
      "SCHURZ HS: SCHURZ HS-International Baccalaureate (IB)",
      "SCHURZ HS: SCHURZ HS-Pre-Engineering",
      "SENN HS: SENN HS-International Baccalaureate (IB)",
      "STEINMETZ HS: STEINMETZ HS-Digital Media",
      "STEINMETZ HS: STEINMETZ HS-International Baccalaureate (IB)",
      "WASHINGTON HS: WASHINGTON HS-International Baccalaureate (IB)",
      "WELLS HS: WELLS HS-Pre-Law",
      "HUBBARD HS: HUBBARD HS-Game Programming",
      "HUBBARD HS: HUBBARD HS-Web Development & Design",
      "HUBBARD HS: HUBBARD HS-International Baccalaureate (IB)",
      "HUBBARD HS: HUBBARD HS-University Scholars",
      "BOGAN HS: BOGAN HS-International Baccalaureate (IB)",
      "FARRAGUT HS: FARRAGUT HS-Teaching Academy",
      "FARRAGUT HS: FARRAGUT HS-International Baccalaureate (IB)",
      "FARRAGUT HS: FARRAGUT HS-Pre-Law",
      "FOREMAN HS: FOREMAN HS-Digital Media",
      "FOREMAN HS: FOREMAN HS-Pre-Engineering",
      "GAGE PARK HS: GAGE PARK HS-Health Science",
      "HARLAN HS: HARLAN HS-Digital Media",
      "HYDE PARK HS: HYDE PARK HS-Broadcast",
      "HYDE PARK HS: HYDE PARK HS-Digital Media",
      "HYDE PARK HS: HYDE PARK HS-General Education",
      "HYDE PARK HS: HYDE PARK HS-International Baccalaureate (IB)",
      "KELLY HS: KELLY HS-Digital Media",
      "KELLY HS: KELLY HS-International Baccalaureate (IB)",
      "KELVYN PARK HS: KELVYN PARK HS-Digital Media",
      "KELVYN PARK HS: KELVYN PARK HS-Health Science",
      "KENNEDY HS: KENNEDY HS-International Baccalaureate (IB)",
      "OGDEN HS: OGDEN HS-International Baccalaureate (IB)",
      "BACK OF THE YARDS HS: BACK OF THE YARDS HS-International Baccalaureate (IB)",
      "SOLORIO HS: SOLORIO HS-Scholars",
      "SOLORIO HS: SOLORIO HS-Pre-Engineering",
      "ORR HS: ORR HS-Digital Media",
      "NORTHSIDE PREP HS: NORTHSIDE PREP HS-Selective Enrollment High School",
      "KING HS: KING HS-Pre-Engineering",
      "KING HS: KING HS-Digital Media",
      "KING HS: KING HS-Selective Enrollment High School",
      "LANE TECH HS: LANE TECH HS-Selective Enrollment High School",
      "HANCOCK HS: HANCOCK HS-Pre-Engineering",
      "HANCOCK HS: HANCOCK HS-Pre-Law",
      "HANCOCK HS: HANCOCK HS-Selective Enrollment High School",
      "WESTINGHOUSE HS: WESTINGHOUSE HS-Selective Enrollment High School",
      "YOUNG HS: YOUNG HS-Selective Enrollment High School",
      "BROOKS HS: BROOKS HS-Selective Enrollment High School",
      "PAYTON HS: PAYTON HS-Selective Enrollment High School",
      "JONES HS: JONES HS-Pre-Engineering",
      "JONES HS: JONES HS-Pre-Law",
      "JONES HS: JONES HS-Selective Enrollment High School",
      "LINDBLOM HS: LINDBLOM HS-Selective Enrollment High School",
      "SOUTH SHORE INTL HS: SOUTH SHORE INTL HS-Health Science",
      "SOUTH SHORE INTL HS: SOUTH SHORE INTL HS-Selective Enrollment High School",
      "BOWEN HS: BOWEN HS-Machine Technology",
      "BOWEN HS: BOWEN HS-Pre-Engineering",
      "RABY HS: RABY HS-Broadcast",
      "RABY HS: RABY HS-Culinary & Hospitality Management",
      "WORLD LANGUAGE HS: WORLD LANGUAGE HS-Health Science",
      "WILLIAMS HS: WILLIAMS HS-General Education",
      "WILLIAMS HS: WILLIAMS HS-Health Science",
      "MULTICULTURAL ARTS HS: MULTICULTURAL ARTS HS-Health Science",
      "SOCIAL JUSTICE HS: SOCIAL JUSTICE HS-Health Science",
      "BRONZEVILLE HS: BRONZEVILLE HS-International Baccalaureate (IB)",
      "ALCOTT HS: ALCOTT HS-Pre-Engineering",
      "UPLIFT HS: UPLIFT HS-Teaching Academy",
      "COLLINS STEAM HS: COLLINS STEAM HS-Computer Networking"
    ],
    "desc": "<ul><li>Application Requirements: High School Admissions Test (HSAT) Scores Required.</li><li>GPA: N/A</li></ul>",
    "fn": accept(everyone)
  },
  "702a390a42f3bc7983516f8524dec606": {
    "id": "702a390a42f3bc7983516f8524dec606",
    "programs": [
      "CHICAGO VOCATIONAL HS: CHICAGO VOCATIONAL HS-Agriculture & Horticulture",
      "CHICAGO VOCATIONAL HS: CHICAGO VOCATIONAL HS-Carpentry",
      "CHICAGO VOCATIONAL HS: CHICAGO VOCATIONAL HS-Cosmetology",
      "CHICAGO VOCATIONAL HS: CHICAGO VOCATIONAL HS-Culinary & Hospitality Management",
      "CHICAGO VOCATIONAL HS: CHICAGO VOCATIONAL HS-Diesel Technology",
      "CHICAGO VOCATIONAL HS: CHICAGO VOCATIONAL HS-Early College STEM",
      "DUNBAR HS: DUNBAR HS-Career Academy",
      "CHICAGO TECH HS: CHICAGO TECH HS-Game Programming",
      "CURIE HS: CURIE HS-Accounting",
      "CURIE HS: CURIE HS-Architecture",
      "CURIE HS: CURIE HS-Automotive Technology",
      "CURIE HS: CURIE HS-Broadcast",
      "CURIE HS: CURIE HS-Culinary & Hospitality",
      "CURIE HS: CURIE HS-Digital Media",
      "CURIE HS: CURIE HS-Teaching Academy",
      "CURIE HS: CURIE HS-Game Programming & Web Design",
      "DYETT ARTS HS: DYETT ARTS HS-Digital Media",
      "SULLIVAN HS: SULLIVAN HS-Entrepreneurship",
      "TILDEN HS: TILDEN HS-Culinary & Hospitality Management",
      "JUAREZ HS: JUAREZ HS-Architecture & Construction",
      "JUAREZ HS: JUAREZ HS-Culinary & Hospitality Management",
      "JUAREZ HS: JUAREZ HS-Teaching Academy",
      "JUAREZ HS: JUAREZ HS-Game Programming & Web Design",
      "JULIAN HS: JULIAN HS-Broadcast",
      "JULIAN HS: JULIAN HS-Digital Media",
      "JULIAN HS: JULIAN HS-Entrepreneurship",
      "JULIAN HS: JULIAN HS-Game Programming",
      "MANLEY HS: MANLEY HS-Culinary & Hospitality Management",
      "MARSHALL HS: MARSHALL HS-Agriculture & Horticulture",
      "MARSHALL HS: MARSHALL HS-Culinary & Hospitality Management",
      "CLEMENTE HS: CLEMENTE HS-Broadcast",
      "CLEMENTE HS: CLEMENTE HS-Culinary & Hospitality Management",
      "RICHARDS HS: RICHARDS HS-Business & Finance-Entrepreneurship",
      "RICHARDS HS: RICHARDS HS-Culinary & Hospitality Management",
      "NORTH-GRAND HS: NORTH-GRAND HS-Culinary & Hospitality Management",
      "MATHER HS: MATHER HS-Digital Media",
      "MATHER HS: MATHER HS-Game Programming & Web Design",
      "PHILLIPS HS: PHILLIPS HS-Digital Media",
      "ROOSEVELT HS: ROOSEVELT HS-Computer Networking",
      "ROOSEVELT HS: ROOSEVELT HS-Culinary & Hospitality Management",
      "ROOSEVELT HS: ROOSEVELT HS-Teaching Academy",
      "ROOSEVELT HS: ROOSEVELT HS-Game Programming",
      "SCHURZ HS: SCHURZ HS-Accounting & Entrepreneurship",
      "SCHURZ HS: SCHURZ HS-Automotive Technology",
      "SCHURZ HS: SCHURZ HS-Digital Media",
      "STEINMETZ HS: STEINMETZ HS-Digital Media",
      "HUBBARD HS: HUBBARD HS-Game Programming",
      "HUBBARD HS: HUBBARD HS-Web Development & Design",
      "FARRAGUT HS: FARRAGUT HS-Teaching Academy",
      "FOREMAN HS: FOREMAN HS-Digital Media",
      "HARLAN HS: HARLAN HS-Digital Media",
      "HYDE PARK HS: HYDE PARK HS-Broadcast",
      "HYDE PARK HS: HYDE PARK HS-Digital Media",
      "KELLY HS: KELLY HS-Digital Media",
      "KELVYN PARK HS: KELVYN PARK HS-Digital Media",
      "ORR HS: ORR HS-Digital Media",
      "KING HS: KING HS-Digital Media",
      "BOWEN HS: BOWEN HS-Machine Technology",
      "RABY HS: RABY HS-Broadcast",
      "RABY HS: RABY HS-Culinary & Hospitality Management",
      "UPLIFT HS: UPLIFT HS-Teaching Academy",
      "COLLINS STEAM HS: COLLINS STEAM HS-Computer Networking"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Students are selected by lottery within groups with preferences for students who have combined HSAT scores above the 58/48th percentile and who live within the attendance area of the school.</li><li><strong>Priority: </strong>Proximity Preference,General</li></ul>",
    "fn": lottery(
      {
      filter: ifHasGrades({hsatMath: 58, hsatRead: 48}),
      size: LotteryStageSize.LARGE
      },
      PROXIMITY_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE
    )
  },
  "329fb2bb81d7ce12a89af11cad5e29b0": {
    "id": "329fb2bb81d7ce12a89af11cad5e29b0",
    "programs": [
      "CHICAGO VOCATIONAL HS: CHICAGO VOCATIONAL HS-Deaf/Hard of Hearing",
      "CHICAGO VOCATIONAL HS: CHICAGO VOCATIONAL HS-Significantly Modified Curriculum w/ Intensive Supports",
      "CHICAGO VOCATIONAL HS: CHICAGO VOCATIONAL HS-Significantly Modified Curriculum w/ Moderate Supports",
      "DUNBAR HS: DUNBAR HS-Significantly Modified Curriculum w/ Moderate Supports",
      "PROSSER HS: PROSSER HS-Deaf/Hard of Hearing",
      "PROSSER HS: PROSSER HS-Significantly Modified Curriculum w/ Moderate Supports",
      "SIMEON HS: SIMEON HS-Significantly Modified Curriculum w/ Intensive Supports",
      "SIMEON HS: SIMEON HS-Significantly Modified Curriculum w/ Moderate Supports",
      "GOODE HS: GOODE HS-Significantly Modified Curriculum w/ Intensive Supports",
      "CLARK HS: CLARK HS-Significantly Modified Curriculum w/ Moderate Supports",
      "VON STEUBEN HS: VON STEUBEN HS-Significantly Modified Curriculum w/ Moderate Supports",
      "CHICAGO AGRICULTURE HS: CHICAGO AGRICULTURE HS-Significantly Modified Curriculum w/ Intensive Supports",
      "CHICAGO AGRICULTURE HS: CHICAGO AGRICULTURE HS-Significantly Modified Curriculum w/ Moderate Supports",
      "CURIE HS: CURIE HS-Deaf/Hard of Hearing",
      "CURIE HS: CURIE HS-Visual Impairment",
      "DYETT ARTS HS: DYETT ARTS HS-Significantly Modified Curriculum w/ Moderate Supports",
      "SULLIVAN HS: SULLIVAN HS-Significantly Modified Curriculum w/ Moderate Supports",
      "TAFT HS: TAFT HS-Significantly Modified Curriculum w/Intensive Supports",
      "TILDEN HS: TILDEN HS-Significantly Modified Curriculum w/ Moderate Supports",
      "JULIAN HS: JULIAN HS-Significantly Modified Curriculum w/ Moderate Support",
      "CLEMENTE HS: CLEMENTE HS-Significantly Modified Curriculum w/ Moderate Supports",
      "CORLISS HS: CORLISS HS-Significantly Modified Curriculum w/ Moderate Supports",
      "NORTH-GRAND HS: NORTH-GRAND HS-Significantly Modified Curriculum w/Intensive Supports",
      "NORTH-GRAND HS: NORTH-GRAND HS-Significantly Modified Curriculum w/Moderate Supports",
      "AMUNDSEN HS: AMUNDSEN HS-Significantly Modified Curriculum w/ Moderate Supports",
      "LINCOLN PARK HS: LINCOLN PARK HS-Significantly Modified Curriculum w/ Moderate Supports",
      "MORGAN PARK HS: MORGAN PARK HS-Significantly Modified Curriculum w/Moderate Supports",
      "KENWOOD HS: KENWOOD HS-Significantly Modified Curriculum w/ Moderate Supports",
      "ROOSEVELT HS: ROOSEVELT HS-Significantly Modified Curriculum w/ Moderate Supports",
      "SCHURZ HS: SCHURZ HS-Significantly Modified Curriculum w/ Moderate Supports",
      "WASHINGTON HS: WASHINGTON HS-Significantly Modified Curriculum w/ Moderate Supports",
      "BOGAN HS: BOGAN HS-Significantly Modified Curriculum w/ Moderate Supports",
      "FARRAGUT HS: FARRAGUT HS-Significantly Modified Curriculum w/ Moderate Supports",
      "FOREMAN HS: FOREMAN HS-Significantly Modified Curriculum w/ Moderate Supports",
      "GAGE PARK HS: GAGE PARK HS-Significantly Modified Curriculum w/ Moderate Supports",
      "HARLAN HS: HARLAN HS-Significantly Modified Curriculum w/ Intensive Supports",
      "HYDE PARK HS: HYDE PARK HS-Significantly Modified Curriculum w/ Moderate Supports",
      "KELLY HS: KELLY HS-Significantly Modified Curriculum w/ Moderate Supports",
      "KENNEDY HS: KENNEDY HS-Significantly Modified Curriculum w/ Moderate Supports",
      "OGDEN HS: OGDEN HS-Deaf/Hard of Hearing",
      "ENGLEWOOD STEM HS: ENGLEWOOD STEM HS-Significantly Modified Curriculum w/ Moderate Supports",
      "SOLORIO HS: SOLORIO HS-Significantly Modified Curriculum w/ Intensive Supports",
      "NORTHSIDE PREP HS: NORTHSIDE PREP HS-Significantly Modified Curriculum w/Intensive Supports",
      "KING HS: KING HS-Significantly Modified Curriculum w/ Intensive Supports",
      "KING HS: KING HS-Significantly Modified Curriculum w/ Moderate Supports",
      "LANE TECH HS: LANE TECH HS-Significantly Modified Curriculum w/ Intensive Supports",
      "LANE TECH HS: LANE TECH HS-Significantly Modified Curriculum w/ Moderate Supports",
      "HANCOCK HS: HANCOCK HS-Significantly Modified Curriculum w/ Moderate Supports",
      "WESTINGHOUSE HS: WESTINGHOUSE HS-Significantly Modified Curriculum w/ Intensive Supports",
      "WESTINGHOUSE HS: WESTINGHOUSE HS-Significantly Modified Curriculum w/ Moderate Supports",
      "YOUNG HS: YOUNG HS-Deaf/Hard of Hearing",
      "YOUNG HS: YOUNG HS-Significantly Modified Curriculum w/ Intensive Supports",
      "YOUNG HS: YOUNG HS-Significantly Modified Curriculum w/ Moderate Supports",
      "BROOKS HS: BROOKS HS-Significantly Modified Curriculum w/ Intensive Supports",
      "BROOKS HS: BROOKS HS-Significantly Modified Curriculum w/ Moderate Supports",
      "PAYTON HS: PAYTON HS-Significantly Modified Curriculum w/ Moderate Supports",
      "PAYTON HS: PAYTON HS-Visual Impairment",
      "JONES HS: JONES HS-Significantly Modified Curriculum w/ Intensive Supports",
      "JONES HS: JONES HS-Significantly Modified Curriculum w/ Moderate Supports",
      "LINDBLOM HS: LINDBLOM HS-Significantly Modified Curriculum w/ Intensive Supports",
      "LINDBLOM HS: LINDBLOM HS-Significantly Modified Curriculum w/ Moderate Supports",
      "SOUTH SHORE INTL HS: SOUTH SHORE INTL HS-Significantly Modified Curriculum w/ Moderate Supports",
      "BOWEN HS: BOWEN HS-Significantly Modified Curriculum w/ Moderate Supports",
      "RABY HS: RABY HS-Significantly Modified Curriculum w/ Moderate Supports",
      "BRONZEVILLE HS: BRONZEVILLE HS-Significantly Modified Curriculum w/ Moderate Supports",
      "UPLIFT HS: UPLIFT HS-Significantly Modified Curriculum w/ Intensive Supports",
      "UPLIFT HS: UPLIFT HS-Significantly Modified Curriculum w/ Moderate Supports",
      "COLLINS STEAM HS: COLLINS STEAM HS-Fine & Performing Arts"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Applicants are selected by random computerized lottery. If the program has priority groups, students in those groups are selected in the order listed.</li><li><strong>Priority: </strong>Proximity Preference,General</li></ul>",
    "fn": lottery(
      PROXIMITY_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE
    )
  },
  "2594b05d883ddedeb324e15aeef48405": {
    "id": "2594b05d883ddedeb324e15aeef48405",
    "programs": [
      "CHICAGO VOCATIONAL HS: CHICAGO VOCATIONAL HS-General Education",
      "TILDEN HS: TILDEN HS-General Education",
      "JUAREZ HS: JUAREZ HS-General Education",
      "JULIAN HS: JULIAN HS-General Education",
      "MANLEY HS: MANLEY HS-General Education",
      "MARSHALL HS: MARSHALL HS-General Education",
      "CLEMENTE HS: CLEMENTE HS-General Education",
      "CORLISS HS: CORLISS HS-Early College STEM",
      "RICHARDS HS: RICHARDS HS-General Education",
      "PHILLIPS HS: PHILLIPS HS-General Education",
      "ROOSEVELT HS: ROOSEVELT HS-General Education",
      "SCHURZ HS: SCHURZ HS-General Education",
      "WELLS HS: WELLS HS-General Education",
      "FENGER HS: FENGER HS-General Education",
      "FOREMAN HS: FOREMAN HS-General Education",
      "GAGE PARK HS: GAGE PARK HS-General Education",
      "HARLAN HS: HARLAN HS-General Education",
      "HIRSCH HS: HIRSCH HS-General Education",
      "KELLY HS: KELLY HS-General Education",
      "KELVYN PARK HS: KELVYN PARK HS-General Education",
      "KENNEDY HS: KENNEDY HS-General Education",
      "ENGLEWOOD STEM HS: ENGLEWOOD STEM HS-Early College STEM",
      "SPRY HS: SPRY HS-Three-Year; Year-Round High School",
      "ORR HS: ORR HS-General Education",
      "BOWEN HS: BOWEN HS-General Education",
      "COLLINS STEAM HS: COLLINS STEAM HS-General Education",
      "COLLINS STEAM HS: COLLINS STEAM HS-STEAM",
      "AUSTIN CCA HS: AUSTIN CCA HS-General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Applicants are selected by random computerized lottery. If the program has priority groups, students in those groups are selected in the order listed.</li><li><strong>Priority: </strong>Sibling Preference,Staff Priority,General</li></ul>",
    "fn": lottery(
      SIBLING_LOTTERY_STAGE,
      STAFF_PREFERENCE_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE
    )
  },
  "2889ee097dbf3b99d5b54837c2409e38": {
    "id": "2889ee097dbf3b99d5b54837c2409e38",
    "programs": [
      "PROSSER HS: PROSSER HS-Career Academy",
      "SIMEON HS: SIMEON HS-Career Academy",
      "TAFT HS: TAFT HS-Academic Center",
      "CLEMENTE HS: CLEMENTE HS-General Education",
      "MORGAN PARK HS: MORGAN PARK HS-Academic Center",
      "MORGAN PARK HS: MORGAN PARK HS-General Education",
      "KENWOOD HS: KENWOOD HS-Academic Center",
      "BOGAN HS: BOGAN HS-General Education",
      "LANE TECH HS: LANE TECH HS-Academic Center",
      "YOUNG HS: YOUNG HS-Academic Center",
      "BROOKS HS: BROOKS HS-Academic Center",
      "LINDBLOM HS: LINDBLOM HS-Academic Center"
    ],
    "desc": "<ul><li>GPA: 2.50</li></ul>",
    "fn": accept(ifHasGrades({gpa:2.5}))
  },
  "0d074429aa6f81b7360583e1248ad4c0": {
    "id": "0d074429aa6f81b7360583e1248ad4c0",
    "programs": [
      "PROSSER HS: PROSSER HS-Career Academy",
      "DOUGLASS HS: DOUGLASS HS-General Education",
      "CHICAGO ACADEMY HS: CHICAGO ACADEMY HS-General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Applicants are selected by random computerized lottery. If the program has priority groups, students in those groups are selected in the order listed.</li><li><strong>Priority: </strong>Sibling Preference,Staff Priority,Proximity Preference,General</li></ul>",
    "fn": lottery(
      SIBLING_LOTTERY_STAGE,
      STAFF_PREFERENCE_LOTTERY_STAGE,
      PROXIMITY_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE
    )
  },
  "c4b1d03d4d20b067f27e232d87f0c7b4": {
    "id": "c4b1d03d4d20b067f27e232d87f0c7b4",
    "programs": [
      "PROSSER HS: PROSSER HS-International Baccalaureate (IB)",
      "CLARK HS: CLARK HS-International Baccalaureate (IB)",
      "TAFT HS: TAFT HS-International Baccalaureate (IB)",
      "JUAREZ HS: JUAREZ HS-International Baccalaureate (IB)",
      "LINCOLN PARK HS: LINCOLN PARK HS-International Baccalaureate (IB) - MYP Diploma Program",
      "MORGAN PARK HS: MORGAN PARK HS-International Baccalaureate (IB)",
      "SCHURZ HS: SCHURZ HS-International Baccalaureate (IB)",
      "HUBBARD HS: HUBBARD HS-International Baccalaureate (IB)",
      "BOGAN HS: BOGAN HS-International Baccalaureate (IB)",
      "KELLY HS: KELLY HS-International Baccalaureate (IB)",
      "KENNEDY HS: KENNEDY HS-International Baccalaureate (IB)",
      "OGDEN HS: OGDEN HS-International Baccalaureate (IB)",
      "BACK OF THE YARDS HS: BACK OF THE YARDS HS-International Baccalaureate (IB)",
      "BRONZEVILLE HS: BRONZEVILLE HS-International Baccalaureate (IB)"
    ],
    "desc": "<ul><li><strong>Priority: </strong>General</li><li><strong>Note: </strong>International Baccalaureate (IB) is an inquiry-based, concept-driven framework that aims to develop self-directed thinkers and reflective problem solvers. Students enrolled in the IB Program may receive college credit for their high school courses. All students applying to this program must take the CPS HSAT. </li></ul>",
    "fn": ibPointSystem
  },
  "6c5b02ca81e7440ce0e1561b14f7a41d": {
    "id": "6c5b02ca81e7440ce0e1561b14f7a41d",
    "programs": [
      "SIMEON HS: SIMEON HS-Career Academy",
      "CURIE HS: CURIE HS-Magnet - Fine & Performing Arts",
      "FARRAGUT HS: FARRAGUT HS-General Education",
      "BRONZEVILLE HS: BRONZEVILLE HS-General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Applicants are selected by random computerized lottery. If the program has priority groups, students in those groups are selected in the order listed.</li><li><strong>Priority: </strong>General</li></ul>",
    "fn": lottery(
      GENERAL_LOTTERY_STAGE
    )
  },
  "546269f1d3462c8fb3fd259fef46ba67": {
    "id": "546269f1d3462c8fb3fd259fef46ba67",
    "programs": [
      "NOBLE - NOBLE HS: NOBLE - NOBLE HS-General Education",
      "NOBLE - GOLDER HS: NOBLE - GOLDER HS-General Education",
      "NOBLE - RAUNER HS: NOBLE - RAUNER HS-General Education",
      "NOBLE - PRITZKER HS: NOBLE - PRITZKER HS-General Education",
      "NOBLE - ROWE CLARK HS: NOBLE - ROWE CLARK HS-STEM",
      "NLCP - CHRISTIANA HS: NLCP - CHRISTIANA HS-General Education",
      "NLCP - COLLINS HS: NLCP - COLLINS HS-General Education",
      "NOBLE - JOHNSON HS: NOBLE - JOHNSON HS-General Education",
      "NOBLE - MUCHIN HS: NOBLE - MUCHIN HS-General Education",
      "PERSPECTIVES - TECH HS: PERSPECTIVES - TECH HS-STEM",
      "PERSPECTIVES - JOSLIN HS: PERSPECTIVES - JOSLIN HS-General Education",
      "CHICAGO MATH & SCIENCE HS: CHICAGO MATH & SCIENCE HS-General Education",
      "INSTITUTO - HEALTH: INSTITUTO - HEALTH-Health Sciences",
      "INSTITUTO - HEALTH: INSTITUTO - HEALTH-General Education",
      "NOBLE - DRW HS: NOBLE - DRW HS-General Education",
      "LEGAL PREP HS: LEGAL PREP HS-Law & Public Safety",
      "PERSPECTIVES - MATH & SCI HS: PERSPECTIVES - MATH & SCI HS-STEM",
      "URBAN PREP HS: URBAN PREP HS-General Education",
      "NOBLE - ACADEMY HS: NOBLE - ACADEMY HS-General Education",
      "CHICAGO COLLEGIATE: CHICAGO COLLEGIATE-General Education",
      "INTRINSIC HS: INTRINSIC HS-General Education",
      "NOBLE - BUTLER HS: NOBLE - BUTLER HS-General Education",
      "NOBLE - BAKER HS: NOBLE - BAKER HS-General Education",
      "ART IN MOTION: ART IN MOTION-Fine & Performing Arts",
      "NOBLE - MANSUETO HS: NOBLE - MANSUETO HS-International Baccalaureate (IB)",
      "CHICAGO TECH HS: CHICAGO TECH HS-STEM"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Applicants are selected by random computerized lottery. If the program has priority groups, students in those groups are selected in the order listed.</li><li><strong>Priority: </strong>Sibling Preference,General</li></ul>",
    "fn": lottery(
      SIBLING_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE
    )
  },
  "9046201b72e1061f903db4253a64721d": {
    "id": "9046201b72e1061f903db4253a64721d",
    "programs": [
      "NOBLE - COMER: NOBLE - COMER-General Education",
      "NOBLE - UIC HS: NOBLE - UIC HS-General Education",
      "NOBLE - BULLS HS: NOBLE - BULLS HS-General Education",
      "U OF C - WOODLAWN HS: U OF C - WOODLAWN HS-General Education",
      "NOBLE - ITW SPEER HS: NOBLE - ITW SPEER HS-STEM"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Applicants are selected by random computerized lottery. If the program has priority groups, students in those groups are selected in the order listed.</li><li><strong>Priority: </strong>Sibling Preference,Overlay Preference,General</li></ul>",
    "fn": lottery(
      SIBLING_LOTTERY_STAGE,
      PROXIMITY_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE
    )
  },
  "0e77c0ca55fbe87d41fae8de5e8ede5f": {
    "id": "0e77c0ca55fbe87d41fae8de5e8ede5f",
    "programs": [
      "CICS - ELLISON HS: CICS - ELLISON HS-General Education",
      "CICS - NORTHTOWN HS: CICS - NORTHTOWN HS-General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Applicants are selected by random computerized lottery. If the program has priority groups, students in those groups are selected in the order listed.</li><li><strong>Priority: </strong>Sibling Preference,Elementary Preference,Overlay Preference,General</li><li><strong>Note: </strong>Elementary Preference School(s): CICS - AVALON/SOUTH SHORE, CICS - BASIL, CICS - BUCKTOWN, CICS - IRVING PARK, CICS - LONGWOOD, CICS - PRAIRIE, CICS - WASHINGTON PARK, CICS - WEST BELDEN, CICS - WRIGHTWOOD</li></ul>",
    "fn": lottery(
      SIBLING_LOTTERY_STAGE,
      {
      filter: ifStudentAttendsOneOf(
        ...CICS_ES_PROGRAMS
      ),
      size: LotteryStageSize.LARGE},
      PROXIMITY_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE
    )
  },
  "1e5c5f905bebfdd173606b25053a7059": {
    "id": "1e5c5f905bebfdd173606b25053a7059",
    "programs": [
      "PERSPECTIVES - LEADERSHIP HS: PERSPECTIVES - LEADERSHIP HS-General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Applicants are selected by random computerized lottery. If the program has priority groups, students in those groups are selected in the order listed.</li><li><strong>Priority: </strong>Sibling Preference,Elementary Preference,General</li><li><strong>Note: </strong>Elementary Preference School(s): PERSPECTIVES - JOSLIN HS, PERSPECTIVES - MATH & SCI HS, PERSPECTIVES - TECH HS</li></ul>",
    "fn": lottery(
      SIBLING_LOTTERY_STAGE,
      {
        filter: ifStudentAttendsOneOf(
          PERSPECTIVES_MS_PROGRAM
        ),
        size:LotteryStageSize.LARGE
      },
      GENERAL_LOTTERY_STAGE
    )
  },
  "93f23ebc2d48abb9c5813ebac9fb0da4": {
    "id": "93f23ebc2d48abb9c5813ebac9fb0da4",
    "programs": [
      "CICS - LONGWOOD: CICS - LONGWOOD-General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Applicants are selected by random computerized lottery. If the program has priority groups, students in those groups are selected in the order listed.</li><li><strong>Priority: </strong>Sibling Preference,Elementary Preference,General</li><li><strong>Note: </strong>Elementary Preference School(s): CICS - AVALON/SOUTH SHORE, CICS - BASIL, CICS - BUCKTOWN, CICS - IRVING PARK, CICS - PRAIRIE, CICS - WASHINGTON PARK, CICS - WEST BELDEN, CICS - WRIGHTWOOD</li></ul>",
    "fn": lottery(
      SIBLING_LOTTERY_STAGE,
      {
        filter: ifStudentAttendsOneOf(
          ...CICS_ES_PROGRAMS
        ),
        size:LotteryStageSize.LARGE
      },
      GENERAL_LOTTERY_STAGE
    )
  },
  "e83c6e1fbb6d6c3bb55dde8569781d58": {
    "id": "e83c6e1fbb6d6c3bb55dde8569781d58",
    "programs": [
      "NOBLE - HANSBERRY HS: NOBLE - HANSBERRY HS-International Baccalaureate (IB)"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Applicants are selected by random computerized lottery. If the program has priority groups, students in those groups are selected in the order listed.</li><li><strong>Priority: </strong>Sibling Preference,General</li><li><strong>Note: </strong>International Baccalaureate (IB) is an inquiry-based, concept-driven framework that aims to develop self-directed thinkers and reflective problem solvers. Students enrolled in the IB Program may receive college credit for their high school courses. Applicants are selected by a random computerized lottery. This program selects students based on the \"Queue Priority\" groups listed on the right. Students in those groups are selected in the order listed. </li></ul>",
    "fn": ibPointSystem
  },
  "7b25b312f4b87c79c4b4f5f521ad7682": {
    "id": "7b25b312f4b87c79c4b4f5f521ad7682",
    "programs": [
      "ACERO - GARCIA HS: ACERO - GARCIA HS-STEM",
      "ACERO - SOTO HS: ACERO - SOTO HS-General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Applicants are selected by random computerized lottery. If the program has priority groups, students in those groups are selected in the order listed.</li><li><strong>Priority: </strong>Sibling Preference,Elementary Preference,General</li><li><strong>Note: </strong>Elementary Preference School(s): ACERO - BRIGHTON PARK, ACERO - CLEMENTE, ACERO - DE LA CRUZ, ACERO - IDAR, ACERO - MARQUEZ, ACERO - PAZ, ACERO - TORRES, ACERO - ZIZUMBO, CISNEROS, DE LAS CASAS, FUENTES, SANTIAGO, TAMAYO</li></ul>",
    "fn": lottery(
      SIBLING_LOTTERY_STAGE,
      {
        filter: ifStudentAttendsOneOf(
          ...ACERO_ES_PROGRAMS
        ),
        size:LotteryStageSize.LARGE
      },
      GENERAL_LOTTERY_STAGE
    )
  },
  "b80c258f84e0df6bdd86e69c1fed5d8f": {
    "id": "b80c258f84e0df6bdd86e69c1fed5d8f",
    "programs": [
      "GOODE HS: GOODE HS-Early College STEM",
      "TAFT HS: TAFT HS-General Education",
      "BACK OF THE YARDS HS: BACK OF THE YARDS HS-General Education",
      "ALCOTT HS: ALCOTT HS-General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Applicants are selected by random computerized lottery. If the program has priority groups, students in those groups are selected in the order listed.</li><li><strong>Priority: </strong>Sibling Preference,Staff Priority,Overlay Preference,General</li></ul>",
    "fn": lottery(
      SIBLING_LOTTERY_STAGE,
      STAFF_PREFERENCE_LOTTERY_STAGE,
      PROXIMITY_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE
    )
  },
  "2a7ba72df279fff9baf6e4179da82640": {
    "id": "2a7ba72df279fff9baf6e4179da82640",
    "programs": [
      "CLARK HS: CLARK HS-Magnet - Early College STEM"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Applicants are selected by random computerized lottery. If the program has priority groups, students in those groups are selected in the order listed.</li><li><strong>Priority: </strong>Sibling Preference,Staff Priority,Tier</li><li><strong>Note: </strong>General Education and Students with 504 plans must have an HSAT minimum combo score of 58% to be considered for the lottery. Students with IEPs and English Language Learners must have an HSAT&nbsp;minimum combo score of 48% to be considered for the lottery.&nbsp; </li></ul>",
    "fn": conditional(
      {
        filter:either(
          ifHasGrades({hsatCombined:58}),
          both(ifIEPorEL, ifHasGrades({hsatCombined:48}))),
        fn: lottery(
            SIBLING_LOTTERY_STAGE,
            STAFF_PREFERENCE_LOTTERY_STAGE,
            TIER_LOTTERY_STAGE
        )
      }
    )
  },
  "72ba93e8ba417d532392cf4fd2bfceae": {
    "id": "72ba93e8ba417d532392cf4fd2bfceae",
    "programs": [
      "DISNEY II HS: DISNEY II HS-Magnet - Fine & Performing Arts, Technology (7-8)"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Applicants are selected by random computerized lottery. If the program has priority groups, students in those groups are selected in the order listed.</li><li><strong>Priority: </strong>Sibling Preference,Staff Priority,Proximity Preference,Tier,General</li><li><strong>Note: </strong>This program provides a comprehensive general education curriculum across all core academic subjects, with a focus on Fine & Performing Arts as an enriching complement to the standard coursework. Arts teachers in Fine & Performing Arts schools work with students and other classroom teachers to provide intensive and integrated instruction in the arts. Students are exposed to various arts opportunities and environments, and have the opportunity to learn and grow in multiple art forms: dance, drama, media arts, music, and/or visual arts.\n\nTechnology Program schools thoughtfully integrate technology and digital media throughout the curriculum to ensure that students develop the skills and habits of mind that will enable them to be successful in whatever endeavors they wish to pursue. This includes enabling students to use technology and digital media to demonstrate creative thinking and construct knowledge; communicate and work collaboratively; gather, evaluate and use information; conduct research, manage projects, and solve problems, practice legal and ethical behaviors while online; and understand technology concepts, systems, and operations. </li></ul>",
    "fn": lottery(
      SIBLING_LOTTERY_STAGE,
      STAFF_PREFERENCE_LOTTERY_STAGE,
      PROXIMITY_LOTTERY_STAGE,
      TIER_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE
    )
  },
  "2f4708b6f4113a0af3d31c2470c5e842": {
    "id": "2f4708b6f4113a0af3d31c2470c5e842",
    "programs": [
      "DISNEY II HS: DISNEY II HS-Magnet - Fine & Performing Arts, Technology",
      "VON STEUBEN HS: VON STEUBEN HS-Magnet - STEM College Prep"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Applicants are selected by random computerized lottery. If the program has priority groups, students in those groups are selected in the order listed.</li><li><strong>Priority: </strong>Sibling Preference,Staff Priority,Tier</li><li><strong>Note: </strong>General Education and Students with 504 plans must have an HSAT minimum combo score of 58% to be considered for the lottery. Students with IEPs and English Language Learners must have an HSAT&nbsp;minimum combo score of 48% to be considered for the lottery. </li></ul>",
    "fn": conditional(
      {
        filter:either(
          ifHasGrades({hsatCombined:58}),
          both(ifIEPorEL, ifHasGrades({hsatCombined:48}))),
        fn: lottery(
            SIBLING_LOTTERY_STAGE,
            STAFF_PREFERENCE_LOTTERY_STAGE,
            TIER_LOTTERY_STAGE
        )
      }
    )
  },
  "80d4227640f05dca4894e759cb76257c": {
    "id": "80d4227640f05dca4894e759cb76257c",
    "programs": [
      "CRANE MEDICAL HS: CRANE MEDICAL HS-Magnet - Early College STEM"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Applicants are selected by random computerized lottery. If the program has priority groups, students in those groups are selected in the order listed.</li><li><strong>Priority: </strong>Sibling Preference,Staff Priority,Tier</li><li><strong>Note: </strong>For the rolling waitlist, General Education and students with 504 plans must have an HSAT minimum combo score of 40% to be considered for the lottery. Students with IEPs and English Language Learners must have an HSAT&nbsp;minimum combo score of 35% to be considered for the lottery.&nbsp; </li></ul>",
    "fn": conditional(
      {
        filter:either(
          ifHasGrades({hsatCombined:40}),
          both(ifIEPorEL, ifHasGrades({hsatCombined:35}))),
        fn: lottery(
            SIBLING_LOTTERY_STAGE,
            STAFF_PREFERENCE_LOTTERY_STAGE,
            TIER_LOTTERY_STAGE
        )
      }
    )
  },
  "6b7898aa4858334e028a91f56bce1e01": {
    "id": "6b7898aa4858334e028a91f56bce1e01",
    "programs": [
      "CHICAGO AGRICULTURE HS: CHICAGO AGRICULTURE HS-Magnet-Agriculture & Horticulture"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Applicants are selected by random computerized lottery. If the program has priority groups, students in those groups are selected in the order listed.</li><li><strong>Priority: </strong>Overlay Preference,Sibling Preference,Staff Priority,Tier</li><li><strong>Note: </strong>General Education and Students with 504 plans must have an HSAT minimum combo score of 58% to be considered for the lottery. Students with IEPs and English Language Learners must have an HSAT minimum combo score of 48% to be considered for the lottery.&nbsp; </li></ul>",
    "fn": conditional(
      {
        filter:either(
          ifHasGrades({hsatCombined:58}),
          both(ifIEPorEL, ifHasGrades({hsatCombined:48}))),
        fn: lottery(
            PROXIMITY_LOTTERY_STAGE,
            SIBLING_LOTTERY_STAGE,
            STAFF_PREFERENCE_LOTTERY_STAGE,
            TIER_LOTTERY_STAGE
        )
      }
    )
  },
  "4f4343e2325ebac8c86e5f566f483412": {
    "id": "4f4343e2325ebac8c86e5f566f483412",
    "programs": [
      "CURIE HS: CURIE HS-International Baccalaureate (IB)"
    ],
    "desc": "<ul><li><strong>Priority: </strong>Elementary Preference,General</li><li><strong>Note: </strong>International Baccalaureate (IB) is an inquiry-based, concept-driven framework that aims to develop self-directed thinkers and reflective problem solvers. Students enrolled in the IB Program may receive college credit for their high school courses. All students applying to this program must take the CPS HSAT. Elementary Preference School(s): EDWARDS</li></ul>",
    "fn": ibPointSystem
  },
  "de2306fa1f05b32b869c38b7248f0c9f": {
    "id": "de2306fa1f05b32b869c38b7248f0c9f",
    "programs": [
      "CHICAGO MILITARY HS: CHICAGO MILITARY HS-Military & Service Leadership"
    ],
    "desc": "<ul><li><strong>Priority: </strong>General</li><li><strong>Note: </strong>Military and Service Leadership programs offer a unique option for highly motivated students, providing an academically rigorous curriculum with a focus on leadership and citizenship. The CPS HSAT requirement for this program has been removed for the rolling waitlist period. </li></ul>",
    "fn": lottery(
      GENERAL_LOTTERY_STAGE
    )
  },
  "77ea136c26cea8229f30bf619d403a96": {
    "id": "77ea136c26cea8229f30bf619d403a96",
    "programs": [
      "CARVER MILITARY HS: CARVER MILITARY HS-Military & Service Leadership",
      "MILITARY LEADERSHIP HS: MILITARY LEADERSHIP HS-Military & Service Leadership",
      "HOLMES HS: HOLMES HS-Military & Service Leadership",
      "PHOENIX MILITARY HS: PHOENIX MILITARY HS-Military & Service Leadership"
    ],
    "desc": "<ul><li><strong>Priority: </strong>General</li><li><strong>Note: </strong>Military and Service Leadership programs offer a unique option for highly motivated students, providing an academically rigorous curriculum with a focus on leadership and citizenship. All students applying to this program must take the CPS HSAT. </li></ul>",
    "fn": lottery(
      GENERAL_LOTTERY_STAGE
    )
  },
  "e962c3d6c234cc13e56ca111aea2e9fe": {
    "id": "e962c3d6c234cc13e56ca111aea2e9fe",
    "programs": [
      "MILITARY LEADERSHIP HS: MILITARY LEADERSHIP HS-Military & Service Leadership"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Applicants are selected by random computerized lottery. If the program has priority groups, students in those groups are selected in the order listed.</li><li><strong>Priority: </strong>Sibling Preference,Staff Priority,General</li><li><strong>Note: </strong>The Service Leadership Academies are unique four-year high schools that prepare students for college and subsequent careers. Marine Leadership is the only one of these programs that is&nbsp;open to students in grades 7-8, and students who enter Marine's program in elementary school are able to continue there for high school without reapplying. Although students wear uniforms and operate in a structured environment, these Service Leadership Academies are not intended to prepare students for the military. Rather, students take part in unprecedented leadership opportunities and cocurricular activities, including college trips and citywide competitions, in a nurturing, safe, and healthy environment in which they can realize their full potential. </li></ul>",
    "fn": lottery(
      SIBLING_LOTTERY_STAGE, 
      STAFF_PREFERENCE_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE
    )
  },
  "5c40601829bf5a2488f490cb18df5910": {
    "id": "5c40601829bf5a2488f490cb18df5910",
    "programs": [
      "RICKOVER MILITARY HS: RICKOVER MILITARY HS-Military & Service Leadership"
    ],
    "desc": "<ul><li><strong>Priority: </strong>Proximity Preference,General</li><li><strong>Note: </strong>Military and Service Leadership programs offer a unique option for highly motivated students, providing an academically rigorous curriculum with a focus on leadership and citizenship. All students applying to this program must take the CPS HSAT. This program selects students based on the priority groups listed below. Students in those groups are selected in the order listed. </li></ul>",
    "fn": lottery(
      PROXIMITY_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE
    )
  },
  "4cf8b9f4858548f55aa25524797a56f0": {
    "id": "4cf8b9f4858548f55aa25524797a56f0",
    "programs": [
      "DYETT ARTS HS: DYETT ARTS HS-Band",
      "DYETT ARTS HS: DYETT ARTS HS-Choir",
      "DYETT ARTS HS: DYETT ARTS HS-Dance",
      "DYETT ARTS HS: DYETT ARTS HS-General Education",
      "DYETT ARTS HS: DYETT ARTS HS-Theatre",
      "DYETT ARTS HS: DYETT ARTS HS-Visual Arts",
      "KELLY HS: KELLY HS-General Education"
    ],
    "desc": "<ul><li>GPA: 2.00</li></ul>",
    "fn": accept(ifHasGrades({gpa:2}))
  },
  "b98ac2a76ba10c18713f224d761e1281": {
    "id": "b98ac2a76ba10c18713f224d761e1281",
    "programs": [
      "DYETT ARTS HS: DYETT ARTS HS-Band",
      "DYETT ARTS HS: DYETT ARTS HS-Choir",
      "DYETT ARTS HS: DYETT ARTS HS-Dance",
      "DYETT ARTS HS: DYETT ARTS HS-Theatre",
      "DYETT ARTS HS: DYETT ARTS HS-Visual Arts"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Applicants are selected by random computerized lottery. If the program has priority groups, students in those groups are selected in the order listed.</li><li><strong>Priority: </strong>Sibling Preference,Attendance Area,General</li></ul>",
    "fn": lottery(
      SIBLING_LOTTERY_STAGE,
      ATTENDANCE_AREA_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE
    )
  },
  "6ce306a7b08cb2f9016390d78477554b": {
    "id": "6ce306a7b08cb2f9016390d78477554b",
    "programs": [
      "DYETT ARTS HS: DYETT ARTS HS-General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Applicants are selected by random computerized lottery. If the program has priority groups, students in those groups are selected in the order listed.</li><li><strong>Priority: </strong>Sibling Preference,General</li><li><strong>Note: </strong>Students living in the attendance area are guaranteed a seat and do not need to submit an application. All students living outside the attendance area must submit an application. Students who live outside of the school's attendance boundary are randomly selected by computerized lottery. Those students with the minimum GPA of 2.0 or higher are eligible to be selected.&nbsp; </li></ul>",
    "fn": conditional(
      {
        filter:ifInAttendBound,
        fn:accept(everyone)
      },
      {
        filter:ifHasGrades({gpa:2}),
        fn: lottery(
            ATTENDANCE_AREA_LOTTERY_STAGE,
            SIBLING_LOTTERY_STAGE,
            GENERAL_LOTTERY_STAGE
        )
      }
    )
  },
  "50049662f3c9b3d3c779aaf42dcb1e99": {
    "id": "50049662f3c9b3d3c779aaf42dcb1e99",
    "programs": [
      "SULLIVAN HS: SULLIVAN HS-The English Learner Academy"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Applicants are selected by random computerized lottery. If the program has priority groups, students in those groups are selected in the order listed.</li><li><strong>Priority: </strong>Sibling Preference,Elementary Preference,General</li><li><strong>Note: </strong>Elementary Preference School(s): ARMSTRONG G, COURTENAY, FIELD, GALE, HAYT, JORDAN, KILMER, MCCUTCHEON, MCPHERSON, MOSAIC, WEST RIDGE</li></ul>",
    "fn": lottery(
      SIBLING_LOTTERY_STAGE,
      {
        filter: ifStudentAttendsOneOf(
          ARMSTRONG_G_ES_PROGRAM,
          COURTENAY_ES_PROGRAM,
          FIELD_ES_PROGRAM,
          GALE_ES_PROGRAM,
          HAYT_ES_PROGRAM,
          JORDAN_ES_PROGRAM,
          KILMER_ES_PROGRAM,
          MCCUTCHEON_ES_PROGRAM,
          MCPHERSON_ES_PROGRAM,
          WEST_RIDGE_ES_PROGRAM
        ),
        size: LotteryStageSize.SMALL
      },
      GENERAL_LOTTERY_STAGE
    )
  },
  "12bb72922693b89ddf83c22926b3518a": {
    "id": "12bb72922693b89ddf83c22926b3518a",
    "programs": [
      "SULLIVAN HS: SULLIVAN HS-General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Applicants are selected by random computerized lottery. If the program has priority groups, students in those groups are selected in the order listed.</li><li><strong>Priority: </strong>Sibling Preference,Staff Priority,Elementary Preference,General</li><li><strong>Note: </strong>Elementary Preference School(s): ARMSTRONG G, COURTENAY, FIELD, GALE, HAYT, JORDAN, KILMER, MCCUTCHEON, MCPHERSON, MOSAIC, WEST RIDGE</li></ul>",
    "fn": lottery(
      SIBLING_LOTTERY_STAGE,
      STAFF_PREFERENCE_LOTTERY_STAGE,
      {
        filter: ifStudentAttendsOneOf(
          ARMSTRONG_G_ES_PROGRAM,
          COURTENAY_ES_PROGRAM,
          FIELD_ES_PROGRAM,
          GALE_ES_PROGRAM,
          HAYT_ES_PROGRAM,
          JORDAN_ES_PROGRAM,
          KILMER_ES_PROGRAM,
          MCCUTCHEON_ES_PROGRAM,
          MCPHERSON_ES_PROGRAM,
          WEST_RIDGE_ES_PROGRAM
        ),
        size: LotteryStageSize.SMALL
      },
      GENERAL_LOTTERY_STAGE
    )
  },
  "33f5da9ef9af22e9b374bf16612c2525": {
    "id": "33f5da9ef9af22e9b374bf16612c2525",
    "programs": [
      "TAFT HS: TAFT HS-Academic Center",
      "MORGAN PARK HS: MORGAN PARK HS-Academic Center",
      "KENWOOD HS: KENWOOD HS-Academic Center",
      "LANE TECH HS: LANE TECH HS-Academic Center",
      "YOUNG HS: YOUNG HS-Academic Center",
      "BROOKS HS: BROOKS HS-Academic Center",
      "LINDBLOM HS: LINDBLOM HS-Academic Center"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>All selective enrollment programs use a points-based selection process. For this program, an applicant's final grades from the previous school year and composite score on the Regional Gifted exam are converted to points using a rubric. Students are selected in descending total point order, with top scorers chosen first. For entry-level (7th grade) selections only, a student's socioeconomic tier will be considered in the selection process (see the Preferences & Priorities section below for more details).</li><li><strong>Priority: </strong>Rank,Tier</li><li><strong>Note: </strong>Academic Centers, housed in high schools, offer high-achieving students the opportunity to take advanced classes. Students attending Academic Centers can continue at their current school when they enter 9th grade without needing to reapply. </li></ul>",
    "fn": sePointSystem
  },
  "31435669ceb253210db9f69a9a72c1fa": {
    "id": "31435669ceb253210db9f69a9a72c1fa",
    "programs": [
      "JULIAN HS: JULIAN HS-Fine & Performing Arts",
      "WELLS HS: WELLS HS-Fine & Performing Arts",
      "KELVYN PARK HS: KELVYN PARK HS-Fine & Performing Arts"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Applicants are selected by random computerized lottery. If the program has priority groups, students in those groups are selected in the order listed.</li><li><strong>Priority: </strong>Attendance Area,General</li></ul>",
    "fn": lottery(
      ATTENDANCE_AREA_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE
    )
  },
  "1695a83baad95dbc0cb68dce26e99200": {
    "id": "1695a83baad95dbc0cb68dce26e99200",
    "programs": [
      "CLEMENTE HS: CLEMENTE HS-International Baccalaureate (IB)"
    ],
    "desc": "<ul><li><strong>Priority: </strong>Elementary Preference,General</li><li><strong>Note: </strong>International Baccalaureate (IB) is an inquiry-based, concept-driven framework that aims to develop self-directed thinkers and reflective problem solvers. Students enrolled in the IB Program may receive college credit for their high school courses. All students applying to this program must take the CPS HSAT. Elementary Preference School(s): MOOS</li></ul>",
    "fn": ibPointSystem
  },
  "f71b7b3351027d90846656e9bd40c9e7": {
    "id": "f71b7b3351027d90846656e9bd40c9e7",
    "programs": [
      "NORTH-GRAND HS: NORTH-GRAND HS-Early College STEAM"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Applicants are selected by random computerized lottery. If the program has priority groups, students in those groups are selected in the order listed.</li><li><strong>Priority: </strong>Sibling Preference,Staff Priority,General</li><li><strong>Note: </strong>All students living <strong>outside </strong>the attendance area for this program must submit an application and must have a minimum 2.5 GPA to enter the lottery. Applicants are selected by random computerized lottery. Students are selected in the order of the &quot;Preferences & Priorities&quot; listed below.\r\n\r\nAll students living <strong>inside </strong>the attendance area for this program will receive a Guaranteed Offer to this program<em>&nbsp;</em>and do not need to apply to Early College STEAM&nbsp;@ North-Grand HS within their Choice application.&nbsp; </li></ul>",
    "fn": lottery(
      SIBLING_LOTTERY_STAGE,
      STAFF_PREFERENCE_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE
    )
  },
  "5522b6dbaced213c5db90c10e9c2bfe3": {
    "id": "5522b6dbaced213c5db90c10e9c2bfe3",
    "programs": [
      "AMUNDSEN HS: AMUNDSEN HS-General Education/Grow Community"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Applicants are selected by random computerized lottery. If the program has priority groups, students in those groups are selected in the order listed.</li><li><strong>Priority: </strong>Sibling Preference,Staff Priority,Elementary Preference,General</li><li><strong>Note: </strong>Students living in the attendance area are guaranteed a seat and do not need to submit an application. All students living outside the attendance area must submit an application. Applicants are selected by random computerized lottery. If the program has priority groups, students in those groups are selected in the order listed. Elementary Preference School(s): AUDUBON, BELL, BLAINE, BUDLONG, BURLEY, CHAPPELL, COONLEY, GREELEY, HAMILTON, HAWTHORNE, INTER-AMERICAN, JAHN, JAMIESON, MCPHERSON, NETTELHORST, RAVENSWOOD, WATERS</li></ul>",
    "fn": conditional(
      {
        filter:ifInAttendBound,
        fn:accept(everyone)
      },
      {
        filter:everyone,
        fn: lottery(
            ATTENDANCE_AREA_LOTTERY_STAGE,
            SIBLING_LOTTERY_STAGE,
            STAFF_PREFERENCE_LOTTERY_STAGE,
            {
              filter: ifStudentAttendsOneOf(
                AUDUBON_ES_PROGRAM,
                BELL_OPEN_ENROLLMENT_ES_PROGRAM,
                BLAINE_ES_PROGRAM,
                BUDLONG_ES_PROGRAM,
                BURLEY_ES_PROGRAM,
                CHAPPELL_ES_PROGRAM,
                COONLEY_OPEN_ENROLLMENT_ES_PROGRAM,
                GREELEY_MAGNET_CLUSTER_ES_PROGRAM, 
                HAMILTON_ES_PROGRAM, 
                HAWTHORNE_ES_PROGRAM, 
                INTER_AMERICAN_ES_PROGRAM,
                JAHN_ES_PROGRAM, 
                JAMIESON_ES_PROGRAM, 
                MCPHERSON_ES_PROGRAM, 
                NETTELHORST_ES_PROGRAM, 
                RAVENSWOOD_ES_PROGRAM, 
                WATERS_ES_PROGRAM
              ),
              size:LotteryStageSize.SMALL
            },
            GENERAL_LOTTERY_STAGE
        )
      }
    )
  },
  "bfba4203fd06b8001fed92d9c99b6f46": {
    "id": "bfba4203fd06b8001fed92d9c99b6f46",
    "programs": [
      "AMUNDSEN HS: AMUNDSEN HS-International Baccalaureate (IB)"
    ],
    "desc": "<ul><li><strong>Priority: </strong>Elementary Preference,General</li><li><strong>Note: </strong>International Baccalaureate (IB) is an inquiry-based, concept-driven framework that aims to develop self-directed thinkers and reflective problem solvers. Students enrolled in the IB Program may receive college credit for their high school courses. All students applying to this program must take the CPS HSAT. Elementary Preference School(s): MCPHERSON</li></ul>",
    "fn": ibPointSystem
  },
  "4cbbd41fd3a8d85c0f5f688b1295e746": {
    "id": "4cbbd41fd3a8d85c0f5f688b1295e746",
    "programs": [
      "LINCOLN PARK HS: LINCOLN PARK HS-Theatre"
    ],
    "desc": "<ul><li><strong>Priority: </strong>Attendance Area,General</li><li><strong>Note: </strong>All applicants must schedule an audition in their GoCPS account at the time of application. Schools will score auditions/portfolios based on a rubric. Applicants are selected in descending total point order based on their audition/portfolio score.&nbsp;Please <a href=\"https://www.lincolnparkhs.org/apps/pages/index.jsp?uREC_ID=920561&type=u&pREC_ID=1616559\">click here</a> to review the Theatre audition requirements. </li></ul>",
    "fn": notImplemented
  },
  "41af1b6978dd46ee42a65f16f84da754": {
    "id": "41af1b6978dd46ee42a65f16f84da754",
    "programs": [
      "LINCOLN PARK HS: LINCOLN PARK HS-Advanced College Prep"
    ],
    "desc": "<ul><li><strong>Priority: </strong>General</li><li><strong>Note: </strong>Students living in the attendance area are guaranteed a seat and do not need to submit an application. All students living outside the attendance area must submit an application. Applicants who do not live in the attendance area are selected in descending total point order on a 900 point scale, with 450 points coming from the HSAT and 450 points coming from final (cumulative) grades from your 7th grade report card. Applicants living in the attendance area are admitted automatically. <em>(Please note this is the program that was formerly named Double Honors.)</em> </li></ul>",
    "fn": conditional(
      {
        filter:ifInAttendBound,
        fn:accept(everyone)
      },
      {
        filter:everyone,
        fn: sePointSystem
      }
    )
  },
  "c9ba95ecf4ca89f15df1de06ec5b60d4": {
    "id": "c9ba95ecf4ca89f15df1de06ec5b60d4",
    "programs": [
      "LINCOLN PARK HS: LINCOLN PARK HS-Instrumental Music"
    ],
    "desc": "<ul><li><strong>Priority: </strong>Attendance Area,General</li><li><strong>Note: </strong>All applicants must schedule an audition in their GoCPS account at the time of application. Schools will score auditions/portfolios based on a rubric. Applicants are selected in descending total point order based on their audition/portfolio score. Please <a href=\"https://docs.google.com/document/d/1XwS83SEsXIhGkmapk2_rGX6MCvWweLGJ6mlKccp9Nv0/edit?usp=sharing\">click here</a> to review the Instrumental Music audition requirements.&nbsp; </li></ul>",
    "fn": notImplemented
  },
  "4e153ca9bcf5a8fee5dd992593b41892": {
    "id": "4e153ca9bcf5a8fee5dd992593b41892",
    "programs": [
      "LINCOLN PARK HS: LINCOLN PARK HS-Visual Arts"
    ],
    "desc": "<ul><li><strong>Priority: </strong>Attendance Area,General</li><li><strong>Note: </strong>All applicants must submit a Visual Arts Portfolio electronically by December 1st&nbsp;at 11:59pm. Students should follow the template laid out in the linked google slides. Include: short statement of intent, short autobiography, sketchbook pages, portfolio of completed artworks. <a href=\"https://docs.google.com/presentation/d/1p6I3J4r2oJq6YOb9bngJD9Pz9FP1q5OPnlYWMb9Eslg/edit?usp=sharing\">Link of template (Download a copy)</a>\r\n\r\n<a href=\"https://www.lincolnparkhs.org/apps/pages/index.jsp?uREC_ID=1106192&type=d&pREC_ID=1606882\">Submission information can be found here</a>. <strong>Any portfolios submitted AFTER the LPHS deadline may not be considered by the review team.&nbsp;</strong>Schools will score auditions/portfolios based on a rubric. Applicants are selected in descending total point order based on their audition/portfolio score. </li></ul>",
    "fn": notImplemented
  },
  "b078afd3f8f4d81e6668225d6a6b8365": {
    "id": "b078afd3f8f4d81e6668225d6a6b8365",
    "programs": [
      "LINCOLN PARK HS: LINCOLN PARK HS-Vocal Music"
    ],
    "desc": "<ul><li><strong>Priority: </strong>Attendance Area,General</li><li><strong>Note: </strong>All applicants must schedule an audition in their GoCPS account at the time of application. Schools will score auditions/portfolios based on a rubric. Applicants are selected in descending total point order based on their audition/portfolio score. Please <a href=\"https://docs.google.com/document/d/1uN-SZEKbIDz_-RT-0kWnoQre8m85uHPO5kFkkcjjIm0/edit?usp=sharing\">click here</a> to review the Vocal Music audition requirements.&nbsp; </li></ul>",
    "fn": notImplemented
  },
  "c0c08050ccbfee0198ee8fa030ada871": {
    "id": "c0c08050ccbfee0198ee8fa030ada871",
    "programs": [
      "LAKE VIEW HS: LAKE VIEW HS-Grow Community - Early College STEM"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Applicants are selected by random computerized lottery. If the program has priority groups, students in those groups are selected in the order listed.</li><li><strong>Priority: </strong>Sibling Preference,Staff Priority,Elementary Preference,Stem Selection,General</li><li><strong>Note: </strong>Students living in the attendance area are guaranteed a seat and do not need to submit an application. All students living outside the attendance area must submit an application. Students who live outside of the school's attendance boundary are randomly selected by computerized lottery. The lottery is conducted in the following order: Siblings, staff preference, Elementary preference (Grow Community Schools), STEM Selection (students who have at least a 3.0 GPA & whose HSAT Reading and math combo is at least 120 for general education students and 110 for IEP/EL students), and then all remaining applicants. Elementary Preference School(s): AUDUBON, BELL, BLAINE, BUDLONG, BURLEY, CHAPPELL, COONLEY, GREELEY, HAMILTON, HAWTHORNE, INTER-AMERICAN, JAHN, JAMIESON, MCPHERSON, NETTELHORST, RAVENSWOOD, WATERS</li></ul>",
    "fn": conditional(
      {
        filter:ifInAttendBound,
        fn:accept(everyone)
      },
      {
        filter:everyone,
        fn: lottery(
          SIBLING_LOTTERY_STAGE,
          STAFF_PREFERENCE_LOTTERY_STAGE,
          {
            filter:ifStudentAttendsOneOf(
              ...GROW_COMMUNITY_SCHOOL_ES_PROGRAMS
            ),
            size: LotteryStageSize.SMALL
          },
          {
            filter:either(
              ifHasGrades({gpa:3, hsatCombined:120}),
              both(
                ifIEPorEL,
                ifHasGrades({gpa:3, hsatCombined:110})
              )
            )
            ,
            size: LotteryStageSize.SMALL
          },
          GENERAL_LOTTERY_STAGE
        )
      }
    )
  },
  "a417cc7953db2373811682057f70489c": {
    "id": "a417cc7953db2373811682057f70489c",
    "programs": [
      "MATHER HS: MATHER HS-General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Applicants are selected by random computerized lottery. If the program has priority groups, students in those groups are selected in the order listed.</li><li><strong>Priority: </strong>Sibling Preference,Staff Priority,Elementary Preference,General</li><li><strong>Note: </strong>Elementary Preference School(s): ARMSTRONG G, CLINTON, JAMIESON, MOSAIC, PETERSON, ROGERS, WEST RIDGE</li></ul>",
    "fn": lottery(
      SIBLING_LOTTERY_STAGE,
      STAFF_PREFERENCE_LOTTERY_STAGE,
      {
        filter: ifStudentAttendsOneOf(
          ARMSTRONG_G_ES_PROGRAM,
          CLINTON_ES_PROGRAM,
          JAMIESON_ES_PROGRAM,
          PETERSON_ES_PROGRAM,
          ROGERS_ES_PROGRAM,
          WEST_RIDGE_ES_PROGRAM
        ),
        size: LotteryStageSize.SMALL
      },
      GENERAL_LOTTERY_STAGE
    )
  },
  "a341a184b4ab51e3f0c7360f2f517b9a": {
    "id": "a341a184b4ab51e3f0c7360f2f517b9a",
    "programs": [
      "MORGAN PARK HS: MORGAN PARK HS-General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Applicants are selected by random computerized lottery. If the program has priority groups, students in those groups are selected in the order listed.</li><li><strong>Priority: </strong>Sibling Preference,Staff Priority,General</li><li><strong>Note: </strong>Students living in the attendance area are guaranteed a seat and do not need to submit an application. All students living outside the attendance area must submit an application. Students who live outside of the school's attendance boundary are randomly selected by computerized lottery. Those students with the minimum GPA of 2.3 or higher are eligible to be selected.&nbsp; </li></ul>",
    "fn": conditional(
      {
        filter:ifInAttendBound,
        fn:accept(everyone)
      },
      {
        filter:ifHasGrades({gpa:2.3}),
        fn: lottery(
            ATTENDANCE_AREA_LOTTERY_STAGE,
            SIBLING_LOTTERY_STAGE,
            STAFF_PREFERENCE_LOTTERY_STAGE,
            GENERAL_LOTTERY_STAGE
        )
      }
    )
  },
  "5ba24e3dbbc63e239ca65659f17a3436": {
    "id": "5ba24e3dbbc63e239ca65659f17a3436",
    "programs": [
      "KENWOOD HS: KENWOOD HS-Magnet - Honors",
      "WESTINGHOUSE HS: WESTINGHOUSE HS-Career Academy",
      "CHICAGO ACADEMY HS: CHICAGO ACADEMY HS-Scholars",
      "COLLINS STEAM HS: COLLINS STEAM HS-Scholars"
    ],
    "desc": "<ul><li>Application Requirements: High School Admissions Test (HSAT) Scores Required.</li><li>GPA: 3.00</li></ul>",
    "fn": accept(ifHasGrades({gpa:3}))
  },
  "e4f7453e432873f0a178bd7e1d4e59e2": {
    "id": "e4f7453e432873f0a178bd7e1d4e59e2",
    "programs": [
      "KENWOOD HS: KENWOOD HS-Magnet - Honors"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Applicants are selected by random computerized lottery. If the program has priority groups, students in those groups are selected in the order listed.</li><li><strong>Priority: </strong>General</li><li><strong>Note: </strong>For the rolling waitlist, General Education and Students with 504 plans must have an HSAT minimum combo score of 100% to be considered for the lottery. Students with IEPs and English Language Learners must have an HSAT&nbsp;minimum combo score of 90% to be considered for the lottery.&nbsp; </li></ul>",
    "fn": conditional(
      {
        filter:either(
          ifHasGrades({hsatCombined:100}),
          both(ifIEPorEL, ifHasGrades({hsatCombined:90}))),
        fn: lottery(
            GENERAL_LOTTERY_STAGE
        )
      }
    )
  },
  "ee690a6b79373669deebbf1228b2f7d6": {
    "id": "ee690a6b79373669deebbf1228b2f7d6",
    "programs": [
      "ROOSEVELT HS: ROOSEVELT HS-Dual Language",
      "SCHURZ HS: SCHURZ HS-Dual Language"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Applicants are selected by random computerized lottery. If the program has priority groups, students in those groups are selected in the order listed.</li><li><strong>Priority: </strong>Sibling Preference,Elementary Preference,General</li><li><strong>Note: </strong>One-way dual language programs provide instruction in two languages and serve mostly English Learners (ELs), former ELs, and heritage language learners in the same classroom. Elementary Preference School(s): AZUELA, BARRY, BATEMAN, BELMONT-CRAGIN, CALMECA, CARSON, CHASE, COOPER, DARWIN, EDWARDS, ERIE, GLOBAL CITIZENSHIP, HURLEY, INTER-AMERICAN, MOOS, MOZART, NAMASTE, SABIN, SPRY ES, STO</li></ul>",
    "fn": lottery(
      SIBLING_LOTTERY_STAGE,
      {
        filter: ifStudentAttendsOneOf(
          AZUELA_LANGUAGE_PROGRAM,
          BARRY_LANGUAGE_PROGRAM,
          BATEMAN_LANGUAGE_PROGRAM,
          BELMONT_CRAGIN_LANGUAGE_PROGRAM,
          CALMECA_LANGUAGE_PROGRAM,
          CALMECA_ES_PROGRAM,
          CARSON_LANGUAGE_PROGRAM,
          CHASE_LANGUAGE_PROGRAM,
          COOPER_LANGUAUGE_PROGRAM,
          DARWIN_LANGUAGE_PROGRAM,
          EDWARDS_LANGUAGE_PROGRAM,
          HURLEY_LANGUAGE_PROGRAM,
          INTER_AMERICAN_ES_PROGRAM,
          MOOS_LANGUAGE_PROGRAM,
          MOZART_LANGUAGE_PROGRAM,
          SABIN_LANGUAGE_PROGRAM,
          SPRY_LANGUAGE_PROGRAM,
          STOWE_LANGUAGE_PROGRAM
        ),
        size: LotteryStageSize.SMALL
      },
      GENERAL_LOTTERY_STAGE
    )
  },
  "47a186e9b7ffecfd82ebe1a34da18e55": {
    "id": "47a186e9b7ffecfd82ebe1a34da18e55",
    "programs": [
      "SENN HS: SENN HS-Dance"
    ],
    "desc": "<ul><li><strong>Priority: </strong>General</li><li><strong>Note: </strong>Learn how to join the Senn HS - Dance program waitlist using <a href=\"https://docs.google.com/document/d/1swObVIiX9NMQUl4G3LF1SvUfFeH4pWLc9KW0AQNzH-8/edit?usp=sharing\">this guide</a>! For more information visit: <a href=\"https://www.sennhs.org/apps/pages/SennArtsDanceAdmissions\">https://www.sennhs.org/apps/pages/SennArtsDanceAdmissions</a> </li></ul>",
    "fn": notImplemented
  },
  "0301ebb1d2801e54aef1d58465f24ddd": {
    "id": "0301ebb1d2801e54aef1d58465f24ddd",
    "programs": [
      "SENN HS: SENN HS-International Baccalaureate (IB)"
    ],
    "desc": "<ul><li><strong>Priority: </strong>Elementary Preference,General</li><li><strong>Note: </strong>International Baccalaureate (IB) is an inquiry-based, concept-driven framework that aims to develop self-directed thinkers and reflective problem solvers. Students enrolled in the IB Program may receive college credit for their high school courses. All students applying to this program must take the CPS HSAT. Elementary Preference School(s): PEIRCE</li></ul>",
    "fn": ibPointSystem
  },
  "17fc6554ab2180b1d8c6bdf7a40ac05a": {
    "id": "17fc6554ab2180b1d8c6bdf7a40ac05a",
    "programs": [
      "SENN HS: SENN HS-Music"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Applicants are selected by random computerized lottery. If the program has priority groups, students in those groups are selected in the order listed.</li><li><strong>Priority: </strong>General</li><li><strong>Note: </strong>The Senn Arts Music Program is an INTEREST BASED program. Students are selected by a lottery system - there are no auditions.&nbsp;\r\n\r\nLearn how to join the Senn HS - Music program waitlist using <a href=\"https://docs.google.com/document/d/1swObVIiX9NMQUl4G3LF1SvUfFeH4pWLc9KW0AQNzH-8/edit?usp=sharing\">this guide</a>!&nbsp;Learn more about the Music program here:&nbsp;<a href=\"https://docs.google.com/document/d/1ZqWmRlWZ5sVc4kI4CvplujN9uGS6NG1NEYPf1y7VDLk/edit?usp=sharing\" target=\"_blank\">Senn Arts Music - Program Info</a> </li></ul>",
    "fn": notImplemented
  },
  "9cda221e5c067ef80f539d21bcb958b9": {
    "id": "9cda221e5c067ef80f539d21bcb958b9",
    "programs": [
      "SENN HS: SENN HS-Theatre"
    ],
    "desc": "<ul><li><strong>Priority: </strong>General</li><li><strong>Note: </strong>Learn how to join the Senn HS - Theatre program waitlist using <a href=\"https://docs.google.com/document/d/1swObVIiX9NMQUl4G3LF1SvUfFeH4pWLc9KW0AQNzH-8/edit?usp=sharing\">this guide</a>!. For more information visit: <a href=\"https://www.sennhs.org/apps/pages/SennArtsTheatreAdmissions\">https://www.sennhs.org/apps/pages/SennArtsTheatreAdmissions</a> </li></ul>",
    "fn": notImplemented
  },
  "3843fe5658793f5d301caac89cba3c64": {
    "id": "3843fe5658793f5d301caac89cba3c64",
    "programs": [
      "SENN HS: SENN HS-Visual Arts"
    ],
    "desc": "<ul><li><strong>Priority: </strong>General</li><li><strong>Note: </strong>Learn how to submit your Visual Arts portfolio and join the Senn HS - Visual Arts program waitlist using <a href=\"https://docs.google.com/document/d/1swObVIiX9NMQUl4G3LF1SvUfFeH4pWLc9KW0AQNzH-8/edit?usp=sharing\">this guide</a>! Students are selected based on the results of their portfolio review. Portfolios are submitted outside of your GoCPS account.&nbsp;For more information visit: <a href=\"https://www.sennhs.org/apps/pages/SennArtsVisualArtAdmissions\">https://www.sennhs.org/apps/pages/SennArtsVisualArtAdmissions</a> </li></ul>",
    "fn": notImplemented
  },
  "b1b2d2865fd9a62812292d32e2442b06": {
    "id": "b1b2d2865fd9a62812292d32e2442b06",
    "programs": [
      "STEINMETZ HS: STEINMETZ HS-STEAM",
      "FENGER HS: FENGER HS-Honors",
      "INFINITY HS: INFINITY HS-STEM"
    ],
    "desc": "<ul><li>Application Requirements: High School Admissions Test (HSAT) Scores Required.</li><li>GPA: 2.00</li></ul>",
    "fn": accept(ifHasGrades({gpa:2}))
  },
  "73f8870f9ecf9af4521b8a290d4b7242": {
    "id": "73f8870f9ecf9af4521b8a290d4b7242",
    "programs": [
      "STEINMETZ HS: STEINMETZ HS-STEAM"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Applicants are selected by random computerized lottery. If the program has priority groups, students in those groups are selected in the order listed.</li><li><strong>Priority: </strong>Sibling Preference,Staff Priority,General</li><li><strong>Note: </strong>Students living in the attendance area are guaranteed a seat and do not need to submit an application. All students living outside the attendance area must submit an application. Applicants are selected by random computerized lottery. If the program has priority groups, students in those groups are selected in the order listed. General Education and Students with 504 plans must have an HSAT minimum combo score of 58% to be considered for the lottery. Students with IEPs and English Language Learners must have an HSAT&nbsp;minimum combo score of 48% to be considered for the lottery. </li></ul>",
    "fn": conditional(
      {
        filter:ifInAttendBound,
        fn:accept(everyone)
      },
      {
        filter: either(
          ifHasGrades({hsatCombined:58}),
            both(
              ifIEPorEL,
              ifHasGrades({hsatCombined:48})
            )
          ),
        fn: lottery(
            ATTENDANCE_AREA_LOTTERY_STAGE,
            SIBLING_LOTTERY_STAGE,
            STAFF_PREFERENCE_LOTTERY_STAGE,
            GENERAL_LOTTERY_STAGE
        )
      }
    )
  },
  "59c30414db501366229771b882584773": {
    "id": "59c30414db501366229771b882584773",
    "programs": [
      "STEINMETZ HS: STEINMETZ HS-International Baccalaureate (IB)"
    ],
    "desc": "<ul><li><strong>Priority: </strong>Elementary Preference,General</li><li><strong>Note: </strong>International Baccalaureate (IB) is an inquiry-based, concept-driven framework that aims to develop self-directed thinkers and reflective problem solvers. Students enrolled in the IB Program may receive college credit for their high school courses. All students applying to this program must take the CPS HSAT. Elementary Preference School(s): LOCKE J</li></ul>",
    "fn": ibPointSystem
  },
  "801cb10341d624061189149ea08c9a99": {
    "id": "801cb10341d624061189149ea08c9a99",
    "programs": [
      "WASHINGTON HS: WASHINGTON HS-International Baccalaureate (IB)"
    ],
    "desc": "<ul><li><strong>Priority: </strong>Elementary Preference,General</li><li><strong>Note: </strong>International Baccalaureate (IB) is an inquiry-based, concept-driven framework that aims to develop self-directed thinkers and reflective problem solvers. Students enrolled in the IB Program may receive college credit for their high school courses. All students applying to this program must take the CPS HSAT. Elementary Preference School(s): MARSH</li></ul>",
    "fn": ibPointSystem
  },
  "bc9ed231131dfb5287e2d4bad18864a3": {
    "id": "bc9ed231131dfb5287e2d4bad18864a3",
    "programs": [
      "HUBBARD HS: HUBBARD HS-General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Applicants are selected by random computerized lottery. If the program has priority groups, students in those groups are selected in the order listed.</li><li><strong>Priority: </strong>Sibling Preference,Staff Priority</li></ul>",
    "fn": lottery(
      SIBLING_LOTTERY_STAGE,
      STAFF_PREFERENCE_LOTTERY_STAGE
    )
  },
  "78ecbad5d00d472eff53b5a99d53be17": {
    "id": "78ecbad5d00d472eff53b5a99d53be17",
    "programs": [
      "HUBBARD HS: HUBBARD HS-University Scholars"
    ],
    "desc": "<ul><li><strong>Priority: </strong>General</li><li><strong>Note: </strong>All students applying to this program must take the CPS HSAT. Students are selected in descending total point order on a 900 point scale, with 450 points coming from the HSAT and 450 points coming from final (cumulative) 7th grade report card. Students who live in the attendance area receive 50 additional points. </li></ul>",
    "fn": sePointSystem
  },
  "46632572f5b81c4bd60cdd91d8ab4b48": {
    "id": "46632572f5b81c4bd60cdd91d8ab4b48",
    "programs": [
      "BOGAN HS: BOGAN HS-General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Applicants are selected by random computerized lottery. If the program has priority groups, students in those groups are selected in the order listed.</li><li><strong>Priority: </strong>Staff Priority,General</li></ul>",
    "fn": lottery(
      STAFF_PREFERENCE_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE
    )
  },
  "42d42fddb29561c39721e0795e4df8e8": {
    "id": "42d42fddb29561c39721e0795e4df8e8",
    "programs": [
      "FARRAGUT HS: FARRAGUT HS-International Baccalaureate (IB)"
    ],
    "desc": "<ul><li><strong>Priority: </strong>Elementary Preference,General</li><li><strong>Note: </strong>International Baccalaureate (IB) is an inquiry-based, concept-driven framework that aims to develop self-directed thinkers and reflective problem solvers. Students enrolled in the IB Program may receive college credit for their high school courses. All students applying to this program must take the CPS HSAT. Elementary Preference School(s): MADERO</li></ul>",
    "fn": ibPointSystem
  },
  "6be830200b7cf28dadb2cffaa68afb88": {
    "id": "6be830200b7cf28dadb2cffaa68afb88",
    "programs": [
      "FENGER HS: FENGER HS-Honors"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Applicants are selected by random computerized lottery. If the program has priority groups, students in those groups are selected in the order listed.</li><li><strong>Priority: </strong>General</li><li><strong>Note: </strong>General Education and Students with 504 plans must have an HSAT minimum combo score of 120% to be considered for the lottery. Students with IEPs and English Language Learners must have an HSAT&nbsp;minimum combo score of 110% to be considered for the lottery.&nbsp; </li></ul>",
    "fn": conditional(
      {
        filter:either(
          ifHasGrades({hsatCombined:120}),
          both(ifIEPorEL, ifHasGrades({hsatCombined:110}))),
        fn: lottery(
            GENERAL_LOTTERY_STAGE
        )
      }
    )
  },
  "01ea8fce4bc9fa3dbe7bee105ef46aa8": {
    "id": "01ea8fce4bc9fa3dbe7bee105ef46aa8",
    "programs": [
      "HYDE PARK HS: HYDE PARK HS-General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Applicants are selected by random computerized lottery. If the program has priority groups, students in those groups are selected in the order listed.</li><li><strong>Priority: </strong>Sibling Preference,Staff Priority,General</li><li><strong>Note: </strong>Students living in the attendance area are guaranteed a seat and do not need to submit an application. All students living outside the attendance area must submit an application. Students who live outside of the school's attendance boundary are randomly selected by computerized lottery. General Education and Students with 504 plans must have an HSAT minimum combo score of 50% to be considered for the lottery. Students with IEPs and English Language Learners must have an HSAT&nbsp;minimum combo score of 40% to be considered for the lottery.&nbsp; </li></ul>",
    "fn": conditional(
      {
        filter:ifInAttendBound,
        fn:accept(everyone)
      },
      {
        filter:either(
          ifHasGrades({hsatCombined:50}),
            both(
              ifIEPorEL,
              ifHasGrades({hsatCombined:40})
            )
          ),
        fn: lottery(
            ATTENDANCE_AREA_LOTTERY_STAGE,
            SIBLING_LOTTERY_STAGE,
            STAFF_PREFERENCE_LOTTERY_STAGE,
            GENERAL_LOTTERY_STAGE
        )
      }
    )
  },
  "4558eac2ec000c6c842a49273bcdce42": {
    "id": "4558eac2ec000c6c842a49273bcdce42",
    "programs": [
      "HYDE PARK HS: HYDE PARK HS-International Baccalaureate (IB)"
    ],
    "desc": "<ul><li><strong>Priority: </strong>Elementary Preference,General</li><li><strong>Note: </strong>International Baccalaureate (IB) is an inquiry-based, concept-driven framework that aims to develop self-directed thinkers and reflective problem solvers. Students enrolled in the IB Program may receive college credit for their high school courses. All students applying to this program must take the CPS HSAT. Elementary Preference School(s): CARNEGIE</li></ul>",
    "fn": ibPointSystem
  },
  "72b226ba75d6e362d1f2561d3a6211a9": {
    "id": "72b226ba75d6e362d1f2561d3a6211a9",
    "programs": [
      "KELVYN PARK HS: KELVYN PARK HS-Open Enrollment"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Applicants are selected by random computerized lottery. If the program has priority groups, students in those groups are selected in the order listed.</li><li><strong>Priority: </strong>Sibling Preference,Staff Priority,General</li><li><strong>Note: </strong>Open enrollment programs offer a well-rounded general education curriculum, focusing on core subjects like math, science, reading, and social studies. These programs serve a broad range of students without admissions screening or specialized academic focus. </li></ul>",
    "fn": lottery(
      SIBLING_LOTTERY_STAGE,
      STAFF_PREFERENCE_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE
    )
  },
  "48f0a45f6ea3dadb28162737e8fc5fd2": {
    "id": "48f0a45f6ea3dadb28162737e8fc5fd2",
    "programs": [
      "BACK OF THE YARDS HS: BACK OF THE YARDS HS-Dual Language"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Students are selected by lottery within groups with preferences for students who have combined HSAT scores above the 58/48th percentile and who live within the attendance area of the school.</li><li><strong>Priority: </strong>Sibling Preference,Elementary Preference,General</li><li><strong>Note: </strong>One-way dual language programs provide instruction in two languages and serve mostly English Learners (ELs), former ELs, and heritage language learners in the same classroom. Elementary Preference School(s): AZUELA, BARRY, BATEMAN, BELMONT-CRAGIN, CALMECA, CARSON, CHASE, COOPER, DARWIN, EDWARDS, ERIE, GLOBAL CITIZENSHIP, HURLEY, INTER-AMERICAN, MOOS, MOZART, NAMASTE, SABIN, SPRY ES, STO</li></ul>",
    "fn": lottery(
      SIBLING_LOTTERY_STAGE,
      {
        filter: both(
          ifStudentAttendsOneOf(...LANGUAGE_ES_PROGRAMS),
          either(
          ifHasGrades({hsatCombined:58}),
            both(
              ifIEPorEL,
              ifHasGrades({hsatCombined:48})
            )
          )),
        size:LotteryStageSize.LARGE
      },
      GENERAL_LOTTERY_STAGE
    )
  },
  "bcd9dc5f78db5a241f618a6d67a00077": {
    "id": "bcd9dc5f78db5a241f618a6d67a00077",
    "programs": [
      "SOLORIO HS: SOLORIO HS-General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Applicants are selected by random computerized lottery. If the program has priority groups, students in those groups are selected in the order listed.</li><li><strong>Priority: </strong>Staff Priority</li></ul>",
    "fn": lottery(
      STAFF_PREFERENCE_LOTTERY_STAGE
    )
  },
  "5d043279282c00b425d349121c3ef6a0": {
    "id": "5d043279282c00b425d349121c3ef6a0",
    "programs": [
      "NORTHSIDE PREP HS: NORTHSIDE PREP HS-Selective Enrollment High School",
      "KING HS: KING HS-Selective Enrollment High School",
      "LANE TECH HS: LANE TECH HS-Selective Enrollment High School",
      "HANCOCK HS: HANCOCK HS-Selective Enrollment High School",
      "WESTINGHOUSE HS: WESTINGHOUSE HS-Selective Enrollment High School",
      "YOUNG HS: YOUNG HS-Selective Enrollment High School",
      "BROOKS HS: BROOKS HS-Selective Enrollment High School",
      "PAYTON HS: PAYTON HS-Selective Enrollment High School",
      "JONES HS: JONES HS-Selective Enrollment High School",
      "LINDBLOM HS: LINDBLOM HS-Selective Enrollment High School",
      "SOUTH SHORE INTL HS: SOUTH SHORE INTL HS-Selective Enrollment High School"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>All students applying to this program must take the CPS High School Admission Test (HSAT). Students are selected in descending total points out of 900. Point totals are made up of 450 points from the HSAT and 450 points from the final 7th grade grades.</li><li><strong>Priority: </strong>Rank,Tier</li><li><strong>Note: </strong>Selective Enrollment High Schools provide academically advanced high school students with a challenging and enriched college preparatory experience. Each of the Selective Enrollment High Schools offers a rigorous curriculum with mainly honors and Advanced Placement (AP) courses. All students applying to this program must take the CPS HSAT. Students are selected in descending total points out of 900-450 points from the HSAT and 450 points from the final 7th grade grades. </li></ul>",
    "fn": sePointSystem
  },
  "c60face03a9d8e3b3a86e508e4b641d5": {
    "id": "c60face03a9d8e3b3a86e508e4b641d5",
    "programs": [
      "HANCOCK HS: HANCOCK HS-Pre-Engineering",
      "HANCOCK HS: HANCOCK HS-Pre-Law",
      "JONES HS: JONES HS-Pre-Engineering",
      "JONES HS: JONES HS-Pre-Law"
    ],
    "desc": "<ul><li><strong>Priority: </strong>Overlay Preference,General</li></ul>",
    "fn": lottery(
      PROXIMITY_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE
    )
  },
  "b849c1e1f484ebbd373dcccf9dcd9b48": {
    "id": "b849c1e1f484ebbd373dcccf9dcd9b48",
    "programs": [
      "WESTINGHOUSE HS: WESTINGHOUSE HS-Career Academy",
      "WILLIAMS HS: WILLIAMS HS-General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Applicants are selected by random computerized lottery. If the program has priority groups, students in those groups are selected in the order listed.</li><li><strong>Priority: </strong>Sibling Preference,Staff Priority,Proximity Preference,General</li><li><strong>Note: </strong>General Education and Students with 504 plans must have an HSAT minimum combo score of 58% to be considered for the lottery. Students with IEPs and English Language Learners must have an HSAT&nbsp;minimum combo score of 48% to be considered for the lottery. </li></ul>",
    "fn": conditional(
      {
        filter:either(
          ifHasGrades({hsatCombined:58}),
          both(ifIEPorEL, ifHasGrades({hsatCombined:48}))),
        fn: lottery(
            SIBLING_LOTTERY_STAGE,
            STAFF_PREFERENCE_LOTTERY_STAGE,
            PROXIMITY_LOTTERY_STAGE,
            GENERAL_LOTTERY_STAGE
        )
      }
    )
  },
  "e43300bdfb9007e8306b6defa2590b1b": {
    "id": "e43300bdfb9007e8306b6defa2590b1b",
    "programs": [
      "CHICAGO ACADEMY HS: CHICAGO ACADEMY HS-Scholars"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Applicants are selected by random computerized lottery. If the program has priority groups, students in those groups are selected in the order listed.</li><li><strong>Priority: </strong>Sibling Preference,Elementary Preference,Proximity Preference,General</li><li><strong>Note: </strong>General Education and Students with 504 plans must have an HSAT minimum combo score of 120% to be considered for the lottery. Students with IEPs and English Language Learners must have an HSAT&nbsp;minimum combo score of 110% to be considered for the lottery.&nbsp; Elementary Preference School(s): CHICAGO ACADEMY ES</li></ul>",
    "fn": conditional(
      {
        filter:either(
          ifHasGrades({hsatCombined:120}),
          both(ifIEPorEL, ifHasGrades({hsatCombined:110}))),
        fn: lottery(
            SIBLING_LOTTERY_STAGE,
            {
              filter:ifStudentAttendsOneOf(
                CHICAGO_ACADEMY_ES_PROGRAM
              ),
              size:LotteryStageSize.SMALL
            },
            PROXIMITY_LOTTERY_STAGE,
            GENERAL_LOTTERY_STAGE
        )
      }
    )
  },
  "34c315156fe3de9397fec91b8e48d08c": {
    "id": "34c315156fe3de9397fec91b8e48d08c",
    "programs": [
      "WORLD LANGUAGE HS: WORLD LANGUAGE HS-General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Applicants are selected by random computerized lottery. If the program has priority groups, students in those groups are selected in the order listed.</li><li><strong>Priority: </strong>Sibling Preference,Staff Priority,Attendance Area,General</li><li><strong>Note: </strong>All students living <strong>outside </strong>the attendance area for this program must submit an application. Applicants are selected by random computerized lottery.\r\n\r\nAll students living <strong>inside </strong>the attendance area for this program will receive a Guaranteed Offer to the Little Village Lawndale Campus <em>(comprised of&nbsp;Infinity HS, Multicultural HS,&nbsp;Social Justice HS, and&nbsp;World Language HS) </em>and do not need to apply to General Education @ World Language HS within their Choice application.&nbsp; </li></ul>",
    "fn": conditional(
      {
        filter:ifInAttendBound,
        fn:accept(everyone)
      },
      {
        filter:everyone,
        fn: lottery(
            SIBLING_LOTTERY_STAGE,
            STAFF_PREFERENCE_LOTTERY_STAGE,
            ATTENDANCE_AREA_LOTTERY_STAGE,
            GENERAL_LOTTERY_STAGE
        )
      }
    )
  },
  "0a629306c17b76691860534406eee981": {
    "id": "0a629306c17b76691860534406eee981",
    "programs": [
      "INFINITY HS: INFINITY HS-STEM"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Students are selected by lottery within groups with preferences for students who have combined HSAT scores above the 58/48th percentile and who live within the attendance area of the school.</li><li><strong>Priority: </strong>Sibling Preference,Staff Priority,Attendance Area,General</li><li><strong>Note: </strong>General Education and Students with 504 plans must have an HSAT minimum combo score of 120% to be considered for the lottery. Students with IEPs and English Language Learners must have an HSAT&nbsp;minimum combo score of 110% to be considered for the lottery.&nbsp; </li></ul>",
    "fn": conditional(
      {
        filter:either(
          ifHasGrades({hsatCombined:120}),
          both(ifIEPorEL, ifHasGrades({hsatCombined:110}))),
        fn: lottery(
            SIBLING_LOTTERY_STAGE,
            PROXIMITY_LOTTERY_STAGE,
            GENERAL_LOTTERY_STAGE
        )
      }
    )
  },
  "263b6278846b0049b1de6b4bf60f4965": {
    "id": "263b6278846b0049b1de6b4bf60f4965",
    "programs": [
      "MULTICULTURAL ARTS HS: MULTICULTURAL ARTS HS-Fine & Performing Arts",
      "SOCIAL JUSTICE HS: SOCIAL JUSTICE HS-General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Applicants are selected by random computerized lottery. If the program has priority groups, students in those groups are selected in the order listed.</li><li><strong>Priority: </strong>Sibling Preference,Staff Priority,Attendance Area,General</li></ul>",
    "fn": lottery(
      SIBLING_LOTTERY_STAGE,
      STAFF_PREFERENCE_LOTTERY_STAGE,
      ATTENDANCE_AREA_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE
    )
  },
  "fdf6fa52522d0ffc43c5305081feb321": {
    "id": "fdf6fa52522d0ffc43c5305081feb321",
    "programs": [
      "UPLIFT HS: UPLIFT HS-Early College STEAM"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Applicants are selected by random computerized lottery. If the program has priority groups, students in those groups are selected in the order listed.</li><li><strong>Priority: </strong>Sibling Preference,Staff Priority,Elementary Preference,General</li><li><strong>Note: </strong>Elementary Preference School(s): BRENNEMANN, COURTENAY, DISNEY, GOUDY, GREELEY, MCCUTCHEON, RAVENSWOOD</li></ul>",
    "fn": lottery(
      SIBLING_LOTTERY_STAGE,
      STAFF_PREFERENCE_LOTTERY_STAGE,
      {
        filter: ifStudentAttendsOneOf(
          BRENNEMANN_ES_PROGRAM,
          COURTENAY_ES_PROGRAM,
          DISNEY_II_ES_PROGRAM,
          GOUDY_ES_PROGRAM,
          GREELEY_MAGNET_CLUSTER_ES_PROGRAM,
          MCCUTCHEON_ES_PROGRAM,
          RAVENSWOOD_ES_PROGRAM
        ),
        size: LotteryStageSize.SMALL
      },
      GENERAL_LOTTERY_STAGE
    )
  },
  "e4c57cc444ba24748444b9d94cf9c2cd": {
    "id": "e4c57cc444ba24748444b9d94cf9c2cd",
    "programs": [
      "COLLINS STEAM HS: COLLINS STEAM HS-Scholars"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Applicants are selected by random computerized lottery. If the program has priority groups, students in those groups are selected in the order listed.</li><li><strong>Priority: </strong>Sibling Preference,General</li><li><strong>Note: </strong>General Education and Students with 504 plans must have an HSAT minimum combo score of 120% to be considered for the lottery. Students with IEPs and English Language Learners must have an HSAT&nbsp;minimum combo score of 110% to be considered for the lottery.&nbsp; </li></ul>",
    "fn": conditional(
      {
        filter:either(
          ifHasGrades({hsatCombined:120}),
          both(ifIEPorEL, ifHasGrades({hsatCombined:110}))),
        fn: lottery(
            SIBLING_LOTTERY_STAGE,
            GENERAL_LOTTERY_STAGE
        )
      }
    )
  },
  "d3ada3d7a3e41cded85fea7983e3bf98": {
    "id": "d3ada3d7a3e41cded85fea7983e3bf98",
    "programs": [
      "NORTHSIDE LEARNING HS: NORTHSIDE LEARNING HS-Significantly Modified Curriculum w/ Moderate Supports",
      "VAUGHN HS: VAUGHN HS-Significantly Modified Curriculum w/ Moderate Supports"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Applicants are selected by random computerized lottery. If the program has priority groups, students in those groups are selected in the order listed.</li><li><strong>Priority: </strong>Proximity Preference,General</li><li><strong>Note: </strong>Students who require this program are selected through OSD School Assignment Placement. Selections for this program require an IEP team determination for a placement in this specialty high school. Applications that do not meet this criteria will be withdrawn. </li></ul>",
    "fn": notImplemented
  }
}

