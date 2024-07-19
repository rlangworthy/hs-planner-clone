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
  pointSystem
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
  EDWARDS_LANGUAGE_PROGRAM

} from "./constants";
import { store } from "../../shared/redux/store";
import { getOverallSuccessChance } from "../util/get-overall-success-chance";

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
const ibPointSystem: RequirementFunction = createIBPointSystem(getNonSECutoffScores, ifInAttendBound);
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
export const requirementFunctions: ReqFnTable = {
  "6adf97f83acf6453d4a6a4b1070f3754": {
    "id": "6adf97f83acf6453d4a6a4b1070f3754",
    "programs": [
      "CHICAGO VOCATIONAL HS: Career & Technical Education (CTE) - Agriculture & Horticulture",
      "CHICAGO VOCATIONAL HS: Career & Technical Education (CTE) - Architecture & Construction - Carpentry",
      "CHICAGO VOCATIONAL HS: Career & Technical Education (CTE) - Personal Care Services - Cosmetology",
      "CHICAGO VOCATIONAL HS: Career & Technical Education (CTE) - Culinary & Hospitality Management",
      "CHICAGO VOCATIONAL HS: Career & Technical Education (CTE) - Transportation - Diesel Technology",
      "CHICAGO VOCATIONAL HS: General Education",
      "CHICAGO VOCATIONAL HS: Career & Technical Education (CTE) - Health Science",
      "CHICAGO VOCATIONAL HS: Career & Technical Education (CTE) - Early College STEM",
      "DUNBAR HS: Career & Technical Education (CTE) - Transportation - Auto Body Repair",
      "DUNBAR HS: Career & Technical Education (CTE) - Architecture & Construction - Architecture",
      "DUNBAR HS: Career & Technical Education (CTE) - Broadcast Technology",
      "DUNBAR HS: Career & Technical Education (CTE) - Culinary & Hospitality",
      "DUNBAR HS: Career & Technical Education (CTE) - Personal Care Services - Cosmetology",
      "DUNBAR HS: Career & Technical Education (CTE) - Health Science",
      "PROSSER HS: Career & Technical Education (CTE) - Career Academy",
      "PROSSER HS: International Baccalaureate (IB)",
      "ACERO - GARCIA HS: STEM",
      "URBAN PREP - ENGLEWOOD HS: Urban Prep Academy for Young Men HS - Englewood - Charter - General Education",
      "PERSPECTIVES - LEADERSHIP HS: Charter - General Education",
      "PERSPECTIVES - TECH HS: Charter - STEM",
      "PERSPECTIVES - JOSLIN HS: Charter - General Education",
      "PERSPECTIVES - MATH & SCI HS: Charter - STEM",
      "CICS - LONGWOOD: Charter - General Education",
      "CICS - NORTHTOWN HS: Charter - General Education",
      "CHICAGO MATH & SCIENCE HS: CHICAGO MATH & SCIENCE ACADEMY HS - Charter - General Education",
      "NOBLE - NOBLE HS: Charter - General Education",
      "NOBLE - COMER: Charter - General Education",
      "NOBLE - GOLDER HS: Charter - General Education",
      "NOBLE - PRITZKER HS: Charter - General Education",
      "NOBLE - RAUNER HS: Charter - General Education",
      "NOBLE - ROWE CLARK HS: Charter - STEM",
      "NOBLE - UIC HS: Charter - General Education",
      "NLCP - CHRISTIANA HS: NORTH LAWNDALE - CHRISTIANA HS - Charter - General Education",
      "NLCP - COLLINS HS: NORTH LAWNDALE - COLLINS HS - Charter - General Education",
      "ASPIRA - EARLY COLLEGE HS: Charter - General Education",
      "NOBLE - MUCHIN HS: Charter - General Education",
      "INSTITUTO - HEALTH: Charter - Health Sciences",
      "INSTITUTO - HEALTH: Charter - General Education",
      "URBAN PREP - BRONZEVILLE HS: Urban Prep Academy For Young Men HS - Bronzeville - Charter - General Education",
      "NOBLE - JOHNSON HS: Charter - General Education",
      "NOBLE - BULLS HS: Charter - General Education",
      "EPIC HS: Charter - General Education",
      "CICS - ELLISON HS: Charter - General Education",
      "NOBLE - ITW SPEER HS: Charter - STEM",
      "NOBLE - ACADEMY HS: Charter - General Education",
      "ASPIRA - BUSINESS & FINANCE HS: Charter - General Education",
      "CHICAGO COLLEGIATE: Charter - General Education",
      "INTRINSIC HS: Charter - General Education",
      "NOBLE - BUTLER HS: Charter - General Education",
      "NOBLE - BAKER HS: Charter - General Education",
      "ACERO - SOTO HS: Charter - General Education",
      "NOBLE - HANSBERRY HS: Charter - International Baccalaureate (IB)",
      "NOBLE - DRW HS: Charter - General Education",
      "LEGAL PREP HS: Charter - Law & Public Safety",
      "U OF C - WOODLAWN HS: Charter - General Education",
      "ART IN MOTION: ART in MOTION HS - Charter - Fine & Performing Arts",
      "NOBLE - MANSUETO HS: Charter - General Education",
      "GOODE HS: STEM - Early College STEM",
      "CHICAGO TECH HS: Career & Technical Education (CTE) - Information Technology - Game Programming",
      "CHICAGO TECH HS: STEM",
      "CLARK HS: Magnet - Early College STEM",
      "DISNEY II HS: Magnet - Fine & Performing Arts, Technology",
      "DISNEY II HS: Magnet - Fine & Performing Arts, Technology",
      "CRANE MEDICAL HS: Magnet - Early College STEM",
      "CHICAGO AGRICULTURE HS: Magnet - Agriculture & Horticulture",
      "CURIE HS: Career & Technical Education (CTE) - Business & Finance - Accounting",
      "CURIE HS: Career & Technical Education (CTE) - Architecture & Construction - Architecture",
      "CURIE HS: Career & Technical Education (CTE) - Transportation - Automotive Technology",
      "CURIE HS: AVID",
      "CURIE HS: Career & Technical Education (CTE) - Media & Communication Arts - Broadcast",
      "CURIE HS: Career & Technical Education (CTE) - Culinary & Hospitality",
      "CURIE HS: Career & Technical Education (CTE) - Media & Communication Arts - Digital Media",
      "CURIE HS: Career & Technical Education (CTE) - Education & Training - Teaching Academy",
      "CURIE HS: Magnet - Fine & Performing Arts - Fine & Performing Arts",
      "CURIE HS: International Baccalaureate (IB)",
      "CURIE HS: Career & Technical Education (CTE) - Information Technology - Game Programming & Web Design",
      "CURIE HS: General Education",
      "CURIE HS: Career & Technical Education (CTE) - Manufacturing - Pre - Engineering",
      "VON STEUBEN HS: STEM - Magnet College Prep Program",
      "CHICAGO MILITARY HS: CHICAGO MILITARY HS at Bronzeville - Military & Service Leadership",
      "MARINE LEADERSHIP AT AMES HS: Military - Military & Service Leadership",
      "MARINE LEADERSHIP AT AMES HS: Military & Service Leadership",
      "CARVER MILITARY HS: Military & Service Leadership",
      "RICKOVER MILITARY HS: Military & Service Leadership",
      "AIR FORCE HS: Military & Service Leadership",
      "PHOENIX MILITARY HS: Military & Service Leadership",
      "KENWOOD HS: Magnet - Honors",
      "CLEMENTE HS: Career & Technical Education (CTE) - Media & Communication Arts - Broadcast",
      "CLEMENTE HS: Career & Technical Education (CTE) - Culinary & Hospitality Management",
      "CLEMENTE HS: General Education",
      "CLEMENTE HS: Career & Technical Education (CTE) - Health Science",
      "CLEMENTE HS: International Baccalaureate (IB)",
      "CORLISS HS: STEM - Early College STEM",
      "JUAREZ HS: Career & Technical Education (CTE) - Architecture & Construction",
      "JUAREZ HS: Career & Technical Education (CTE) - Culinary & Hospitality Management",
      "JUAREZ HS: Career & Technical Education (CTE) - Education & Training - Teaching Academy",
      "JUAREZ HS: General Education",
      "JUAREZ HS: Career & Technical Education (CTE) - Health Science",
      "JUAREZ HS: International Baccalaureate (IB)",
      "JUAREZ HS: Career & Technical Education (CTE) - Information Technology - Game Programming & Web Design",
      "JULIAN HS: Career & Technical Education (CTE) - Media & Communication Arts - Broadcast",
      "JULIAN HS: Career & Technical Education (CTE) - Media & Communication Arts - Digital Media",
      "JULIAN HS: Career & Technical Education (CTE) - Business & Finance - Entrepreneurship",
      "JULIAN HS: Fine & Performing Arts",
      "JULIAN HS: General Education",
      "JULIAN HS: Career & Technical Education (CTE) - Health Science",
      "JULIAN HS: Career & Technical Education (CTE) - Information Technology - Game Programming",
      "WASHINGTON HS: General Education",
      "WASHINGTON HS: International Baccalaureate (IB)",
      "WELLS HS: Fine & Performing Arts",
      "WELLS HS: General Education",
      "WELLS HS: Career & Technical Education (CTE) - Law & Public Safety - Pre - Law",
      "HUBBARD HS: Career & Technical Education (CTE) - Information Technology - Game Programming",
      "HUBBARD HS: Career & Technical Education (CTE) - Information Technology - Web Development & Design",
      "HUBBARD HS: General Education",
      "HUBBARD HS: International Baccalaureate (IB)",
      "HUBBARD HS: Military & Service Leadership - JROTC",
      "HUBBARD HS: Honors - University Scholars",
      "SULLIVAN HS: Career & Technical Education (CTE) - Business & Finance - Entrepreneurship",
      "SULLIVAN HS: General Education - The English Learner Academy",
      "SULLIVAN HS: General Education",
      "SULLIVAN HS: Career & Technical Education (CTE) - Health Science",
      "TAFT HS: General Education",
      "TAFT HS: International Baccalaureate (IB)",
      "TILDEN HS: Career & Technical Education (CTE) - Culinary & Hospitality Management",
      "TILDEN HS: General Education",
      "DYETT ARTS HS: Fine & Performing Arts - Band",
      "DYETT ARTS HS: Fine & Performing Arts - Choir",
      "DYETT ARTS HS: Fine & Performing Arts - Dance",
      "DYETT ARTS HS: Career & Technical Education (CTE) - Media & Communication Arts - Digital Media",
      "DYETT ARTS HS: General Education",
      "DYETT ARTS HS: Fine & Performing Arts - Theatre",
      "DYETT ARTS HS: Fine & Performing Arts - Visual Arts",
      "BOGAN HS: International Baccalaureate (IB)",
      "FARRAGUT HS: Career & Technical Education (CTE) - Education & Training - Teaching Academy",
      "FARRAGUT HS: International Baccalaureate (IB)",
      "FARRAGUT HS: Military & Service Leadership - JROTC",
      "FARRAGUT HS: Career & Technical Education (CTE) - Law & Public Safety - Pre - Law",
      "FENGER HS: General Education",
      "FENGER HS: Honors",
      "FOREMAN HS: Career & Technical Education (CTE) - Media & Communication Arts - Digital Media",
      "FOREMAN HS: General Education",
      "FOREMAN HS: Career & Technical Education (CTE) - Manufacturing - Pre - Engineering",
      "FOREMAN HS: Military & Service Leadership - JROTC",
      "GAGE PARK HS: General Education",
      "GAGE PARK HS: Career & Technical Education (CTE) - Health Science",
      "HARLAN HS: Career & Technical Education (CTE) - Media & Communication Arts - Digital Media",
      "HARLAN HS: General Education",
      "HIRSCH HS: General Education",
      "HYDE PARK HS: Career & Technical Education (CTE) - Media & Communication Arts - Broadcast",
      "HYDE PARK HS: Career & Technical Education (CTE) - Media & Communication Arts - Digital Media",
      "HYDE PARK HS: General Education",
      "HYDE PARK HS: International Baccalaureate (IB)",
      "KELLY HS: Career & Technical Education (CTE) - Architecture & Construction",
      "KELLY HS: Career & Technical Education (CTE) - Media & Communication Arts - Digital Media",
      "KELLY HS: General Education",
      "KELLY HS: International Baccalaureate (IB)",
      "KELVYN PARK HS: Open Enrollment - General Education",
      "KELVYN PARK HS: Fine & Performing Arts",
      "KELVYN PARK HS: General Education",
      "KELVYN PARK HS: Career & Technical Education (CTE) - Media & Communication Arts - Digital Media",
      "KELVYN PARK HS: Career & Technical Education (CTE) - Health Science",
      "KENNEDY HS: General Education",
      "KENNEDY HS: International Baccalaureate (IB)",
      "RICHARDS HS: Career & Technical Education (CTE) - Business & Finance - Entrepreneurship",
      "RICHARDS HS: Career & Technical Education (CTE) - Culinary & Hospitality Management",
      "RICHARDS HS: General Education",
      "NORTH - GRAND HS: Career &Technical Education (CTE) - Culinary & Hospitality Management",
      "NORTH - GRAND HS: Early College STEAM",
      "NORTH - GRAND HS: Career &Technical Education (CTE) - Health Science",
      "NORTH - GRAND HS: Career & Technical Education (CTE) - Manufacturing - Pre - Engineering",
      "AMUNDSEN HS: General Education/Grow Community",
      "AMUNDSEN HS: International Baccalaureate (IB)",
      "LINCOLN PARK HS: Advanced College Prep (formerly Double Honors)",
      "LINCOLN PARK HS: International Baccalaureate (IB) - MYP Diploma Program",
      "LAKE VIEW HS: Grow Community - Early College STEM",
      "MANLEY HS: Career & Technical Education (CTE) - Culinary & Hospitality Management",
      "MANLEY HS: General Education",
      "MARSHALL HS: Career & Technical Education (CTE) - Agriculture & Horticulture",
      "MARSHALL HS: Career & Technical Education (CTE) - Culinary & Hospitality Management",
      "MARSHALL HS: General Education",
      "MATHER HS: AVID",
      "MATHER HS: Career & Technical Education (CTE) - Media & Communication Arts - Digital Media",
      "MATHER HS: General Education",
      "MATHER HS: Career & Technical Education (CTE) - Information Technology - Game Programming & Web Design",
      "MATHER HS: Career & Technical Education (CTE) - Manufacturing - Pre - Engineering",
      "MATHER HS: Career & Technical Education (CTE) - Law & Public Safety - Pre - Law",
      "MORGAN PARK HS: General Education",
      "MORGAN PARK HS: International Baccalaureate (IB)",
      "PHILLIPS HS: Career & Technical Education (CTE) - Media & Communication Arts - Digital Media",
      "PHILLIPS HS: General Education",
      "ROOSEVELT HS: Career & Technical Education (CTE) - Information Technology - Computer Networking",
      "ROOSEVELT HS: Career & Technical Education (CTE) - Culinary & Hospitality Management",
      "ROOSEVELT HS: Career & Technical Education (CTE) - Education & Training - Teaching Academy",
      "ROOSEVELT HS: General Education",
      "ROOSEVELT HS: World Language - Dual Language",
      "ROOSEVELT HS: Career & Technical Education (CTE) - Health Science",
      "ROOSEVELT HS: Career & Technical Education (CTE) - Information Technology - Game Programming",
      "SCHURZ HS: Career & Technical Education (CTE) - Business & Finance - Accounting & Entrepreneurship",
      "SCHURZ HS: Career & Technical Education (CTE) - Transportation - Automotive Technology",
      "SCHURZ HS: AVID",
      "SCHURZ HS: Career & Technical Education (CTE) - Media & Communication Arts - Digital Media",
      "SCHURZ HS: World Language - Dual Language",
      "SCHURZ HS: General Education",
      "SCHURZ HS: Career & Technical Education (CTE) - Health Science",
      "SCHURZ HS: International Baccalaureate (IB)",
      "SCHURZ HS: Career & Technical Education (CTE) - Manufacturing - Pre - Engineering",
      "SENN HS: General Education",
      "SENN HS: International Baccalaureate (IB)",
      "STEINMETZ HS: Career & Technical Education (CTE) - Media & Communication Arts - Digital Media",
      "STEINMETZ HS: STEAM",
      "STEINMETZ HS: International Baccalaureate (IB)",
      "STEINMETZ HS: Military & Service Leadership - JROTC",
      "ENGLEWOOD STEM HS: Early College STEM",
      "BACK OF THE YARDS HS: World Language - Dual Language",
      "BACK OF THE YARDS HS: General Education",
      "BACK OF THE YARDS HS: International Baccalaureate (IB)",
      "SPRY HS: SPRY COMMUNITY LINKS HS - Three - Year; Year - Round High School",
      "ORR HS: Career & Technical Education (CTE) - Media & Communication Arts - Digital Media",
      "ORR HS: General Education",
      "SOLORIO HS: General Education",
      "SOLORIO HS: Honors - Double Honors/Scholars",
      "SOLORIO HS: Career & Technical Education (CTE) - Manufacturing - Pre - Engineering",
      "OGDEN HS: International Baccalaureate (IB)",
      "DOUGLASS HS: General Education",
      "KING HS: King HS - Career & Technical Education (CTE) - Media & Communication Arts - Digital Media",
      "HANCOCK HS: Career & Technical Education (CTE) - Manufacturing - Pre - Engineering",
      "HANCOCK HS: Career & Technical Education (CTE) - Law & Public Safety - Pre - Law",
      "WESTINGHOUSE HS: Career & Technical Education (CTE) - Career Academy",
      "JONES HS: Pre - Career & Technical Education (CTE) - Manufacturing - Pre - Engineering",
      "JONES HS: Career & Technical Education (CTE) - Law & Public Safety - Pre - Law",
      "SOUTH SHORE INTL HS: Career & Technical Education (CTE) - Health Science",
      "SOUTH SHORE INTL HS: International Baccalaureate (IB)",
      "CHICAGO ACADEMY HS: General Education",
      "CHICAGO ACADEMY HS: Honors - Scholars",
      "WILLIAMS HS: General Education",
      "WILLIAMS HS: Career & Technical Education (CTE) - Health Science",
      "BRONZEVILLE HS: International Baccalaureate (IB)",
      "SOCIAL JUSTICE HS: General Education",
      "SOCIAL JUSTICE HS: Career & Technical Education (CTE) - Health Science",
      "INFINITY HS: LVLHS INFINITY HS - General Education - STEM",
      "MULTICULTURAL ARTS HS: MULTICULTURAL HS - General Education - Fine & Performing Arts",
      "MULTICULTURAL ARTS HS: MULTICULTURAL HS - Career & Technical Education (CTE) - Health Science",
      "BOWEN HS: General Education",
      "BOWEN HS: Career & Technical Education (CTE) - Manufacturing - Pre - Engineering",
      "RABY HS: Career & Technical Education (CTE) - Media & Communication Arts - Broadcast",
      "RABY HS: Career & Technical Education (CTE) - Culinary & Hospitality Management",
      "RABY HS: Career & Technical Education (CTE) - Law & Public Safety - Pre - Law",
      "AUSTIN CCA HS: General Education",
      "ALCOTT HS: Career & Technical Education (CTE) - Manufacturing - Pre - Engineering",
      "WORLD LANGUAGE HS: Career & Technical Education (CTE) - Health Science",
      "WORLD LANGUAGE HS: General Education",
      "UPLIFT HS: Career & Technical Education (CTE) - Education & Training - Teaching Academy",
      "UPLIFT HS: General Education - Early College STEAM",
      "Collins Academy STEAM HS: COLLINS HS - Fine & Performing Arts",
      "Collins Academy STEAM HS: COLLINS HS - General Education",
      "Collins Academy STEAM HS: COLLINS HS - Career & Technical Education (CTE) - Information Technology - Computer Networking",
      "Collins Academy STEAM HS: COLLINS HS - Honors - Scholars"
    ],
    "desc": "None",
    "fn": accept(everyone)
  },
  "93c6f349e4f5e35de421419911fa61b5": {
    "id": "93c6f349e4f5e35de421419911fa61b5",
    "programs": [
      "CHICAGO VOCATIONAL HS: Career & Technical Education (CTE) - Agriculture & Horticulture",
      "CHICAGO VOCATIONAL HS: Career & Technical Education (CTE) - Architecture & Construction - Carpentry",
      "CHICAGO VOCATIONAL HS: Career & Technical Education (CTE) - Personal Care Services - Cosmetology",
      "CHICAGO VOCATIONAL HS: Career & Technical Education (CTE) - Culinary & Hospitality Management",
      "CHICAGO VOCATIONAL HS: Career & Technical Education (CTE) - Transportation - Diesel Technology",
      "CHICAGO VOCATIONAL HS: Career & Technical Education (CTE) - Early College STEM",
      "CURIE HS: Career & Technical Education (CTE) - Business & Finance - Accounting",
      "CURIE HS: Career & Technical Education (CTE) - Architecture & Construction - Architecture",
      "CURIE HS: Career & Technical Education (CTE) - Transportation - Automotive Technology",
      "CURIE HS: Career & Technical Education (CTE) - Media & Communication Arts - Broadcast",
      "CURIE HS: Career & Technical Education (CTE) - Culinary & Hospitality",
      "CURIE HS: Career & Technical Education (CTE) - Media & Communication Arts - Digital Media",
      "CURIE HS: Career & Technical Education (CTE) - Education & Training - Teaching Academy",
      "CURIE HS: Career & Technical Education (CTE) - Information Technology - Game Programming & Web Design",
      "CLEMENTE HS: Career & Technical Education (CTE) - Media & Communication Arts - Broadcast",
      "CLEMENTE HS: Career & Technical Education (CTE) - Culinary & Hospitality Management",
      "JUAREZ HS: Career & Technical Education (CTE) - Architecture & Construction",
      "JUAREZ HS: Career & Technical Education (CTE) - Culinary & Hospitality Management",
      "JUAREZ HS: Career & Technical Education (CTE) - Education & Training - Teaching Academy",
      "JUAREZ HS: Career & Technical Education (CTE) - Information Technology - Game Programming & Web Design",
      "JULIAN HS: Career & Technical Education (CTE) - Media & Communication Arts - Broadcast",
      "JULIAN HS: Career & Technical Education (CTE) - Media & Communication Arts - Digital Media",
      "JULIAN HS: Career & Technical Education (CTE) - Business & Finance - Entrepreneurship",
      "JULIAN HS: Career & Technical Education (CTE) - Information Technology - Game Programming",
      "HUBBARD HS: Career & Technical Education (CTE) - Information Technology - Game Programming",
      "HUBBARD HS: Career & Technical Education (CTE) - Information Technology - Web Development & Design",
      "SULLIVAN HS: Career & Technical Education (CTE) - Business & Finance - Entrepreneurship",
      "TILDEN HS: Career & Technical Education (CTE) - Culinary & Hospitality Management",
      "DYETT ARTS HS: Career & Technical Education (CTE) - Media & Communication Arts - Digital Media",
      "FARRAGUT HS: Career & Technical Education (CTE) - Education & Training - Teaching Academy",
      "FOREMAN HS: Career & Technical Education (CTE) - Media & Communication Arts - Digital Media",
      "HARLAN HS: Career & Technical Education (CTE) - Media & Communication Arts - Digital Media",
      "HYDE PARK HS: Career & Technical Education (CTE) - Media & Communication Arts - Broadcast",
      "HYDE PARK HS: Career & Technical Education (CTE) - Media & Communication Arts - Digital Media",
      "KELLY HS: Career & Technical Education (CTE) - Architecture & Construction",
      "KELLY HS: Career & Technical Education (CTE) - Media & Communication Arts - Digital Media",
      "KELVYN PARK HS: Career & Technical Education (CTE) - Media & Communication Arts - Digital Media",
      "RICHARDS HS: Career & Technical Education (CTE) - Business & Finance - Entrepreneurship",
      "RICHARDS HS: Career & Technical Education (CTE) - Culinary & Hospitality Management",
      "NORTH - GRAND HS: Career &Technical Education (CTE) - Culinary & Hospitality Management",
      "MANLEY HS: Career & Technical Education (CTE) - Culinary & Hospitality Management",
      "MARSHALL HS: Career & Technical Education (CTE) - Agriculture & Horticulture",
      "MARSHALL HS: Career & Technical Education (CTE) - Culinary & Hospitality Management",
      "MATHER HS: Career & Technical Education (CTE) - Media & Communication Arts - Digital Media",
      "MATHER HS: Career & Technical Education (CTE) - Information Technology - Game Programming & Web Design",
      "PHILLIPS HS: Career & Technical Education (CTE) - Media & Communication Arts - Digital Media",
      "ROOSEVELT HS: Career & Technical Education (CTE) - Information Technology - Computer Networking",
      "ROOSEVELT HS: Career & Technical Education (CTE) - Culinary & Hospitality Management",
      "ROOSEVELT HS: Career & Technical Education (CTE) - Education & Training - Teaching Academy",
      "ROOSEVELT HS: Career & Technical Education (CTE) - Information Technology - Game Programming",
      "SCHURZ HS: Career & Technical Education (CTE) - Business & Finance - Accounting & Entrepreneurship",
      "SCHURZ HS: Career & Technical Education (CTE) - Transportation - Automotive Technology",
      "SCHURZ HS: Career & Technical Education (CTE) - Media & Communication Arts - Digital Media",
      "STEINMETZ HS: Career & Technical Education (CTE) - Media & Communication Arts - Digital Media",
      "ORR HS: Career & Technical Education (CTE) - Media & Communication Arts - Digital Media",
      "BOWEN HS: Career & Technical Education (CTE) - Manufacturing & Engineering - Machine Technology"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HSAT Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / 58</li><li>IEP and EL Students: / 48 </li></ul><li><strong>Priority: </strong>Attendance Area,General</li></ul>",
    "fn": conditional({
      filter: either(
        both(ifIEPorEL, ifHasGrades({ hsatCombined: 48 })),
        ifHasGrades({ hsatCombined: 58 })
      ),
      fn: lottery(
        ATTENDANCE_AREA_LOTTERY_STAGE,
        GENERAL_LOTTERY_STAGE
      )
    })
  },
  "093bdb9e6477bfb91a17a801e48e406a": {
    "id": "093bdb9e6477bfb91a17a801e48e406a",
    "programs": [
      "CHICAGO VOCATIONAL HS: Special Education - Deaf/Hard of Hearing",
      "CHICAGO VOCATIONAL HS: Special Education - Significantly Modified Curriculum w/ Intensive Supports",
      "CHICAGO VOCATIONAL HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "DUNBAR HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "PROSSER HS: Special Education - Deaf/Hard of Hearing",
      "PROSSER HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "SIMEON HS: Special Education - Significantly Modified Curriculum w/ Intensive Supports",
      "SIMEON HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "GOODE HS: Special Education - Significantly Modified Curriculum w/ Intensive Supports",
      "CLARK HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "CHICAGO AGRICULTURE HS: Special Education - Significantly Modified Curriculum w/ Intensive Supports",
      "CHICAGO AGRICULTURE HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "CURIE HS: Special Education - Deaf/Hard of Hearing",
      "CURIE HS: Special Education - Visual Impairment",
      "VON STEUBEN HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "KENWOOD HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "CLEMENTE HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "CORLISS HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "JULIAN HS: Special Education - Significantly Modified Curriculum w/ Moderate Support",
      "JULIAN HS: Special Education - MultiSensory",
      "WASHINGTON HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "HUBBARD HS: Special Education - MultiSensory",
      "SULLIVAN HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "TAFT HS: Special Education - Significantly Modified Curriculum w/Intensive Supports",
      "TILDEN HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "DYETT ARTS HS: DYETT HS - Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "BOGAN HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "FARRAGUT HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "FOREMAN HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "GAGE PARK HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "HARLAN HS: Special Education - Significantly Modified Curriculum w/ Intensive Supports",
      "HYDE PARK HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "KELLY HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "KELLY HS: Special Education - MultiSensory",
      "KENNEDY HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "NORTH - GRAND HS: Special Education - Significantly Modified Curriculum w/Intensive Supports",
      "NORTH - GRAND HS: Special Education - Significantly Modified Curriculum w/Moderate Supports",
      "AMUNDSEN HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "LINCOLN PARK HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "LAKE VIEW HS: Special Education - MultiSensory",
      "MORGAN PARK HS: Special Education - Significantly Modified Curriculum w/Moderate Supports",
      "ROOSEVELT HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "SCHURZ HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "ENGLEWOOD STEM HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "SOLORIO HS: Special Education - Significantly Modified Curriculum w/ Intensive Supports",
      "OGDEN HS: Special Education - Deaf/Hard of Hearing",
      "NORTHSIDE PREP HS: Special Education - Significantly Modified Curriculum w/Intensive Supports",
      "KING HS: Special Education - Significantly Modified Curriculum w/ Intensive Supports",
      "KING HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "YOUNG HS: Special Education - Deaf/Hard of Hearing",
      "YOUNG HS: Special Education - Significantly Modified Curriculum w/ Intensive Supports",
      "YOUNG HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "LANE TECH HS: Special Education - Significantly Modified Curriculum w/ Intensive Supports",
      "LANE TECH HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "HANCOCK HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "WESTINGHOUSE HS: Special Education - Significantly Modified Curriculum w/ Intensive Supports",
      "WESTINGHOUSE HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "BROOKS HS: Special Education - Significantly Modified Curriculum w/ Intensive Supports",
      "BROOKS HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "PAYTON HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "PAYTON HS: Special Education - Visual Impairment",
      "JONES HS: Special Education - Significantly Modified Curriculum w/ Intensive Supports",
      "JONES HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "SOUTH SHORE INTL HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "LINDBLOM HS: Special Education - Significantly Modified Curriculum w/ Intensive Supports",
      "LINDBLOM HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "BRONZEVILLE HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "BOWEN HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "RABY HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "UPLIFT HS: Special Education - Significantly Modified Curriculum w/ Intensive Supports",
      "UPLIFT HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "VAUGHN HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "NORTHSIDE LEARNING HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports"
    ],
    "desc": "Cluster and Review",
    "fn": notImplemented
  },
  "bb859ed4e5c91f128ecede83b8a0fc70": {
    "id": "bb859ed4e5c91f128ecede83b8a0fc70",
    "programs": [
      "CHICAGO VOCATIONAL HS: Special Education - Deaf/Hard of Hearing",
      "CHICAGO VOCATIONAL HS: Special Education - Significantly Modified Curriculum w/ Intensive Supports",
      "CHICAGO VOCATIONAL HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "DUNBAR HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "PROSSER HS: Special Education - Deaf/Hard of Hearing",
      "PROSSER HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "SIMEON HS: Special Education - Significantly Modified Curriculum w/ Intensive Supports",
      "SIMEON HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "GOODE HS: Special Education - Significantly Modified Curriculum w/ Intensive Supports",
      "CLARK HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "CHICAGO AGRICULTURE HS: Special Education - Significantly Modified Curriculum w/ Intensive Supports",
      "CHICAGO AGRICULTURE HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "CURIE HS: Special Education - Deaf/Hard of Hearing",
      "CURIE HS: Special Education - Visual Impairment",
      "VON STEUBEN HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "KENWOOD HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "CLEMENTE HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "CORLISS HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "JULIAN HS: Special Education - Significantly Modified Curriculum w/ Moderate Support",
      "JULIAN HS: Special Education - MultiSensory",
      "WASHINGTON HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "HUBBARD HS: Special Education - MultiSensory",
      "SULLIVAN HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "TAFT HS: Special Education - Significantly Modified Curriculum w/Intensive Supports",
      "TILDEN HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "DYETT ARTS HS: DYETT HS - Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "BOGAN HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "FARRAGUT HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "FOREMAN HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "GAGE PARK HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "HARLAN HS: Special Education - Significantly Modified Curriculum w/ Intensive Supports",
      "HYDE PARK HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "KELLY HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "KELLY HS: Special Education - MultiSensory",
      "KENNEDY HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "NORTH - GRAND HS: Special Education - Significantly Modified Curriculum w/Intensive Supports",
      "NORTH - GRAND HS: Special Education - Significantly Modified Curriculum w/Moderate Supports",
      "AMUNDSEN HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "LINCOLN PARK HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "LAKE VIEW HS: Special Education - MultiSensory",
      "MORGAN PARK HS: Special Education - Significantly Modified Curriculum w/Moderate Supports",
      "ROOSEVELT HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "SCHURZ HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "ENGLEWOOD STEM HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "SOLORIO HS: Special Education - Significantly Modified Curriculum w/ Intensive Supports",
      "OGDEN HS: Special Education - Deaf/Hard of Hearing",
      "NORTHSIDE PREP HS: Special Education - Significantly Modified Curriculum w/Intensive Supports",
      "KING HS: Special Education - Significantly Modified Curriculum w/ Intensive Supports",
      "KING HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "YOUNG HS: Special Education - Deaf/Hard of Hearing",
      "YOUNG HS: Special Education - Significantly Modified Curriculum w/ Intensive Supports",
      "YOUNG HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "LANE TECH HS: Special Education - Significantly Modified Curriculum w/ Intensive Supports",
      "LANE TECH HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "HANCOCK HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "WESTINGHOUSE HS: Special Education - Significantly Modified Curriculum w/ Intensive Supports",
      "WESTINGHOUSE HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "BROOKS HS: Special Education - Significantly Modified Curriculum w/ Intensive Supports",
      "BROOKS HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "PAYTON HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "PAYTON HS: Special Education - Visual Impairment",
      "JONES HS: Special Education - Significantly Modified Curriculum w/ Intensive Supports",
      "JONES HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "SOUTH SHORE INTL HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "LINDBLOM HS: Special Education - Significantly Modified Curriculum w/ Intensive Supports",
      "LINDBLOM HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "BRONZEVILLE HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "BOWEN HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "RABY HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "UPLIFT HS: Special Education - Significantly Modified Curriculum w/ Intensive Supports",
      "UPLIFT HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "VAUGHN HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports",
      "NORTHSIDE LEARNING HS: Special Education - Significantly Modified Curriculum w/ Moderate Supports"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>Proximity,General</li></ul>",
    "fn": lottery(
      PROXIMITY_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE
    )
  },
  "081e2bdf67bfe620963a0ebe0abaf6f8": {
    "id": "081e2bdf67bfe620963a0ebe0abaf6f8",
    "programs": [
      "CHICAGO VOCATIONAL HS: General Education",
      "CORLISS HS: STEM - Early College STEM",
      "JUAREZ HS: General Education",
      "JULIAN HS: General Education",
      "WELLS HS: General Education",
      "TILDEN HS: General Education",
      "FENGER HS: General Education",
      "FOREMAN HS: General Education",
      "GAGE PARK HS: General Education",
      "HARLAN HS: General Education",
      "HIRSCH HS: General Education",
      "HYDE PARK HS: General Education",
      "KENNEDY HS: General Education",
      "RICHARDS HS: General Education",
      "MANLEY HS: General Education",
      "MARSHALL HS: General Education",
      "PHILLIPS HS: General Education",
      "SCHURZ HS: General Education",
      "ENGLEWOOD STEM HS: Early College STEM",
      "ORR HS: General Education",
      "SOCIAL JUSTICE HS: General Education",
      "MULTICULTURAL ARTS HS: MULTICULTURAL HS - General Education - Fine & Performing Arts",
      "BOWEN HS: General Education",
      "AUSTIN CCA HS: General Education",
      "WORLD LANGUAGE HS: General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>Attendance Area,Sibling Preference,Staff Preference,General</li><li><strong>Note: </strong>Staff Preference applies at the entry level grade only. A maximum of 2 seats can be filled through Staff Preference.</li></ul>",
    "fn": lottery(
      ATTENDANCE_AREA_LOTTERY_STAGE,
      SIBLING_LOTTERY_STAGE,
      STAFF_PREFERENCE_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE
    )
  },
  "817ab6b8acdc912f43ade2ab6d3f1bc7": {
    "id": "817ab6b8acdc912f43ade2ab6d3f1bc7",
    "programs": [
      "CHICAGO VOCATIONAL HS: Career & Technical Education (CTE) - Health Science",
      "DUNBAR HS: Career & Technical Education (CTE) - Health Science",
      "CURIE HS: Career & Technical Education (CTE) - Manufacturing - Pre - Engineering",
      "VON STEUBEN HS: Honors - Scholars",
      "CHICAGO MILITARY HS: CHICAGO MILITARY HS at Bronzeville - Military & Service Leadership",
      "CARVER MILITARY HS: Military & Service Leadership",
      "AIR FORCE HS: Military & Service Leadership",
      "PHOENIX MILITARY HS: Military & Service Leadership",
      "CLEMENTE HS: Career & Technical Education (CTE) - Health Science",
      "JUAREZ HS: Career & Technical Education (CTE) - Health Science",
      "JULIAN HS: Career & Technical Education (CTE) - Health Science",
      "WELLS HS: Career & Technical Education (CTE) - Law & Public Safety - Pre - Law",
      "HUBBARD HS: Honors - University Scholars",
      "SULLIVAN HS: Career & Technical Education (CTE) - Health Science",
      "FARRAGUT HS: Career & Technical Education (CTE) - Law & Public Safety - Pre - Law",
      "FOREMAN HS: Career & Technical Education (CTE) - Manufacturing - Pre - Engineering",
      "GAGE PARK HS: Career & Technical Education (CTE) - Health Science",
      "KELVYN PARK HS: Career & Technical Education (CTE) - Health Science",
      "NORTH - GRAND HS: Career &Technical Education (CTE) - Health Science",
      "NORTH - GRAND HS: Career & Technical Education (CTE) - Manufacturing - Pre - Engineering",
      "MATHER HS: Career & Technical Education (CTE) - Manufacturing - Pre - Engineering",
      "MATHER HS: Career & Technical Education (CTE) - Law & Public Safety - Pre - Law",
      "ROOSEVELT HS: Career & Technical Education (CTE) - Health Science",
      "SCHURZ HS: Career & Technical Education (CTE) - Health Science",
      "SCHURZ HS: Career & Technical Education (CTE) - Manufacturing - Pre - Engineering",
      "SOLORIO HS: Honors - Double Honors/Scholars",
      "SOLORIO HS: Career & Technical Education (CTE) - Manufacturing - Pre - Engineering",
      "KING HS: Career & Technical Education (CTE) - Manufacturing - Pre - Engineering",
      "SOUTH SHORE INTL HS: Career & Technical Education (CTE) - Health Science",
      "WILLIAMS HS: Career & Technical Education (CTE) - Health Science",
      "SOCIAL JUSTICE HS: Career & Technical Education (CTE) - Health Science",
      "MULTICULTURAL ARTS HS: MULTICULTURAL HS - Career & Technical Education (CTE) - Health Science",
      "BOWEN HS: Career & Technical Education (CTE) - Manufacturing - Pre - Engineering",
      "RABY HS: Career & Technical Education (CTE) - Law & Public Safety - Pre - Law",
      "ALCOTT HS: Career & Technical Education (CTE) - Manufacturing - Pre - Engineering",
      "WORLD LANGUAGE HS: Career & Technical Education (CTE) - Health Science"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Descending Point Score based on Academic Criteria</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>General</li></ul>",
    "fn": ctePointSystem
  },
  "7a3053081112d27ead712163d022d3ec": {
    "id": "7a3053081112d27ead712163d022d3ec",
    "programs": [
      "DUNBAR HS: Career & Technical Education (CTE) - Transportation - Auto Body Repair",
      "DUNBAR HS: Career & Technical Education (CTE) - Architecture & Construction - Architecture",
      "DUNBAR HS: Career & Technical Education (CTE) - Broadcast Technology",
      "DUNBAR HS: Career & Technical Education (CTE) - Culinary & Hospitality",
      "DUNBAR HS: Career & Technical Education (CTE) - Personal Care Services - Cosmetology",
      "CHICAGO TECH HS: Career & Technical Education (CTE) - Information Technology - Game Programming",
      "KING HS: King HS - Career & Technical Education (CTE) - Media & Communication Arts - Digital Media",
      "RABY HS: Career & Technical Education (CTE) - Media & Communication Arts - Broadcast",
      "RABY HS: Career & Technical Education (CTE) - Culinary & Hospitality Management",
      "UPLIFT HS: Career & Technical Education (CTE) - Education & Training - Teaching Academy",
      "Collins Academy STEAM HS: COLLINS HS - Career & Technical Education (CTE) - Information Technology - Computer Networking"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HSAT Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / 58</li><li>IEP and EL Students: / 48 </li></ul><li><strong>Priority: </strong>Proximity,General</li></ul>",
    "fn": conditional({
      filter: either(
        both(ifIEPorEL, ifHasGrades({ hsatCombined: 48 })),
        ifHasGrades({ hsatCombined: 58 })
      ),
      fn: lottery(
        PROXIMITY_LOTTERY_STAGE,
        GENERAL_LOTTERY_STAGE
      )
    })
  },
  "9be7162e1ee6037b9132f599f6bd2f1f": {
    "id": "9be7162e1ee6037b9132f599f6bd2f1f",
    "programs": [
      "PROSSER HS: Career & Technical Education (CTE) - Career Academy"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>2.5</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>Sibling Preference,Staff Preference,Proximity,General</li><li><strong>Note: </strong>Staff Preference applies at the entry level grade only. A maximum of 2 seats can be filled through Staff Preference.</li></ul>",
    "fn": conditional({
      filter: ifHasGrades({ gpa: 2.5 }),
      fn: lottery(
        SIBLING_LOTTERY_STAGE,
        STAFF_PREFERENCE_LOTTERY_STAGE,
        PROXIMITY_LOTTERY_STAGE,
        GENERAL_LOTTERY_STAGE
      )
    })
  },
  "bc3f0c8eeccd7c254c8e2beb0acbdeab": {
    "id": "bc3f0c8eeccd7c254c8e2beb0acbdeab",
    "programs": [
      "PROSSER HS: International Baccalaureate (IB)",
      "SOUTH SHORE INTL HS: International Baccalaureate (IB)",
      "BRONZEVILLE HS: International Baccalaureate (IB)"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Descending Point Score based on Academic Criteria</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>General</li><li><strong>Note: </strong>50 bonus points for students who live within 2.5 miles of the school.</li></ul>",
    "fn": ibPointSystem
  },
  "d416d93fd0bc8c838400e8110be5d6ae": {
    "id": "d416d93fd0bc8c838400e8110be5d6ae",
    "programs": [
      "SIMEON HS: Career & Technical Education (CTE) - Career Academy"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>2.0</li><li><strong>HSAT Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / 58</li><li>IEP and EL Students: / 48 </li></ul><li><strong>Priority: </strong>General</li></ul>",
    "fn": conditional({
      filter: either(
        both(ifIEPorEL, ifHasGrades({ hsatCombined: 48, gpa: 2.0 })),
        ifHasGrades({ hsatCombined: 58, gpa: 2.0 })
      ),
      fn: lottery(
        GENERAL_LOTTERY_STAGE
      )
    })
  },
  "f1f7d18151615d2a896c2b5bda0b151c": {
    "id": "f1f7d18151615d2a896c2b5bda0b151c",
    "programs": [
      "ACERO - GARCIA HS: STEM",
      "ACERO - SOTO HS: Charter - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>Sibling Preference,Elementary Preference,General</li><li><strong>Note: </strong>Elementary preference: ACERO - BRIGHTON PARK, ACERO - CISNEROS, ACERO - CLEMENTE, ACERO - DE LA CRUZ, ACERO - DE LAS CASAS, ACERO - FUENTES, ACERO - IDAR, ACERO - MARQUEZ, ACERO - PAZ, ACERO - SANTIAGO, ACERO - TAMAYO, ACERO - TORRES, ACERO - ZIZUMBO\"</li></ul>",
    "fn": lottery(
      SIBLING_LOTTERY_STAGE,
      {
        filter: ifStudentAttendsOneOf(...ACERO_ES_PROGRAMS),
        size: LotteryStageSize.LARGE
      },
      GENERAL_LOTTERY_STAGE,
    )
  },
  "6bad5064d64f2ad02dac9b05231213f0": {
    "id": "6bad5064d64f2ad02dac9b05231213f0",
    "programs": [
      "URBAN PREP - ENGLEWOOD HS: Urban Prep Academy for Young Men HS - Englewood - Charter - General Education",
      "PERSPECTIVES - TECH HS: Charter - STEM",
      "NOBLE - NOBLE HS: Charter - General Education",
      "NOBLE - GOLDER HS: Charter - General Education",
      "NOBLE - PRITZKER HS: Charter - General Education",
      "NOBLE - RAUNER HS: Charter - General Education",
      "NOBLE - ROWE CLARK HS: Charter - STEM",
      "NLCP - CHRISTIANA HS: NORTH LAWNDALE - CHRISTIANA HS - Charter - General Education",
      "NLCP - COLLINS HS: NORTH LAWNDALE - COLLINS HS - Charter - General Education",
      "NOBLE - MUCHIN HS: Charter - General Education",
      "INSTITUTO - HEALTH: Charter - Health Sciences",
      "INSTITUTO - HEALTH: Charter - General Education",
      "URBAN PREP - BRONZEVILLE HS: Urban Prep Academy For Young Men HS - Bronzeville - Charter - General Education",
      "NOBLE - JOHNSON HS: Charter - General Education",
      "EPIC HS: Charter - General Education",
      "NOBLE - ACADEMY HS: Charter - General Education",
      "NOBLE - BUTLER HS: Charter - General Education",
      "NOBLE - BAKER HS: Charter - General Education",
      "NOBLE - HANSBERRY HS: Charter - International Baccalaureate (IB)",
      "NOBLE - DRW HS: Charter - General Education",
      "LEGAL PREP HS: Charter - Law & Public Safety",
      "NOBLE - MANSUETO HS: Charter - General Education",
      "CHICAGO TECH HS: STEM"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>Sibling Preference,General</li></ul>",
    "fn": lottery(
      SIBLING_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE
    )
  },
  "2ec716c893a873f0aa4a2aa0e78598a9": {
    "id": "2ec716c893a873f0aa4a2aa0e78598a9",
    "programs": [
      "PERSPECTIVES - LEADERSHIP HS: Charter - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>Continuing Enrollment,Elementary Preference,Sibling Preference,General</li></ul>",
    "fn": lottery(
      {
        filter: ifStudentAttendsOneOf(
          //FIXME add Noble Comer ES
        ),
        size: LotteryStageSize.SMALL
      },
      SIBLING_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE
    )
  },
  "3b105ecc91d4a04cc2531ce3572d05e0": {
    "id": "3b105ecc91d4a04cc2531ce3572d05e0",
    "programs": [
      "PERSPECTIVES - JOSLIN HS: Charter - General Education",
      "PERSPECTIVES - MATH & SCI HS: Charter - STEM",
      "CHICAGO MATH & SCIENCE HS: CHICAGO MATH & SCIENCE ACADEMY HS - Charter - General Education",
      "CHICAGO COLLEGIATE: Charter - General Education",
      "INTRINSIC HS: Charter - General Education",
      "ART IN MOTION: ART in MOTION HS - Charter - Fine & Performing Arts"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>Continuing Enrollment,Sibling Preference,General</li></ul>",
    "fn": lottery(
      {filter: ifStudentAttendsOneOf(
        CHICAGO_COLLEGIATE_GENERAL_EDUCATION_JOINT_ES_HS_PROGRAM,
        CHICAGO_MATH_AND_SCIENCE_GENERAL_EDUCATION_JOINT_ES_HS_PROGRAM
        //FIXME add perspectives, art in motion and intrinsic 8th grades
      ),
    size: LotteryStageSize.LARGE},
    SIBLING_LOTTERY_STAGE,
    GENERAL_LOTTERY_STAGE,
    )
  },
  "6de8bdb1e5a08bbac808406bdf0ff272": {
    "id": "6de8bdb1e5a08bbac808406bdf0ff272",
    "programs": [
      "CICS - LONGWOOD: Charter - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>Continuing Enrollment,Elementary Preference,Sibling Preference,General</li><li><strong>Note: </strong>Elementary preference: CICS - AVALON/SOUTH SHORE, CICS - BASIL, CICS - BUCKTOWN, CICS - IRVING PARK, CICS - LONGWOOD, CICS - PRAIRIE, CICS - WASHINGTON PARK, CICS - WEST BELDEN, CICS - WRIGHTWOOD</li></ul>",
    "fn": conditional(
      {
        filter: ifStudentAttendsOneOf(CICS_LONGWOOD_GENERAL_EDUCATION_JOINT_ES_HS_PROGRAM),
        fn: accept(everyone)
      },
      {
        filter: everyone,
        fn: lottery(
          {
            filter: ifStudentAttendsOneOf(
              CICS_AVALON_ES_PROGRAM,
              CICS_BASIL_ES_PROGRAM,
              CICS_BUCKTOWN_ES_PROGRAM,
              CICS_IRVING_PARK_ES_PROGRAM,
              CICS_LONGWOOD_GENERAL_EDUCATION_JOINT_ES_HS_PROGRAM,
              CICS_PRAIRIE_ES_PROGRAM,
              CICS_WASHINGTON_PARK_ES_PROGRAM,
              CICS_WEST_BELDEN_ES_PROGRAM,
              CICS_WRIGHTWOOD_ES_PROGRAM
            ),
            size: LotteryStageSize.LARGE
          },
          SIBLING_LOTTERY_STAGE,
          GENERAL_LOTTERY_STAGE,
        )
      }
    )
  },
  "d35d03512cc79195717b431d888ac1bd": {
    "id": "d35d03512cc79195717b431d888ac1bd",
    "programs": [
      "CICS - NORTHTOWN HS: Charter - General Education",
      "CICS - ELLISON HS: Charter - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>Elementary Preference,Sibling Preference,Overlay,General</li><li><strong>Note: </strong>Elementary preference: CICS - AVALON/SOUTH SHORE, CICS - BASIL, CICS - BUCKTOWN, CICS - IRVING PARK, CICS - LONGWOOD, CICS - PRAIRIE, CICS - WASHINGTON PARK, CICS - WEST BELDEN, CICS - WRIGHTWOOD</li></ul>",
    "fn": lottery(
      {
        filter: ifStudentAttendsOneOf(
          CICS_AVALON_ES_PROGRAM,
          CICS_BASIL_ES_PROGRAM,
          CICS_BUCKTOWN_ES_PROGRAM,
          CICS_IRVING_PARK_ES_PROGRAM,
          CICS_LONGWOOD_GENERAL_EDUCATION_JOINT_ES_HS_PROGRAM,
          CICS_PRAIRIE_ES_PROGRAM,
          CICS_WASHINGTON_PARK_ES_PROGRAM,
          CICS_WEST_BELDEN_ES_PROGRAM,
          CICS_WRIGHTWOOD_ES_PROGRAM
        ),
        size: LotteryStageSize.LARGE
      },
      SIBLING_LOTTERY_STAGE,
      // Overlay lottery stage
      GENERAL_LOTTERY_STAGE,
    )
  },
  "aab155b12ad42ed9e64d2cd29038c54d": {
    "id": "aab155b12ad42ed9e64d2cd29038c54d",
    "programs": [
      "NOBLE - COMER: Charter - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>Continuing Enrollment,Sibling Preference,Overlay,General</li></ul>",
    "fn": lottery(
      {
        filter: ifStudentAttendsOneOf(
          //FIXME add Noble Comer ES
        ),
        size: LotteryStageSize.SMALL
      },
      SIBLING_LOTTERY_STAGE,
      // Overlay lottery stage
      GENERAL_LOTTERY_STAGE
    )
  },
  "1fba1b4cca87c8657ab164e5a3f1978a": {
    "id": "1fba1b4cca87c8657ab164e5a3f1978a",
    "programs": [
      "NOBLE - UIC HS: Charter - General Education",
      "NOBLE - BULLS HS: Charter - General Education",
      "NOBLE - ITW SPEER HS: Charter - STEM"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>Sibling Preference,Overlay,General</li></ul>",
    "fn": lottery(
      SIBLING_LOTTERY_STAGE,
      // (overlay lottery stage?)
      GENERAL_LOTTERY_STAGE
    )
  },
  "ca54a9d6c181303e76790484048a2300": {
    "id": "ca54a9d6c181303e76790484048a2300",
    "programs": [
      "ASPIRA - EARLY COLLEGE HS: Charter - General Education",
      "ASPIRA - BUSINESS & FINANCE HS: Charter - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>Elementary Preference,Sibling Preference,General</li><li><strong>Note: </strong>Elementary preference: Aspira Haugan Middle</li></ul>",
    "fn": lottery(
      {
        filter: ifStudentAttendsOneOf(
          ASPIRA_MS_PROGRAM
        ),
        size: LotteryStageSize.LARGE
      },
      SIBLING_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE,
    )
  },
  "816fa9b319531493e8371cef6eb303d7": {
    "id": "816fa9b319531493e8371cef6eb303d7",
    "programs": [
      "U OF C - WOODLAWN HS: Charter - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>Sibling Preference,Continuing Enrollment,Overlay,General</li><li><strong>Note: </strong>Elementary preference: U of C Woodlawn</li></ul>",
    "fn": conditional(
      {filter: ifStudentAttendsOneOf(
        U_OF_C_WOODLAWN_GENERAL_EDUCATION_JOINT_ES_HS_PROGRAM, 
      ),
      fn: accept(everyone)},{
      filter: everyone,  
      fn:lottery(
        SIBLING_LOTTERY_STAGE,
        PROXIMITY_LOTTERY_STAGE,
        GENERAL_LOTTERY_STAGE,
        )
      }
    )
  },
  "b6b2599871fd7e47bf217d61e7ce2e07": {
    "id": "b6b2599871fd7e47bf217d61e7ce2e07",
    "programs": [
      "GOODE HS: STEM - Early College STEM",
      "BACK OF THE YARDS HS: General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>Sibling Preference,Staff Preference,Overlay,General</li><li><strong>Note: </strong>Staff Preference applies at the entry level grade only. A maximum of 2 seats can be filled through Staff Preference.</li></ul>",
    "fn": lottery(
      SIBLING_LOTTERY_STAGE,
      STAFF_PREFERENCE_LOTTERY_STAGE,
      // Overlay lottery stage
      GENERAL_LOTTERY_STAGE
    )
  },
  "83cb9088eedf39ff8ccb0954b72ba2da": {
    "id": "83cb9088eedf39ff8ccb0954b72ba2da",
    "programs": [
      "CHIARTS HS: Fine & Performing Arts - Instrumental Music Brass & Woodwinds",
      "CHIARTS HS: Fine & Performing Arts - Creative Writing",
      "CHIARTS HS: Fine & Performing Arts - Dance",
      "CHIARTS HS: Fine & Performing Arts - Instrumental Music Guitar",
      "CHIARTS HS: Fine & Performing Arts - Musical Theatre",
      "CHIARTS HS: Fine & Performing Arts - Instrumental Music Percussion",
      "CHIARTS HS: Fine & Performing Arts - Instrumental Music Piano",
      "CHIARTS HS: Fine & Performing Arts - Instrumental Music Strings",
      "CHIARTS HS: Fine & Performing Arts - Theatre",
      "CHIARTS HS: Fine & Performing Arts - Vocal Music",
      "LINCOLN PARK HS: Fine & Performing Arts - Drama",
      "LINCOLN PARK HS: Fine & Performing Arts - Instrumental Music",
      "LINCOLN PARK HS: Fine & Performing Arts - Vocal Music",
      "SENN HS: Fine & Performing Arts - Dance",
      "SENN HS: Fine & Performing Arts - Music",
      "SENN HS: Fine & Performing Arts - Theatre"
    ],
    "desc": "Audition",
    "fn": notImplemented
  },
  "3c17ba5d0be89b258bf24d7be9371b52": {
    "id": "3c17ba5d0be89b258bf24d7be9371b52",
    "programs": [
      "CHIARTS HS: Fine & Performing Arts - Instrumental Music Brass & Woodwinds",
      "CHIARTS HS: Fine & Performing Arts - Creative Writing",
      "CHIARTS HS: Fine & Performing Arts - Dance",
      "CHIARTS HS: Fine & Performing Arts - Instrumental Music Guitar",
      "CHIARTS HS: Fine & Performing Arts - Musical Theatre",
      "CHIARTS HS: Fine & Performing Arts - Instrumental Music Percussion",
      "CHIARTS HS: Fine & Performing Arts - Instrumental Music Piano",
      "CHIARTS HS: Fine & Performing Arts - Instrumental Music Strings",
      "CHIARTS HS: Fine & Performing Arts - Theatre",
      "CHIARTS HS: Fine & Performing Arts - Visual Arts",
      "CHIARTS HS: Fine & Performing Arts - Vocal Music"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Descending Point Score based on Audition Score</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>General</li><li><strong>Note: </strong>Schedule your audition in your GoCPS account. For more information visit: Visit https://chiarts.org/prospective-students-parents/apply/audition-requirements/</li></ul>",
    "fn": notImplemented
  },
  "fabca26dfec794d58fff02d0d1a06854": {
    "id": "fabca26dfec794d58fff02d0d1a06854",
    "programs": [
      "CHIARTS HS: Fine & Performing Arts - Visual Arts",
      "LINCOLN PARK HS: Fine & Performing Arts - Visual Arts",
      "SENN HS: Fine & Performing Arts - Visual Arts"
    ],
    "desc": "Portfolio Review",
    "fn": notImplemented
  },
  "df8627b81894efb4710d33dc60ae9678": {
    "id": "df8627b81894efb4710d33dc60ae9678",
    "programs": [
      "CLARK HS: International Baccalaureate (IB)"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Descending Point Score based on Academic Criteria</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>General</li><li><strong>Note: </strong>50 bonus points for students who live within a 2.5 mile proximity of the school. </li></ul>",
    "fn": ibPointSystem
  },
  "f7e8317dbeb6460ab02f669efe1b256e": {
    "id": "f7e8317dbeb6460ab02f669efe1b256e",
    "programs": [
      "CLARK HS: Magnet - Early College STEM",
      "CRANE MEDICAL HS: Magnet - Early College STEM",
      "VON STEUBEN HS: STEM - Magnet College Prep Program"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HSAT Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / 58</li><li>IEP and EL Students: / 48 </li></ul><li><strong>Priority: </strong>Sibling Preference,Staff Preference,Tier</li></ul>",
    "fn": conditional({
      filter: (either(
        both(ifIEPorEL, ifHasGrades({ hsatCombined: 48 })),
        ifHasGrades({ hsatCombined: 58 })
      )),
      fn: lottery(
        SIBLING_LOTTERY_STAGE,
        STAFF_PREFERENCE_LOTTERY_STAGE,
        TIER_LOTTERY_STAGE
      )
    })
  },
  "91e3f439df431f03edf2fa30f590297b": {
    "id": "91e3f439df431f03edf2fa30f590297b",
    "programs": [
      "DISNEY II HS: Magnet - Fine & Performing Arts, Technology"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>Sibling Preference,Staff Preference,Proximity,Tier,General</li><li><strong>Note: </strong>This program serves only grades 7-8. There is a separate program available for applicants to grade 9.Staff Preference applies at the entry level grade only. A maximum of 2 seats can be filled through Staff Preference.</li></ul>",
    "fn": lottery(
      SIBLING_LOTTERY_STAGE,
      STAFF_PREFERENCE_LOTTERY_STAGE,
      PROXIMITY_LOTTERY_STAGE,
      TIER_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE
    )
  },
  "b80488c13bcff002e3cb9d8f1362733c": {
    "id": "b80488c13bcff002e3cb9d8f1362733c",
    "programs": [
      "DISNEY II HS: Magnet - Fine & Performing Arts, Technology"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HSAT Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / 58</li><li>IEP and EL Students: / 48 </li></ul><li><strong>Priority: </strong>Continuing Enrollment,Sibling Preference,Staff Preference,Tier</li></ul>",
    "fn": conditional(
      {
        filter: either(
          both(ifIEPorEL, ifHasGrades({ hsatCombined: 48 })),
          ifHasGrades({ hsatCombined: 58 })
        ),
        fn: lottery(
          CONTINUING_STUDENTS_LOTTERY_STAGE,
          SIBLING_LOTTERY_STAGE,
          STAFF_PREFERENCE_LOTTERY_STAGE,
          TIER_LOTTERY_STAGE,
          GENERAL_LOTTERY_STAGE
        )
      }
    )
  },
  "79351495f858d1fd543e18427a1883c1": {
    "id": "79351495f858d1fd543e18427a1883c1",
    "programs": [
      "CHICAGO AGRICULTURE HS: Magnet - Agriculture & Horticulture"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HSAT Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / 58</li><li>IEP and EL Students: / 48 </li></ul><li><strong>Priority: </strong>Overlay,Sibling Preference,Staff Preference,Tier</li></ul>",
    "fn": conditional(
      {
        filter: either(
          both(ifIEPorEL, ifHasGrades({ hsatCombined: 48 })),
          ifHasGrades({ hsatCombined: 58 })
        ),
        fn: lottery(
          SIBLING_LOTTERY_STAGE,
          STAFF_PREFERENCE_LOTTERY_STAGE,
          TIER_LOTTERY_STAGE,
          GENERAL_LOTTERY_STAGE
        )
      }
    )
  },
  "1cccdfcfb9e313883cdb87cf6674dd2c": {
    "id": "1cccdfcfb9e313883cdb87cf6674dd2c",
    "programs": [
      "CURIE HS: AVID"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>2.5</li><li><strong>HSAT Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / 120</li><li>IEP and EL Students: / 110 </li></ul><li><strong>Priority: </strong>Sibling Preference,Attendance Area,General</li></ul>",
    "fn": conditional(
      {
        filter: either(
          both(ifIEPorEL, ifHasGrades({ hsatCombined: 110, gpa: 2.5 })),
          ifHasGrades({ hsatCombined: 120, gpa: 2.5 })
        ),
        fn: lottery(
          SIBLING_LOTTERY_STAGE,
          ATTENDANCE_AREA_LOTTERY_STAGE,
          GENERAL_LOTTERY_STAGE
        )
      }
    )
  },
  "6d8071cea60fc56814c1a950a9a0f0b0": {
    "id": "6d8071cea60fc56814c1a950a9a0f0b0",
    "programs": [
      "CURIE HS: Magnet - Fine & Performing Arts - Fine & Performing Arts",
      "BRONZEVILLE HS: General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>General</li></ul>",
    "fn": lottery(GENERAL_LOTTERY_STAGE)
  },
  "71c627d8bc69f51ceca1f29a904111c0": {
    "id": "71c627d8bc69f51ceca1f29a904111c0",
    "programs": [
      "CURIE HS: International Baccalaureate (IB)"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Descending Point Score based on Academic Criteria</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>Elementary Preference,General</li><li><strong>Note: </strong>50 bonus points for attendance areaElementary preference: Edwards ES (IB Partner School)</li></ul>",
    "fn": conditional(
      {
        filter: ifStudentAttendsOneOf(EDWARDS_LANGUAGE_PROGRAM),
        fn: accept(everyone)
      },
      {
        filter: everyone,
        fn: ibPointSystem
      }
    )
  },
  "cd66854f8a2b17c12348b3cacde2ddc8": {
    "id": "cd66854f8a2b17c12348b3cacde2ddc8",
    "programs": [
      "CURIE HS: General Education",
      "WASHINGTON HS: General Education",
      "SENN HS: General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>Attendance Area</li></ul>",
    "fn": lottery(
      ATTENDANCE_AREA_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE
    )
  },
  "7b6ef4cc299f4329a9b1f910735d8537": {
    "id": "7b6ef4cc299f4329a9b1f910735d8537",
    "programs": [
      "MARINE LEADERSHIP AT AMES HS: Military - Military & Service Leadership"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>Sibling Preference,Staff Preference,General</li><li><strong>Note: </strong>This program serves only grades 7-8. There is a separate program available for applicants to grade 9.</li></ul>",
    "fn": lottery(
      SIBLING_LOTTERY_STAGE,
      STAFF_PREFERENCE_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE
    )
  },
  "ab63706c73ce1b6f05742ce80a32c151": {
    "id": "ab63706c73ce1b6f05742ce80a32c151",
    "programs": [
      "MARINE LEADERSHIP AT AMES HS: Military & Service Leadership"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Descending Point Score based on Academic Criteria</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>Continuing Enrollment,General</li></ul>",
    "fn": notImplemented //TODO military
  },
  "5cb8d66479ddd02fdd9cb181f2c4d581": {
    "id": "5cb8d66479ddd02fdd9cb181f2c4d581",
    "programs": [
      "RICKOVER MILITARY HS: Military & Service Leadership"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Descending Point Score based on Academic Criteria</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>Proximity,General</li></ul>",
    "fn": notImplemented //TODO military
  },
  "626ed37ef5e5e5f484aa97869fd3a842": {
    "id": "626ed37ef5e5e5f484aa97869fd3a842",
    "programs": [
      "KENWOOD HS: Selective Enrollment - Academic Center",
      "TAFT HS: Selective Enrollment - Academic Center",
      "MORGAN PARK HS: Selective Enrollment - Academic Center",
      "NORTHSIDE PREP HS: Selective Enrollment High School",
      "KING HS: Selective Enrollment High School",
      "YOUNG HS: Selective Enrollment - Academic Center",
      "YOUNG HS: Selective Enrollment High School",
      "LANE TECH HS: Selective Enrollment - Academic Center",
      "LANE TECH HS: Selective Enrollment High School",
      "HANCOCK HS: Selective Enrollment High School",
      "WESTINGHOUSE HS: Selective Enrollment High School",
      "BROOKS HS: Selective Enrollment - Academic Center",
      "BROOKS HS: Selective Enrollment High School",
      "PAYTON HS: Selective Enrollment High School",
      "JONES HS: Selective Enrollment High School",
      "SOUTH SHORE INTL HS: Selective Enrollment High School",
      "LINDBLOM HS: Selective Enrollment - Academic Center",
      "LINDBLOM HS: Selective Enrollment High School"
    ],
    "desc": "Admissions Exam",
    "fn": accept(everyone)
  },
  "bc5ee15f157b471dc0955876b7ce1946": {
    "id": "bc5ee15f157b471dc0955876b7ce1946",
    "programs": [
      "KENWOOD HS: Selective Enrollment - Academic Center",
      "TAFT HS: Selective Enrollment - Academic Center",
      "MORGAN PARK HS: Selective Enrollment - Academic Center",
      "YOUNG HS: Selective Enrollment - Academic Center",
      "LANE TECH HS: Selective Enrollment - Academic Center",
      "BROOKS HS: Selective Enrollment - Academic Center",
      "LINDBLOM HS: Selective Enrollment - Academic Center"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Descending Point Score based on Academic Criteria</li><li><strong>GPA: </strong>2.5</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>General,Tier</li><li><strong>Note: </strong>The Academic Center program serves only grades 7-8.The distribution of available seats into the 4 socio-economic tiers will only be applicable at the entry-level grade (7th grade).</li></ul>",
    "fn": notImplemented //FIXME remove these from this part of site?
  },
  "3447aac508771f7718f1dd163a717599": {
    "id": "3447aac508771f7718f1dd163a717599",
    "programs": [
      "KENWOOD HS: Magnet - Honors"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>3.0</li><li><strong>HSAT Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / 120</li><li>IEP and EL Students: / 110 </li></ul><li><strong>Priority: </strong>General</li></ul>",
    "fn": conditional({
      filter: either(
        both(ifIEPorEL, ifHasGrades({ hsatCombined: 110, gpa: 3.0 })),
        ifHasGrades({ hsatCombined: 120, gpa: 3.0 })
      ),
      fn: lottery(
        GENERAL_LOTTERY_STAGE
      )
    })
  },
  "73a6e0ea8d720c3a0b14b904a831e352": {
    "id": "73a6e0ea8d720c3a0b14b904a831e352",
    "programs": [
      "KENWOOD HS: General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>Continuing Enrollment,Attendance Area,General</li></ul>",
    "fn": conditional(
      {
        filter: either(ifStudentAttendsOneOf(KENWOOD_ACADEMIC_CENTER_PROGRAM), ifInAttendBound),
        fn: accept(everyone)
      },
      {
        filter:everyone,
        fn:lottery(
          CONTINUING_STUDENTS_LOTTERY_STAGE,
          ATTENDANCE_AREA_LOTTERY_STAGE,
          GENERAL_LOTTERY_STAGE,
        )
      }
    )
  },
  "64380570ae091ab3d8b7d9fa2c7852b6": {
    "id": "64380570ae091ab3d8b7d9fa2c7852b6",
    "programs": [
      "CLEMENTE HS: General Education",
      "NORTH - GRAND HS: Early College STEAM"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>2.5</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>Attendance Area,Sibling Preference,Staff Preference,General</li><li><strong>Note: </strong>Staff Preference applies at the entry level grade only. A maximum of 2 seats can be filled through Staff Preference.</li></ul>",
    "fn": conditional(
      {
        filter:ifInAttendBound,
        fn:accept(everyone)
      },
      {
        filter:ifHasGrades({
          gpa:2.5
        }),
        fn:lottery(
          ATTENDANCE_AREA_LOTTERY_STAGE,
          SIBLING_LOTTERY_STAGE,
          STAFF_PREFERENCE_LOTTERY_STAGE,
          GENERAL_LOTTERY_STAGE,
        )
      }
    )
  },
  "797a5c85e21922fa801c996061d75798": {
    "id": "797a5c85e21922fa801c996061d75798",
    "programs": [
      "CLEMENTE HS: International Baccalaureate (IB)",
      "JUAREZ HS: International Baccalaureate (IB)",
      "HUBBARD HS: International Baccalaureate (IB)",
      "BOGAN HS: International Baccalaureate (IB)",
      "KELLY HS: International Baccalaureate (IB)",
      "KENNEDY HS: International Baccalaureate (IB)",
      "LINCOLN PARK HS: International Baccalaureate (IB) - MYP Diploma Program",
      "SCHURZ HS: International Baccalaureate (IB)"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Descending Point Score based on Academic Criteria</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>General</li><li><strong>Note: </strong>50 bonus points for attendance area</li></ul>",
    "fn": ibPointSystem
  },
  "14ea70645a295ad9d0706b71ab4454ed": {
    "id": "14ea70645a295ad9d0706b71ab4454ed",
    "programs": [
      "JULIAN HS: Fine & Performing Arts",
      "WELLS HS: Fine & Performing Arts",
      "FARRAGUT HS: General Education",
      "SCHURZ HS: AVID"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>Attendance Area,General</li></ul>",
    "fn": lottery(
      ATTENDANCE_AREA_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE
    )
  },
  "989468041f5e9eee56527688cd8e5018": {
    "id": "989468041f5e9eee56527688cd8e5018",
    "programs": [
      "WASHINGTON HS: International Baccalaureate (IB)"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Descending Point Score based on Academic Criteria</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>Elementary Preference,General</li><li><strong>Note: </strong>50 bonus points for attendance areaElementary preference: Marsh ES (IB Partner School)</li></ul>",
    "fn": ibPointSystem //FIXME add elementary preference
  },
  "56714a996f9491b4c28d03989fe075ff": {
    "id": "56714a996f9491b4c28d03989fe075ff",
    "programs": [
      "HUBBARD HS: General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>Attendance Area,Sibling Preference,Staff Preference</li><li><strong>Note: </strong>Staff Preference applies at the entry level grade only. A maximum of 2 seats can be filled through Staff Preference.</li></ul>",
    "fn": lottery(
      ATTENDANCE_AREA_LOTTERY_STAGE,
      SIBLING_LOTTERY_STAGE,
      STAFF_PREFERENCE_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE
    )
  },
  "917604008472aa54b3d159cfd0bddbf0": {
    "id": "917604008472aa54b3d159cfd0bddbf0",
    "programs": [
      "HUBBARD HS: Military & Service Leadership - JROTC"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>2.0</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>Sibling Preference,Attendance Area,General</li></ul>",
    "fn": conditional({
      filter: ifHasGrades({ gpa: 2.0 }),
      fn: lottery(
        SIBLING_LOTTERY_STAGE,
        ATTENDANCE_AREA_LOTTERY_STAGE,
        GENERAL_LOTTERY_STAGE
      )
    })
  },
  "ae2072fac38b0065534ff5595545cdd4": {
    "id": "ae2072fac38b0065534ff5595545cdd4",
    "programs": [
      "SULLIVAN HS: General Education - The English Learner Academy"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>Attendance Area,Elementary Preference,Sibling Preference,General</li><li><strong>Note: </strong>Elementary preference: Armstrong, Boone, Courtenay, Field, Gale, Hayt, Jordan, Kilmer, McCutcheon, McPherson, West Ridge</li></ul>",
    "fn": lottery(
      ATTENDANCE_AREA_LOTTERY_STAGE,
      {
        filter: ifStudentAttendsOneOf(
          ARMSTRONG_G_ES_PROGRAM,
          BOONE_ES_PROGRAM,
          COURTENAY_ES_PROGRAM,
          FIELD_ES_PROGRAM,
          GALE_ES_PROGRAM,
          HAYT_ES_PROGRAM,
          JORDAN_ES_PROGRAM,
          KILMER_ES_PROGRAM,
          MCCUTCHEON_ES_PROGRAM,
          MCPHERSON_ES_PROGRAM,
          WEST_RIDGE_ES_PROGRAM,
        ),
        size: LotteryStageSize.LARGE
      },
      SIBLING_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE
    )
  },
  "64b8c2d1f8ada3ec9b7a7d9df59478be": {
    "id": "64b8c2d1f8ada3ec9b7a7d9df59478be",
    "programs": [
      "SULLIVAN HS: General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>Attendance Area,Elementary Preference,Sibling Preference,Staff Preference,General</li><li><strong>Note: </strong>Elementary preference: Armstrong, Boone, Courtenay, Field, Gale, Hayt, Jordan, Kilmer, McCutcheon, McPherson, West RidgeStaff Preference applies at the entry level grade only. A maximum of 2 seats can be filled through Staff Preference.</li></ul>",
    "fn": lottery(
      ATTENDANCE_AREA_LOTTERY_STAGE,
      {
        filter: ifStudentAttendsOneOf(
          ARMSTRONG_G_ES_PROGRAM,
          BOONE_ES_PROGRAM,
          COURTENAY_ES_PROGRAM,
          FIELD_ES_PROGRAM,
          GALE_ES_PROGRAM,
          HAYT_ES_PROGRAM,
          JORDAN_ES_PROGRAM,
          KILMER_ES_PROGRAM,
          MCCUTCHEON_ES_PROGRAM,
          MCPHERSON_ES_PROGRAM,
          WEST_RIDGE_ES_PROGRAM,
        ),
        size: LotteryStageSize.LARGE
      },
      SIBLING_LOTTERY_STAGE,
      STAFF_PREFERENCE_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE
    )
  },
  "9da1cdf655397a0c6f2be0d55f80f6cd": {
    "id": "9da1cdf655397a0c6f2be0d55f80f6cd",
    "programs": [
      "TAFT HS: General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>Attendance Area,Overlay,General</li><li><strong>Note: </strong>The Overlay includes students who reside within Taft's Preference Zone. </li></ul>",
    "fn": lottery(
      ATTENDANCE_AREA_LOTTERY_STAGE,
      // Overlay lottery stage
      GENERAL_LOTTERY_STAGE
    )
  },
  "4108f7dccff274f8ec678330030cbd96": {
    "id": "4108f7dccff274f8ec678330030cbd96",
    "programs": [
      "TAFT HS: International Baccalaureate (IB)"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Descending Point Score based on Academic Criteria</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>Continuing Enrollment,General</li><li><strong>Note: </strong>50 bonus points for attendance areaThere is a continuing enrollment preference for students in the Academic Center at Taft.</li></ul>",
    "fn": ibPointSystem
  },
  "182301dc9612d0fc3e88f1e88042f095": {
    "id": "182301dc9612d0fc3e88f1e88042f095",
    "programs": [
      "TAFT HS: Military & Service Leadership - NJROTC"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>2.0</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / 48</li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>Overlay,Attendance Area,General</li></ul>",
    "fn": conditional({
      filter: both(
        ifHasGrades({ gpa: 2.0 }),
        either(ifIEPorEL, ifHasGrades({ hsatCombined: 48 }))
      ),
      fn: lottery(
        // Overlay lottery stage
        ATTENDANCE_AREA_LOTTERY_STAGE,
        GENERAL_LOTTERY_STAGE
      )
    })
  },
  "7edf50664cc2c2524e7807d5b9dde6e4": {
    "id": "7edf50664cc2c2524e7807d5b9dde6e4",
    "programs": [
      "DYETT ARTS HS: Fine & Performing Arts - Band",
      "DYETT ARTS HS: Fine & Performing Arts - Choir",
      "DYETT ARTS HS: Fine & Performing Arts - Theatre"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>2</li><li><strong>HSAT Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / 58</li><li>IEP and EL Students: / 48 </li></ul><li><strong>Priority: </strong>Sibling Preference,Attendance Area,General</li></ul>",
    "fn": conditional(
      {
        filter:ifIsNeighborhoodSchool,
        fn:accept(everyone)
      },
      {
        filter: ifInAttendBound,
        fn: lottery(
          SIBLING_LOTTERY_STAGE,
          ATTENDANCE_AREA_LOTTERY_STAGE,
          GENERAL_LOTTERY_STAGE,)
      },
      {
        filter: either(
          both(ifIEPorEL, ifHasGrades({ gpa: 2.0, hsatCombined: 48 })),
          ifHasGrades({ hsatCombined: 58 })
        ),
        fn: lottery(
          SIBLING_LOTTERY_STAGE,
          ATTENDANCE_AREA_LOTTERY_STAGE,
          GENERAL_LOTTERY_STAGE,
        )
      }
    )
  },
  "d622e4b5301a195fda15df7321c385f9": {
    "id": "d622e4b5301a195fda15df7321c385f9",
    "programs": [
      "DYETT ARTS HS: Fine & Performing Arts - Dance",
      "DYETT ARTS HS: Fine & Performing Arts - Visual Arts"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>2.0</li><li><strong>HSAT Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / 58</li><li>IEP and EL Students: / 48 </li></ul><li><strong>Priority: </strong>Sibling Preference,Attendance Area,General</li></ul>",
    "fn": conditional(
      {
        filter:ifIsNeighborhoodSchool,
        fn:accept(everyone)
      },
      {
        filter: ifInAttendBound,
        fn: lottery(
          SIBLING_LOTTERY_STAGE,
          ATTENDANCE_AREA_LOTTERY_STAGE,
          GENERAL_LOTTERY_STAGE,)
      },
      {
        filter: either(
          both(ifIEPorEL, ifHasGrades({ gpa: 2.0, hsatCombined: 48 })),
          ifHasGrades({ hsatCombined: 58 })
        ),
        fn: lottery(
          SIBLING_LOTTERY_STAGE,
          ATTENDANCE_AREA_LOTTERY_STAGE,
          GENERAL_LOTTERY_STAGE,
        )
      }
    )
  },
  "e987527c383cab1ac5f33e0863225b1b": {
    "id": "e987527c383cab1ac5f33e0863225b1b",
    "programs": [
      "DYETT ARTS HS: General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>2</li><li><strong>HSAT Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / 58</li><li>IEP and EL Students: / 48 </li></ul><li><strong>Priority: </strong>Attendance Area,Sibling Preference,General</li></ul>",
    "fn": conditional(
      {
        filter:ifIsNeighborhoodSchool,
        fn:accept(everyone)
      },
      {
        filter: ifInAttendBound,
        fn: lottery(
          SIBLING_LOTTERY_STAGE,
          ATTENDANCE_AREA_LOTTERY_STAGE,
          GENERAL_LOTTERY_STAGE,)
      },
      {
        filter: either(
          both(ifIEPorEL, ifHasGrades({ gpa: 2.0, hsatCombined: 48 })),
          ifHasGrades({ hsatCombined: 58 })
        ),
        fn: lottery(
          SIBLING_LOTTERY_STAGE,
          ATTENDANCE_AREA_LOTTERY_STAGE,
          GENERAL_LOTTERY_STAGE,
        )
      }
    )
  },
  "e3978efa8488a6133ddee3e458289d8b": {
    "id": "e3978efa8488a6133ddee3e458289d8b",
    "programs": [
      "BOGAN HS: General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>2.5</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>Attendance Area,Staff Preference,General</li><li><strong>Note: </strong>Staff Preference applies at the entry level grade only. A maximum of 2 seats can be filled through Staff Preference.</li></ul>",
    "fn": conditional(
      {
        filter:ifInAttendBound,
        fn:accept(everyone)
      },
      {
        filter:ifHasGrades({
          gpa:2.5
        }),
        fn:lottery(
          ATTENDANCE_AREA_LOTTERY_STAGE,
          STAFF_PREFERENCE_LOTTERY_STAGE,
          GENERAL_LOTTERY_STAGE,
        )
      }
    )
  },
  "78b474f776134de729f0789f159891f0": {
    "id": "78b474f776134de729f0789f159891f0",
    "programs": [
      "FARRAGUT HS: International Baccalaureate (IB)"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Descending Point Score based on Academic Criteria</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>Elementary Preference,General</li><li><strong>Note: </strong>50 bonus points for attendance areaElementary preference: Madero (IB Partner School)</li></ul>",
    "fn": ibPointSystem
  },
  "1fa612cbae7eee259d9b96bf345dc07f": {
    "id": "1fa612cbae7eee259d9b96bf345dc07f",
    "programs": [
      "FARRAGUT HS: Military & Service Leadership - JROTC"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>2</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>Attendance Area,General</li></ul>",
    "fn": conditional(
      {
        filter: ifHasGrades({gpa:2}),
        fn:lottery(
          ATTENDANCE_AREA_LOTTERY_STAGE,
          GENERAL_LOTTERY_STAGE,
          )
      }
    )
  },
  "fbb5880a791f057434ddbd847434addb": {
    "id": "fbb5880a791f057434ddbd847434addb",
    "programs": [
      "FENGER HS: Honors"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>2</li><li><strong>HSAT Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / 120</li><li>IEP and EL Students: / 110 </li></ul><li><strong>Priority: </strong>General</li></ul>",
    "fn": conditional({
      filter: either(
        both(ifIEPorEL, ifHasGrades({ gpa: 2, hsatCombined: 110 })),
        ifHasGrades({ gpa: 2, hsatCombined: 120 })
      ),
      fn: lottery(GENERAL_LOTTERY_STAGE)
    })
  },
  "eb82a9f4f55f5ab1377691bc81142935": {
    "id": "eb82a9f4f55f5ab1377691bc81142935",
    "programs": [
      "FOREMAN HS: Military & Service Leadership - JROTC"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>2</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>Sibling Preference,Attendance Area,General</li></ul>",
    "fn": conditional(
      {
        filter: ifHasGrades({gpa:2}),
        fn:lottery(
          SIBLING_LOTTERY_STAGE,
          ATTENDANCE_AREA_LOTTERY_STAGE,
          GENERAL_LOTTERY_STAGE,
          )
      }
    )
  },
  "5845ea2b509b5fa824f48701f612f7c5": {
    "id": "5845ea2b509b5fa824f48701f612f7c5",
    "programs": [
      "HYDE PARK HS: International Baccalaureate (IB)"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Descending Point Score based on Academic Criteria</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>Elementary Preference,General</li><li><strong>Note: </strong>50 bonus points for attendance areaElementary preference: Carnegie ES (IB Partner School)</li></ul>",
    "fn": ibPointSystem
  },
  "b241754ef51e1b21cc9aa329e0d69f79": {
    "id": "b241754ef51e1b21cc9aa329e0d69f79",
    "programs": [
      "KELLY HS: General Education",
      "MORGAN PARK HS: General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>2.0</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>Attendance Area,Sibling Preference,Staff Preference,General</li><li><strong>Note: </strong>Staff Preference applies at the entry level grade only. A maximum of 2 seats can be filled through Staff Preference.</li></ul>",
    "fn": conditional(
      {
        filter: ifInAttendBound,
        fn:accept(everyone)
      },
      {
        filter: ifHasGrades({gpa:2}),
        fn: lottery(
          ATTENDANCE_AREA_LOTTERY_STAGE,
          SIBLING_LOTTERY_STAGE,
          STAFF_PREFERENCE_LOTTERY_STAGE,
          GENERAL_LOTTERY_STAGE,
        )
      }
    )
  },
  "3b4ce15ecf9306d529af09d56ff2d551": {
    "id": "3b4ce15ecf9306d529af09d56ff2d551",
    "programs": [
      "KELVYN PARK HS: Open Enrollment - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>Sibling Preference,Staff Preference,General</li><li><strong>Note: </strong>This program serves only grades 7-8. There is a separate program available for applicants to grade 9.Staff Preference applies at the entry level grade only. A maximum of 2 seats can be filled through Staff Preference.</li></ul>",
    "fn": lottery(
      SIBLING_LOTTERY_STAGE,
      STAFF_PREFERENCE_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE
    )
  },
  "18a92f9cdfc7a03b55492a9c56f369c3": {
    "id": "18a92f9cdfc7a03b55492a9c56f369c3",
    "programs": [
      "KELVYN PARK HS: Fine & Performing Arts"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>General,Attendance Area</li></ul>",
    "fn": lottery(
      GENERAL_LOTTERY_STAGE,
      ATTENDANCE_AREA_LOTTERY_STAGE
    )
  },
  "0897aa324d60c12404ff21abe9d66468": {
    "id": "0897aa324d60c12404ff21abe9d66468",
    "programs": [
      "KELVYN PARK HS: General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>Continuing Enrollment,Attendance Area,Sibling Preference,Staff Preference,General</li><li><strong>Note: </strong>Staff Preference applies at the entry level grade only. A maximum of 2 seats can be filled through Staff Preference.</li></ul>",
    "fn": conditional(
      {
        filter:ifInAttendBound,
        fn:accept(everyone)
      },
      {
        filter:everyone,
        fn:lottery(
        CONTINUING_STUDENTS_LOTTERY_STAGE,
        ATTENDANCE_AREA_LOTTERY_STAGE,
        SIBLING_LOTTERY_STAGE,
        STAFF_PREFERENCE_LOTTERY_STAGE,
        GENERAL_LOTTERY_STAGE,
        )
      }
    )
  },
  "36dfc5b4f48d41d984d76da8ee4d7064": {
    "id": "36dfc5b4f48d41d984d76da8ee4d7064",
    "programs": [
      "AMUNDSEN HS: General Education/Grow Community"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>Attendance Area,Sibling Preference,Staff Preference,Elementary Preference,General</li><li><strong>Note: </strong>Elementary preference: Audubon ES, Bell ES, Blaine ES, Budlong ES, Burley ES, Chappell ES, Coonley ES, Greeley ES, Hamilton ES, Hawthorne ES, Inter - American ES, Jahn ES, Jamieson ES, McPherson ES, Nettelhorst ES, Ravenswood ES, Waters ES, Ravenswood ES, Waters ESStaff Preference applies at the entry level grade only. A maximum of 2 seats can be filled through Staff Preference.</li></ul>",
    "fn": conditional(
      {
        filter: ifInAttendBound,
        fn: accept(everyone)
      },
      {
        filter: everyone,
        fn: lottery(
        ATTENDANCE_AREA_LOTTERY_STAGE,
        SIBLING_LOTTERY_STAGE,
        STAFF_PREFERENCE_LOTTERY_STAGE,
        {
          filter: ifStudentAttendsOneOf(
            ...GROW_COMMUNITY_SCHOOL_ES_PROGRAMS
          ),
          size: LotteryStageSize.LARGE
        },
        GENERAL_LOTTERY_STAGE,
      )}
    )
  },
  "cf44435bf8078e0fffcef3bb141817cd": {
    "id": "cf44435bf8078e0fffcef3bb141817cd",
    "programs": [
      "AMUNDSEN HS: International Baccalaureate (IB)"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Descending Point Score based on Academic Criteria</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>Elementary Preference,General</li><li><strong>Note: </strong>50 bonus points for attendance areaElementary preference: McPherson (IB Partner School)</li></ul>",
    "fn": ibPointSystem
  },
  "a9efffcd05e67572dbf9d9b990a6b51e": {
    "id": "a9efffcd05e67572dbf9d9b990a6b51e",
    "programs": [
      "LINCOLN PARK HS: Fine & Performing Arts - Drama",
      "LINCOLN PARK HS: Fine & Performing Arts - Instrumental Music",
      "LINCOLN PARK HS: Fine & Performing Arts - Visual Arts",
      "LINCOLN PARK HS: Fine & Performing Arts - Vocal Music"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Descending Point Score based on Audition Score</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>General,Attendance Area</li><li><strong>Note: </strong>Schedule your audition in your GoCPS account. For more information visit: https://www.lincolnparkhs.org/apps/pages/index.jsp?uREC_ID=924953&type=d&pREC_ID=1674883</li></ul>",
    "fn": notImplemented
  },
  "6b2683ea24dec8b2b740720e8552a116": {
    "id": "6b2683ea24dec8b2b740720e8552a116",
    "programs": [
      "LINCOLN PARK HS: Advanced College Prep (formerly Double Honors)"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Descending Point Score based on Academic Criteria</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>Attendance Area,General</li></ul>",
    "fn": ibPointSystem //TODO verify that this is correct
  },
  "89ccb19deb188449aa9a76743442bb08": {
    "id": "89ccb19deb188449aa9a76743442bb08",
    "programs": [
      "LAKE VIEW HS: Grow Community - Early College STEM"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>Attendance Area,Sibling Preference,Staff Preference,Elementary Preference,Overlay,General</li><li><strong>Note: </strong> Grow Community Schools preference: Audubon, Bell, Blaine, Budlong, Burley, Chappell, Coonley, Greeley, Hamilton, Hawthorne, Inter - American, Jahn, Jamieson, McPherson, Nettelhorst, Ravenswood, or Waters.  Staff Preference applies at the entry level grade only. A maximum of 2 seats can be filled through Staff Preference.</li></ul>",
    "fn": lottery(
      ATTENDANCE_AREA_LOTTERY_STAGE,
      SIBLING_LOTTERY_STAGE,
      STAFF_PREFERENCE_LOTTERY_STAGE,
      {
        filter: ifStudentAttendsOneOf(...GROW_COMMUNITY_SCHOOL_ES_PROGRAMS),
        size: LotteryStageSize.LARGE
      },
      {
        filter: ifHasGrades({ gpa: 3.1, hsatCombined: 100 }),
        size: LotteryStageSize.LARGE // not too sure this should be large... oh well, shouldn't matter
      },
      GENERAL_LOTTERY_STAGE,
    )
  },
  "fb7ee9c5bc10df7e45ffc6389d6b4ab0": {
    "id": "fb7ee9c5bc10df7e45ffc6389d6b4ab0",
    "programs": [
      "MATHER HS: AVID"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>2.0</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>Attendance Area,Sibling Preference,Staff Preference,Elementary Preference,General</li><li><strong>Note: </strong>Elementary preference: Mosaic, Clinton, Jamieson, Peterson, Rogers, West RidgeStaff Preference applies at the entry level grade only. A maximum of 2 seats can be filled through Staff Preference.</li></ul>",
    "fn": conditional(
      {
        filter: ifHasGrades({gpa: 2}),
        fn: lottery(
          ATTENDANCE_AREA_LOTTERY_STAGE,
          SIBLING_LOTTERY_STAGE,
          STAFF_PREFERENCE_LOTTERY_STAGE,
          {
            filter: ifStudentAttendsOneOf(
              BOONE_ES_PROGRAM,
              CLINTON_ES_PROGRAM,
              JAMIESON_ES_PROGRAM,
              PETERSON_ES_PROGRAM,
              ROGERS_ES_PROGRAM,
              WEST_RIDGE_ES_PROGRAM),
            size: LotteryStageSize.LARGE
          },
          GENERAL_LOTTERY_STAGE,
        )
      }
    )
  },
  "e111cf3d163354e5973191936044dee3": {
    "id": "e111cf3d163354e5973191936044dee3",
    "programs": [
      "MATHER HS: General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>Attendance Area,Sibling Preference,Staff Preference,Elementary Preference,General</li><li><strong>Note: </strong>Elementary preference: Mosaic, Clinton, Jamieson, Peterson, Rogers, West RidgeStaff Preference applies at the entry level grade only. A maximum of 2 seats can be filled through Staff Preference.</li></ul>",
    "fn": conditional(
      {
        filter: ifInAttendBound,
        fn:accept(everyone)
      },
      {
        filter: everyone,
        fn: lottery(
          ATTENDANCE_AREA_LOTTERY_STAGE,
          SIBLING_LOTTERY_STAGE,
          STAFF_PREFERENCE_LOTTERY_STAGE,
          {
            filter: ifStudentAttendsOneOf(
              BOONE_ES_PROGRAM,
              CLINTON_ES_PROGRAM,
              JAMIESON_ES_PROGRAM,
              PETERSON_ES_PROGRAM,
              ROGERS_ES_PROGRAM,
              WEST_RIDGE_ES_PROGRAM),
            size: LotteryStageSize.LARGE
          },
          GENERAL_LOTTERY_STAGE,
      )
    }
  )
  },
  "e3f343f57319aa461bf3bed140653cab": {
    "id": "e3f343f57319aa461bf3bed140653cab",
    "programs": [
      "MORGAN PARK HS: International Baccalaureate (IB)"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Descending Point Score based on Academic Criteria</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>Continuing Enrollment,General</li><li><strong>Note: </strong>50 bonus points for attendance areaThere is a continuing enrollment preference for students in the Academic Center at Morgan Park.</li></ul>",
    "fn": conditional(
      {
        filter: ifStudentAttendsOneOf(MORGAN_PARK_ACADEMIC_CENTER_PROGRAM),
        fn: accept(everyone)
      },
      {
        filter: everyone,
        fn: ibPointSystem
      }
    )
  },
  "66e343a085b71702276816de30084068": {
    "id": "66e343a085b71702276816de30084068",
    "programs": [
      "ROOSEVELT HS: General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>Sibling Preference,Staff Preference,Attendance Area,General</li><li><strong>Note: </strong>Staff Preference applies at the entry level grade only. A maximum of 2 seats can be filled through Staff Preference.</li></ul>",
    "fn": lottery(
      SIBLING_LOTTERY_STAGE,
      STAFF_PREFERENCE_LOTTERY_STAGE,
      ATTENDANCE_AREA_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE
    )
  },
  "d41d8ee6f2405b88fd8c286c962920ce": {
    "id": "d41d8ee6f2405b88fd8c286c962920ce",
    "programs": [
      "ROOSEVELT HS: World Language - Dual Language"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>2.5</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>Sibling Preference,Elementary Preference,General</li><li><strong>Note: </strong>Elementary preference: AZUELA, BARRY, BATEMAN, BELMONT - CRAGIN , CALMECA, CARSON, CHASE, COOPER, DARWIN, EDWARDS, ERIE, GLOBAL CITIZENSHIP, HURLEY, INTER - AMERICAN, MOOS, MOZART, NAMASTE, SABIN, SPRY ES, STOWE, TALCOTT, TELPOCHCALLI, VOLTA, VON LINNE, WHITTIER</li></ul>",
    "fn": conditional(
      {
        filter: ifHasGrades({gpa: 2.5}),
        fn: lottery(
          SIBLING_LOTTERY_STAGE,
          {
            filter: ifStudentAttendsOneOf(...LANGUAGE_ES_PROGRAMS),
            size: LotteryStageSize.LARGE
          },
          GENERAL_LOTTERY_STAGE,
        )
      }
    )
  },
  "0f522a7205b7dbae736f0992d95d0047": {
    "id": "0f522a7205b7dbae736f0992d95d0047",
    "programs": [
      "SCHURZ HS: World Language - Dual Language"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>Sibling Preference,Elementary Preference,General</li><li><strong>Note: </strong>Elementary preference: AZUELA, BARRY, BATEMAN, BELMONT - CRAGIN, CALMECA, CARSON, CHASE, COOPER, DARWIN, EDWARDS, ERIE, GLOBAL CITIZENSHIP, HURLEY, INTER - AMERICAN, MOOS, MOZART, NAMASTE, SABIN, SPRY ES, STOWE, TALCOTT, TELPOCHCALLI, VOLTA, VON LINNE, WHITTIER</li></ul>",
    "fn": lottery(
      SIBLING_LOTTERY_STAGE,
      {
        filter: ifStudentAttendsOneOf(...LANGUAGE_ES_PROGRAMS),
        size: LotteryStageSize.LARGE
      },
      GENERAL_LOTTERY_STAGE,
    )
  },
  "0c63c8fc5f7d2b560047b2797d78fcaa": {
    "id": "0c63c8fc5f7d2b560047b2797d78fcaa",
    "programs": [
      "SENN HS: Fine & Performing Arts - Dance",
      "SENN HS: Fine & Performing Arts - Music",
      "SENN HS: Fine & Performing Arts - Theatre",
      "SENN HS: Fine & Performing Arts - Visual Arts"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Descending Point Score based on Audition Score</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>General</li><li><strong>Note: </strong>Schedule your audition in your GoCPS account. For more information visit: https://www.sennhs.org/apps/pages/SennArtsDanceAdmissions</li></ul>",
    "fn": notImplemented
  },
  "31509cd37ce687b6a047e2f65a939de6": {
    "id": "31509cd37ce687b6a047e2f65a939de6",
    "programs": [
      "SENN HS: International Baccalaureate (IB)"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Descending Point Score based on Academic Criteria</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>Elementary Preference,General</li><li><strong>Note: </strong>50 bonus points for attendance areaElementary preference: Peirce ES (IB Partner School)</li></ul>",
    "fn": conditional(
      {
        filter: ifStudentAttendsOneOf(PEIRCE_ES_PROGRAM),
        fn: accept(everyone)
      },
      {
        filter: everyone,
        fn: ibPointSystem
      }
    )
  },
  "123d0f63c5d2eb93f214b65560427c90": {
    "id": "123d0f63c5d2eb93f214b65560427c90",
    "programs": [
      "STEINMETZ HS: STEAM"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>2</li><li><strong>HSAT Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / 58</li><li>IEP and EL Students: / 48 </li></ul><li><strong>Priority: </strong>Attendance Area,Sibling Preference,Staff Preference,General</li></ul>",
    "fn": conditional(
      {
        filter:ifInAttendBound,
        fn:lottery(
          ATTENDANCE_AREA_LOTTERY_STAGE,
          SIBLING_LOTTERY_STAGE,
          STAFF_PREFERENCE_LOTTERY_STAGE,
          GENERAL_LOTTERY_STAGE,
        )
      },
      {
        filter:either(
          both(ifIEPorEL, ifHasGrades({ gpa: 2, hsatCombined: 48 })),
          ifHasGrades({ gpa: 2, hsatCombined: 58 })),
        fn:lottery(
          ATTENDANCE_AREA_LOTTERY_STAGE,
          SIBLING_LOTTERY_STAGE,
          STAFF_PREFERENCE_LOTTERY_STAGE,
          GENERAL_LOTTERY_STAGE,
        )
      }
    )
  },
  "5803cd64b9782cf213f2e7ac279bd4db": {
    "id": "5803cd64b9782cf213f2e7ac279bd4db",
    "programs": [
      "STEINMETZ HS: International Baccalaureate (IB)"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Descending Point Score based on Academic Criteria</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>Elementary Preference,General</li><li><strong>Note: </strong>50 bonus points for attendance areaElementary preference: Locke (IB Partner School)</li></ul>",
    "fn": conditional(
      {
        filter: ifStudentAttendsOneOf(LOCKE_MAGNET_CLUSTER_ES_PROGRAM),
        fn: accept(everyone)
      },
      {
        filter: everyone,
        fn: ibPointSystem
      }
    )
  },
  "034f4ecd1ed2266bfde53644d4f7b670": {
    "id": "034f4ecd1ed2266bfde53644d4f7b670",
    "programs": [
      "STEINMETZ HS: Military & Service Leadership - JROTC"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>2</li><li><strong>HSAT Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / 58</li><li>IEP and EL Students: / 48 </li></ul><li><strong>Priority: </strong>General</li></ul>",
    "fn": conditional(
      {
        filter:either(
          both(ifIEPorEL, ifHasGrades({gpa:2, hsatCombined:48})),
          ifHasGrades({gpa:2, hsatCombined:58})),
        fn:lottery(
          GENERAL_LOTTERY_STAGE,
        )
      }
    )
  },
  "08b6e607d0396f07082344cd0928e13e": {
    "id": "08b6e607d0396f07082344cd0928e13e",
    "programs": [
      "BACK OF THE YARDS HS: World Language - Dual Language"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>2.5</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>Sibling Preference,Elementary Preference,General</li><li><strong>Note: </strong>Elementary preference: \r\n AZUELA, BARRY, BATEMAN, BELMONT - CRAGIN, CALMECA, CARSON, CHASE, COOPER, DARWIN, EDWARDS, ERIE, GLOBAL CITIZENSHIP, HURLEY, INTER - AMERICAN, MOOS, MOZART, NAMASTE, SABIN, SPRY ES, STOWE, TALCOTT, TELPOCHCALLI, VOLTA, VON LINNE, WHITTIER</li></ul>",
    "fn": conditional(
      {
        filter: ifHasGrades({gpa: 2.5}),
        fn: lottery(
          SIBLING_LOTTERY_STAGE,
          {
            filter: ifStudentAttendsOneOf(...LANGUAGE_ES_PROGRAMS),
            size: LotteryStageSize.LARGE
          },
          GENERAL_LOTTERY_STAGE,
        )
      }
    )
  },
  "d7d90f2864409ddfa8ff77ad90537fa4": {
    "id": "d7d90f2864409ddfa8ff77ad90537fa4",
    "programs": [
      "BACK OF THE YARDS HS: International Baccalaureate (IB)"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Descending Point Score based on Academic Criteria</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>General</li><li><strong>Note: </strong>50 bonus points for students who reside in the preference area (overlay)</li></ul>",
    "fn": ibPointSystem
  },
  "4f8c9bbb584260aa81ec92adfa1cc2ba": {
    "id": "4f8c9bbb584260aa81ec92adfa1cc2ba",
    "programs": [
      "SPRY HS: SPRY COMMUNITY LINKS HS - Three - Year; Year - Round High School"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>Continuing Enrollment,Staff Preference,Sibling Preference,General</li><li><strong>Note: </strong>Staff Preference applies at the entry level grade only. A maximum of 2 seats can be filled through Staff Preference.</li></ul>",
    "fn": lottery(
      CONTINUING_STUDENTS_LOTTERY_STAGE,
      STAFF_PREFERENCE_LOTTERY_STAGE,
      SIBLING_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE
    )
  },
  "9fa1d26c535e64160d601e4c78a38d55": {
    "id": "9fa1d26c535e64160d601e4c78a38d55",
    "programs": [
      "SOLORIO HS: General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>Attendance Area,Staff Preference</li><li><strong>Note: </strong>Staff Preference applies at the entry level grade only. A maximum of 2 seats can be filled through Staff Preference.</li></ul>",
    "fn": conditional(
      {
        filter:ifInAttendBound,
        fn:accept(everyone)
      },
      {
        filter:everyone,
        fn:lottery(
          ATTENDANCE_AREA_LOTTERY_STAGE,
          STAFF_PREFERENCE_LOTTERY_STAGE,
          GENERAL_LOTTERY_STAGE
        )
      }
    )
  },
  "2528f14792b192d978aa91682502662d": {
    "id": "2528f14792b192d978aa91682502662d",
    "programs": [
      "OGDEN HS: International Baccalaureate (IB)"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Descending Point Score based on Academic Criteria</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>Elementary Preference,General</li><li><strong>Note: </strong>Elementary preference: Ogden ES\r\n50 bonus points for students who reside in the preference area (overlay)</li></ul>",
    "fn": ibPointSystem
  },
  "746ea94301117c81c1ce48eb33971647": {
    "id": "746ea94301117c81c1ce48eb33971647",
    "programs": [
      "DOUGLASS HS: General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>Sibling Preference,Staff Preference,Proximity,General</li><li><strong>Note: </strong>Staff Preference applies at the entry level grade only. A maximum of 2 seats can be filled through Staff Preference.</li></ul>",
    "fn": lottery(
      SIBLING_LOTTERY_STAGE,
      STAFF_PREFERENCE_LOTTERY_STAGE,
      PROXIMITY_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE
    )
  },
  "8bfffa8e219dddfa0f211e2c929fd915": {
    "id": "8bfffa8e219dddfa0f211e2c929fd915",
    "programs": [
      "NORTHSIDE PREP HS: Selective Enrollment High School",
      "KING HS: Selective Enrollment High School",
      "YOUNG HS: Selective Enrollment High School",
      "LANE TECH HS: Selective Enrollment High School",
      "HANCOCK HS: Selective Enrollment High School",
      "WESTINGHOUSE HS: Selective Enrollment High School",
      "BROOKS HS: Selective Enrollment High School",
      "PAYTON HS: Selective Enrollment High School",
      "JONES HS: Selective Enrollment High School",
      "SOUTH SHORE INTL HS: Selective Enrollment High School",
      "LINDBLOM HS: Selective Enrollment High School"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Descending Point Score based on Academic Criteria</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>General,Tier</li></ul>",
    "fn": sePointSystem
  },
  "ae184bbef225c5d521efdf11597415a4": {
    "id": "ae184bbef225c5d521efdf11597415a4",
    "programs": [
      "HANCOCK HS: Career & Technical Education (CTE) - Manufacturing - Pre - Engineering",
      "HANCOCK HS: Career & Technical Education (CTE) - Law & Public Safety - Pre - Law",
      "JONES HS: Pre - Career & Technical Education (CTE) - Manufacturing - Pre - Engineering",
      "JONES HS: Career & Technical Education (CTE) - Law & Public Safety - Pre - Law"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Descending Point Score based on Academic Criteria</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>Overlay,General</li></ul>",
    "fn": ctePointSystem
  },
  "4b6cd0685299101b4865f534d6e40a08": {
    "id": "4b6cd0685299101b4865f534d6e40a08",
    "programs": [
      "WESTINGHOUSE HS: Career & Technical Education (CTE) - Career Academy"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>3</li><li><strong>HSAT Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / 58</li><li>IEP and EL Students: / 48 </li></ul><li><strong>Priority: </strong>Sibling Preference,Staff Preference,Proximity,General</li></ul>",
    "fn": conditional(
      {
        filter: both(ifIEPorEL, ifHasGrades({gpa:3, hsatCombined: 48})),
        fn:lottery(
          SIBLING_LOTTERY_STAGE,
          STAFF_PREFERENCE_LOTTERY_STAGE,
          PROXIMITY_LOTTERY_STAGE,
          GENERAL_LOTTERY_STAGE
        )
      },
      {
        filter: ifHasGrades({gpa:3, hsatCombined: 58}),
        fn:lottery(
          SIBLING_LOTTERY_STAGE,
          STAFF_PREFERENCE_LOTTERY_STAGE,
          PROXIMITY_LOTTERY_STAGE,
          GENERAL_LOTTERY_STAGE
        )
      }
    )
  },
  "b67253cfc04ef6ecf1457b6595c3ef1c": {
    "id": "b67253cfc04ef6ecf1457b6595c3ef1c",
    "programs": [
      "CHICAGO ACADEMY HS: General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>Elementary Preference,Sibling Preference,Staff Preference,Proximity,General</li></ul>",
    "fn": lottery(
      CONTINUING_STUDENTS_LOTTERY_STAGE,
      SIBLING_LOTTERY_STAGE,
      STAFF_PREFERENCE_LOTTERY_STAGE,
      PROXIMITY_LOTTERY_STAGE,
      {
        filter: ifStudentAttendsOneOf(
          CHICAGO_COLLEGIATE_GENERAL_EDUCATION_JOINT_ES_HS_PROGRAM,
          CHICAGO_MATH_AND_SCIENCE_GENERAL_EDUCATION_JOINT_ES_HS_PROGRAM
        ),
        size: LotteryStageSize.LARGE
      },
      GENERAL_LOTTERY_STAGE,
    )
  },
  "bae485f15f8767fe81de33eb174e4b1b": {
    "id": "bae485f15f8767fe81de33eb174e4b1b",
    "programs": [
      "CHICAGO ACADEMY HS: Honors - Scholars"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>3</li><li><strong>HSAT Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / 120</li><li>IEP and EL Students: / 110 </li></ul><li><strong>Priority: </strong>Elementary Preference,Sibling Preference,Proximity,General</li></ul>",
    "fn": conditional(
      {
        filter: either(
          both(ifIEPorEL, ifHasGrades({ gpa: 3, hsatCombined: 110 })),
          ifHasGrades({ gpa: 3, hsatCombined: 120 })
        ),
        fn: lottery(
          CONTINUING_STUDENTS_LOTTERY_STAGE,
          SIBLING_LOTTERY_STAGE,
          PROXIMITY_LOTTERY_STAGE,
          GENERAL_LOTTERY_STAGE,
        )
      }
    )
  },
  "91de135b361712cf0a9cc8c4bb8d43ba": {
    "id": "91de135b361712cf0a9cc8c4bb8d43ba",
    "programs": [
      "WILLIAMS HS: General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HSAT Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / 58</li><li>IEP and EL Students: / 48 </li></ul><li><strong>Priority: </strong>Sibling Preference,Staff Preference,Proximity,General</li></ul>",
    "fn": conditional({
      filter: either(
        both(ifIEPorEL, ifHasGrades({ hsatCombined: 48 })),
        ifHasGrades({ hsatCombined: 58 })
      ),
      fn: lottery(
        SIBLING_LOTTERY_STAGE,
        STAFF_PREFERENCE_LOTTERY_STAGE,
        PROXIMITY_LOTTERY_STAGE,
        GENERAL_LOTTERY_STAGE
      )
    })
  },
  "92e35b8f35a23890f54eafd6c6a24dcf": {
    "id": "92e35b8f35a23890f54eafd6c6a24dcf",
    "programs": [
      "INFINITY HS: LVLHS INFINITY HS - General Education - STEM"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>2</li><li><strong>HSAT Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / 120</li><li>IEP and EL Students: / 110 </li></ul><li><strong>Priority: </strong>Attendance Area,Sibling Preference,Staff Preference,General</li></ul>",
    "fn": conditional(
      {
        filter: either(
          both(ifIEPorEL, ifHasGrades({gpa: 2,hsatCombined:110})),
          ifHasGrades({gpa:2, hsatCombined:120})
        ),
        fn: lottery(
          ATTENDANCE_AREA_LOTTERY_STAGE,
          SIBLING_LOTTERY_STAGE,
          STAFF_PREFERENCE_LOTTERY_STAGE,
          GENERAL_LOTTERY_STAGE,
        )
      }
    )
  },
  "7767bf9eb2aaa588cbb5508e4aec5736": {
    "id": "7767bf9eb2aaa588cbb5508e4aec5736",
    "programs": [
      "ALCOTT HS: General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>Elementary Preference,Staff Preference,Overlay,General</li><li><strong>Note: </strong>Elementary preference: Alcott ESStaff Preference applies at the entry level grade only. A maximum of 2 seats can be filled through Staff Preference.</li></ul>",
    "fn": conditional(
      {
        filter: ifStudentAttendsOneOf(ALCOTT_ES_PROGRAM),
        fn:accept(everyone)
      },
      {
        filter: everyone,
        fn:lottery(
          STAFF_PREFERENCE_LOTTERY_STAGE,
          ATTENDANCE_AREA_LOTTERY_STAGE,
          GENERAL_LOTTERY_STAGE,
        )
      }
    )
  },
  "79db9407e81a2a67afc0d8c13346d9e5": {
    "id": "79db9407e81a2a67afc0d8c13346d9e5",
    "programs": [
      "UPLIFT HS: General Education - Early College STEAM"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>Sibling Preference,Staff Preference,Elementary Preference,General</li><li><strong>Note: </strong>Staff Preference applies at the entry level grade only. A maximum of 2 seats can be filled through Staff Preference.</li></ul>",
    "fn": lottery(
      SIBLING_LOTTERY_STAGE,
      STAFF_PREFERENCE_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE
    )
  },
  "70d73925e60f709af9b09970c8a3e02f": {
    "id": "70d73925e60f709af9b09970c8a3e02f",
    "programs": [
      "Collins Academy STEAM HS: COLLINS HS - Fine & Performing Arts"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>General,Proximity</li></ul>",
    "fn": lottery(
      PROXIMITY_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE,
    )
  },
  "ba4396fa752e72e3c20f371f319d7b34": {
    "id": "ba4396fa752e72e3c20f371f319d7b34",
    "programs": [
      "Collins Academy STEAM HS: COLLINS HS - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>Sibling Preference,Staff Preference,General</li><li><strong>Note: </strong>Staff Preference applies at the entry level grade only. A maximum of 2 seats can be filled through Staff Preference.</li></ul>",
    "fn": lottery(
      SIBLING_LOTTERY_STAGE,
      STAFF_PREFERENCE_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE
    )
  },
  "0f666db06f5150c58224e512bbba6e97": {
    "id": "0f666db06f5150c58224e512bbba6e97",
    "programs": [
      "Collins Academy STEAM HS: COLLINS HS - Honors - Scholars"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>3.0</li><li><strong>HSAT Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / 120</li><li>IEP and EL Students: / 110 </li></ul><li><strong>Priority: </strong>Elementary Preference,Sibling Preference,General</li></ul>",
    "fn": conditional(
      {
        filter: both(
          either(
            both(ifIEPorEL, ifHasGrades({hsatCombined:110})),
            ifHasGrades({hsatCombined:120})
          ),
          ifHasGrades({ gpa: 3.0 })
        ),
        fn: lottery(
          {
            filter: ifStudentAttendsOneOf(
              CHALMERS_ES_PROGRAM,
              DVORAK_ES_PROGRAM,
              HERZL_ES_PROGRAM,
              JOHNSON_ES_PROGRAM,
              MORTON_ES_PROGRAM,
            ),
            size: LotteryStageSize.LARGE
          },
          SIBLING_LOTTERY_STAGE,
          GENERAL_LOTTERY_STAGE,
        )
      }
    )
  },
  "8b6863c073cc5e05306177993a8da943": {
    "id": "8b6863c073cc5e05306177993a8da943",
    "programs": [
      "Collins Academy STEAM HS: COLLINS HS - STEAM"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Random Computerized Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: / </li><li>IEP and EL Students: / </li></ul><li><strong>Priority: </strong>Sibling Preference,Staff Preference,General</li></ul>",
    "fn": lottery(
      SIBLING_LOTTERY_STAGE,
      STAFF_PREFERENCE_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE
    )
  }
}

