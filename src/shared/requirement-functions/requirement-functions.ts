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
  LANGUAGE_ES_PROGRAMS

} from "./constants";
import { store } from "../../shared/redux/store";

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
      "desc": "None",
      "programs": [
          "NOBLE - JOHNSON HS - General Education - Application",
          "FOUNDATIONS - General Education - Application",
          "NOBLE - PRITZKER HS - General Education - Application",
          "PERSPECTIVES - TECH HS - General Education - Application",
          "FARRAGUT HS - General Education - Application",
          "URBAN PREP - WEST HS - General Education - Application",
          "AUSTIN CCA HS - General Education - Application",
          "CHICAGO VIRTUAL - Charter - Application",
          "NOBLE - MANSUETO HS - General Education - Application",
          "ACERO - SOTO HS - General Education - Application",
          "CICS - LONGWOOD - Charter - Application",
          "NOBLE - NOBLE HS - General Education - Application",
          "ACERO - GARCIA HS - General Education - Application",
          "ASPIRA - EARLY COLLEGE HS - General Education - Application",
          "NOBLE - UIC HS - General Education - Application",
          "WELLS HS - Pre-Law - Application",
          "NOBLE - COMER - General Education - Application",
          "SCHURZ HS - Accounting & Entrepreneurship - Application",
          "WASHINGTON HS - General Education - Application",
          "SCHURZ HS - General Education - Application",
          "JUAREZ HS - General Education - Application",
          "CHICAGO VOCATIONAL HS - Agricultural Sciences - Application",
          "RICHARDS HS - General Education - Application",
          "BOGAN HS - Entrepreneurship - Application",
          "DOUGLASS HS - General Education - Application",
          "LAKE VIEW HS - General Education - Application",
          "ROOSEVELT HS - Game Programming - Application",
          "ROOSEVELT HS - Medical & Health Careers - Application",
          "NORTH-GRAND HS - Culinary Arts - Application",
          "FOREMAN HS - Digital Media - Application",
          "PHILLIPS HS - Digital Media - Application",
          "ALCOTT HS - Pre-Engineering - Application",
          "CURIE HS - Game Programming & Web Design - Application",
          "CHICAGO MATH & SCIENCE HS - General Education - Application",
          "BOWEN HS - Manufacturing - Application",
          "JUAREZ HS - Culinary Arts - Application",
          "SULLIVAN HS - Medical & Health Careers - Application",
          "HUBBARD HS - General Education - Application",
          "CHICAGO VOCATIONAL HS - Culinary Arts - Application",
          "CICS - NORTHTOWN HS - General Education - Application",
          "JULIAN HS - General Education - Application",
          "SCHURZ HS - Automotive Technology - Application",
          "CICS - CHICAGOQUEST HS - General Education - Application",
          "COLLINS HS - Game Programming - Application",
          "SULLIVAN HS - Accounting - Application",
          "CHICAGO VIRTUAL - General Education - Application",
          "SPRY HS - General Education - Application",
          "FARRAGUT HS - Pre-Law - Application",
          "NOBLE - BAKER HS - General Education - Application",
          "CLEMENTE HS - Broadcast Technology - Application",
          "SOUTH SHORE INTL HS - Medical & Health Careers - Application",
          "CURIE HS - Accounting - Application",
          "ROOSEVELT HS - Early Childhood - Application",
          "PERSPECTIVES - MATH & SCI HS - General Education - Application",
          "KENNEDY HS - General Education - Application",
          "KELLY HS - General Education - Application",
          "FARRAGUT HS - Automotive Technology - Application",
          "JULIAN HS - Entrepreneurship - Application",
          "CHICAGO VOCATIONAL HS - Carpentry - Application",
          "CICS - ELLISON HS - General Education - Application",
          "NOBLE - BULLS HS - General Education - Application",
          "JULIAN HS - Allied Health - Application",
          "ROOSEVELT HS - General Education - Application",
          "URBAN PREP - ENGLEWOOD HS - General Education - Application",
          "HYDE PARK HS - Broadcast Technology - Application",
          "NORTH-GRAND HS - General Education - Application",
          "GAGE PARK HS - General Education - Application",
          "UPLIFT HS - General Education - Application",
          "JUAREZ HS - Automotive Technology - Application",
          "U OF C - WOODLAWN HS - General Education - Application",
          "TILDEN HS - General Education - Application",
          "BOWEN HS - General Education - Application",
          "DUNBAR HS - Chicago Builds - Application",
          "TAFT HS - General Education - Application",
          "MORGAN PARK HS - General Education - Application",
          "JULIAN HS - Broadcast Technology - Application",
          "CURIE HS - Early Childhood & Teaching - Application",
          "CLEMENTE HS - Culinary Arts - Application",
          "BOGAN HS - Accounting - Application",
          "NORTH-GRAND HS - Pre-Engineering - Application",
          "CURIE HS - Automotive Technology - Application",
          "JUAREZ HS - Medical & Health Careers - Application",
          "JULIAN HS - Game Programming - Application",
          "NORTH-GRAND HS - Allied Health - Application",
          "JUAREZ HS - Architecture - Application",
          "TILDEN HS - Culinary Arts - Application",
          "INTRINSIC HS - General Education - Application",
          "NOBLE - RAUNER HS - General Education - Application",
          "SCHURZ HS - Digital Media - Application",
          "FOREMAN HS - Web Design - Application",
          "PERSPECTIVES - LEADERSHIP HS - General Education - Application",
          "HYDE PARK HS - Digital Media - Application",
          "CICS - LONGWOOD - General Education - Application",
          "CORLISS HS - Early College STEM - Application",
          "BOWEN HS - Pre-Engineering - Application",
          "HYDE PARK HS - General Education - Application",
          "ROOSEVELT HS - Culinary Arts - Application",
          "FOREMAN HS - General Education - Application",
          "NOBLE - ROWE CLARK HS - General Education - Application",
          "CURIE HS - Broadcast Technology - Application",
          "NOBLE - MUCHIN HS - General Education - Application",
          "ALCOTT HS - General Education - Application",
          "RICHARDS HS - Culinary Arts - Application",
          "FENGER HS - Culinary Arts - Application",
          "SCHURZ HS - Allied Health - Application",
          "RABY HS - Culinary Arts - Application",
          "RABY HS - Pre-Law - Application",
          "FENGER HS - General Education - Application",
          "HARPER HS - Culinary Arts - Application",
          "NOBLE - DRW HS - General Education - Application",
          "AMUNDSEN HS - General Education - Application",
          "WILLIAMS HS - Medical & Health Careers - Application",
          "NOBLE - GOLDER HS - General Education - Application",
          "RABY HS - Broadcast Technology - Application",
          "HIRSCH HS - General Education - Application",
          "STEINMETZ HS - Digital Media - Application",
          "JULIAN HS - Digital Media - Application",
          "AUSTIN CCA HS - Manufacturing - Application",
          "HARPER HS - Digital Media - Application",
          "DYETT ARTS HS - General Education - Application",
          "MATHER HS - Pre-Law - Application",
          "AMUNDSEN HS - Game Programming & Web Design - Application",
          "SOLORIO HS - General Education - Application",
          "PERSPECTIVES - JOSLIN HS - General Education - Application",
          "RICHARDS HS - Accounting - Application",
          "MATHER HS - Game Programming & Web Design - Application",
          "EPIC HS - General Education - Application",
          "BOGAN HS - General Education - Application",
          "CHICAGO COLLEGIATE - General Education - Application",
          "CURIE HS - Culinary Arts - Application",
          "RABY HS - Entrepreneurship - Application",
          "CLEMENTE HS - Allied Health - Application",
          "DYETT ARTS HS - Digital Media - Application",
          "DUNBAR HS - Allied Health - Application",
          "CHICAGO VOCATIONAL HS - Early College STEM - Application",
          "HARLAN HS - Digital Media - Application",
          "DUNBAR HS - Career Academy - Application",
          "MANLEY HS - Culinary Arts - Application",
          "CHICAGO VOCATIONAL HS - Diesel Technology - Application",
          "CURIE HS - Fine Arts & Technology - NEIGHBORHOOD - Application",
          "CHICAGO VOCATIONAL HS - General Education - Application",
          "STEINMETZ HS - General Education - Application",
          "SENN HS - General Education - Application",
          "WELLS HS - Game Programming - Application",
          "NOBLE - HANSBERRY HS - General Education - Application",
          "ROBESON HS - General Education - Application",
          "CHICAGO VOCATIONAL HS - Medical Assisting - Application",
          "LAKE VIEW HS - Early College STEM - Application",
          "CHICAGO VOCATIONAL HS - Cosmetology - Application",
          "FENGER HS - Carpentry - Application",
          "HARLAN HS - Web Design - Application",
          "CURIE HS - Digital Media - Application",
          "URBAN PREP - BRONZEVILLE HS - General Education - Application",
          "CURIE HS - Architecture - Application",
          "KENWOOD HS - General Education - Application",
          "MATHER HS - General Education - Application",
          "AUSTIN CCA HS - Pre-Engineering - Application",
          "ORR HS - General Education - Application",
          "SULLIVAN HS - General Education - Application",
          "MANLEY HS - General Education - Application",
          "HOPE HS - General Education - Application",
          "NORTH LAWNDALE - CHRISTIANA HS - General Education - Application",
          "NORTH LAWNDALE - COLLINS HS - General Education - Application",
          "UPLIFT HS - Teaching - Application",
          "SCHURZ HS - Pre-Engineering - Application",
          "ACE TECH HS - General Education - Application",
          "LEGAL PREP HS - General Education - Application",
          "ASPIRA - BUSINESS & FINANCE HS - General Education - Application",
          "JUAREZ HS - Game Programming & Web Design - Application",
          "PROSSER HS - Career Academy - Application",
          "HARPER HS - General Education - Application",
          "INSTITUTO - HEALTH - General Education - Application",
          "ROOSEVELT HS - Cisco Networking - Application",
          "INFINITY HS - Science/Technology/Engineering/Math - Application",
          "CHICAGO TECH HS - Science/Technology/Engineering/Math - Application",
          "NOBLE - ITW SPEER HS - General Education - Application",
          "NOBLE - BUTLER HS - General Education - Application",
          "NOBLE - ACADEMY HS - General Education - Application",
          "MARSHALL HS - General Education - Application",
          "MARSHALL HS - Agricultural Sciences - Application",
          "MARSHALL HS - Culinary Arts - Application"
      ],
    "fn": accept(everyone)
  },
  "de259633beb791e93447d688dd9bedd1": {
    "id": "de259633beb791e93447d688dd9bedd1",
    "programs": [
      "DYETT ARTS HS: DYETT ARTS HS - Band",
      "DYETT ARTS HS: DYETT ARTS HS - Choir",
      "DYETT ARTS HS: DYETT ARTS HS - Theater"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>2</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / 48</li><li>IEP and EL Students: N/A / 48</li></ul><li><strong>Priority: </strong>Sibling,Attendance Area,General</li></ul>",
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
        filter: ifHasGrades(
          {
            gpa: 2,
            hsatCombined: 48,
          }),
        fn: lottery(
          SIBLING_LOTTERY_STAGE,
          ATTENDANCE_AREA_LOTTERY_STAGE,
          GENERAL_LOTTERY_STAGE,
        )
      }
    )
  },
  "0d238fc0a72010300f421c6b847158c0": {
    "id": "0d238fc0a72010300f421c6b847158c0",
    "programs": [
      "DYETT ARTS HS: DYETT ARTS HS - Dance",
      "DYETT ARTS HS: DYETT ARTS HS - Visual Arts"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>2.0</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / 48</li><li>IEP and EL Students: N/A / 48</li></ul><li><strong>Priority: </strong>Sibling,Attendance Area,General</li></ul>",
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
        filter: ifHasGrades(
          {
            gpa: 2,
            hsatCombined: 48,
          }),
        fn: lottery(
          SIBLING_LOTTERY_STAGE,
          ATTENDANCE_AREA_LOTTERY_STAGE,
          GENERAL_LOTTERY_STAGE,
        )
      }
    )
  },
  //2022-7-11
  "3c28d0a2ace45f1d4481d633be533b84": {
    "id": "3c28d0a2ace45f1d4481d633be533b84",
    "programs": [
      "DYETT ARTS HS: DYETT ARTS HS - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>2</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / 48</li><li>IEP and EL Students: N/A / 48</li></ul><li><strong>Priority: </strong>Attendance Area,Sibling,General</li></ul>",
    "fn": conditional(
      {
        filter:ifIsNeighborhoodSchool,
        fn:accept(everyone)
      },
      {
        filter: ifInAttendBound,
        fn: lottery(
          ATTENDANCE_AREA_LOTTERY_STAGE,
          SIBLING_LOTTERY_STAGE,
          GENERAL_LOTTERY_STAGE,)
      },
      {
        filter: ifHasGrades(
          {
            gpa: 2,
            hsatCombined: 48,
          }),
        fn: lottery(
          ATTENDANCE_AREA_LOTTERY_STAGE,
          SIBLING_LOTTERY_STAGE,
          GENERAL_LOTTERY_STAGE,
        )
      }
    )
  },
  "22d8bcbefb15daaedbfc62da0abdec1b": {
    "id": "22d8bcbefb15daaedbfc62da0abdec1b",
    "programs": [
      "DYETT ARTS HS: DYETT ARTS HS - Digital Media",
      "SULLIVAN HS: SULLIVAN HS - Accounting",
      "TILDEN HS: TILDEN HS - Culinary Arts",
      "WELLS HS: WELLS HS - Game Programming",
      "HUBBARD HS: HUBBARD HS - Game Programming",
      "HUBBARD HS: HUBBARD HS - Web Development & Design",
      "CHICAGO VOCATIONAL HS: CHICAGO VOCATIONAL HS - Agricultural Sciences",
      "CHICAGO VOCATIONAL HS: CHICAGO VOCATIONAL HS - Carpentry",
      "CHICAGO VOCATIONAL HS: CHICAGO VOCATIONAL HS - Cosmetology",
      "CHICAGO VOCATIONAL HS: CHICAGO VOCATIONAL HS - Culinary Arts",
      "CHICAGO VOCATIONAL HS: CHICAGO VOCATIONAL HS - Diesel Technology",
      "CHICAGO VOCATIONAL HS: CHICAGO VOCATIONAL HS - Early College STEM",
      "RICHARDS HS: RICHARDS HS - Accounting",
      "RICHARDS HS: RICHARDS HS - Culinary Arts",
      "NORTH-GRAND HS: NORTH-GRAND HS - Culinary Arts",
      "FARRAGUT HS: FARRAGUT HS - Automotive Technology",
      "FARRAGUT HS: FARRAGUT HS - Teaching",
      "FOREMAN HS: FOREMAN HS - Digital Media",
      "HARLAN HS: HARLAN HS - Digital Media",
      "HARLAN HS: HARLAN HS - Marketing",
      "HYDE PARK HS: HYDE PARK HS - Broadcast Technology",
      "HYDE PARK HS: HYDE PARK HS - Digital Media",
      "KELLY HS: KELLY HS - Architecture",
      "KELLY HS: KELLY HS - Digital Media",
      "KELVYN PARK HS: KELVYN PARK HS - Digital Media",
      "MANLEY HS: MANLEY HS - Culinary Arts",
      "MARSHALL HS: MARSHALL HS - Agricultural Sciences",
      "MARSHALL HS: MARSHALL HS - Culinary Arts",
      "MATHER HS: MATHER HS - Digital Media",
      "MATHER HS: MATHER HS - Game Programming & Web Design",
      "PHILLIPS HS: PHILLIPS HS - Digital Media",
      "ROOSEVELT HS: ROOSEVELT HS - Computer Networking",
      "ROOSEVELT HS: ROOSEVELT HS - Culinary Arts",
      "ROOSEVELT HS: ROOSEVELT HS - Early Childhood",
      "ROOSEVELT HS: ROOSEVELT HS - Game Programming",
      "SCHURZ HS: SCHURZ HS - Accounting & Entrepreneurship",
      "SCHURZ HS: SCHURZ HS - Automotive Technology",
      "SCHURZ HS: SCHURZ HS - Digital Media",
      "STEINMETZ HS: STEINMETZ HS - Digital Media",
      "CURIE HS: CURIE HS - Accounting",
      "CURIE HS: CURIE HS - Architecture",
      "CURIE HS: CURIE HS - Automotive Technology",
      "CURIE HS: CURIE HS - Broadcast Technology",
      "CURIE HS: CURIE HS - Culinary Arts",
      "CURIE HS: CURIE HS - Digital Media",
      "CURIE HS: CURIE HS - Teaching",
      "CURIE HS: CURIE HS - Game Programming & Web Design",
      "CLEMENTE HS: CLEMENTE HS - Broadcast Technology",
      "CLEMENTE HS: CLEMENTE HS - Culinary Arts",
      "JUAREZ HS: JUAREZ HS - Architecture",
      "JUAREZ HS: JUAREZ HS - Culinary Arts",
      "JUAREZ HS: JUAREZ HS - Teaching",
      "JUAREZ HS: JUAREZ HS - Game Programming & Web Design",
      "JULIAN HS: JULIAN HS - Broadcast Technology",
      "JULIAN HS: JULIAN HS - Digital Media",
      "JULIAN HS: JULIAN HS - Entrepreneurship",
      "JULIAN HS: JULIAN HS - Game Programming",
      "ORR HS: ORR HS - Digital Media"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / None</li><li>IEP and EL Students: N/A / None</li></ul><li><strong>Priority: </strong>Attendance Area,General</li><li><strong>Note: </strong>Preference given to students scoring above the 24% in ELA and Math</li></ul>",
    "fn": lottery(...filterPreference(
      ifHasGrades({ hsatBoth: 48 }),
      ATTENDANCE_AREA_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE
    ))
  },
  "a3d90f09fac79d0299ba8bd3672dae17": {
    "id": "a3d90f09fac79d0299ba8bd3672dae17",
    "programs": [
      "CHICAGO TECH HS: CHICAGO TECH HS - Computer Programming",
      "DUNBAR HS: DUNBAR HS - Auto Body Repair",
      "DUNBAR HS: DUNBAR HS - Architecture",
      "DUNBAR HS: DUNBAR HS - Broadcast Technology",
      "DUNBAR HS: DUNBAR HS - Culinary Arts",
      "DUNBAR HS: DUNBAR HS - Cosmetology",
      "RABY HS: RABY HS - Broadcast Technology",
      "RABY HS: RABY HS - Culinary Arts",
      "UPLIFT HS: UPLIFT HS - Teaching",
      "COLLINS HS: COLLINS HS - Web Development & Design"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / None</li><li>IEP and EL Students: N/A / None</li></ul><li><strong>Priority: </strong>Proximity,General</li><li><strong>Note: </strong>Preference given to students scoring above the 24% in ELA and Math</li></ul>",
    "fn": lottery(...filterPreference(
      ifHasGrades({ hsatBoth: 24 }),
      PROXIMITY_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE
    ))
  },
  "357379728e153ce74dcfe07f1d19ceaf": {
    "id": "357379728e153ce74dcfe07f1d19ceaf",
    "programs": [
      "DUNBAR HS: DUNBAR HS - Chicago Builds"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / None</li><li>IEP and EL Students: N/A / None</li></ul><li><strong>Priority: </strong>Proximity,General</li></ul>",
    "fn": lottery(
      PROXIMITY_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE
    )
  },
  "8a08ed5e9e4618cb7c930dc441e915de": {
    "id": "8a08ed5e9e4618cb7c930dc441e915de",
    "programs": [
      "CICS - ELLISON HS: CICS - ELLISON HS - General Education",
      "CICS - NORTHTOWN HS: CICS - NORTHTOWN HS - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / None</li><li>IEP and EL Students: N/A / None</li></ul><li><strong>Priority: </strong>Elem Pref,Sibling,Overlay,General</li><li><strong>Note: </strong>Elementary preference:  CICS - AVALON/SOUTH SHORE, CICS - BASIL, CICS - BUCKTOWN, CICS - IRVING PARK, CICS - LONGWOOD, CICS - PRAIRIE, CICS - WASHINGTON PARK, CICS - WEST BELDEN, CICS - WRIGHTWOOD</li></ul>",
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
      GENERAL_LOTTERY_STAGE,
    )
  },
  "c5da9170d2a510581748b3567070de60": {
    "id": "c5da9170d2a510581748b3567070de60",
    "programs": [
      "ASPIRA - EARLY COLLEGE HS: ASPIRA - EARLY COLLEGE HS - General Education",
      "ASPIRA - BUSINESS & FINANCE HS: ASPIRA - BUSINESS & FINANCE HS - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / None</li><li>IEP and EL Students: N/A / None</li></ul><li><strong>Priority: </strong>Elem Pref,Sibling,General</li><li><strong>Note: </strong>Elementary preference:  Aspira Haugan Middle</li></ul>",
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
  "46496f468f1da1db8184eacae7e6cf7b": {
    "id": "46496f468f1da1db8184eacae7e6cf7b",
    "programs": [
      "CHIARTS HS: CHIARTS HS - Music - Instrumental - Brass & Woodwinds",
      "CHIARTS HS: CHIARTS HS - Dance",
      "CHIARTS HS: CHIARTS HS - Music - Instrumental - Guitar",
      "CHIARTS HS: CHIARTS HS - Musical Theatre",
      "CHIARTS HS: CHIARTS HS - Music - Instrumental - Percussion",
      "CHIARTS HS: CHIARTS HS - Music - Instrumental - Piano",
      "CHIARTS HS: CHIARTS HS - Music - Instrumental - Strings",
      "CHIARTS HS: CHIARTS HS - Theatre",
      "CHIARTS HS: CHIARTS HS - Music - Vocal",
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Point</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / None</li><li>IEP and EL Students: N/A / None</li></ul><li><strong>Priority: </strong>General</li><li><strong>Note: </strong>Schedule your audition in your GoCPS account. For more information visit: Visit https://chiarts.org/prospective-students-parents/apply/audition-requirements/</li></ul>",
    "fn": notImplemented
  },
  "83cb9088eedf39ff8ccb0954b72ba2da": {
    "id": "83cb9088eedf39ff8ccb0954b72ba2da",
    "programs": [
      "LINCOLN PARK HS: LINCOLN PARK HS - Drama",
      "LINCOLN PARK HS: LINCOLN PARK HS - Music - Instrumental",
      "LINCOLN PARK HS: LINCOLN PARK HS - VISUAL ARTS",
      "LINCOLN PARK HS: LINCOLN PARK HS - Music - Vocal",
      "SENN HS: SENN HS - Dance",
      "SENN HS: SENN HS - Music",
      "SENN HS: SENN HS - Theatre",
      "CURIE HS: CURIE HS - Dance",
      "CURIE HS: CURIE HS - Music"
    ],
    "desc": "Audition",
    "fn": notImplemented
  },
  "74b07daa2f40bfcacce4d616c43dbc79": {
    "id": "74b07daa2f40bfcacce4d616c43dbc79",
    "programs": [
      "EPIC HS: EPIC HS - General Education",
      "NOBLE - MUCHIN HS: NOBLE - MUCHIN HS - General Education",
      "INSTITUTO - HEALTH: INSTITUTO - HEALTH - General Education",
      "URBAN PREP - BRONZEVILLE HS: URBAN PREP - BRONZEVILLE HS - General Education",
      "URBAN PREP - BRONZEVILLE HS: URBAN PREP - BRONZEVILLE HS - General Education",
      "NOBLE - JOHNSON HS: NOBLE - JOHNSON HS - General Education",
      "NOBLE - NOBLE HS: NOBLE - NOBLE HS - General Education",
      "NOBLE - GOLDER HS: NOBLE - GOLDER HS - General Education",
      "NOBLE - PRITZKER HS: NOBLE - PRITZKER HS - General Education",
      "NOBLE - RAUNER HS: NOBLE - RAUNER HS - General Education",
      "NOBLE - ROWE CLARK HS: NOBLE - ROWE CLARK HS - STEM",
      "NLCP - CHRISTIANA HS: NLCP - CHRISTIANA HS - General Education",
      "NLCP - COLLINS HS: NLCP - COLLINS HS - General Education",
      "PERSPECTIVES - TECH HS: PERSPECTIVES - TECH HS - STEM",
      "URBAN PREP - ENGLEWOOD HS: URBAN PREP - ENGLEWOOD HS - General Education",
      "CHICAGO TECH HS: CHICAGO TECH HS - STEM",
      "NOBLE - HANSBERRY HS: NOBLE - HANSBERRY HS - International Baccalaureate (IB)",
      "NOBLE - DRW HS: NOBLE - DRW HS - General Education",
      "LEGAL PREP HS: LEGAL PREP HS - Law & Public Safety",
      "NOBLE - BUTLER HS: NOBLE - BUTLER HS - General Education",
      "NOBLE - BAKER HS: NOBLE - BAKER HS - General Education",
      "NOBLE - ACADEMY HS: NOBLE - ACADEMY HS - General Education",
      "NOBLE - MANSUETO HS: NOBLE - MANSUETO HS - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / None</li><li>IEP and EL Students: N/A / None</li></ul><li><strong>Priority: </strong>Sibling,General</li></ul>",
    "fn": lottery(
      SIBLING_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE
    )
  },
  "fabca26dfec794d58fff02d0d1a06854": {
    "id": "fabca26dfec794d58fff02d0d1a06854",
    "programs": [
      "CHIARTS HS: CHIARTS HS - Creative Writing",
      "CHIARTS HS: CHIARTS HS - Visual Arts",
      "SENN HS: SENN HS - Visual Arts",
      "CURIE HS: CURIE HS - Visual Arts"
    ],
    "desc": "Portfolio Review",
    "fn": notImplemented
  },
  "a927f734f323e593dc1f1f76e806270e": {
    "id": "a927f734f323e593dc1f1f76e806270e",
    "programs": [
      "CICS - LONGWOOD: CICS - LONGWOOD - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / None</li><li>IEP and EL Students: N/A / None</li></ul><li><strong>Priority: </strong>Continuing,Elem Pref,Sibling,General</li><li><strong>Note: </strong>Elementary preference:  CICS - AVALON/SOUTH SHORE, CICS - BASIL, CICS - BUCKTOWN, CICS - IRVING PARK, CICS - LONGWOOD, CICS - PRAIRIE, CICS - WASHINGTON PARK, CICS - WEST BELDEN, CICS - WRIGHTWOOD</li></ul>",
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
  "63660d4b689060f529ec716703c3fad9": {
    "id": "63660d4b689060f529ec716703c3fad9",
    "programs": [
      "CHICAGO MATH & SCIENCE HS: CHICAGO MATH & SCIENCE HS - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / None</li><li>IEP and EL Students: N/A / None</li></ul><li><strong>Priority: </strong>Continuing,Sibling,General</li><li><strong>Note: </strong>Elementary preference:  BRADWELL, CARTER, CASALS, CHALMERS, CHICAGO ACADEMY ES, CURTIS, DENEEN, DEWEY, DULLES, DVORAK, FULLER, GRESHAM, HARVARD, HERZL, HOWE, JOHNSON, MARQUETTE, MCNAIR, MORTON, NATIONAL TEACHERS, OKEEFFE, PICCOLO, SHERMAN, STAGG, TARKINGTON</li></ul>",
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
  "0bc451e0da439c9d5098d13888790402": {
    "id": "0bc451e0da439c9d5098d13888790402",
    "programs": [
      "PERSPECTIVES - JOSLIN HS: PERSPECTIVES - JOSLIN HS - General Education",
      "PERSPECTIVES - MATH & SCI HS: PERSPECTIVES - MATH & SCI HS - STEM",
      "CHICAGO COLLEGIATE: CHICAGO COLLEGIATE - General Education",
      "INTRINSIC HS: INTRINSIC HS - General Education",
      "HORIZON - SOUTHWEST: HORIZON - SOUTHWEST - General Education",
      "ART IN MOTION: ART IN MOTION - Fine & Performing Arts"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / None</li><li>IEP and EL Students: N/A / None</li></ul><li><strong>Priority: </strong>Continuing,Sibling,General</li></ul>",
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
  },"56dc7b398c41501c2872dac12e87245b": {
    "id": "56dc7b398c41501c2872dac12e87245b",
    "programs": [
      "NOBLE - COMER: NOBLE - COMER - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / None</li><li>IEP and EL Students: N/A / None</li></ul><li><strong>Priority: </strong>Continuing,Sibling,Overlay,General</li></ul>",
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
  "a1f8f178cd604d350b5dba418d492f38": {
    "id": "a1f8f178cd604d350b5dba418d492f38",
    "programs": [
      "NOBLE - BULLS HS: NOBLE - BULLS HS - General Education",
      "NOBLE - UIC HS: NOBLE - UIC HS - General Education",
      "NOBLE - ITW SPEER HS: NOBLE - ITW SPEER HS - STEM"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / None</li><li>IEP and EL Students: N/A / None</li></ul><li><strong>Priority: </strong>Sibling,Overlay,General</li></ul>",
    "fn": lottery(
      SIBLING_LOTTERY_STAGE,
      // (overlay lottery stage?)
      GENERAL_LOTTERY_STAGE
    )
  },
  "3c605ec37638e34bcb9239d1b90712ad": {
    "id": "3c605ec37638e34bcb9239d1b90712ad",
    "programs": [
      "INSTITUTO - HEALTH: INSTITUTO - HEALTH - Allied Health",
      "SULLIVAN HS: SULLIVAN HS - Medical & Health Careers",
      "WELLS HS: WELLS HS - Pre-Law",
      "CHICAGO VOCATIONAL HS: CHICAGO VOCATIONAL HS - Medical Assisting",
      "DUNBAR HS: DUNBAR HS - Medical and Health Careers",
      "NORTH-GRAND HS: NORTH-GRAND HS - Allied Health",
      "NORTH-GRAND HS: NORTH-GRAND HS - Pre-Engineering",
      "FARRAGUT HS: FARRAGUT HS - Pre-Law",
      "FOREMAN HS: FOREMAN HS - Pre-Engineering",
      "GAGE PARK HS: GAGE PARK HS - Allied Health",
      "KELVYN PARK HS: KELVYN PARK HS - Allied Health",
      "MATHER HS: MATHER HS - Pre-Engineering",
      "MATHER HS: MATHER HS - Pre-Law",
      "ROOSEVELT HS: ROOSEVELT HS - Medical & Health Careers",
      "SCHURZ HS: SCHURZ HS - Allied Health",
      "SCHURZ HS: SCHURZ HS - Pre-Engineering",
      "CURIE HS: CURIE HS - Pre-Engineering",
      "CLEMENTE HS: CLEMENTE HS - Allied Health",
      "JUAREZ HS: JUAREZ HS - Medical & Health Careers",
      "JULIAN HS: JULIAN HS - Allied Health",
      "BOWEN HS: BOWEN HS - Pre-Engineering",
      "RABY HS: RABY HS - Pre-Law",
      "WILLIAMS HS: WILLIAMS HS - Medical & Health Careers",
      "SOCIAL JUSTICE HS: SOCIAL JUSTICE HS - Allied Health",
      "MULTICULTURAL ARTS HS: MULTICULTURAL ARTS HS - Allied Health",
      "WORLD LANGUAGE HS: WORLD LANGUAGE HS - Allied Health",
      "ALCOTT HS: ALCOTT HS - Pre-Engineering",
      "SOLORIO HS: SOLORIO HS - Pre-Engineering",
      "SOUTH SHORE INTL HS: SOUTH SHORE INTL HS - Medical & Health Careers"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Point</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / None</li><li>IEP and EL Students: N/A / None</li></ul><li><strong>Priority: </strong>General</li></ul>",
    "fn": ctePointSystem
  },
  "de8132a075636d92854e2b7875d5fa0e": {
    "id": "de8132a075636d92854e2b7875d5fa0e",
    "programs": [
      "PERSPECTIVES - LEADERSHIP HS: PERSPECTIVES - LEADERSHIP HS - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / None</li><li>IEP and EL Students: N/A / None</li></ul><li><strong>Priority: </strong>Continuing,Sibling,Proximity,General</li></ul>",
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
  "cc2a3cbeb40c78e589f5657b6b458e92": {
    "id": "cc2a3cbeb40c78e589f5657b6b458e92",
    "programs": [
      "U OF C - WOODLAWN HS: U OF C - WOODLAWN HS - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / None</li><li>IEP and EL Students: N/A / None</li></ul><li><strong>Priority: </strong>Sibling,Overlay,General,Continuing,Guarantee Elem</li><li><strong>Note: </strong>Elementary preference:  U of C Woodson</li></ul>",
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
  "88072e4d14a13aab62fbc2ee51135755": {
    "id": "88072e4d14a13aab62fbc2ee51135755",
    "programs": [
      "ACERO - DE LA CRUZ: ACERO - DE LA CRUZ - Fine & Performing Arts"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / None</li><li>IEP and EL Students: N/A / None</li></ul><li><strong>Priority: </strong>Sibling,Continuing,Elem Pref,General</li><li><strong>Note: </strong>Elementary preference: ACERO - BRIGHTON PARK, ACERO - CISNEROS, ACERO - CLEMENTE,  ACERO - DE LA CRUZ, ACERO - DE LAS CASAS,  ACERO - FUENTES,ACERO - IDAR, ACERO - MARQUEZ, ACERO - PAZ, ACERO - SANTIAGO, ACERO - TAMAYO,  ACERO - TORRES, ACERO - ZIZUMBO</li></ul>",
    "fn": lottery(
      SIBLING_LOTTERY_STAGE,
      {
        filter: ifStudentAttendsOneOf(...ACERO_ES_PROGRAMS),
        size: LotteryStageSize.LARGE
      },
      GENERAL_LOTTERY_STAGE,
    )
  },
  "04233c494a44c261de810fae4c99c24d": {
    "id": "04233c494a44c261de810fae4c99c24d",
    "programs": [
      "ACERO - GARCIA HS: ACERO - GARCIA HS - STEM",
      "ACERO - SOTO HS: ACERO - SOTO HS - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / None</li><li>IEP and EL Students: N/A / None</li></ul><li><strong>Priority: </strong>Sibling,Elem Pref,General</li><li><strong>Note: </strong>Elementary preference: ACERO - BRIGHTON PARK, ACERO - CISNEROS, ACERO - CLEMENTE,  ACERO - DE LA CRUZ, ACERO - DE LAS CASAS,  ACERO - FUENTES,ACERO - IDAR, ACERO - MARQUEZ, ACERO - PAZ, ACERO - SANTIAGO, ACERO - TAMAYO,  ACERO - TORRES, ACERO - ZIZUMBO</li></ul>",
    "fn": lottery(
      SIBLING_LOTTERY_STAGE,
      {
        filter: ifStudentAttendsOneOf(...ACERO_ES_PROGRAMS),
        size: LotteryStageSize.LARGE
      },
      GENERAL_LOTTERY_STAGE,
    )
  },
  "213070db79565b477ef1202c9c8731b8": {
    "id": "213070db79565b477ef1202c9c8731b8",
    "programs": [
      "SULLIVAN HS: SULLIVAN HS - Significantly Modified Curriculum w/ Moderate Supports",
      "TAFT HS: TAFT HS - Significantly Modified Curriculum w/ Intensive Supports",
      "TILDEN HS: TILDEN HS - Significantly Modified Curriculum w/ Moderate Supports",
      "VON STEUBEN HS: VON STEUBEN HS - Significantly Modified Curriculum w/ Moderate Supports",
      "WASHINGTON HS: WASHINGTON HS - Significantly Modified Curriculum w/ Moderate Supports",
      "HUBBARD HS: HUBBARD HS - MultiSensory",
      "NORTHSIDE LEARNING HS: NORTHSIDE LEARNING HS - Significantly Modified Curriculum w/ Moderate Supports",
      "CHICAGO VOCATIONAL HS: CHICAGO VOCATIONAL HS - Deaf/Hard of Hearing",
      "CHICAGO VOCATIONAL HS: CHICAGO VOCATIONAL HS - Significantly Modified Curriculum w/ Intensive Supports",
      "CHICAGO VOCATIONAL HS: CHICAGO VOCATIONAL HS - Significantly Modified Curriculum w/ Moderate Supports",
      "DUNBAR HS: DUNBAR HS - Significantly Modified Curriculum w/ Moderate Supports",
      "JONES HS: JONES HS - Significantly Modified Curriculum w/ Intensive Supports",
      "JONES HS: JONES HS - Significantly Modified Curriculum w/ Moderate Supports",
      "PROSSER HS: PROSSER HS - Deaf/Hard of Hearing",
      "PROSSER HS: PROSSER HS - Significantly Modified Curriculum w/ Moderate Supports",
      "PAYTON HS: PAYTON HS - Significantly Modified Curriculum w/ Moderate Supports",
      "PAYTON HS: PAYTON HS - Visual Impairment",
      "SIMEON HS: SIMEON HS - Significantly Modified Curriculum w/ Intensive Supports",
      "SIMEON HS: SIMEON HS - Significantly Modified Curriculum w/ Moderate Supports",
      "NORTH-GRAND HS: NORTH-GRAND HS - Significantly Modified Curriculum w/ Intensive Supports",
      "NORTH-GRAND HS: NORTH-GRAND HS - Significantly Modified Curriculum w/ Moderate Supports",
      "WESTINGHOUSE HS: WESTINGHOUSE HS - Significantly Modified Curriculum w/ Intensive Supports",
      "WESTINGHOUSE HS: WESTINGHOUSE HS - Significantly Modified Curriculum w/ Moderate Supports",
      "AMUNDSEN HS: AMUNDSEN HS - Significantly Modified Curriculum w/ Moderate Supports",
      "HANCOCK HS: HANCOCK HS - Significantly Modified Curriculum w/ Moderate Supports",
      "BOGAN HS: BOGAN HS - Significantly Modified Curriculum w/ Moderate Supports",
      "FARRAGUT HS: FARRAGUT HS - Significantly Modified Curriculum w/ Moderate Supports",
      "FOREMAN HS: FOREMAN HS - Significantly Modified Curriculum w/ Moderate Supports",
      "HYDE PARK HS: HYDE PARK HS - Significantly Modified Curriculum w/ Moderate Supports",
      "KELLY HS: KELLY HS - Significantly Modified Curriculum w/ Moderate Supports",
      "KELLY HS: KELLY HS - MultiSensory",
      "KENNEDY HS: KENNEDY HS - Significantly Modified Curriculum w/ Moderate Supports",
      "BROOKS HS: BROOKS HS - Significantly Modified Curriculum w/ Intensive Supports",
      "BROOKS HS: BROOKS HS - Significantly Modified Curriculum w/ Moderate Supports",
      "LINCOLN PARK HS: LINCOLN PARK HS - Significantly Modified Curriculum w/ Moderate Supports",
      "LAKE VIEW HS: LAKE VIEW HS - MultiSensory",
      "LANE TECH HS: LANE TECH HS - Significantly Modified Curriculum w/ Intensive Supports",
      "LANE TECH HS: LANE TECH HS - Significantly Modified Curriculum w/ Moderate Supports",
      "MORGAN PARK HS: MORGAN PARK HS - Significantly Modified Curriculum w/ Moderate Supports",
      "ROOSEVELT HS: ROOSEVELT HS - Significantly Modified Curriculum w/ Moderate Supports",
      "SCHURZ HS: SCHURZ HS - Significantly Modified Curriculum w/ Moderate Supports",
      "KENWOOD HS: KENWOOD HS - Significantly Modified Curriculum w/ Moderate Supports",
      "NORTHSIDE PREP HS: NORTHSIDE PREP HS - Significantly Modified Curriculum w/ Intensive Supports",
      "KING HS: KING HS - Significantly Modified Curriculum w/ Intensive Supports",
      "KING HS: KING HS - Significantly Modified Curriculum w/ Moderate Supports",
      "CHICAGO AGRICULTURE HS: CHICAGO AGRICULTURE HS - Significantly Modified Curriculum w/ Intensive Supports",
      "CHICAGO AGRICULTURE HS: CHICAGO AGRICULTURE HS - Significantly Modified Curriculum w/ Moderate Supports",
      "YOUNG HS: YOUNG HS - Deaf/Hard of Hearing",
      "YOUNG HS: YOUNG HS - Significantly Modified Curriculum w/ Intensive Supports",
      "YOUNG HS: YOUNG HS - Significantly Modified Curriculum w/ Moderate Supports",
      "CURIE HS: CURIE HS - Deaf/Hard of Hearing",
      "CURIE HS: CURIE HS - Visual Impairment",
      "CLEMENTE HS: CLEMENTE HS - Significantly Modified Curriculum w/ Moderate Supports",
      "CORLISS HS: CORLISS HS - Significantly Modified Curriculum w/ Moderate Supports",
      "JULIAN HS: JULIAN HS - Significantly Modified Curriculum w/ Moderate Supports",
      "JULIAN HS: JULIAN HS - MultiSensory",
      "VAUGHN HS: VAUGHN HS - Significantly Modified Curriculum w/ Moderate Supports",
      "CLARK HS: CLARK HS - Significantly Modified Curriculum w/ Moderate Supports",
      "BOWEN HS: BOWEN HS - Significantly Modified Curriculum w/ Moderate Supports",
      "RABY HS: RABY HS - Significantly Modified Curriculum w/ Moderate Supports",
      "BRONZEVILLE HS: BRONZEVILLE HS - General Education",
      "LINDBLOM HS: LINDBLOM HS - Significantly Modified Curriculum w/ Intensive Supports",
      "LINDBLOM HS: LINDBLOM HS - Significantly Modified Curriculum w/ Moderate Supports",
      "UPLIFT HS: UPLIFT HS - Significantly Modified Curriculum w/ Intensive Supports",
      "UPLIFT HS: UPLIFT HS - Significantly Modified Curriculum w/ Moderate Supports",
      "OGDEN HS: OGDEN HS - Deaf/Hard of Hearing",
      "SOLORIO HS: SOLORIO HS - Significantly Modified Curriculum w/ Intensive Supports",
      "SOUTH SHORE INTL HS: SOUTH SHORE INTL HS - Significantly Modified Curriculum w/ Moderate Supports",
      "GOODE HS: GOODE HS - Significantly Modified Curriculum w/ Intensive Supports",
      "ENGLEWOOD STEM HS: ENGLEWOOD STEM HS - Significantly Modified Curriculum w/ Moderate Supports"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>None<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: None / None</li><li>IEP and EL Students: None / None</li></ul></li><li><strong>Priority: </strong>None</li></ul>",
    "fn": lottery(
      GENERAL_LOTTERY_STAGE
    )
  },
  "093bdb9e6477bfb91a17a801e48e406a": {
    "id": "093bdb9e6477bfb91a17a801e48e406a",
    "programs": [
      "SULLIVAN HS: SULLIVAN HS - Significantly Modified Curriculum w/ Moderate Supports",
      "TAFT HS: TAFT HS - Significantly Modified Curriculum w/ Intensive Supports",
      "TILDEN HS: TILDEN HS - Significantly Modified Curriculum w/ Moderate Supports",
      "VON STEUBEN HS: VON STEUBEN HS - Significantly Modified Curriculum w/ Moderate Supports",
      "WASHINGTON HS: WASHINGTON HS - Significantly Modified Curriculum w/ Moderate Supports",
      "HUBBARD HS: HUBBARD HS - MultiSensory",
      "NORTHSIDE LEARNING HS: NORTHSIDE LEARNING HS - Significantly Modified Curriculum w/ Moderate Supports",
      "CHICAGO VOCATIONAL HS: CHICAGO VOCATIONAL HS - Deaf/Hard of Hearing",
      "CHICAGO VOCATIONAL HS: CHICAGO VOCATIONAL HS - Significantly Modified Curriculum w/ Intensive Supports",
      "CHICAGO VOCATIONAL HS: CHICAGO VOCATIONAL HS - Significantly Modified Curriculum w/ Moderate Supports",
      "DUNBAR HS: DUNBAR HS - Significantly Modified Curriculum w/ Moderate Supports",
      "JONES HS: JONES HS - Significantly Modified Curriculum w/ Intensive Supports",
      "JONES HS: JONES HS - Significantly Modified Curriculum w/ Moderate Supports",
      "PROSSER HS: PROSSER HS - Deaf/Hard of Hearing",
      "PROSSER HS: PROSSER HS - Significantly Modified Curriculum w/ Moderate Supports",
      "PAYTON HS: PAYTON HS - Significantly Modified Curriculum w/ Moderate Supports",
      "PAYTON HS: PAYTON HS - Visual Impairment",
      "SIMEON HS: SIMEON HS - Significantly Modified Curriculum w/ Intensive Supports",
      "SIMEON HS: SIMEON HS - Significantly Modified Curriculum w/ Moderate Supports",
      "NORTH-GRAND HS: NORTH-GRAND HS - Significantly Modified Curriculum w/ Intensive Supports",
      "NORTH-GRAND HS: NORTH-GRAND HS - Significantly Modified Curriculum w/ Moderate Supports",
      "WESTINGHOUSE HS: WESTINGHOUSE HS - Significantly Modified Curriculum w/ Intensive Supports",
      "WESTINGHOUSE HS: WESTINGHOUSE HS - Significantly Modified Curriculum w/ Moderate Supports",
      "AMUNDSEN HS: AMUNDSEN HS - Significantly Modified Curriculum w/ Moderate Supports",
      "HANCOCK HS: HANCOCK HS - Significantly Modified Curriculum w/ Moderate Supports",
      "BOGAN HS: BOGAN HS - Significantly Modified Curriculum w/ Moderate Supports",
      "FARRAGUT HS: FARRAGUT HS - Significantly Modified Curriculum w/ Moderate Supports",
      "FOREMAN HS: FOREMAN HS - Significantly Modified Curriculum w/ Moderate Supports",
      "HYDE PARK HS: HYDE PARK HS - Significantly Modified Curriculum w/ Moderate Supports",
      "KELLY HS: KELLY HS - Significantly Modified Curriculum w/ Moderate Supports",
      "KELLY HS: KELLY HS - MultiSensory",
      "KENNEDY HS: KENNEDY HS - Significantly Modified Curriculum w/ Moderate Supports",
      "BROOKS HS: BROOKS HS - Significantly Modified Curriculum w/ Intensive Supports",
      "BROOKS HS: BROOKS HS - Significantly Modified Curriculum w/ Moderate Supports",
      "LINCOLN PARK HS: LINCOLN PARK HS - Significantly Modified Curriculum w/ Moderate Supports",
      "LAKE VIEW HS: LAKE VIEW HS - MultiSensory",
      "LANE TECH HS: LANE TECH HS - Significantly Modified Curriculum w/ Intensive Supports",
      "LANE TECH HS: LANE TECH HS - Significantly Modified Curriculum w/ Moderate Supports",
      "MORGAN PARK HS: MORGAN PARK HS - Significantly Modified Curriculum w/ Moderate Supports",
      "ROOSEVELT HS: ROOSEVELT HS - Significantly Modified Curriculum w/ Moderate Supports",
      "SCHURZ HS: SCHURZ HS - Significantly Modified Curriculum w/ Moderate Supports",
      "KENWOOD HS: KENWOOD HS - Significantly Modified Curriculum w/ Moderate Supports",
      "NORTHSIDE PREP HS: NORTHSIDE PREP HS - Significantly Modified Curriculum w/ Intensive Supports",
      "KING HS: KING HS - Significantly Modified Curriculum w/ Intensive Supports",
      "KING HS: KING HS - Significantly Modified Curriculum w/ Moderate Supports",
      "CHICAGO AGRICULTURE HS: CHICAGO AGRICULTURE HS - Significantly Modified Curriculum w/ Intensive Supports",
      "CHICAGO AGRICULTURE HS: CHICAGO AGRICULTURE HS - Significantly Modified Curriculum w/ Moderate Supports",
      "YOUNG HS: YOUNG HS - Deaf/Hard of Hearing",
      "YOUNG HS: YOUNG HS - Significantly Modified Curriculum w/ Intensive Supports",
      "YOUNG HS: YOUNG HS - Significantly Modified Curriculum w/ Moderate Supports",
      "CURIE HS: CURIE HS - Deaf/Hard of Hearing",
      "CURIE HS: CURIE HS - Visual Impairment",
      "CLEMENTE HS: CLEMENTE HS - Significantly Modified Curriculum w/ Moderate Supports",
      "CORLISS HS: CORLISS HS - Significantly Modified Curriculum w/ Moderate Supports",
      "JULIAN HS: JULIAN HS - Significantly Modified Curriculum w/ Moderate Supports",
      "JULIAN HS: JULIAN HS - MultiSensory",
      "VAUGHN HS: VAUGHN HS - Significantly Modified Curriculum w/ Moderate Supports",
      "CLARK HS: CLARK HS - Significantly Modified Curriculum w/ Moderate Supports",
      "BOWEN HS: BOWEN HS - Significantly Modified Curriculum w/ Moderate Supports",
      "RABY HS: RABY HS - Significantly Modified Curriculum w/ Moderate Supports",
      "BRONZEVILLE HS: BRONZEVILLE HS - Significantly Modified Curriculum w/ Moderate Supports",
      "LINDBLOM HS: LINDBLOM HS - Significantly Modified Curriculum w/ Intensive Supports",
      "LINDBLOM HS: LINDBLOM HS - Significantly Modified Curriculum w/ Moderate Supports",
      "UPLIFT HS: UPLIFT HS - Significantly Modified Curriculum w/ Intensive Supports",
      "UPLIFT HS: UPLIFT HS - Significantly Modified Curriculum w/ Moderate Supports",
      "OGDEN HS: OGDEN HS - Deaf/Hard of Hearing",
      "SOLORIO HS: SOLORIO HS - Significantly Modified Curriculum w/ Intensive Supports",
      "SOUTH SHORE INTL HS: SOUTH SHORE INTL HS - Significantly Modified Curriculum w/ Moderate Supports",
      "GOODE HS: GOODE HS - Significantly Modified Curriculum w/ Intensive Supports",
      "ENGLEWOOD STEM HS: ENGLEWOOD STEM HS - Significantly Modified Curriculum w/ Moderate Supports"
    ],
    "desc": "Cluster and Review",
    "fn": notImplemented
  },
  "27f338b0d4bb3729dda10dfbb6839e0b": {
    "id": "27f338b0d4bb3729dda10dfbb6839e0b",
    "programs": [
      "ROOSEVELT HS: ROOSEVELT HS - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / None</li><li>IEP and EL Students: N/A / None</li></ul><li><strong>Priority: </strong>Sibling,Staff Pref,Attendance Area,General</li></ul>",
    "fn": lottery(
      SIBLING_LOTTERY_STAGE,
      STAFF_PREFERENCE_LOTTERY_STAGE,
      ATTENDANCE_AREA_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE
    )
  },
  "f3b4921d7c91bd3ffb63e7bef5989b04": {
    "id": "f3b4921d7c91bd3ffb63e7bef5989b04",
    "programs": [
      "JONES HS: JONES HS - Pre-Engineering",
      "JONES HS: JONES HS - Pre-Law",
      "HANCOCK HS: HANCOCK HS - Pre-Engineering",
      "HANCOCK HS: HANCOCK HS - Pre-Law"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Point</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: 24 / 48</li><li>IEP and EL Students: 24 / 48</li></ul><li><strong>Priority: </strong>Overlay,General</li></ul>",
    "fn": conditional(
      {
        filter: ifHasGrades({hsatCombined: 48}),
        fn: ctePointSystem
      }
    )
  },
  "626ed37ef5e5e5f484aa97869fd3a842": {
    "id": "626ed37ef5e5e5f484aa97869fd3a842",
    "programs": [
      "JONES HS: JONES HS - Selective Enrollment High School",
      "PAYTON HS: PAYTON HS - Selective Enrollment High School",
      "WESTINGHOUSE HS: WESTINGHOUSE HS - Selective Enrollment High School",
      "HANCOCK HS: HANCOCK HS - Selective Enrollment High School",
      "BROOKS HS: BROOKS HS - Selective Enrollment High School",
      "LANE TECH HS: LANE TECH HS - Selective Enrollment High School",
      "NORTHSIDE PREP HS: NORTHSIDE PREP HS - Selective Enrollment High School",
      "KING HS: KING HS - Selective Enrollment High School",
      "YOUNG HS: YOUNG HS - Selective Enrollment High School",
      "LINDBLOM HS: LINDBLOM HS - Selective Enrollment High School",
      "SOUTH SHORE INTL HS: SOUTH SHORE INTL HS - Selective Enrollment High School"
    ],
    "desc": "Admissions Exam",
    "fn": accept(everyone)
  },
  "a5617aaca0f1bdff1e9844101b2eab99": {
    "id": "a5617aaca0f1bdff1e9844101b2eab99",
    "programs": [
      "JONES HS: JONES HS - Selective Enrollment High School",
      "PAYTON HS: PAYTON HS - Selective Enrollment High School",
      "WESTINGHOUSE HS: WESTINGHOUSE HS - Selective Enrollment High School",
      "HANCOCK HS: HANCOCK HS - Selective Enrollment High School",
      "BROOKS HS: BROOKS HS - Selective Enrollment High School",
      "LANE TECH HS: LANE TECH HS - Selective Enrollment High School",
      "NORTHSIDE PREP HS: NORTHSIDE PREP HS - Selective Enrollment High School",
      "KING HS: KING HS - Selective Enrollment High School",
      "YOUNG HS: YOUNG HS - Selective Enrollment High School",
      "LINDBLOM HS: LINDBLOM HS - Selective Enrollment High School",
      "SOUTH SHORE INTL HS: SOUTH SHORE INTL HS - Selective Enrollment High School"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Point</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: 24 / 48</li><li>IEP and EL Students: 24 / 48</li></ul><li><strong>Priority: </strong>General,Tier</li></ul>",
    "fn": sePointSystem
  },
  "f2ccdcf5bbf70e93a36e359fcf11fb61": {
    "id": "f2ccdcf5bbf70e93a36e359fcf11fb61",
    "programs": [
      "PROSSER HS: PROSSER HS - Career Academy"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>2.5</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / None</li><li>IEP and EL Students: N/A / None</li></ul><li><strong>Priority: </strong>Sibling,Staff Pref,Proximity,General</li></ul>",
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
  "5887d530808c0fdcc3f430f0905bd1d9": {
    "id": "5887d530808c0fdcc3f430f0905bd1d9",
    "programs": [
      "HUBBARD HS: HUBBARD HS - International Baccalaureate (IB)",
      "PROSSER HS: PROSSER HS - International Baccalaureate (IB)",
      "BOGAN HS: BOGAN HS - International Baccalaureate (IB)",
      "KELLY HS: KELLY HS - International Baccalaureate (IB)",
      "KENNEDY HS: KENNEDY HS - International Baccalaureate (IB)",
      "LINCOLN PARK HS: LINCOLN PARK HS - International Baccalaureate (IB)",
      "SCHURZ HS: SCHURZ HS - International Baccalaureate (IB)",
      "CLEMENTE HS: CLEMENTE HS - International Baccalaureate (IB)",
      "JUAREZ HS: JUAREZ HS - International Baccalaureate (IB)",
      "BRONZEVILLE HS: BRONZEVILLE HS - International Baccalaureate (IB)",
      "SOUTH SHORE INTL HS: SOUTH SHORE INTL HS - International Baccalaureate (IB)"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Point</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / None</li><li>IEP and EL Students: N/A / None</li></ul><li><strong>Priority: </strong>General</li><li><strong>Note: </strong>50 bonus points for attendance area</li></ul>",
    "fn": ibPointSystem
  },
  "ea923a50b0da60d62ba86ee031c124c3": {
    "id": "ea923a50b0da60d62ba86ee031c124c3",
    "programs": [
      "NORTH-GRAND HS: NORTH-GRAND HS - General Education",
      "CLEMENTE HS: CLEMENTE HS - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>2.5</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / None</li><li>IEP and EL Students: N/A / None</li></ul><li><strong>Priority: </strong>Attendance Area,Sibling,Staff Pref,General</li></ul>",
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
  "f0f62e58ab3027892364abeb8a420616": {
    "id": "f0f62e58ab3027892364abeb8a420616",
    "programs": [
      "SIMEON HS: SIMEON HS - Career Academy"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Point</li><li><strong>GPA: </strong>2</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / 25</li><li>IEP and EL Students: N/A / 25</li></ul><li><strong>Priority: </strong>General</li><li><strong>Note: </strong>Schedule your interview in your GoCPS account. </li></ul>",
    "fn": conditional({
      filter: ifHasGrades({ hsatCombined: 25, gpa: 2 }),
      fn: lottery(
        GENERAL_LOTTERY_STAGE
      )
    })
  },
  "cb20d1782d895ed3da2b5cad6179462d": {
    "id": "cb20d1782d895ed3da2b5cad6179462d",
    "programs": [
      "TAFT HS: TAFT HS - NJROTC"
    ],
    "desc": "Interview",
    "fn": notImplemented
  },
  "99f60cb1cad390234aa50184df7719ba": {
    "id": "99f60cb1cad390234aa50184df7719ba",
    "programs": [
      "WASHINGTON HS: WASHINGTON HS - General Education",
      "SENN HS: SENN HS - General Education",
      "CURIE HS: CURIE HS - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / None</li><li>IEP and EL Students: N/A / None</li></ul><li><strong>Priority: </strong>Attendance Area</li></ul>",
    "fn": lottery(
      GENERAL_LOTTERY_STAGE
    )
  },
  "2630fa97cbfe6f5bbdee95c31b6cd2f4": {
    "id": "2630fa97cbfe6f5bbdee95c31b6cd2f4",
    "programs": [
      "WESTINGHOUSE HS: WESTINGHOUSE HS - Career Academy"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>3</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: 24 / 48</li><li>IEP and EL Students: 24 / 48</li></ul><li><strong>Priority: </strong>Sibling,Staff Pref,Proximity,General</li></ul>",
    "fn": conditional(
      {
        filter: both(ifIEPorEL, ifHasGrades({gpa:3, hsatCombined: 48})),
        fn:lottery(
          PROXIMITY_LOTTERY_STAGE,
          GENERAL_LOTTERY_STAGE,
        )
      },
      {
        filter: ifHasGrades({gpa:3, hsatBoth: 24}),
        fn:lottery(
          PROXIMITY_LOTTERY_STAGE,
          GENERAL_LOTTERY_STAGE,
        )
      }
    )
  },
  "498dd3d8d852fccd7f5baa9dca4eb6dc": {
    "id": "498dd3d8d852fccd7f5baa9dca4eb6dc",
    "programs": [
      "AMUNDSEN HS: AMUNDSEN HS - General Education Grow Community"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / None</li><li>IEP and EL Students: N/A / None</li></ul><li><strong>Priority: </strong>Attendance Area,Sibling,Staff Pref,Elem Pref,General</li><li><strong>Note: </strong>Elementary preference: Audubon ES,  Bell ES, Blaine ES, Budlong ES, Burley ES, Chappell ES, Coonley ES, Greeley ES, Hamilton ES, Hawthorne ES,  Inter-American ES, Jahn ES, Jamieson ES, McPherson ES, Nettelhorst ES, Ravenswood ES, Waters ES, Ravenswood ES, Waters ES</li></ul>",
    "fn": conditional(
      {
        filter: ifInAttendBound,
        fn: accept(everyone)
      },
      {
        filter: everyone,
        fn: lottery(
        {
          filter: ifStudentAttendsOneOf(
            ...GROW_COMMUNITY_SCHOOL_ES_PROGRAMS
          ),
          size: LotteryStageSize.LARGE
        },
        ATTENDANCE_AREA_LOTTERY_STAGE,
        SIBLING_LOTTERY_STAGE,
        STAFF_PREFERENCE_LOTTERY_STAGE,
        GENERAL_LOTTERY_STAGE,
      )}
    )
  },
  "3e60b09562a5c0fdd86d8c946f1473c8": {
    "id": "3e60b09562a5c0fdd86d8c946f1473c8",
    "programs": [
      "AMUNDSEN HS: AMUNDSEN HS - International Baccalaureate (IB)"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Point</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / None</li><li>IEP and EL Students: N/A / None</li></ul><li><strong>Priority: </strong>Elem Pref,General</li><li><strong>Note: </strong>-50 bonus points for attendance area- Elementary preference: McPherson (IB Partner School)</li></ul>",
    "fn": ibPointSystem
  },
  "dde7fa9df4f2316490b4df271f165dc9": {
    "id": "dde7fa9df4f2316490b4df271f165dc9",
    "programs": [
      "BOGAN HS: BOGAN HS - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>2.5</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / None</li><li>IEP and EL Students: N/A / None</li></ul><li><strong>Priority: </strong>Attendance Area,Staff Pref,General</li></ul>",
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
  "b92e3a17002c0ee8140dfcb86e2c7988": {
    "id": "b92e3a17002c0ee8140dfcb86e2c7988",
    "programs": [
      "FARRAGUT HS: FARRAGUT HS - International Baccalaureate (IB)"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Point</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / None</li><li>IEP and EL Students: N/A / None</li></ul><li><strong>Priority: </strong>Elem Pref,General</li><li><strong>Note: </strong>- 50 bonus points for attendance area - Elementary preference:  Madero (IB Partner School)</li></ul>",
    "fn": ibPointSystem
  },
  "7ad36db6cd93e6c5145c4084e0a66bc6": {
    "id": "7ad36db6cd93e6c5145c4084e0a66bc6",
    "programs": [
      "FARRAGUT HS: FARRAGUT HS - JROTC"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>2</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / None</li><li>IEP and EL Students: N/A / None</li></ul><li><strong>Priority: </strong>Attendance Area,General</li></ul>",
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
  "b7b596d00dfeb8ae3ddb3d310c03ee53": {
    "id": "b7b596d00dfeb8ae3ddb3d310c03ee53",
    "programs": [
      "FENGER HS: FENGER HS - Honors"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>2</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: 50 / 100</li><li>IEP and EL Students: 50 / 100</li></ul><li><strong>Priority: </strong>General</li></ul>",
    "fn": conditional(
      {
        filter: both(ifIEPorEL, ifHasGrades({gpa:2, hsatCombined:100})),
        fn:lottery(
          GENERAL_LOTTERY_STAGE,
        )
      },
      {
        filter: ifHasGrades({gpa:2, hsatBoth:50}),
        fn:lottery(
          GENERAL_LOTTERY_STAGE,
        )
      }
    )
  },
  "d5b08e9fbd7fa29f0aa8c77a78453658": {
    "id": "d5b08e9fbd7fa29f0aa8c77a78453658",
    "programs": [
      "FOREMAN HS: FOREMAN HS - JROTC"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>2</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / None</li><li>IEP and EL Students: N/A / None</li></ul><li><strong>Priority: </strong>Sibling,Attendance Area,General</li></ul>",
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
  "de8225424b151068cbf840ff4f5ebec5": {
    "id": "de8225424b151068cbf840ff4f5ebec5",
    "programs": [
      "HYDE PARK HS: HYDE PARK HS - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / None</li><li>IEP and EL Students: N/A / None</li></ul><li><strong>Priority: </strong>Attendance Area,Sibling,Staff Pref,Elem Pref,General</li><li><strong>Note: </strong>Elementary preference:  Carnegie ES (IB Partner School)</li></ul>",
    "fn": conditional(
        {
          filter:ifInAttendBound,
          fn:accept(everyone)
        },
        {
          filter: everyone,
          fn:lottery(
          ATTENDANCE_AREA_LOTTERY_STAGE,
          SIBLING_LOTTERY_STAGE,
          STAFF_PREFERENCE_LOTTERY_STAGE,
          {
            filter: ifStudentAttendsOneOf(CARNEGIE_ES_PROGRAMS),
            size: LotteryStageSize.LARGE
          },
          GENERAL_LOTTERY_STAGE,
        )
      }
    )
  },
  "5169a454ae0797aaecfed2cd6d6f2d8a": {
    "id": "5169a454ae0797aaecfed2cd6d6f2d8a",
    "programs": [
      "HYDE PARK HS: HYDE PARK HS - International Baccalaureate (IB)"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Point</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / None</li><li>IEP and EL Students: N/A / None</li></ul><li><strong>Priority: </strong>Elem Pref,General</li><li><strong>Note: </strong>- 50 bonus points for attendance area - Elementary preference: Carnegie ES (IB Partner School)</li></ul>",
    "fn": ibPointSystem
  },
  "6a173306fafef3bff410a99d93da7873": {
    "id": "6a173306fafef3bff410a99d93da7873",
    "programs": [
      "KELLY HS: KELLY HS - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>2.0</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / None</li><li>IEP and EL Students: N/A / None</li></ul><li><strong>Priority: </strong>Attendance Area,Sibling,Staff Pref,General</li></ul>",
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
  "fc14b1bcf70407e1a612cdf374f9f219": {
    "id": "fc14b1bcf70407e1a612cdf374f9f219",
    "programs": [
      "KELVYN PARK HS: KELVYN PARK HS - Fine Arts & Technology",
      "BRONZEVILLE HS: BRONZEVILLE HS - Significantly Modified Curriculum w/ Moderate Supports"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / None</li><li>IEP and EL Students: N/A / None</li></ul><li><strong>Priority: </strong>General,Attendance Area</li></ul>",
    "fn": lottery(
      GENERAL_LOTTERY_STAGE,
      ATTENDANCE_AREA_LOTTERY_STAGE
    )
  },
  "3693234d9662958b675510aae85adc23": {
    "id": "3693234d9662958b675510aae85adc23",
    "programs": [
      "KELVYN PARK HS: KELVYN PARK HS - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / None</li><li>IEP and EL Students: N/A / None</li></ul><li><strong>Priority: </strong>Continuing,Attendance Area,Sibling,Staff Pref,General</li></ul>",
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
  "c27c69f5a0460c428f2c6d6b6d389930": {
    "id": "c27c69f5a0460c428f2c6d6b6d389930",
    "programs": [
      "LINCOLN PARK HS: LINCOLN PARK HS - Drama",
      "LINCOLN PARK HS: LINCOLN PARK HS - Music - Instrumental",
      "LINCOLN PARK HS: LINCOLN PARK HS - VISUAL ARTS",
      "LINCOLN PARK HS: LINCOLN PARK HS - Music - Vocal"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Point</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / None</li><li>IEP and EL Students: N/A / None</li></ul><li><strong>Priority: </strong>General,Attendance Area</li><li><strong>Note: </strong>Schedule your audition in your GoCPS account. For more information visit: https://www.lincolnparkhs.org/apps/pages/index.jsp?uREC_ID=924953&type=d&pREC_ID=1674883</li></ul>",
    "fn": notImplemented
  },
  "7ce60fadea9c74646594d00f2ddfd57d": {
    "id": "7ce60fadea9c74646594d00f2ddfd57d",
    "programs": [
      "LINCOLN PARK HS: LINCOLN PARK HS - Honors/Double Honors"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Point</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / None</li><li>IEP and EL Students: N/A / None</li></ul><li><strong>Priority: </strong>Attendance Area,General</li><li><strong>Note: </strong>50 bonus points for attendance area</li></ul>",
    "fn": ibPointSystem
  },
  "6288b018f93924c04babb26300ad86df": {
    "id": "6288b018f93924c04babb26300ad86df",
    "programs": [
      "LAKE VIEW HS: LAKE VIEW HS - Early College STEM"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / None</li><li>IEP and EL Students: N/A / None</li></ul><li><strong>Priority: </strong>Attendance Area,Sibling,Staff Pref,Elem Pref,Overlay,General</li><li><strong>Note: </strong>Students who live outside of the school's attendance boundary are randomly selected by computerized lottery. Students who attend Grow Community Schools (Audubon, Bell, Blaine, Budlong, Burley, Chappell, Coonley, Greeley, Hamilton, Hawthorne, Inter-American, Jahn, Jamieson, McPherson, Nettelhorst, Ravenswood, or Waters) receive preference to available seats after sibling and staff preference seats are filled. The lottery is conducted in the following order: Siblings, staff preference, Elementary preference (Grow Community Schools), students who have at least a 3.1 GPA & whose HSAT ELA and math combo is at least 100, general.</li></ul>",
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
  "46936de6b1417394fde5f08ef91ffe57": {
    "id": "46936de6b1417394fde5f08ef91ffe57",
    "programs": [
      "MATHER HS: MATHER HS - AVID"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>2.0</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / None</li><li>IEP and EL Students: N/A / None</li></ul><li><strong>Priority: </strong>Attendance Area,Sibling,Staff Pref,Elem Pref,General</li><li><strong>Note: </strong>Elementary preference:  Boone, Clinton, Jamieson, Peterson, Rogers, West Ridge</li></ul>",
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
  "9488c751c5bac32f53b3ff4be3ce9e58": {
    "id": "9488c751c5bac32f53b3ff4be3ce9e58",
    "programs": [
      "MATHER HS: MATHER HS - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / None</li><li>IEP and EL Students: N/A / None</li></ul><li><strong>Priority: </strong>Attendance Area,Sibling,Staff Pref,Elem Pref,General</li><li><strong>Note: </strong>Elementary preference:  Boone, Clinton, Jamieson, Peterson, Rogers, West Ridge</li></ul>",
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
  "d3a4162e2f1f3909ef6f7f7dafcb66fd": {
    "id": "d3a4162e2f1f3909ef6f7f7dafcb66fd",
    "programs": [
      "MORGAN PARK HS: MORGAN PARK HS - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>2.3</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / None</li><li>IEP and EL Students: N/A / None</li></ul><li><strong>Priority: </strong>Attendance Area,Sibling,Staff Pref,General</li></ul>",
    "fn": conditional(
      {
        filter:ifInAttendBound,
        fn:accept(everyone)
      },
      {
        filter:ifHasGrades({
          gpa:2.3
        }),
        fn:lottery(
          ATTENDANCE_AREA_LOTTERY_STAGE,
          CONTINUING_STUDENTS_LOTTERY_STAGE,
          SIBLING_LOTTERY_STAGE,
          STAFF_PREFERENCE_LOTTERY_STAGE,
          GENERAL_LOTTERY_STAGE,
        )
      }
    )
  },
  "95919a140331d3f81bb2df4b26a87298": {
    "id": "95919a140331d3f81bb2df4b26a87298",
    "programs": [
      "MORGAN PARK HS: MORGAN PARK HS - International Baccalaureate (IB)"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Point</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / None</li><li>IEP and EL Students: N/A / None</li></ul><li><strong>Priority: </strong>Continuing,General</li><li><strong>Note: </strong>- 50 bonus points for attendance area - Elementary preference: Morgan Park Academic Center</li></ul>",
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
  "8d0117ca1caa5d3bf47f0971efd3f4b6": {
    "id": "8d0117ca1caa5d3bf47f0971efd3f4b6",
    "programs": [
      "ROOSEVELT HS: ROOSEVELT HS - Dual Language",
      "BACK OF THE YARDS HS: BACK OF THE YARDS HS - Dual Language"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>2.5</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / None</li><li>IEP and EL Students: N/A / None</li></ul><li><strong>Priority: </strong>Sibling,Elem Pref,General</li><li><strong>Note: </strong>Elementary preference:  AZUELA,  BARRY, BATEMAN, BELMONT-CRAGIN, CALMECA, CARSON, CHASE, COOPER, DARWIN, EDWARDS, ERIE, GLOBAL CITIZENSHIP, HURLEY, INTER-AMERICAN, MOOS, MOZART, NAMASTE, SABIN, SPRY ES, STOWE, TALCOTT, TELPOCHCALLI, VOLTA, VON LINNE, WHITTIER</li></ul>",
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
  "a3d12293d1cd856c179519c4e6269550": {
    "id": "a3d12293d1cd856c179519c4e6269550",
    "programs": [
      "SCHURZ HS: SCHURZ HS - Dual Language"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / None</li><li>IEP and EL Students: N/A / None</li></ul><li><strong>Priority: </strong>Sibling,Elem Pref,General</li><li><strong>Note: </strong>Elementary preference:  AZUELA,  BARRY, BATEMAN, BELMONT-CRAGIN, CALMECA, CARSON, CHASE, COOPER, DARWIN, EDWARDS, ERIE, GLOBAL CITIZENSHIP, HURLEY, INTER-AMERICAN, MOOS, MOZART, NAMASTE, SABIN, SPRY ES, STOWE, TALCOTT, TELPOCHCALLI, VOLTA, VON LINNE, WHITTIER</li></ul>",
    "fn": lottery(
      SIBLING_LOTTERY_STAGE,
      {
        filter: ifStudentAttendsOneOf(...LANGUAGE_ES_PROGRAMS),
        size: LotteryStageSize.LARGE
      },
      GENERAL_LOTTERY_STAGE,
    )
  },
  "5247bb0b48948321a31ba4fafb4553d4": {
    "id": "5247bb0b48948321a31ba4fafb4553d4",
    "programs": [
      "SENN HS: SENN HS - International Baccalaureate (IB)"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Point</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / None</li><li>IEP and EL Students: N/A / None</li></ul><li><strong>Priority: </strong>Elem Pref,General</li><li><strong>Note: </strong>- 50 bonus points for attendance area - Elementary preference: Peirce ES (IB Partner School)</li></ul>",
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
  "8fc4f2f3662b05b0d9653e007deffbe1": {
    "id": "8fc4f2f3662b05b0d9653e007deffbe1",
    "programs": [
      "SENN HS: SENN HS - Dance",
      "SENN HS: SENN HS - Music",
      "SENN HS: SENN HS - Theatre",
      "SENN HS: SENN HS - Visual Arts"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Point</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / None</li><li>IEP and EL Students: N/A / None</li></ul><li><strong>Priority: </strong>General</li><li><strong>Note: </strong>Schedule your audition in your GoCPS account. For more information visit: https://www.sennhs.org/apps/pages/SennArtsDanceAdmissions</li></ul>",
    "fn": notImplemented
  },
  "9527d5a24b8bcc776decec496f577ac6": {
    "id": "9527d5a24b8bcc776decec496f577ac6",
    "programs": [
      "STEINMETZ HS: STEINMETZ HS - STEAM"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>2</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: 20 / 40</li><li>IEP and EL Students: 20 / 40</li></ul><li><strong>Priority: </strong>Attendance Area,Sibling,Staff Pref,General</li></ul>",
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
          both(ifIEPorEL, ifHasGrades({gpa:2, hsatCombined:40})),
          ifHasGrades({gpa:2, hsatBoth:20})),
        fn:lottery(
          ATTENDANCE_AREA_LOTTERY_STAGE,
          SIBLING_LOTTERY_STAGE,
          STAFF_PREFERENCE_LOTTERY_STAGE,
          GENERAL_LOTTERY_STAGE,
        )
      }
    )
  },
  "e6dd04e1e2e1e366f964006559bda517": {
    "id": "e6dd04e1e2e1e366f964006559bda517",
    "programs": [
      "STEINMETZ HS: STEINMETZ HS - International Baccalaureate (IB)"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Point</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / None</li><li>IEP and EL Students: N/A / None</li></ul><li><strong>Priority: </strong>Elem Pref,General</li><li><strong>Note: </strong>- 50 bonus points for attendance area - Elementary preference: Locke (IB Partner School)</li></ul>",
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
  "0e79f5df0cc5c95e247889f514fdf26f": {
    "id": "0e79f5df0cc5c95e247889f514fdf26f",
    "programs": [
      "STEINMETZ HS: STEINMETZ HS - JROTC"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>2</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: 22 / 44</li><li>IEP and EL Students: 22 / 44</li></ul><li><strong>Priority: </strong>General</li></ul>",
    "fn": conditional(
      {
        filter:either(
          both(ifIEPorEL, ifHasGrades({gpa:2, hsatCombined:44})),
          ifHasGrades({gpa:2, hsatBoth:22})),
        fn:lottery(
          GENERAL_LOTTERY_STAGE,
        )
      }
    )
  },
  "c76dacfe16e4bdeb33c7c9f9d3d0df35": {
    "id": "c76dacfe16e4bdeb33c7c9f9d3d0df35",
    "programs": [
      "SULLIVAN HS: SULLIVAN HS - Newcomer Academy"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / None</li><li>IEP and EL Students: N/A / None</li></ul><li><strong>Priority: </strong>Attendance Area,Elem Pref,Sibling,General</li><li><strong>Note: </strong>Elementary preference:  Armstrong, Boone, Courtenay, Field, Gale, Hayt, Jordan, Kilmer, McCutcheon, McPherson, West Ridge</li></ul>",
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
      GENERAL_LOTTERY_STAGE,
    )
  },
  "a383dec7f921c785cd538f689489b929": {
    "id": "a383dec7f921c785cd538f689489b929",
    "programs": [
      "SULLIVAN HS: SULLIVAN HS - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / None</li><li>IEP and EL Students: N/A / None</li></ul><li><strong>Priority: </strong>Attendance Area,Elem Pref,Sibling,Staff Pref,General</li><li><strong>Note: </strong>Elementary preference:  Armstrong, Boone, Courtenay, Field, Gale, Hayt, Jordan, Kilmer, McCutcheon, McPherson, West Ridge</li></ul>",
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
      GENERAL_LOTTERY_STAGE,
    )
  },
  "c1f212d18775a504fcb57165efc85331": {
    "id": "c1f212d18775a504fcb57165efc85331",
    "programs": [
      "TAFT HS: TAFT HS - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / None</li><li>IEP and EL Students: N/A / None</li></ul><li><strong>Priority: </strong>Overlay,General</li></ul>",
    "fn": lottery(
      ATTENDANCE_AREA_LOTTERY_STAGE,
      //FIXME replace attendance area stage with overlay stage
      GENERAL_LOTTERY_STAGE
    )
  },
  "1fb317012c8cb0b8c4d3523827e8dad0": {
    "id": "1fb317012c8cb0b8c4d3523827e8dad0",
    "programs": [
      "TAFT HS: TAFT HS - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / None</li><li>IEP and EL Students: N/A / None</li></ul><li><strong>Priority: </strong>Attendance Area,Overlay,General</li><li><strong>Note: </strong>The Overlay includes students who reside within Taft's Preference Zone. </li></ul>",
    "fn": lottery(
      ATTENDANCE_AREA_LOTTERY_STAGE,
      //FIXME add overlay stage here
      GENERAL_LOTTERY_STAGE
    )
  },
  "d19cba80be52ce23738e591f4016ad99": {
    "id": "d19cba80be52ce23738e591f4016ad99",
    "programs": [
      "TAFT HS: TAFT HS - International Baccalaureate (IB)"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Point</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / None</li><li>IEP and EL Students: N/A / None</li></ul><li><strong>Priority: </strong>Continuing,General</li><li><strong>Note: </strong>- 50 bonus points for attendance area - Elementary preference: Taft Academic Center</li></ul>",
    "fn": ibPointSystem
  },
  "9669b710d8e4179fdfe399389b25490b": {
    "id": "9669b710d8e4179fdfe399389b25490b",
    "programs": [
      "TAFT HS: TAFT HS - NJROTC"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / 100</li><li>IEP and EL Students: N/A / 100</li></ul><li><strong>Priority: </strong>Overlay,Attendance Area,General</li><li><strong>Note: </strong>Schedule your interview in your GoCPS account. </li></ul>",
    "fn": conditional({
      filter: ifHasGrades({ hsatCombined: 100 }),
      fn: lottery(
        // Overlay
        ATTENDANCE_AREA_LOTTERY_STAGE,
        GENERAL_LOTTERY_STAGE
      )
    })
  },
  "bc7628628839b26f227b6a7d6a1d47ca": {
    "id": "bc7628628839b26f227b6a7d6a1d47ca",
    "programs": [
      "TILDEN HS: TILDEN HS - General Education",
      "WELLS HS: WELLS HS - General Education",
      "HUBBARD HS: HUBBARD HS - General Education",
      "CHICAGO VOCATIONAL HS: CHICAGO VOCATIONAL HS - General Education",
      "RICHARDS HS: RICHARDS HS - General Education",
      "FENGER HS: FENGER HS - General Education",
      "FOREMAN HS: FOREMAN HS - General Education",
      "GAGE PARK HS: GAGE PARK HS - General Education",
      "HARLAN HS: HARLAN HS - General Education",
      "HIRSCH HS: HIRSCH HS - General Education",
      "KENNEDY HS: KENNEDY HS - General Education",
      "MANLEY HS: MANLEY HS - General Education",
      "MARSHALL HS: MARSHALL HS - General Education",
      "PHILLIPS HS: PHILLIPS HS - General Education",
      "SCHURZ HS: SCHURZ HS - General Education",
      "CORLISS HS: CORLISS HS - Early College STEM",
      "JUAREZ HS: JUAREZ HS - General Education",
      "JULIAN HS: JULIAN HS - General Education",
      "BOWEN HS: BOWEN HS - General Education",
      "SOCIAL JUSTICE HS: SOCIAL JUSTICE HS - General Education",
      "MULTICULTURAL ARTS HS: MULTICULTURAL ARTS HS - Fine & Performing Arts",
      "ORR HS: ORR HS - General Education",
      "WORLD LANGUAGE HS: WORLD LANGUAGE HS - General Education",
      "AUSTIN CCA HS: AUSTIN CCA HS - General Education",
      "ENGLEWOOD STEM HS: ENGLEWOOD STEM HS - STEM"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / None</li><li>IEP and EL Students: N/A / None</li></ul><li><strong>Priority: </strong>Attendance Area,Sibling,Staff Pref,General</li></ul>",
    "fn": lottery(
      ATTENDANCE_AREA_LOTTERY_STAGE,
      SIBLING_LOTTERY_STAGE,
      STAFF_PREFERENCE_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE
    )
  },
  "612990dff3a5e5bc3b2f06bd8939d3e7": {
    "id": "612990dff3a5e5bc3b2f06bd8939d3e7",
    "programs": [
      "VON STEUBEN HS: VON STEUBEN HS - Science"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: 24 / 48</li><li>IEP and EL Students: 24 / 48</li></ul><li><strong>Priority: </strong>Sibling,Staff Pref,Tier</li></ul>",
    "fn": conditional(
      {
        filter: ifHasGrades({ hsatBoth: 24 }),
        fn: lottery(
          SIBLING_LOTTERY_STAGE,
          STAFF_PREFERENCE_LOTTERY_STAGE,
          GENERAL_LOTTERY_STAGE
        )
      }
    )
  },
  "23e9fc7127344e11a32115682aed4ca2": {
    "id": "23e9fc7127344e11a32115682aed4ca2",
    "programs": [
      "VON STEUBEN HS: VON STEUBEN HS - Scholars"
    ],
    "desc": "Letter of Recommendation and Essay",
    "fn": notImplemented
  },
  "882327653234d466cb232327197241dd": {
    "id": "882327653234d466cb232327197241dd",
    "programs": [
      "VON STEUBEN HS: VON STEUBEN HS - Scholars"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Point</li><li><strong>GPA: </strong>3</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: 60 / 120</li><li>IEP and EL Students: 60 / 120</li></ul><li><strong>Priority: </strong>General</li></ul>",
    "fn": conditional({
      filter: both(
        ifHasGrades({ gpa: 3 }),
        ifHasGrades({ hsatCombined: 120 })
      ),
      fn: ctePointSystem
    })
  },
  "0eb9ce33686321bc985536e49174b62c": {
    "id": "0eb9ce33686321bc985536e49174b62c",
    "programs": [
      "WASHINGTON HS: WASHINGTON HS - International Baccalaureate (IB)"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Point</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / None</li><li>IEP and EL Students: N/A / None</li></ul><li><strong>Priority: </strong>Elem Pref,General</li><li><strong>Note: </strong>- 50 bonus points for attendance area - Elementary preference: Marsh ES (IB Partner School)</li></ul>",
    "fn": ibPointSystem
    //FIXME add elementary preference
  },
  "fb38f5f5a3e776d8d1da4b8d04e4bc80": {
    "id": "fb38f5f5a3e776d8d1da4b8d04e4bc80",
    "programs": [
      "WELLS HS: WELLS HS - Fine & Performing Arts",
      "BOGAN HS: BOGAN HS - Entrepreneurship",
      "FARRAGUT HS: FARRAGUT HS - General Education",
      "FENGER HS: FENGER HS - Culinary Arts",
      "KELLY HS: KELLY HS - AVID",
      "SCHURZ HS: SCHURZ HS - AVID",
      "JULIAN HS: JULIAN HS - Fine & Performing Arts",
      "AUSTIN CCA HS: AUSTIN CCA HS - Manufacturing"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / None</li><li>IEP and EL Students: N/A / None</li></ul><li><strong>Priority: </strong>Attendance Area,General</li></ul>",
    "fn": lottery(
      ATTENDANCE_AREA_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE
    )
  },
  "50ae10245b1423ac30460d6c1c001b5b": {
    "id": "50ae10245b1423ac30460d6c1c001b5b",
    "programs": [
      "HUBBARD HS: HUBBARD HS - JROTC"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>2.0</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / None</li><li>IEP and EL Students: N/A / None</li></ul><li><strong>Priority: </strong>Sibling,General</li></ul>",
    "fn": conditional({
      filter: ifHasGrades({ gpa: 2 }),
      fn: lottery(
        SIBLING_LOTTERY_STAGE,
        GENERAL_LOTTERY_STAGE
      )
    })
  },
  "8757674e11116c7b1582c3c810a196db": {
    "id": "8757674e11116c7b1582c3c810a196db",
    "programs": [
      "HUBBARD HS: HUBBARD HS - University Scholars"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Point</li><li><strong>GPA: </strong>2.5</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: 24 / 48</li><li>IEP and EL Students: 24 / 48</li></ul><li><strong>Priority: </strong>General</li></ul>",
    "fn": conditional({
      filter: ifHasGrades({ gpa: 2.5, hsatCombined: 48 }),
      fn: lottery(
        GENERAL_LOTTERY_STAGE
      )
    })
  },
  "704e0bcb9d1e6ada7988a43c40af22ee": {
    "id": "704e0bcb9d1e6ada7988a43c40af22ee",
    "programs": [
      "KENWOOD HS: KENWOOD HS - Honors"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>3.5</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / 140</li><li>IEP and EL Students: N/A / 140</li></ul><li><strong>Priority: </strong>General</li><li><strong>Note: </strong>Elementary preference:  Kenwood Academic Center</li></ul>",
    "fn": conditional(
      {
        filter: either(
          both(ifIEPorEL, ifHasGrades({gpa: 3.5, hsatCombined:140 })),
          ifHasGrades({gpa: 3.5, hsatCombined:140 })
        ),
        fn: lottery(
          {
            filter: ifStudentAttendsOneOf(KENWOOD_ACADEMIC_CENTER_PROGRAM),
            size: LotteryStageSize.SMALL
          },
          GENERAL_LOTTERY_STAGE,
        )
      }
    )
  },
  "abdb12e766398ff8cbe0d6ca0cf63789": {
    "id": "abdb12e766398ff8cbe0d6ca0cf63789",
    "programs": [
      "KENWOOD HS: KENWOOD HS - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>3</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / 110</li><li>IEP and EL Students: N/A / 110</li></ul><li><strong>Priority: </strong>Elem Pref,General</li></ul>",
    "fn": accept(either(ifStudentAttendsOneOf(KENWOOD_ACADEMIC_CENTER_PROGRAM), ifInAttendBound))
  },
  "c732ca9f55119aa13f8e1ed03f41b910": {
    "id": "c732ca9f55119aa13f8e1ed03f41b910",
    "programs": [
      "KENWOOD HS: KENWOOD HS - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / None</li><li>IEP and EL Students: N/A / None</li></ul><li><strong>Priority: </strong>Continuing,Attendance Area,General</li><li><strong>Note: </strong>Elementary preference:  Kenwood Academic Center</li></ul>",
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
  "3b2cea8af86c2a51758f0269a45558e0": {
    "id": "3b2cea8af86c2a51758f0269a45558e0",
    "programs": [
      "CHICAGO AGRICULTURE HS: CHICAGO AGRICULTURE HS - Agricultural Sciences"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: 24 / 48</li><li>IEP and EL Students: 24 / 48</li></ul><li><strong>Priority: </strong>Sibling,Staff Pref,Overlay,Tier</li></ul>",
    "fn": conditional(
      {
        filter: either(
          both(ifIEPorEL, ifHasGrades({hsatCombined:48})),
          ifHasGrades({hsatBoth:24})
        ),
        fn: lottery(
          SIBLING_LOTTERY_STAGE,
          STAFF_PREFERENCE_LOTTERY_STAGE,
          ATTENDANCE_AREA_LOTTERY_STAGE,
          GENERAL_LOTTERY_STAGE,
        )
      }
    )
  },
  "1b8269108017d57c5f8629508fe02341": {
    "id": "1b8269108017d57c5f8629508fe02341",
    "programs": [
      "CHICAGO MILITARY HS: CHICAGO MILITARY HS - Service Leadership Academy (Military)",
      "CARVER MILITARY HS: CARVER MILITARY HS - Service Leadership Academy (Military)",
      "PHOENIX MILITARY HS: PHOENIX MILITARY HS - Service Leadership Academy (Military)",
      "AIR FORCE HS: AIR FORCE HS - Service Leadership Academy (Military)"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Point</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / 48</li><li>IEP and EL Students: N/A / 48</li></ul><li><strong>Priority: </strong>General</li></ul>",
    "fn": notImplemented//TODO Military point system
  },
  "0acf722915b9cb47436da4504bd13c35": {
    "id": "0acf722915b9cb47436da4504bd13c35",
    "programs": [
      "CURIE HS: CURIE HS - AVID"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>2.5</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: 50 / 100</li><li>IEP and EL Students: 50 / 100</li></ul><li><strong>Priority: </strong>Sibling,Attendance Area,General</li></ul>",
    "fn": conditional(
      {
        filter: either(
          both(ifIEPorEL, ifHasGrades({gpa: 2.5,hsatCombined:100})),
          ifHasGrades({gpa: 2.5, hsatBoth:50})
        ),
        fn: lottery(
          SIBLING_LOTTERY_STAGE,
          ATTENDANCE_AREA_LOTTERY_STAGE,
          GENERAL_LOTTERY_STAGE,
        )
      }
    )
  },
  "b2256d259f381959102a98522a25cf38": {
    "id": "b2256d259f381959102a98522a25cf38",
    "programs": [
      "CURIE HS: CURIE HS - Dance",
      "CURIE HS: CURIE HS - Music",
      "CURIE HS: CURIE HS - Visual Arts"
    ],
    "desc": "Acknowledgement of Requirements Form",
    "fn": notImplemented
  },
  "faf2d1f16e4ccc1d8b0179ed75a2a5e2": {
    "id": "faf2d1f16e4ccc1d8b0179ed75a2a5e2",
    "programs": [
      "CURIE HS: CURIE HS - Dance",
      "CURIE HS: CURIE HS - Music",
      "CURIE HS: CURIE HS - Visual Arts"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / None</li><li>IEP and EL Students: N/A / None</li></ul><li><strong>Priority: </strong>General</li><li><strong>Note: </strong>Applicants must also complete a Curie Acknowledgement of Requirements Form at https://docs.google.com/forms/d/e/1FAIpQLSfMcI-MfXRuZZS7FJte8F4vRqhXDHKhKbEWBNjRIfl8mLTAug/viewform</li></ul>",
    "fn": notImplemented
  },
  "f18685634242d940e3fac149765e4eb2": {
    "id": "f18685634242d940e3fac149765e4eb2",
    "programs": [
      "CURIE HS: CURIE HS - International Baccalaureate (IB)"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Point</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / None</li><li>IEP and EL Students: N/A / None</li></ul><li><strong>Priority: </strong>Elem Pref,General</li><li><strong>Note: </strong>- 50 bonus points for attendance area - Elementary preference: Edwards ES (IB Partner School)</li></ul>",
    "fn": ibPointSystem
  },
  "137633374751546e59c8594fe612cfc7": {
    "id": "137633374751546e59c8594fe612cfc7",
    "programs": [
      "CURIE HS: CURIE HS - Creative Writing"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: 30 / 60</li><li>IEP and EL Students: 30 / 60</li></ul><li><strong>Priority: </strong>Sibling,Attendance Area</li></ul>",
    "fn": conditional(
      {
        filter: either(
          both(ifIEPorEL, ifHasGrades({hsatCombined:60})),
          ifHasGrades({hsatBoth:30})
        ),
        fn: lottery(
          SIBLING_LOTTERY_STAGE,
          ATTENDANCE_AREA_LOTTERY_STAGE,
          GENERAL_LOTTERY_STAGE,
        )
      }
    )
  },
  "ce488d45a467bc508dd03ef0eb345392": {
    "id": "ce488d45a467bc508dd03ef0eb345392",
    "programs": [
      "MARINE LEADERSHIP AT AMES HS: MARINE LEADERSHIP AT AMES HS - Service Leadership Academy (Military)"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Point</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / 48</li><li>IEP and EL Students: N/A / 48</li></ul><li><strong>Priority: </strong>Continuing,General</li></ul>",
    "fn": notImplemented//TODO military
  },
  "3e4e9539290db8fc01cef7e7f10f0f74": {
    "id": "3e4e9539290db8fc01cef7e7f10f0f74",
    "programs": [
      "CLARK HS: CLARK HS - Early College STEM"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / 40</li><li>IEP and EL Students: N/A / 40</li></ul><li><strong>Priority: </strong>Sibling,Staff Pref,Tier</li></ul>",
    "fn": conditional(
      {
        filter: ifHasGrades({ hsatCombined: 40 }),
        fn: lottery(
          SIBLING_LOTTERY_STAGE,
          STAFF_PREFERENCE_LOTTERY_STAGE,
          TIER_LOTTERY_STAGE,
          GENERAL_LOTTERY_STAGE,
        )
      }
    )
  },
  "3be4a89909025c58068cdd67fe72fb88": {
    "id": "3be4a89909025c58068cdd67fe72fb88",
    "programs": [
      "DOUGLASS HS: DOUGLASS HS - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / None</li><li>IEP and EL Students: N/A / None</li></ul><li><strong>Priority: </strong>Sibling,Staff Pref,Proximity,General</li></ul>",
    "fn": lottery(
      SIBLING_LOTTERY_STAGE,
      STAFF_PREFERENCE_LOTTERY_STAGE,
      PROXIMITY_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE,
    )
  },
  "18fec20caca42f63c71d12846f73f1f9": {
    "id": "18fec20caca42f63c71d12846f73f1f9",
    "programs": [
      "CHICAGO ACADEMY HS: CHICAGO ACADEMY HS - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / None</li><li>IEP and EL Students: N/A / None</li></ul><li><strong>Priority: </strong>Continuing,Sibling,Staff Pref,Proximity,Elem Pref,General</li><li><strong>Note: </strong>Elementary preference: BRADWELL, CARTER, CASALS, CHALMERS, CHICAGO ACADEMY ES, CURTIS, DENEEN, DEWEY, DULLES, DVORAK, FULLER, GRESHAM, HARVARD, HERZL, HOWE, JOHNSON, MARQUETTE, MCNAIR, MORTON, NATIONAL TEACHERS, OKEEFFE, PICCOLO, SHERMAN, STAGG, TARKINGTON</li></ul>",
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
  "48faa445ffe038ef4a0585cdbe34f247": {
    "id": "48faa445ffe038ef4a0585cdbe34f247",
    "programs": [
      "CHICAGO ACADEMY HS: CHICAGO ACADEMY HS - Scholars"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>3</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: 70 / 140</li><li>IEP and EL Students: 70 / 140</li></ul><li><strong>Priority: </strong>Continuing,Sibling,Proximity,Elem Pref,General</li></ul>",
    "fn": conditional(
      {
        filter: either(
          both(ifIEPorEL, ifHasGrades({hsatCombined:140})),
          ifHasGrades({hsatBoth:70})
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
  "70b6fd72cd0393c21e68e2d8f91a3fdc": {
    "id": "70b6fd72cd0393c21e68e2d8f91a3fdc",
    "programs": [
      "SPRY HS: SPRY HS - Three-Year High School"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / None</li><li>IEP and EL Students: N/A / None</li></ul><li><strong>Priority: </strong>Sibling,Staff Pref,General</li></ul>",
    "fn": lottery(
      SIBLING_LOTTERY_STAGE,
      STAFF_PREFERENCE_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE,
    )
  },
  "5d746b90333ac3300f3ca5d716085c78": {
    "id": "5d746b90333ac3300f3ca5d716085c78",
    "programs": [
      "WILLIAMS HS: WILLIAMS HS - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: 24 / 48</li><li>IEP and EL Students: 24 / 48</li></ul><li><strong>Priority: </strong>Sibling,Staff Pref,Proximity,General</li></ul>",
    "fn": conditional(
      {
        filter: either(
          both(ifIEPorEL, ifHasGrades({hsatCombined:48})),
          ifHasGrades({hsatBoth:24})
        ),
        fn: lottery(
          SIBLING_LOTTERY_STAGE,
          STAFF_PREFERENCE_LOTTERY_STAGE,
          PROXIMITY_LOTTERY_STAGE,
          GENERAL_LOTTERY_STAGE,
        )
      }
    )
  },
  "67bb34f19567468400eae4862eaca869": {
    "id": "67bb34f19567468400eae4862eaca869",
    "programs": [
      "INFINITY HS: INFINITY HS - STEM"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>2</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: 55 / 110</li><li>IEP and EL Students: 55 / 110</li></ul><li><strong>Priority: </strong>Attendance Area,Sibling,Staff Pref,General</li></ul>",
    "fn": conditional(
      {
        filter: either(
          both(ifIEPorEL, ifHasGrades({gpa: 2,hsatCombined:110})),
          ifHasGrades({gpa:2, hsatBoth:55})
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
  "0907b202712af50e1061dd09ecd5d575": {
    "id": "0907b202712af50e1061dd09ecd5d575",
    "programs": [
      "RICKOVER MILITARY HS: RICKOVER MILITARY HS - Service Leadership Academy (Military)"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Point</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / 48</li><li>IEP and EL Students: N/A / 48</li></ul><li><strong>Priority: </strong>Proximity,General</li></ul>",
    "fn": notImplemented//TODO military
  },
  "4b5b2a3c59e0f68b2dd4a63b5493a737": {
    "id": "4b5b2a3c59e0f68b2dd4a63b5493a737",
    "programs": [
      "UPLIFT HS: UPLIFT HS - General Education",
      "COLLINS HS: COLLINS HS - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / None</li><li>IEP and EL Students: N/A / None</li></ul><li><strong>Priority: </strong>Sibling,Staff Pref,Elem Pref,General</li></ul>",
    "fn": lottery(
      SIBLING_LOTTERY_STAGE,
      STAFF_PREFERENCE_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE
    )
  },
  "b7ef935cd12b541f96a9d8127f474aec": {
    "id": "b7ef935cd12b541f96a9d8127f474aec",
    "programs": [
      "COLLINS HS: COLLINS HS - Fine & Performing Arts"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / None</li><li>IEP and EL Students: N/A / None</li></ul><li><strong>Priority: </strong>General,Proximity</li></ul>",
    "fn": lottery(
      PROXIMITY_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE,
    )
  },
  "d6243e336375946096206d64e81275f0": {
    "id": "d6243e336375946096206d64e81275f0",
    "programs": [
      "COLLINS HS: COLLINS HS - Scholars"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>2.8</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: 40 / 80</li><li>IEP and EL Students: 40 / 80</li></ul><li><strong>Priority: </strong>Elem Pref,Sibling,General</li><li><strong>Note: </strong>Elementary preference:  Chalmers, Dvorak, Herzl, Johnson, Morton</li></ul>",
    "fn": conditional(
      {
        filter: both(
          either(
            both(ifIEPorEL, ifHasGrades({hsatCombined:80})),
            ifHasGrades({hsatBoth:40})
          ),
          ifHasGrades({ gpa: 2.8 })
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
  "9c11bcbd5e0baadd33db8fc56eec831c": {
    "id": "9c11bcbd5e0baadd33db8fc56eec831c",
    "programs": [
      "ALCOTT HS: ALCOTT HS - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / None</li><li>IEP and EL Students: N/A / None</li></ul><li><strong>Priority: </strong>Guarantee Elem,Staff Pref,Overlay,General</li><li><strong>Note: </strong>Elementary preference: Alcott ES</li></ul>",
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
  "872096d363873f36592f5144dbd53b24": {
    "id": "872096d363873f36592f5144dbd53b24",
    "programs": [
      "OGDEN HS: OGDEN HS - International Baccalaureate (IB)"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Point</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / None</li><li>IEP and EL Students: N/A / None</li></ul><li><strong>Priority: </strong>General,Elem Pref</li><li><strong>Note: </strong>50 bonus points for attendance area. Elementary preference: Ogden ES</li></ul>",
    "fn": ibPointSystem
  },
  "b29f6476f2e081e4879e95536b670ddf": {
    "id": "b29f6476f2e081e4879e95536b670ddf",
    "programs": [
      "SOLORIO HS: SOLORIO HS - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / None</li><li>IEP and EL Students: N/A / None</li></ul><li><strong>Priority: </strong>Attendance Area,Sibling,Staff Pref</li></ul>",
    "fn": conditional(
      {
        filter:ifInAttendBound,
        fn:accept(everyone)
      },
      {
        filter:everyone,
        fn:lottery(
          ATTENDANCE_AREA_LOTTERY_STAGE,
          SIBLING_LOTTERY_STAGE,
          STAFF_PREFERENCE_LOTTERY_STAGE,
          GENERAL_LOTTERY_STAGE,
        )
      }
    )
    
  },
  "f66fd1ff2f06a221c3d131a93fff9e0e": {
    "id": "f66fd1ff2f06a221c3d131a93fff9e0e",
    "programs": [
      "SOLORIO HS: SOLORIO HS - Double Honors/Scholars"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>3</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: 75 / 150</li><li>IEP and EL Students: 75 / 150</li></ul><li><strong>Priority: </strong>Sibling,Attendance Area,General</li></ul>",
    "fn": conditional(
      {
        filter: either(
          both(ifIEPorEL, ifHasGrades({gpa: 3, hsatCombined:150})),
          ifHasGrades({gpa: 3,hsatBoth:75})
        ),
        fn: lottery(
          SIBLING_LOTTERY_STAGE,
          ATTENDANCE_AREA_LOTTERY_STAGE,
          GENERAL_LOTTERY_STAGE,
        )
      }
    )
  },
  "8e8d4d8dceb710e418df605360fdfb42": {
    "id": "8e8d4d8dceb710e418df605360fdfb42",
    "programs": [
      "GOODE HS: GOODE HS - Early College STEM"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / None</li><li>IEP and EL Students: N/A / None</li></ul><li><strong>Priority: </strong>Staff Pref,Overlay,In-Network,General</li></ul>",
    "fn": notImplemented//TODO information session, in network & overlay
  },
  "3cecb615e5ec320a52d3bea174d6c15f": {
    "id": "3cecb615e5ec320a52d3bea174d6c15f",
    "programs": [
      "CRANE MEDICAL HS: CRANE MEDICAL HS - Health Sciences"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / 35</li><li>IEP and EL Students: N/A / 35</li></ul><li><strong>Priority: </strong>Sibling,Staff Pref,Proximity,Tier</li></ul>",
    "fn": lottery(
      SIBLING_LOTTERY_STAGE,
      STAFF_PREFERENCE_LOTTERY_STAGE,
      PROXIMITY_LOTTERY_STAGE,
      TIER_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE,
    )
  },
  "93edfbe104c04b87852dc3b9991a612a": {
    "id": "93edfbe104c04b87852dc3b9991a612a",
    "programs": [
      "BACK OF THE YARDS HS: BACK OF THE YARDS HS - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / None</li><li>IEP and EL Students: N/A / None</li></ul><li><strong>Priority: </strong>Sibling,Staff Pref,Overlay,General</li></ul>",
    "fn": lottery(
      SIBLING_LOTTERY_STAGE,
      STAFF_PREFERENCE_LOTTERY_STAGE,
      ATTENDANCE_AREA_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE,
    )
  },
  "bed483ca122e848a0a56d3e7985242db": {
    "id": "bed483ca122e848a0a56d3e7985242db",
    "programs": [
      "BACK OF THE YARDS HS: BACK OF THE YARDS HS - International Baccalaureate (IB)"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Point</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: N/A / None</li><li>IEP and EL Students: N/A / None</li></ul><li><strong>Priority: </strong>General</li><li><strong>Note: </strong>50 bonus points for students who reside in the preference area (overlay)</li></ul>",
    "fn": ibPointSystem
  },
  "d116ad480440bd146cdd9a8bc3ac2f34": {
    "id": "d116ad480440bd146cdd9a8bc3ac2f34",
    "programs": [
      "DISNEY II HS: DISNEY II HS - Fine Arts & Technology"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery</li><li><strong>GPA: </strong>N/A</li><li><strong>HS Admissions Exam Minimum for ELA/Math: </strong></li><ul><li>General Education and 504 Plan Students: 24 / 48</li><li>IEP and EL Students: 24 / 48</li></ul><li><strong>Priority: </strong>Continuing,Sibling,Staff Pref,Tier</li></ul>",
    "fn": conditional(
      {
        filter: either(
          both(ifIEPorEL, ifHasGrades({hsatCombined:48})),
          ifHasGrades({hsatBoth:24})
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
  }

}

