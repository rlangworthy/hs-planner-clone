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
  
  CPS_NEIGHBORHOOD_HS_PROGRAMS

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
  //2022-7-11
  "5258d52569c6abc293bd999f7da7c804": {
    "id": "5258d52569c6abc293bd999f7da7c804",
    "programs": [
      "DYETT ARTS HS: DYETT ARTS HS - Band",
      "DYETT ARTS HS: DYETT ARTS HS - Choir",
      "DYETT ARTS HS: DYETT ARTS HS - Dance",
      "DYETT ARTS HS: DYETT ARTS HS - General Education",
      "DYETT ARTS HS: DYETT ARTS HS - Theater",
      "DYETT ARTS HS: DYETT ARTS HS - Visual Arts"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>AA-none\noutside AA- 2.0<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: AA- none, Outside AA- Combo of 48%</li><li>IEP and EL Students: AA- none, Outside AA- Combo of 48%</li></ul></li><li><strong>Priority: </strong>Attendance Area, Sibling</li></ul>",
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
  "2ff9b904bb00d4349a786eef63057f5c": {
    "id": "2ff9b904bb00d4349a786eef63057f5c",
    "programs": [
      "DYETT ARTS HS: DYETT ARTS HS - Digital Media",
      "CHICAGO TECH HS: CHICAGO TECH HS - Computer Programming",
      "CHICAGO VOCATIONAL HS: CHICAGO VOCATIONAL HS - Agricultural Sciences",
      "CHICAGO VOCATIONAL HS: CHICAGO VOCATIONAL HS - Carpentry",
      "CHICAGO VOCATIONAL HS: CHICAGO VOCATIONAL HS - Cosmetology",
      "CHICAGO VOCATIONAL HS: CHICAGO VOCATIONAL HS - Culinary Arts",
      "CHICAGO VOCATIONAL HS: CHICAGO VOCATIONAL HS - Diesel Technology",
      "CHICAGO VOCATIONAL HS: CHICAGO VOCATIONAL HS - Early College STEM",
      "DUNBAR HS: DUNBAR HS - Auto Body Repair",
      "DUNBAR HS: DUNBAR HS - Architecture",
      "DUNBAR HS: DUNBAR HS - Broadcast Technology",
      "DUNBAR HS: DUNBAR HS - Culinary Arts",
      "DUNBAR HS: DUNBAR HS - Chicago Builds",
      "DUNBAR HS: DUNBAR HS - Cosmetology",
      "RICHARDS HS: RICHARDS HS - Accounting",
      "RICHARDS HS: RICHARDS HS - Culinary Arts",
      "NORTH-GRAND HS: NORTH-GRAND HS - Culinary Arts",
      "BOGAN HS: BOGAN HS - Entrepreneurship",
      "FARRAGUT HS: FARRAGUT HS - Automotive Technology",
      "FARRAGUT HS: FARRAGUT HS - Teaching",
      "FENGER HS: FENGER HS - Culinary Arts",
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
      "ROOSEVELT HS: ROOSEVELT HS - Culinary Arts",
      "ROOSEVELT HS: ROOSEVELT HS - Teaching",
      "ROOSEVELT HS: ROOSEVELT HS - Game Programming",
      "SCHURZ HS: SCHURZ HS - Accounting & Entrepreneurship",
      "SCHURZ HS: SCHURZ HS - Automotive Technology",
      "SCHURZ HS: SCHURZ HS - Digital Media",
      "HUBBARD HS: HUBBARD HS - Game Programming",
      "HUBBARD HS: HUBBARD HS - Web Development & Design",
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
      "JULIAN HS: JULIAN HS - Broadcast Technology",
      "JULIAN HS: JULIAN HS - Digital Media",
      "JULIAN HS: JULIAN HS - Entrepreneurship",
      "JULIAN HS: JULIAN HS - Game Programming",
      "JUAREZ HS: JUAREZ HS - Architecture",
      "JUAREZ HS: JUAREZ HS - Culinary Arts",
      "JUAREZ HS: JUAREZ HS - Teaching",
      "JUAREZ HS: JUAREZ HS - Game Programming & Web Design",
      "BOWEN HS: BOWEN HS - Manufacturing",
      "RABY HS: RABY HS - Broadcast Technology",
      "RABY HS: RABY HS - Culinary Arts",
      "ORR HS: ORR HS - Digital Media",
      "COLLINS HS: COLLINS HS - Web Development & Design",
      "AUSTIN CCA HS: AUSTIN CCA HS - Manufacturing"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>None<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: 24% / 24%</li><li>IEP and EL Students: Combo of 48%</li></ul></li><li><strong>Priority: </strong>30% of seats for Attendance Area<li><strong>Note: </strong>Repeating 8th graders and students pushed into 8th grade from 6th grade due to age requirements qualify for selection but will be placed in a lower preference group.</li></ul>",
    "fn": conditional(
      {
        filter: ifIEPorEL,
        fn: conditional (
          {
            filter: ifHasGrades(
              {hsatCombined: 48}
            ),
          fn: lottery(...lowerPriority8thGrade(
            ATTENDANCE_AREA_LOTTERY_STAGE,
            GENERAL_LOTTERY_STAGE,)
          )
          })
      },
      {
        filter: ifHasGrades(
          {
            hsatMath: 24,
            hsatRead: 24,
          }),
        fn: lottery(
          ATTENDANCE_AREA_LOTTERY_STAGE,
          GENERAL_LOTTERY_STAGE,
        )
      }
    )
  },
  "009cc66f727bc61ae504ed4d0907186c": {
    "id": "009cc66f727bc61ae504ed4d0907186c",
    "programs": [
      "ASPIRA - EARLY COLLEGE HS: ASPIRA - EARLY COLLEGE HS - General Education",
      "ASPIRA - BUSINESS & FINANCE HS: ASPIRA - BUSINESS & FINANCE HS - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>None<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: None / None</li><li>IEP and EL Students: None / None</li></ul></li><li><strong>Priority: </strong>Elementary Preference, Sibling<li><strong>Note: </strong>Elem Pref includes: Aspira Haugan Middle School</li></ul>",
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
  "83cb9088eedf39ff8ccb0954b72ba2da": {
    "id": "83cb9088eedf39ff8ccb0954b72ba2da",
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
  "1fdd684ddcd83c661664b75439c7ba6a": {
    "id": "1fdd684ddcd83c661664b75439c7ba6a",
    "programs": [
      "CHIARTS HS: CHIARTS HS - Music - Instrumental - Brass & Woodwinds",
      "CHIARTS HS: CHIARTS HS - Creative Writing",
      "CHIARTS HS: CHIARTS HS - Dance",
      "CHIARTS HS: CHIARTS HS - Music - Instrumental - Guitar",
      "CHIARTS HS: CHIARTS HS - Musical Theatre",
      "CHIARTS HS: CHIARTS HS - Music - Instrumental - Percussion",
      "CHIARTS HS: CHIARTS HS - Music - Instrumental - Piano",
      "CHIARTS HS: CHIARTS HS - Music - Instrumental - Strings",
      "CHIARTS HS: CHIARTS HS - Theatre",
      "CHIARTS HS: CHIARTS HS - Visual Arts",
      "CHIARTS HS: CHIARTS HS - Music - Vocal"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Point<li><strong>GPA: </strong>None<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: 24% / 24%</li><li>IEP and EL Students: Combo of 48%</li></ul></li><li><strong>Priority: </strong>none</li></ul>",
    "fn": conditional(
      {
        filter: ifIEPorEL,
        fn: accept(ifHasGrades(
          {
            hsatCombined: 48,
          }
        ))
      },
      {
        filter: everyone,
        fn: accept(ifHasGrades(
          {
            hsatBoth: 24,
          }
        ))
      }
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
  "842cec8cb781567872de54cfb3c0f02e": {
    "id": "842cec8cb781567872de54cfb3c0f02e",
    "programs": [
      "CICS - ELLISON HS: CICS - ELLISON HS - General Education",
      "CICS - NORTHTOWN HS: CICS - NORTHTOWN HS - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>None<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: None / None</li><li>IEP and EL Students: None / None</li></ul></li><li><strong>Priority: </strong>Elementary Preference, Sibling, Overlay<li><strong>Note: </strong>Elem Pref includes: students attending Avalon, Basil, Bucktown, Irving Park, Longwood, Prairie, Washington Park, West Belden, or Wrightwood</li></ul>",
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
  "0a4b66f1778639bfb6d231054f774de1": {
    "id": "0a4b66f1778639bfb6d231054f774de1",
    "programs": [
      "CICS - LONGWOOD: CICS - LONGWOOD - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>None<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: None / None</li><li>IEP and EL Students: None / None</li></ul></li><li><strong>Priority: </strong>Continuing Enrollment, Elementary Preference, Sibling, Overlay<li><strong>Note: </strong>Elem Pref includes: students attending Avalon, Basil, Bucktown, Irving Park, Longwood, Prairie, Washington Park, West Belden, or Wrightwood</li></ul>",
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
  "fd886585105179ce54025e315a13e055": {
    "id": "fd886585105179ce54025e315a13e055",
    "programs": [
      "CHICAGO MATH & SCIENCE HS: CHICAGO MATH & SCIENCE HS - General Education",
      "PERSPECTIVES - JOSLIN HS: PERSPECTIVES - JOSLIN HS - General Education",
      "PERSPECTIVES - MATH & SCI HS: PERSPECTIVES - MATH & SCI HS - STEM",
      "CHICAGO COLLEGIATE: CHICAGO COLLEGIATE - General Education",
      "INTRINSIC HS: INTRINSIC HS - General Education",
      "ART IN MOTION: ART in MOTION HS - Fine & Performing Arts"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>None<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: None / None</li><li>IEP and EL Students: None / None</li></ul></li><li><strong>Priority: </strong>Continuing, Sibling</li></ul>",
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
  "2ad24faee045dc0d2e7053754426bc0c": {
    "id": "2ad24faee045dc0d2e7053754426bc0c",
    "programs": [
      "NOBLE - NOBLE HS: NOBLE - NOBLE HS - General Education",
      "NOBLE - GOLDER HS: NOBLE - GOLDER HS - General Education",
      "NOBLE - PRITZKER HS: NOBLE - PRITZKER HS - General Education",
      "NOBLE - RAUNER HS: NOBLE - RAUNER HS - General Education",
      "NOBLE - ROWE CLARK HS: NOBLE - ROWE CLARK HS - STEM",
      "NLCP - CHRISTIANA HS: NORTH LAWNDALE - CHRISTIANA HS - General Education",
      "NLCP - COLLINS HS: NORTH LAWNDALE - COLLINS HS - General Education",
      "PERSPECTIVES - TECH HS: PERSPECTIVES - TECH HS - STEM",
      "CHICAGO TECH HS: CHICAGO TECH HS - STEM",
      "EPIC HS: EPIC HS - General Education",
      "NOBLE - MUCHIN HS: NOBLE - MUCHIN HS - General Education",
      "INSTITUTO - HEALTH: INSTITUTO - HEALTH - General Education",
      "NOBLE - JOHNSON HS: NOBLE - JOHNSON HS - General Education",
      "NOBLE - HANSBERRY HS: NOBLE - HANSBERRY HS - International Baccalaureate (IB)",
      "NOBLE - DRW HS: NOBLE - DRW HS - General Education",
      "LEGAL PREP HS: LEGAL PREP HS - Law & Public Safety",
      "NOBLE - BUTLER HS: NOBLE - BUTLER HS - General Education",
      "NOBLE - BAKER HS: NOBLE - BAKER HS - General Education",
      "NOBLE - ACADEMY HS: NOBLE - ACADEMY HS - General Education",
      "NOBLE - MANSUETO HS: NOBLE - MANSUETO HS - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>None<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: None / None</li><li>IEP and EL Students: None / None</li></ul></li><li><strong>Priority: </strong>Sibling</li></ul>",
    "fn": 
    lottery(
      SIBLING_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE,
    )
  },
  "7063bb338ff6c6488e06fed8b0e17141": {
    "id": "7063bb338ff6c6488e06fed8b0e17141",
    "programs": [
      "NOBLE - COMER: NOBLE - COMER - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>None<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: None / None</li><li>IEP and EL Students: None / None</li></ul></li><li><strong>Priority: </strong>Continuing, Sibling, Overlay</li></ul>",
    "fn": lottery(
      //FIXME add Noble to continuing ES
      SIBLING_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE,
    )
  },
  "7b5acb22adbc240efb07eadbdd67048e": {
    "id": "7b5acb22adbc240efb07eadbdd67048e",
    "programs": [
      "NOBLE - UIC HS: NOBLE - UIC HS - General Education",
      "NOBLE - BULLS HS: NOBLE - BULLS HS - General Education",
      "NOBLE - ITW SPEER HS: NOBLE - ITW SPEER HS - STEM"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>None<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: None / None</li><li>IEP and EL Students: None / None</li></ul></li><li><strong>Priority: </strong>Sibling, Overlay</li></ul>",
    "fn": lottery(
      SIBLING_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE,
    )
  },
  "ff092d5f0c922f128ab4211a1f27b729": {
    "id": "ff092d5f0c922f128ab4211a1f27b729",
    "programs": [
      "PERSPECTIVES - LEADERSHIP HS: PERSPECTIVES - LEADERSHIP HS - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>None<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: None / None</li><li>IEP and EL Students: None / None</li></ul></li><li><strong>Priority: </strong>Continuing, Sibling, Proximity</li></ul>",
    "fn": lottery(
      //FIXME add Noble to continuing ES
      SIBLING_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE,
    )
  },
  "9375a2d9b7f956ce4e61b847e944b08e": {
    "id": "9375a2d9b7f956ce4e61b847e944b08e",
    "programs": [
      "U OF C - WOODLAWN HS: U OF C - WOODLAWN HS - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>None<li><strong>HS Admissions Exam Minimum for Reading/Math: </strong><ul><li>General Education and 504 Plan Students: None / None</li><li>IEP and EL Students: None / None</li></ul></li><li><strong>Priority: </strong>Continuing, Sibling, Overlay, Guarantee Elem<li><strong>Note: </strong>Elem Pref includes: U of C Woodson</li></ul>",
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
  "fda93e06a20acbd5e029200f35c08222": {
    "id": "fda93e06a20acbd5e029200f35c08222",
    "programs": [
      "ACERO - GARCIA HS: ACERO - GARCIA HS - STEM",
      "ACERO - SOTO HS: ACERO - SOTO HS - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>None<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: None / None</li><li>IEP and EL Students: None / None</li></ul></li><li><strong>Priority: </strong>Sibling, Elementary Preference<li><strong>Note: </strong>Elementary Pref includes: Acero Elementary Charter School</li></ul>",
    "fn": lottery(
      {
        filter: ifStudentAttendsOneOf(...ACERO_ES_PROGRAMS),
        size: LotteryStageSize.LARGE
      },
      SIBLING_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE,
    )
  },
  "bce0d761c7de1a860364917664debc61": {
    "id": "bce0d761c7de1a860364917664debc61",
    "programs": [
      "URBAN PREP - ENGLEWOOD HS: Urban Prep Academy for Young Men - Englewood - General Education",
      "URBAN PREP - BRONZEVILLE HS: Urban Prep Academy for Young Men - Bronzeville - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>None<li><strong>HS Admissions Exam Minimum for Reading/Math: </strong><ul><li>General Education and 504 Plan Students: None / None</li><li>IEP and EL Students: None / None</li></ul></li><li><strong>Priority: </strong>Sibling</li></ul>",
    "fn": lottery(
      SIBLING_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE,
    )
  },
  "25c7c76a73b736f3a6d7af9ad535139a": {
    "id": "25c7c76a73b736f3a6d7af9ad535139a",
    "programs": [
      "INSTITUTO - HEALTH: INSTITUTO - HEALTH - Allied Health",
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
      "ROOSEVELT HS: ROOSEVELT HS - Computer Networking",
      "ROOSEVELT HS: ROOSEVELT HS - Medical & Health Careers",
      "SCHURZ HS: SCHURZ HS - Allied Health",
      "SCHURZ HS: SCHURZ HS - Pre-Engineering",
      "CURIE HS: CURIE HS - Pre-Engineering",
      "CURIE HS: CURIE HS - Visual Arts",
      "CLEMENTE HS: CLEMENTE HS - Allied Health",
      "JULIAN HS: JULIAN HS - Allied Health",
      "JUAREZ HS: JUAREZ HS - Medical & Health Careers",
      "BOWEN HS: BOWEN HS - Pre-Engineering",
      "RABY HS: RABY HS - Pre-Law",
      "SOCIAL JUSTICE HS: LVLHS SOCIAL JUSTICE HS - Allied Health",
      "MULTICULTURAL ARTS HIGH SCHOOL: LVLHS MULTICULTURAL HS - Allied Health",
      "WORLD LANGUAGE HS: LVLHS WORLD LANGUAGE HS - Allied Health",
      "ALCOTT HS: ALCOTT HS - Pre-Engineering"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Point<li><strong>GPA: </strong>None<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: None / None</li><li>IEP and EL Students: None / None</li></ul></li><li><strong>Priority: </strong>None</li></ul>",
    "fn": ctePointSystem
  },
  "093bdb9e6477bfb91a17a801e48e406a": {
    "id": "093bdb9e6477bfb91a17a801e48e406a",
    "programs": [
      "CHICAGO VOCATIONAL HS: CHICAGO VOCATIONAL HS - Deaf/Hard of Hearing",
      "CHICAGO VOCATIONAL HS: CHICAGO VOCATIONAL HS - Significantly Mod Curr/Intensive",
      "CHICAGO VOCATIONAL HS: CHICAGO VOCATIONAL HS - Significantly Mod Curr/Moderate",
      "DUNBAR HS: DUNBAR HS - Significantly Mod Curr/Moderate",
      "JONES HS: JONES HS - Significantly Mod Curr/Intensive",
      "JONES HS: JONES HS - Significantly Mod Curr/Moderate",
      "PROSSER HS: PROSSER HS - Deaf/Hard of Hearing",
      "PROSSER HS: PROSSER HS - Significantly Mod Curr/Moderate",
      "PAYTON HS: PAYTON HS - Significantly Mod Curr/Moderate",
      "PAYTON HS: PAYTON HS - Visual Impairment",
      "NORTH-GRAND HS: NORTH-GRAND HS - Significantly Mod Curr/Intensive",
      "NORTH-GRAND HS: NORTH-GRAND HS - Significantly Mod Curr/Moderate",
      "SIMEON HS: SIMEON HS - Significantly Mod Curr/Intensive",
      "SIMEON HS: SIMEON HS - Significantly Mod Curr/Moderate",
      "WESTINGHOUSE HS: WESTINGHOUSE HS - Significantly Mod Curr/Intensive",
      "WESTINGHOUSE HS: WESTINGHOUSE HS - Significantly Mod Curr/Moderate",
      "HANCOCK HS: HANCOCK HS - Significantly Mod Curr/Moderate",
      "AMUNDSEN HS: AMUNDSEN HS - Significantly Mod Curr/Moderate",
      "BOGAN HS: BOGAN HS - Significantly Mod Curr/Moderate",
      "FARRAGUT HS: FARRAGUT HS - Significantly Mod Curr/Moderate",
      "FOREMAN HS: FOREMAN HS - Significantly Mod Curr/Moderate",
      "HYDE PARK HS: HYDE PARK HS - Significantly Mod Curr/Moderate",
      "KELLY HS: KELLY HS - Significantly Mod Curr/Moderate",
      "KELLY HS: KELLY HS - MultiSensory",
      "KENNEDY HS: KENNEDY HS - Significantly Mod Curr/Moderate",
      "BROOKS HS: BROOKS HS - Significantly Mod Curr/Intensive",
      "BROOKS HS: BROOKS HS - Significantly Mod Curr/Moderate",
      "LINCOLN PARK HS: LINCOLN PARK HS - Significantly Mod Curr/Moderate",
      "LAKE VIEW HS: LAKE VIEW HS - MultiSensory",
      "LANE TECH HS: LANE TECH HS - Significantly Mod Curr/Intensive",
      "LANE TECH HS: LANE TECH HS - Significantly Mod Curr/Moderate",
      "MORGAN PARK HS: MORGAN PARK HS - Significantly Mod Curr/Moderate",
      "ROOSEVELT HS: ROOSEVELT HS - Significantly Mod Curr/Moderate",
      "SCHURZ HS: SCHURZ HS - Significantly Mod Curr/Moderate",
      "SULLIVAN HS: SULLIVAN HS - Significantly Mod Curr/Moderate",
      "TAFT HS: TAFT HS - Significantly Mod Curr/Intensive",
      "TILDEN HS: TILDEN HS - Significantly Mod Curr/Moderate",
      "VON STEUBEN HS: VON STEUBEN HS - Significantly Mod Curr/Moderate",
      "WASHINGTON HS: WASHINGTON HS - Significantly Mod Curr/Moderate",
      "HUBBARD HS: HUBBARD HS - MultiSensory",
      "NORTHSIDE LEARNING HS: NORTHSIDE LEARNING HS - Significantly Mod Curr/Moderate",
      "KENWOOD HS: KENWOOD HS - Significantly Mod Curr/Moderate",
      "NORTHSIDE PREP HS: NORTHSIDE PREP HS - Significantly Mod Curr/Intensive",
      "KING HS: KING HS - Significantly Mod Curr/Intensive",
      "KING HS: KING HS - Significantly Mod Curr/Moderate",
      "CHICAGO AGRICULTURE HS: CHICAGO AGRICULTURE HS - Significantly Mod Curr/Intensive",
      "CHICAGO AGRICULTURE HS: CHICAGO AGRICULTURE HS - Significantly Mod Curr/Moderate",
      "YOUNG HS: YOUNG HS - Deaf/Hard of Hearing",
      "YOUNG HS: YOUNG HS - Significantly Mod Curr/Intensive",
      "YOUNG HS: YOUNG HS - Significantly Mod Curr/Moderate",
      "CURIE HS: CURIE HS - Deaf/Hard of Hearing",
      "CURIE HS: CURIE HS - Visual Impairment",
      "JULIAN HS: JULIAN HS - Significantly Mod Curr/Moderate",
      "JULIAN HS: JULIAN HS - MultiSensory",
      "BOWEN HS: BOWEN HS - Significantly Mod Curr/Moderate",
      "RABY HS: RABY HS - Significantly Mod Curr/Moderate",
      "BRONZEVILLE HS: BRONZEVILLE HS - Significantly Mod Curr/Moderate",
      "LINDBLOM HS: LINDBLOM HS - Significantly Mod Curr/Intensive",
      "LINDBLOM HS: LINDBLOM HS - Significantly Mod Curr/Moderate",
      "UPLIFT HS: UPLIFT HS - Significantly Mod Curr/Intensive",
      "UPLIFT HS: UPLIFT HS - Significantly Mod Curr/Moderate",
      "OGDEN HS: OGDEN HS - Deaf/Hard of Hearing",
      "SOLORIO HS: SOLORIO HS - Significantly Mod Curr/Intensive",
      "SOUTH SHORE INTL HS: SOUTH SHORE INTL HS - Significantly Mod Curr/Moderate",
      "GOODE HS: GOODE HS - Significantly Mod Curr/Intensive",
      "ENGLEWOOD STEM HS: ENGLEWOOD STEM HS - Significantly Mod Curr/Moderate"
    ],
    "desc": "Cluster and Review",
    "fn": notImplemented
  },
  "5b7f464daaf2e2e517b72c77d39ede72": {
    "id": "5b7f464daaf2e2e517b72c77d39ede72",
    "programs": [
      "CHICAGO VOCATIONAL HS: CHICAGO VOCATIONAL HS - Deaf/Hard of Hearing",
      "CHICAGO VOCATIONAL HS: CHICAGO VOCATIONAL HS - Significantly Mod Curr/Intensive",
      "CHICAGO VOCATIONAL HS: CHICAGO VOCATIONAL HS - Significantly Mod Curr/Moderate",
      "DUNBAR HS: DUNBAR HS - Significantly Mod Curr/Moderate",
      "JONES HS: JONES HS - Significantly Mod Curr/Intensive",
      "JONES HS: JONES HS - Significantly Mod Curr/Moderate",
      "PROSSER HS: PROSSER HS - Deaf/Hard of Hearing",
      "PROSSER HS: PROSSER HS - Significantly Mod Curr/Moderate",
      "PAYTON HS: PAYTON HS - Significantly Mod Curr/Moderate",
      "PAYTON HS: PAYTON HS - Visual Impairment",
      "NORTH-GRAND HS: NORTH-GRAND HS - Significantly Mod Curr/Intensive",
      "NORTH-GRAND HS: NORTH-GRAND HS - Significantly Mod Curr/Moderate",
      "HANCOCK HS: HANCOCK HS - Significantly Mod Curr/Moderate",
      "AMUNDSEN HS: AMUNDSEN HS - Significantly Mod Curr/Moderate",
      "BOGAN HS: BOGAN HS - Significantly Mod Curr/Moderate",
      "FARRAGUT HS: FARRAGUT HS - Significantly Mod Curr/Moderate",
      "FOREMAN HS: FOREMAN HS - Significantly Mod Curr/Moderate",
      "HYDE PARK HS: HYDE PARK HS - Significantly Mod Curr/Moderate",
      "KELLY HS: KELLY HS - Significantly Mod Curr/Moderate",
      "KELLY HS: KELLY HS - MultiSensory",
      "KENNEDY HS: KENNEDY HS - Significantly Mod Curr/Moderate",
      "BROOKS HS: BROOKS HS - Significantly Mod Curr/Intensive",
      "BROOKS HS: BROOKS HS - Significantly Mod Curr/Moderate",
      "LINCOLN PARK HS: LINCOLN PARK HS - Significantly Mod Curr/Moderate",
      "LAKE VIEW HS: LAKE VIEW HS - MultiSensory",
      "LANE TECH HS: LANE TECH HS - Significantly Mod Curr/Intensive",
      "LANE TECH HS: LANE TECH HS - Significantly Mod Curr/Moderate",
      "MORGAN PARK HS: MORGAN PARK HS - Significantly Mod Curr/Moderate",
      "ROOSEVELT HS: ROOSEVELT HS - Significantly Mod Curr/Moderate",
      "SCHURZ HS: SCHURZ HS - Significantly Mod Curr/Moderate",
      "HUBBARD HS: HUBBARD HS - MultiSensory",
      "NORTHSIDE LEARNING HS: NORTHSIDE LEARNING HS - Significantly Mod Curr/Moderate",
      "KENWOOD HS: KENWOOD HS - Significantly Mod Curr/Moderate",
      "NORTHSIDE PREP HS: NORTHSIDE PREP HS - Significantly Mod Curr/Intensive",
      "KING HS: KING HS - Significantly Mod Curr/Intensive",
      "KING HS: KING HS - Significantly Mod Curr/Moderate",
      "CHICAGO AGRICULTURE HS: CHICAGO AGRICULTURE HS - Significantly Mod Curr/Intensive",
      "CHICAGO AGRICULTURE HS: CHICAGO AGRICULTURE HS - Significantly Mod Curr/Moderate",
      "CURIE HS: CURIE HS - Deaf/Hard of Hearing",
      "CURIE HS: CURIE HS - Visual Impairment",
      "CLEMENTE HS: CLEMENTE HS - Significantly Mod Curr/Moderate",
      "CORLISS HS: CORLISS HS - Significantly Mod Curr/Moderate",
      "JULIAN HS: JULIAN HS - Significantly Mod Curr/Moderate",
      "JULIAN HS: JULIAN HS - MultiSensory",
      "CLARK HS: CLARK HS - Significantly Mod Curr/Moderate",
      "BOWEN HS: BOWEN HS - Significantly Mod Curr/Moderate",
      "RABY HS: RABY HS - Significantly Mod Curr/Moderate",
      "BRONZEVILLE HS: BRONZEVILLE HS - General Education",
      "BRONZEVILLE HS: BRONZEVILLE HS - Significantly Mod Curr/Moderate",
      "LINDBLOM HS: LINDBLOM HS - Significantly Mod Curr/Intensive",
      "LINDBLOM HS: LINDBLOM HS - Significantly Mod Curr/Moderate",
      "OGDEN HS: OGDEN HS - Deaf/Hard of Hearing",
      "GOODE HS: GOODE HS - Significantly Mod Curr/Intensive",
      "ENGLEWOOD STEM HS: ENGLEWOOD STEM HS - Significantly Mod Curr/Moderate"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>None<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: None / None</li><li>IEP and EL Students: None / None</li></ul></li><li><strong>Priority: </strong>None</li></ul>",
    "fn": lottery(
      GENERAL_LOTTERY_STAGE,
    )
  },
  "b567d9886ab9527c1ae39c4f26f61358": {
    "id": "b567d9886ab9527c1ae39c4f26f61358",
    "programs": [
      "CHICAGO VOCATIONAL HS: CHICAGO VOCATIONAL HS - General Education",
      "RICHARDS HS: RICHARDS HS - General Education",
      "FOREMAN HS: FOREMAN HS - General Education",
      "GAGE PARK HS: GAGE PARK HS - General Education",
      "HARLAN HS: HARLAN HS - General Education",
      "HIRSCH HS: HIRSCH HS - General Education",
      "KELVYN PARK HS: KELVYN PARK HS - Open Enrollment",
      "KENNEDY HS: KENNEDY HS - General Education",
      "MANLEY HS: MANLEY HS - General Education",
      "MARSHALL HS: MARSHALL HS - General Education",
      "PHILLIPS HS: PHILLIPS HS - General Education",
      "ROOSEVELT HS: ROOSEVELT HS - General Education",
      "SCHURZ HS: SCHURZ HS - General Education",
      "HUBBARD HS: HUBBARD HS - General Education",
      "CORLISS HS: CORLISS HS - Early College STEM",
      "JULIAN HS: JULIAN HS - General Education",
      "JUAREZ HS: JUAREZ HS - General Education",
      "SOCIAL JUSTICE HS: LVLHS SOCIAL JUSTICE HS - General Education",
      "MULTICULTURAL ARTS HIGH SCHOOL: LVLHS MULTICULTURAL HS - Fine & Performing Arts",
      "ORR HS: ORR HS - General Education",
      "WORLD LANGUAGE HS: LVLHS WORLD LANGUAGE HS - General Education",
      "AUSTIN CCA HS: AUSTIN CCA HS - General Education",
      "ENGLEWOOD STEM HS: ENGLEWOOD STEM HS - STEM"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>None<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: None / None</li><li>IEP and EL Students: None / None</li></ul></li><li><strong>Priority: </strong>Attendance Area, Sibling, Staff Pref</li></ul>",
    "fn": conditional(
      {
        filter: ifIsNeighborhoodSchool,
        fn:accept(everyone)
      },
      {
        filter: everyone,
        fn:lottery(
        GENERAL_LOTTERY_STAGE,
        )
      }
    )
  },
  "4ad2e26e01d6e89ff6d9a86863ea033a": {
    "id": "4ad2e26e01d6e89ff6d9a86863ea033a",
    "programs": [
      "JONES HS: JONES HS - Pre-Engineering",
      "JONES HS: JONES HS - Pre-Law",
      "HANCOCK HS: HANCOCK HS - Pre-Engineering",
      "HANCOCK HS: HANCOCK HS - Pre-Law"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Point<li><strong>GPA: </strong>None<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: 24% / 24%</li><li>IEP and EL Students: Combo of 48%</li></ul></li><li><strong>Priority: </strong>Overlay</li></ul>",
    "fn": conditional(
      {
        filter: both(ifIEPorEL, ifHasGrades({hsatCombined: 48})),
        fn: ctePointSystem
      },
      {
        filter: ifHasGrades({hsatBoth: 24}),
        fn:ctePointSystem
      },
    )
  },
  "21771062a0bd30115d52435e45ece600": {
    "id": "21771062a0bd30115d52435e45ece600",
    "programs": [
      "JONES HS: JONES HS - Selective Enrollment High School",
      "PAYTON HS: PAYTON HS - Selective Enrollment High School",
      "HANCOCK HS: HANCOCK HS - Selective Enrollment High School",
      "LANE TECH HS: LANE TECH HS - Selective Enrollment High School",
      "NORTHSIDE PREP HS: NORTHSIDE PREP HS - Selective Enrollment High School",
      "KING HS: KING HS - Selective Enrollment High School",
      "LINDBLOM HS: LINDBLOM HS - Selective Enrollment High School",
      "SOUTH SHORE INTL HS: SOUTH SHORE INTL HS - Selective Enrollment High School"
    ],
    "desc": "CPS HS Admissions Exam",
    "fn": accept(everyone)
  },
  "6fb6e820fe6c3ba6132cf3b49fff0a02": {
    "id": "6fb6e820fe6c3ba6132cf3b49fff0a02",
    "programs": [
      "JONES HS: JONES HS - Selective Enrollment High School",
      "PAYTON HS: PAYTON HS - Selective Enrollment High School",
      "HANCOCK HS: HANCOCK HS - Selective Enrollment High School",
      "BROOKS HS: BROOKS HS - Selective Enrollment High School",
      "NORTHSIDE PREP HS: NORTHSIDE PREP HS - Selective Enrollment High School",
      "KING HS: KING HS - Selective Enrollment High School"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Point<li><strong>GPA: </strong>None<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: 24% / 24%</li><li>IEP and EL Students: Combo of 48%</li></ul></li><li><strong>Priority: </strong>Tier</li></ul>",
    "fn": sePointSystem
  },
  "ea789842c6038bc26456a757fb891a0d": {
    "id": "ea789842c6038bc26456a757fb891a0d",
    "programs": [
      "PROSSER HS: PROSSER HS - Career Academy",
      "MARINE LEADERSHIP AT AMES HS: MARINE LEADERSHIP AT AMES HS - Military",
      "MARINE LEADERSHIP AT AMES HS: MARINE LEADERSHIP AT AMES HS - Service Leadership Academy",
      "PHOENIX MILITARY HS: PHOENIX STEM MILITARY HS - Service Leadership Academy",
      "RICKOVER MILITARY HS: RICKOVER MILITARY HS - Service Leadership Academy",
      "GOODE HS: GOODE HS - Early College STEM"
    ],
    "desc": "Information Session",
    "fn": conditional({
      filter:ifHasGrades({
        gpa:2.5
      }),
      fn: lottery(
        SIBLING_LOTTERY_STAGE,
        STAFF_PREFERENCE_LOTTERY_STAGE,
        PROXIMITY_LOTTERY_STAGE,
        GENERAL_LOTTERY_STAGE,
      )
    })
  },
  "b963431c7904d6ff0f3f547fef44d755": {
    "id": "b963431c7904d6ff0f3f547fef44d755",
    "programs": [
      "PROSSER HS: PROSSER HS - Career Academy"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>2.5<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: None / None</li><li>IEP and EL Students: None / None</li></ul></li><li><strong>Priority: </strong>Sibling, Staff Pref, Proximity</li></ul>",
    "fn": conditional({
      filter:ifHasGrades({
        gpa:2.5
      }),
      fn: lottery(
        SIBLING_LOTTERY_STAGE,
        STAFF_PREFERENCE_LOTTERY_STAGE,
        PROXIMITY_LOTTERY_STAGE,
        GENERAL_LOTTERY_STAGE,
      )
    })
  },
  "b791deb2be2a3a1dbd864866f8deaeaa": {
    "id": "b791deb2be2a3a1dbd864866f8deaeaa",
    "programs": [
      "PROSSER HS: PROSSER HS - International Baccalaureate (IB)",
      "KELLY HS: KELLY HS - International Baccalaureate (IB)",
      "KENNEDY HS: KENNEDY HS - International Baccalaureate (IB)",
      "LINCOLN PARK HS: LINCOLN PARK HS - International Baccalaureate (IB) - MYP (Diploma Program)",
      "MORGAN PARK HS: MORGAN PARK HS - International Baccalaureate (IB)",
      "SCHURZ HS: SCHURZ HS - International Baccalaureate (IB)",
      "SENN HS: SENN HS - International Baccalaureate (IB)",
      "HUBBARD HS: HUBBARD HS - International Baccalaureate (IB)",
      "JUAREZ HS: JUAREZ HS - International Baccalaureate (IB)"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Point<li><strong>GPA: </strong>2.5<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: 24% / 24%</li><li>IEP and EL Students: Combo of 48%</li></ul></li><li><strong>Priority: </strong>Attendance Area- Additional points</li></ul>",
    "fn": ibPointSystem
  },
  "05f3e9358cb8a5fb882f6bc592e36b38": {
    "id": "05f3e9358cb8a5fb882f6bc592e36b38",
    "programs": [
      "NORTH-GRAND HS: NORTH-GRAND HS - General Education",
      "CLEMENTE HS: CLEMENTE HS - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>AA-none\noutside AA- 2.5<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: None / None</li><li>IEP and EL Students: None / None</li></ul></li><li><strong>Priority: </strong>Attendance Area, Sibling, Staff Pref</li></ul>",
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
  "cb20d1782d895ed3da2b5cad6179462d": {
    "id": "cb20d1782d895ed3da2b5cad6179462d",
    "programs": [
      "SIMEON HS: SIMEON HS - Career Academy",
      "TAFT HS: TAFT HS - NJROTC"
    ],
    "desc": "Interview",
    "fn": notImplemented
  },
  "bfdde819a576b21f3c2f5eaf9148c575": {
    "id": "bfdde819a576b21f3c2f5eaf9148c575",
    "programs": [
      "SIMEON HS: SIMEON HS - Career Academy"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Point<li><strong>GPA: </strong>2<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: Combo of 30%</li><li>IEP and EL Students: Combo of 30%</li></ul></li><li><strong>Priority: </strong>None</li></ul>",
    "fn": accept(
      ifHasGrades({
        gpa:2,
        hsatCombined:30
      })
    )
  },
  "25848f643f140127debfc91479c8a495": {
    "id": "25848f643f140127debfc91479c8a495",
    "programs": [
      "SIMEON HS: SIMEON HS - Significantly Mod Curr/Intensive",
      "SIMEON HS: SIMEON HS - Significantly Mod Curr/Moderate",
      "WESTINGHOUSE HS: WESTINGHOUSE HS - Significantly Mod Curr/Intensive",
      "WESTINGHOUSE HS: WESTINGHOUSE HS - Significantly Mod Curr/Moderate",
      "SULLIVAN HS: SULLIVAN HS - Significantly Mod Curr/Moderate",
      "TAFT HS: TAFT HS - Significantly Mod Curr/Intensive",
      "TILDEN HS: TILDEN HS - Significantly Mod Curr/Moderate",
      "VON STEUBEN HS: VON STEUBEN HS - Significantly Mod Curr/Moderate",
      "WASHINGTON HS: WASHINGTON HS - General Education",
      "WASHINGTON HS: WASHINGTON HS - Significantly Mod Curr/Moderate",
      "WELLS HS: WELLS HS - Pre-Law",
      "YOUNG HS: YOUNG HS - Deaf/Hard of Hearing",
      "YOUNG HS: YOUNG HS - Significantly Mod Curr/Intensive",
      "YOUNG HS: YOUNG HS - Significantly Mod Curr/Moderate",
      "VAUGHN HS: VAUGHN HS - Significantly Mod Curr/Moderate",
      "UPLIFT HS: UPLIFT HS - Significantly Mod Curr/Intensive",
      "UPLIFT HS: UPLIFT HS - Significantly Mod Curr/Moderate",
      "SOLORIO HS: SOLORIO HS - Significantly Mod Curr/Intensive",
      "SOUTH SHORE INTL HS: SOUTH SHORE INTL HS - Significantly Mod Curr/Moderate"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>None<li><strong>HS Admissions Exam Minimum for Reading/Math: </strong><ul><li>General Education and 504 Plan Students: None / None</li><li>IEP and EL Students: None / None</li></ul></li><li><strong>Priority: </strong>None</li></ul>",
    "fn": accept(ifIsNeighborhoodSchool)
  },
  "0774570f1c0692bbbc5154a50761073d": {
    "id": "0774570f1c0692bbbc5154a50761073d",
    "programs": [
      "WESTINGHOUSE HS: WESTINGHOUSE HS - Career Academy"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>3<li><strong>HS Admissions Exam Minimum for Reading/Math: </strong><ul><li>General Education and 504 Plan Students: 24% / 24%</li><li>IEP and EL Students: Combo of 48%</li></ul></li><li><strong>Priority: </strong>Proximity</li></ul>",
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
  "b66068cf75e5acb6cf1af2ad1d0642ed": {
    "id": "b66068cf75e5acb6cf1af2ad1d0642ed",
    "programs": [
      "WESTINGHOUSE HS: WESTINGHOUSE HS - Selective Enrollment High School",
      "BROOKS HS: BROOKS HS - Selective Enrollment High School",
      "YOUNG HS: YOUNG HS - Selective Enrollment High School"
    ],
    "desc": "Exam",
    "fn": accept(everyone)
  },
  "d3d1ad2715bf0351bdec936b5d6cf36a": {
    "id": "d3d1ad2715bf0351bdec936b5d6cf36a",
    "programs": [
      "WESTINGHOUSE HS: WESTINGHOUSE HS - Selective Enrollment High School",
      "YOUNG HS: YOUNG HS - Selective Enrollment High School",
      "SOUTH SHORE INTL HS: SOUTH SHORE INTL HS - Selective Enrollment High School"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Point<li><strong>GPA: </strong>None<li><strong>HS Admissions Exam Minimum for Reading/Math: </strong><ul><li>General Education and 504 Plan Students: 24% / 24%</li><li>IEP and EL Students: Combo of 48%</li></ul></li><li><strong>Priority: </strong>Tier</li></ul>",
    "fn": sePointSystem
  },
  "719dc2c519925806133ab18a36f05633": {
    "id": "719dc2c519925806133ab18a36f05633",
    "programs": [
      "AMUNDSEN HS: AMUNDSEN HS - General Education Grow Community"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>None<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: None / None</li><li>IEP and EL Students: None / None</li></ul></li><li><strong>Priority: </strong>Elementary Preference, Attendance Area, Sibling, Staff Pref<li><strong>Note: </strong>Elem Pref includes: Grow Community Schools (Audubon, Bell, Blaine, Budlong, Burley, Chappell, Coonley, Greeley, Hamilton, Hawthorne, Inter-American, Jahn, Jamieson, McPherson, Nettelhorst, Ravenswood, or Waters</li></ul>",
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
  }
  ,
  "adf9b0cf25b3c5cc2649305fbc5f1090": {
    "id": "adf9b0cf25b3c5cc2649305fbc5f1090",
    "programs": [
      "AMUNDSEN HS: AMUNDSEN HS - International Baccalaureate (IB)"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Point<li><strong>GPA: </strong>2.5<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: 24% / 24%</li><li>IEP and EL Students: Combo of 48%</li></ul></li><li><strong>Priority: </strong>Attendance Area - additional points",
    "fn": ibPointSystem
  },
  "90b96b32ce2f539f08e99e8112c10594": {
    "id": "90b96b32ce2f539f08e99e8112c10594",
    "programs": [
      "BOGAN HS: BOGAN HS - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>AA-none\noutside AA- 2.5<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: None / None</li><li>IEP and EL Students: None / None</li></ul></li><li><strong>Priority: </strong>Attendance area, Staff Pref</li></ul>",
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
  "324d886dfa65cc829539506e839cfe2d": {
    "id": "324d886dfa65cc829539506e839cfe2d",
    "programs": [
      "BOGAN HS: BOGAN HS - International Baccalaureate (IB)"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>None<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: 24% / 24%</li><li>IEP and EL Students: None / None</li></ul></li><li><strong>Priority: </strong>30% of seats for Attendance Area</li></ul>",
    "fn": conditional(
      {
        filter:ifIEPorEL,
        fn:lottery(
          ATTENDANCE_AREA_LOTTERY_STAGE,
          GENERAL_LOTTERY_STAGE,
        )
      },
      {
        filter:ifHasGrades({
          hsatBoth:24
        }),
        fn:lottery(
          ATTENDANCE_AREA_LOTTERY_STAGE,
          GENERAL_LOTTERY_STAGE,
        )
      }
    )
  },
  "56af8b26d2e9476631d427fffc66c477": {
    "id": "56af8b26d2e9476631d427fffc66c477",
    "programs": [
      "FARRAGUT HS: FARRAGUT HS - General Education",
      "KELLY HS: KELLY HS - AVID",
      "KELVYN PARK HS: KELVYN PARK HS - Fine & Performing Arts",
      "SENN HS: SENN HS - General Education",
      "CURIE HS: CURIE HS - General Education",
      "JULIAN HS: JULIAN HS - Fine & Performing Arts"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>None<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: None / None</li><li>IEP and EL Students: None / None</li></ul></li><li><strong>Priority: </strong>Attendance Area</li></ul>",
    "fn": conditional(
      {
        filter: ifIsNeighborhoodSchool,
        fn:accept(everyone)
      },
      {
        filter: everyone,
        fn: lottery(
          ATTENDANCE_AREA_LOTTERY_STAGE,
          GENERAL_LOTTERY_STAGE,
        )
      }
    )
  },
  "e6e3ff1d82e3deaee61bc0c71e5a5e3f": {
    "id": "e6e3ff1d82e3deaee61bc0c71e5a5e3f",
    "programs": [
      "FARRAGUT HS: FARRAGUT HS - International Baccalaureate (IB)"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Point<li><strong>GPA: </strong>2.5<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: 24% / 24%</li><li>IEP and EL Students: Combo of 48%</li></ul></li><li><strong>Priority: </strong>Attendance Area- Additional points, Partner Schools</li></ul>",
    "fn": ibPointSystem
  },
  "be03b6c1d53785b2e5b23e37e7c64ba3": {
    "id": "be03b6c1d53785b2e5b23e37e7c64ba3",
    "programs": [
      "FARRAGUT HS: FARRAGUT HS - JROTC",
      "SCHURZ HS: SCHURZ HS - AVID"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>2<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: None / None</li><li>IEP and EL Students: None / None</li></ul></li><li><strong>Priority: </strong>Attendance Area</li></ul>",
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
  "a0de74cf6934c6088b3d3694667e868f": {
    "id": "a0de74cf6934c6088b3d3694667e868f",
    "programs": [
      "FENGER HS: FENGER HS - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>None<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: None / None</li><li>IEP and EL Students: None / None</li></ul></li><li><strong>Priority: </strong>Sibling, Staff Pref</li></ul>",
    "fn": conditional(
      {
        filter: ifInAttendBound,
        fn:accept(everyone)
      },
      { 
        filter:everyone, 
        fn:lottery(
          SIBLING_LOTTERY_STAGE,
          STAFF_PREFERENCE_LOTTERY_STAGE,
          GENERAL_LOTTERY_STAGE,
        )
      }
    )
  },
  "d40be26f5a567b47ecd676eaf88bfb0c": {
    "id": "d40be26f5a567b47ecd676eaf88bfb0c",
    "programs": [
      "FENGER HS: FENGER HS - Honors"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>2<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: 50% / 50%</li><li>IEP and EL Students: Combo of 100%</li></ul></li><li><strong>Priority: </strong>None</li></ul>",
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
  "977f7fb154aec1341e0832db3b9b348b": {
    "id": "977f7fb154aec1341e0832db3b9b348b",
    "programs": [
      "FOREMAN HS: FOREMAN HS - Digital Media"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>None<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: 24% / 24%</li><li>IEP and EL Students: Combo of 48%</li></ul></li><li><strong>Priority: </strong>30% of seats for Attendance Area</li></ul>",
    "fn": conditional(
      {
        filter: both(ifIEPorEL, ifHasGrades({hsatCombined:48})),
        fn:lottery(
          ATTENDANCE_AREA_LOTTERY_STAGE,
          GENERAL_LOTTERY_STAGE,
          )
      },
      {
        filter: ifHasGrades({hsatBoth:24}),
        fn:lottery(
          ATTENDANCE_AREA_LOTTERY_STAGE,
          GENERAL_LOTTERY_STAGE,
          )
      }
    )
  },
  "8fc3dfac8bfacd40664e7c963a23a47f": {
    "id": "8fc3dfac8bfacd40664e7c963a23a47f",
    "programs": [
      "FOREMAN HS: FOREMAN HS - JROTC"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>2<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: None / None</li><li>IEP and EL Students: None / None</li></ul></li><li><strong>Priority: </strong>Sibling, Attendance Area</li></ul>",
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
  "083365ca1987a5262d98577943b8b717": {
    "id": "083365ca1987a5262d98577943b8b717",
    "programs": [
      "HYDE PARK HS: HYDE PARK HS - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>None<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: None / None</li><li>IEP and EL Students: None / None</li></ul></li><li><strong>Priority: </strong>Attendance Area, Sibling, Staff Pref, Elem Pref<li><strong>Note: </strong>Elem Pref includes: Carnegie Elementary School</li></ul>",
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
  "391f6f90374e29a41d1fa57f89dbcfba": {
    "id": "391f6f90374e29a41d1fa57f89dbcfba",
    "programs": [
      "HYDE PARK HS: HYDE PARK HS - International Baccalaureate (IB)"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Point<li><strong>GPA: </strong>2.5<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: 24% / 24%</li><li>IEP and EL Students: Combo of 48%</li></ul></li><li><strong>Priority: </strong>Elem Pref<li><strong>Note: </strong>Elem Pref includes: Carnegie Elementary School</li></ul>",
    "fn": ibPointSystem
  },
  "547179ce6b3ed44a681fcf0d2c808d36": {
    "id": "547179ce6b3ed44a681fcf0d2c808d36",
    "programs": [
      "KELLY HS: KELLY HS - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>2<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: None / None</li><li>IEP and EL Students: None / None</li></ul></li><li><strong>Priority: </strong>Attendance Area, Sibling, Staff Pref</li></ul>",
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
  "0ca4e3e843437c9038595f4a6400dd27": {
    "id": "0ca4e3e843437c9038595f4a6400dd27",
    "programs": [
      "KELVYN PARK HS: KELVYN PARK HS - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>None<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: None / None</li><li>IEP and EL Students: None / None</li></ul></li><li><strong>Priority: </strong>Continuing, Attendance Area, Sibling, Staff Pref</li></ul>",
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
  "e2e44387546c16887b76023fe4046853": {
    "id": "e2e44387546c16887b76023fe4046853",
    "programs": [
      "BROOKS HS: BROOKS HS - Selective Enrollment",
      "MORGAN PARK HS: MORGAN PARK HS - Selective Enrollment",
      "TAFT HS: TAFT HS - Selective Enrollment",
      "KENWOOD HS: KENWOOD HS - Selective Enrollment",
      "YOUNG HS: YOUNG HS - Selective Enrollment",
      "LINDBLOM HS: LINDBLOM HS - Selective Enrollment"
    ],
    "desc": "Admission Exam",
    "fn": accept(everyone)
  },
  "970dab13e54072c8f691f653e5d8372b": {
    "id": "970dab13e54072c8f691f653e5d8372b",
    "programs": [
      "BROOKS HS: BROOKS HS - Selective Enrollment",
      "LANE TECH HS: LANE TECH HS - Selective Enrollment",
      "MORGAN PARK HS: MORGAN PARK HS - Selective Enrollment",
      "KENWOOD HS: KENWOOD HS - Selective Enrollment"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Point<li><strong>GPA: </strong>2.5<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: 45% / 45%</li><li>IEP and EL Students: Minimum of 50% in one subject (ELA or Math) and 40% in the other (ELA or Math)</li></ul></li><li><strong>Priority: </strong>None</li></ul>",
    "fn": sePointSystem
  },
  "468f540ba089e9efd9797324ecec39f5": {
    "id": "468f540ba089e9efd9797324ecec39f5",
    "programs": [
      "LINCOLN PARK HS: LINCOLN PARK HS - Drama",
      "LINCOLN PARK HS: LINCOLN PARK HS - International Baccalaureate (IB) - MYP (Honors/DoubleHonors)",
      "LINCOLN PARK HS: LINCOLN PARK HS - Music - Instrumental",
      "LINCOLN PARK HS: LINCOLN PARK HS - VISUAL ARTS",
      "LINCOLN PARK HS: LINCOLN PARK HS - Music - Vocal"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Point<li><strong>GPA: </strong>AA-none\noutside AA- 2.5<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: AA- none, Outside AA- 24% / AA- none, Outside AA- 24%</li><li>IEP and EL Students: AA- none, Outside AA- Combo of 48%</li></ul></li><li><strong>Priority: </strong>Attendance Area</li></ul>",
    "fn": notImplemented
  },
  "3308208d02f49698cbe653e5c12a7827": {
    "id": "3308208d02f49698cbe653e5c12a7827",
    "programs": [
      "LAKE VIEW HS: LAKE VIEW HS - Early College STEM"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>None<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: None / None</li><li>IEP and EL Students: None / None</li></ul></li><li><strong>Priority: </strong>Attendance Area, Sibling, Staff Pref, Elem Pref, Overlay<li><strong>Note: </strong>Elem Pref includes: Grow Community Schools (Audubon, Bell, Blaine, Budlong, Burley, Chappell, Coonley, Greeley, Hamilton, Hawthorne, Inter-American, Jahn, Jamieson, McPherson, Nettelhorst, Ravenswood, or Waters</li></ul>",
    "fn": lottery(
      ATTENDANCE_AREA_LOTTERY_STAGE,
      SIBLING_LOTTERY_STAGE,
      STAFF_PREFERENCE_LOTTERY_STAGE,
      {
        filter: ifStudentAttendsOneOf(...GROW_COMMUNITY_SCHOOL_ES_PROGRAMS),
        size: LotteryStageSize.LARGE
      },
      GENERAL_LOTTERY_STAGE,
    )
  },
  "4e26d28febafc3edcc836b2e1a9dcc0a": {
    "id": "4e26d28febafc3edcc836b2e1a9dcc0a",
    "programs": [
      "LANE TECH HS: LANE TECH HS - Selective Enrollment"
    ],
    "desc": "Entrance Exam",
    "fn": accept(everyone)
  },
  "07bd68f079f799c12343248f9894c307": {
    "id": "07bd68f079f799c12343248f9894c307",
    "programs": [
      "LANE TECH HS: LANE TECH HS - Selective Enrollment High School",
      "LINDBLOM HS: LINDBLOM HS - Selective Enrollment High School"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Point<li><strong>GPA: </strong>None<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: 24% / 24%</li><li>IEP and EL Students: Combo of 48%</li></ul></li><li><strong>Priority: </strong>Continuing, Tier</li></ul>",
    "fn": sePointSystem
  },
  "f2214ad33e87e42db5c5df5252421663": {
    "id": "f2214ad33e87e42db5c5df5252421663",
    "programs": [
      "MATHER HS: MATHER HS - AVID"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>2<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: None / None</li><li>IEP and EL Students: None / None</li></ul></li><li><strong>Priority: </strong>Attendance Area, Sibling, Staff Pref, Elem Pref<li><strong>Note: </strong>Elem Pref includes: students currently enrolled in Boone, Clinton, Jamieson, Peterson, Rogers, or West Ridge</li></ul>",
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
  "3868118dde29969eab2cf550e3972d4b": {
    "id": "3868118dde29969eab2cf550e3972d4b",
    "programs": [
      "MATHER HS: MATHER HS - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>None<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: None / None</li><li>IEP and EL Students: None / None</li></ul></li><li><strong>Priority: </strong>Attendance Area, Sibling, Staff Pref, Elem Pref<li><strong>Note: </strong>Elem Pref includes: students currently enrolled in Armstrong G, Boone, Clinton, Jamieson, Peterson, Rogers, or West Ridge</li></ul>",
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
  "57f8c17bdb34e354a66829b1dafc5098": {
    "id": "57f8c17bdb34e354a66829b1dafc5098",
    "programs": [
      "MORGAN PARK HS: MORGAN PARK HS - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>AA-none\noutside AA- 2.3<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: None / None</li><li>IEP and EL Students: None / None</li></ul></li><li><strong>Priority: </strong>Attendance Area, Continuing, Sibling, Staff Pref</li></ul>",
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
  "8e8d060a5bad743b643ac48ffd63123f": {
    "id": "8e8d060a5bad743b643ac48ffd63123f",
    "programs": [
      "ROOSEVELT HS: ROOSEVELT HS - Dual Language"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>2.5<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: None / None</li><li>IEP and EL Students: None / None</li></ul></li><li><strong>Priority: </strong>Sibling, Elem Pref<li><strong>Note: </strong>Elem Pref includes: a CPS elementary school with a world language or dual language program</li></ul>",
    "fn": conditional(
      {
        filter: ifHasGrades({gpa: 2.5}),
        fn: lottery(
          SIBLING_LOTTERY_STAGE,
          {//FIXME Add dual/world language es program group
            filter: ifStudentAttendsOneOf(
              ),
            size: LotteryStageSize.LARGE
          },
          GENERAL_LOTTERY_STAGE,
        )
      }
    )
  },
  "b3257a03373ad136686f830b64a92f0b": {
    "id": "b3257a03373ad136686f830b64a92f0b",
    "programs": [
      "SCHURZ HS: SCHURZ HS - Dual Language"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>None<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: None / None</li><li>IEP and EL Students: None / None</li></ul></li><li><strong>Priority: </strong>Sibling, Elem Pref<li><strong>Note: </strong>Elem Pref includes: a CPS elementary school with a world language or dual language program</li></ul>",
    "fn": lottery(
      SIBLING_LOTTERY_STAGE,
      {//FIXME Add dual/world language es program group
        filter: ifStudentAttendsOneOf(
          ),
        size: LotteryStageSize.LARGE
      },
      GENERAL_LOTTERY_STAGE,
    )
  },
  "fa5fdc53fcc9f985c0a7f8662bf23407": {
    "id": "fa5fdc53fcc9f985c0a7f8662bf23407",
    "programs": [
      "SENN HS: SENN HS - Dance",
      "SENN HS: SENN HS - Music",
      "SENN HS: SENN HS - Theatre",
      "SENN HS: SENN HS - Visual Arts"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Point<li><strong>GPA: </strong>None<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: 24% / 24%</li><li>IEP and EL Students: Combo of 48%</li></ul></li><li><strong>Priority: </strong>None</li></ul>",
    "fn": notImplemented
  },
  "e6671c8e71e3fae8a639bd4993e770a0": {
    "id": "e6671c8e71e3fae8a639bd4993e770a0",
    "programs": [
      "SENN HS: SENN HS - General Education",
      "CURIE HS: CURIE HS - Journalism",
      "CURIE HS: CURIE HS - General Education"
    ],
    "desc": "Attendance Area",
    "fn": accept(ifInAttendBound)
  },
  "28489402083eae556eacbe5564c72c98": {
    "id": "28489402083eae556eacbe5564c72c98",
    "programs": [
      "STEINMETZ HS: STEINMETZ HS - Digital Media",
      "SULLIVAN HS: SULLIVAN HS - Entrepreneurship",
      "TILDEN HS: TILDEN HS - Culinary Arts"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>None<li><strong>HS Admissions Exam Minimum for Reading/Math: </strong><ul><li>General Education and 504 Plan Students: 24% / 24%</li><li>IEP and EL Students: Combo of 48%</li></ul></li><li><strong>Priority: </strong>30% of seats for Attendance Area<li><strong>Note: </strong>Repeating 8th graders and students pushed into 8th grade from 6th grade due to age requirements qualify for selection but will be placed in a lower preference group.</li></ul>",
    "fn": conditional(
      {
        filter: both(ifIEPorEL, ifHasGrades({hsatCombined:48})),
        fn:lottery(
          ATTENDANCE_AREA_LOTTERY_STAGE,
          GENERAL_LOTTERY_STAGE,
          )
      },
      {
        filter: ifHasGrades({hsatBoth:24}),
        fn:lottery(
            ...lowerPriority8thGrade(
            ATTENDANCE_AREA_LOTTERY_STAGE,
            GENERAL_LOTTERY_STAGE,
            )
          )
      }
    )
  },
  "06c36aecb7cb084b9a7839a635b15f9e": {
    "id": "06c36aecb7cb084b9a7839a635b15f9e",
    "programs": [
      "STEINMETZ HS: STEINMETZ HS - STEAM"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>AA-none\noutside AA- 2<li><strong>HS Admissions Exam Minimum for Reading/Math: </strong><ul><li>General Education and 504 Plan Students: AA-none, outside AA- 20% / AA-none, outside AA- 20%</li><li>IEP and EL Students: AA-none, outside AA- 40%</li></ul></li><li><strong>Priority: </strong>Attendance Area, Sibling, Staff Pref</li></ul>",
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
  "8d1f8d98a9b4d02643de8f8d1a6005da": {
    "id": "8d1f8d98a9b4d02643de8f8d1a6005da",
    "programs": [
      "STEINMETZ HS: STEINMETZ HS - International Baccalaureate (IB)",
      "SOUTH SHORE INTL HS: SOUTH SHORE INTL HS - International Baccalaureate (IB)"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Point<li><strong>GPA: </strong>2.5<li><strong>HS Admissions Exam Minimum for Reading/Math: </strong><ul><li>General Education and 504 Plan Students: 24% / 24%</li><li>IEP and EL Students: Combo of 48%</li></ul></li><li><strong>Priority: </strong>Attendance Area- Additional points</li></ul>",
    "fn": ibPointSystem
  },
  "e2da007596eac91687c2d86ef3f7445b": {
    "id": "e2da007596eac91687c2d86ef3f7445b",
    "programs": [
      "STEINMETZ HS: STEINMETZ HS - JROTC"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>2<li><strong>HS Admissions Exam Minimum for Reading/Math: </strong><ul><li>General Education and 504 Plan Students: 22% / 22%</li><li>IEP and EL Students: Combo of 44%</li></ul></li><li><strong>Priority: </strong>None</li></ul>",
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
  "da56ff81635cf0cd71c1c7559c9bfefb": {
    "id": "da56ff81635cf0cd71c1c7559c9bfefb",
    "programs": [
      "SULLIVAN HS: SULLIVAN HS - The English Learner Academy"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>None<li><strong>HS Admissions Exam Minimum for Reading/Math: </strong><ul><li>General Education and 504 Plan Students: None / None</li><li>IEP and EL Students: None / None</li></ul></li><li><strong>Priority: </strong>Attendance Area, Elem Pref, Sibling<li><strong>Note: </strong>Elem Pref includes: students attending Armstrong G, Ccourtenay, Boone, Field, Gale, Hayt, Jordan, Kilmer, McCutcheon, McPherson, or West Ridge Elementary Schools</li></ul>",
    "fn": lottery(
      ATTENDANCE_AREA_LOTTERY_STAGE,
      {
        filter: ifStudentAttendsOneOf(
          //FIXME Add Armstrong G ES program
          BOONE_ES_PROGRAM,
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
  "2184425bb905cc594d05e830aba8d8b8": {
    "id": "2184425bb905cc594d05e830aba8d8b8",
    "programs": [
      "SULLIVAN HS: SULLIVAN HS - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>None<li><strong>HS Admissions Exam Minimum for Reading/Math: </strong><ul><li>General Education and 504 Plan Students: None / None</li><li>IEP and EL Students: None / None</li></ul></li><li><strong>Priority: </strong>Attendance Area, Elem Pref, Sibling, Staff Pref<li><strong>Note: </strong>Elem Pref includes: students attending Armstrong G, Ccourtenay, Boone, Field, Gale, Hayt, Jordan, Kilmer, McCutcheon, McPherson, or West Ridge Elementary Schools</li></ul>",
    "fn": conditional(
      {
        filter:ifInAttendBound,
        fn:accept(everyone)
      },
      {
        filter: everyone,
        fn:lottery(
          ATTENDANCE_AREA_LOTTERY_STAGE,
          {
            filter: ifStudentAttendsOneOf(
              //FIXME Add Armstrong G ES program
              BOONE_ES_PROGRAM,
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
      }
    )
  },
  "ad2c0c5279aa6ee4acad3f2d05012df5": {
    "id": "ad2c0c5279aa6ee4acad3f2d05012df5",
    "programs": [
      "SULLIVAN HS: SULLIVAN HS - Medical & Health Careers",
      "WILLIAMS HS: WILLIAMS HS - Medical & Health Careers",
      "SOLORIO HS: SOLORIO HS - Pre-Engineering",
      "SOUTH SHORE INTL HS: SOUTH SHORE INTL HS - Medical & Health Careers"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Point<li><strong>GPA: </strong>None<li><strong>HS Admissions Exam Minimum for Reading/Math: </strong><ul><li>General Education and 504 Plan Students: None / None</li><li>IEP and EL Students: None / None</li></ul></li><li><strong>Priority: </strong>None</li></ul>",
    "fn": notImplemented//FIXME point system
  },
  "6edcbfb7727ad02f9cdfce307007455e": {
    "id": "6edcbfb7727ad02f9cdfce307007455e",
    "programs": [
      "TAFT HS: TAFT HS - Selective Enrollment",
      "YOUNG HS: YOUNG HS - Selective Enrollment"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Point<li><strong>GPA: </strong>None<li><strong>HS Admissions Exam Minimum for Reading/Math: </strong><ul><li>General Education and 504 Plan Students: 45% / 45%</li><li>IEP and EL Students: Minimum of 50% in one subject (Reading or Math) and 40% in the other (Reading or Math)</li></ul></li><li><strong>Priority: </strong>None</li></ul>",
    "fn": sePointSystem
  },
  "02b70d349c1beeedd4ac663ccccac323": {
    "id": "02b70d349c1beeedd4ac663ccccac323",
    "programs": [
      "TAFT HS: TAFT HS - General Education for Preference Zone"
    ],
    "desc": "Attendance Area/Academic Center Attendance",
    "fn": accept(either(ifInAttendBound, ifStudentAttendsOneOf(TAFT_ACADEMIC_CENTER_PROGRAM)))
  },
  "cfb0f10b95518bd57c16f52de003e35f": {
    "id": "cfb0f10b95518bd57c16f52de003e35f",
    "programs": [
      "TAFT HS: TAFT HS - General Education for Preference Zone"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>None<li><strong>HS Admissions Exam Minimum for Reading/Math: </strong><ul><li>General Education and 504 Plan Students: None / None</li><li>IEP and EL Students: None / None</li></ul></li><li><strong>Priority: </strong>Overlay</li></ul>",
    "fn": lottery(
      ATTENDANCE_AREA_LOTTERY_STAGE,
      {
        filter: ifStudentAttendsOneOf(
          TAFT_ACADEMIC_CENTER_PROGRAM
        ),
        size: LotteryStageSize.LARGE
      },
      GENERAL_LOTTERY_STAGE,
      )
  },
  "59910615409209203fdc6633a6698c9b": {
    "id": "59910615409209203fdc6633a6698c9b",
    "programs": [
      "TAFT HS: TAFT HS - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>None<li><strong>HS Admissions Exam Minimum for Reading/Math: </strong><ul><li>General Education and 504 Plan Students: None / None</li><li>IEP and EL Students: None / None</li></ul></li><li><strong>Priority: </strong>Attendance Area</li></ul>",
    "fn": lottery(
      ATTENDANCE_AREA_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE,
    )
  },
  "eae751f7510b3b4267ce32f95dd00d48": {
    "id": "eae751f7510b3b4267ce32f95dd00d48",
    "programs": [
      "TAFT HS: TAFT HS - International Baccalaureate (IB)"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Point<li><strong>GPA: </strong>2.5<li><strong>HS Admissions Exam Minimum for Reading/Math: </strong><ul><li>General Education and 504 Plan Students: 24% / 24%</li><li>IEP and EL Students: Combo of 48%</li></ul></li><li><strong>Priority: </strong>Continuing</li></ul>",
    "fn": ibPointSystem
  },
  "6415bacdabbcfe969f7c0775d0613396": {
    "id": "6415bacdabbcfe969f7c0775d0613396",
    "programs": [
      "TAFT HS: TAFT HS - NJROTC"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Point<li><strong>GPA: </strong>None<li><strong>HS Admissions Exam Minimum for Reading/Math: </strong><ul><li>General Education and 504 Plan Students: 50% / 50%</li><li>IEP and EL Students: Combo of 100%</li></ul></li><li><strong>Priority: </strong>Attendance Area</li></ul>",
    "fn": accept(
      either(
        both(ifIEPorEL, ifHasGrades({hsatCombined:100})),
        ifHasGrades({hsatBoth:50})
      )
    )
  },
  "8ecd76f1f451c4d45b59582fae8aa060": {
    "id": "8ecd76f1f451c4d45b59582fae8aa060",
    "programs": [
      "TILDEN HS: TILDEN HS - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>None<li><strong>HS Admissions Exam Minimum for Reading/Math: </strong><ul><li>General Education and 504 Plan Students: None / None</li><li>IEP and EL Students: None / None</li></ul></li><li><strong>Priority: </strong>Attendance Area, Sibling, Staff Pref </li></ul>",
    "fn": conditional(
      {
        filter:ifInAttendBound,
        fn:accept(everyone)
      },
      {
        filter:everyone,
        fn:
          lottery(
            ATTENDANCE_AREA_LOTTERY_STAGE,
            SIBLING_LOTTERY_STAGE,
            STAFF_PREFERENCE_LOTTERY_STAGE,
            GENERAL_LOTTERY_STAGE,
        )
      }
    )
    
  },
  "f287f1a31ab9df121267f3035abf608f": {
    "id": "f287f1a31ab9df121267f3035abf608f",
    "programs": [
      "VON STEUBEN HS: VON STEUBEN HS - Magnet College Prep Program"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>None<li><strong>HS Admissions Exam Minimum for Reading/Math: </strong><ul><li>General Education and 504 Plan Students: 24% / 24%</li><li>IEP and EL Students: Combo of 48%</li></ul></li><li><strong>Priority: </strong>Sibling, Staff Pref, Proximity*, Tier<li><strong>Note: </strong>Proximity preference is only in effect during certain years depending on student population.</li></ul>",
    "fn": conditional(
      {
        filter: both(ifIEPorEL, ifHasGrades({hsatCombined:48})),
        fn:lottery(
          SIBLING_LOTTERY_STAGE,
          STAFF_PREFERENCE_LOTTERY_STAGE,
          PROXIMITY_LOTTERY_STAGE,
          TIER_LOTTERY_STAGE,
          GENERAL_LOTTERY_STAGE,
        )
      },
      {
        filter: ifHasGrades({hsatBoth:24}),
        fn:lottery(
          SIBLING_LOTTERY_STAGE,
          STAFF_PREFERENCE_LOTTERY_STAGE,
          PROXIMITY_LOTTERY_STAGE,
          TIER_LOTTERY_STAGE,
          GENERAL_LOTTERY_STAGE,
        )
      }
    )
  },
  "b17c0e466051a21cc78e5625a92ede67": {
    "id": "b17c0e466051a21cc78e5625a92ede67",
    "programs": [
      "VON STEUBEN HS: VON STEUBEN HS - Scholars"
    ],
    "desc": "Teacher Rec\nEssay",
    "fn": notImplemented
  },
  "a0a3bc55be90d6aaa0476bc490dd6721": {
    "id": "a0a3bc55be90d6aaa0476bc490dd6721",
    "programs": [
      "VON STEUBEN HS: VON STEUBEN HS - Scholars"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Point<li><strong>GPA: </strong>3<li><strong>HS Admissions Exam Minimum for Reading/Math: </strong><ul><li>General Education and 504 Plan Students: 60% / 60%</li><li>IEP and EL Students: Combo of 120%</li></ul></li><li><strong>Priority: </strong>None</li></ul>",
    "fn": accept(
      either(
        both(ifIEPorEL, ifHasGrades({gpa: 3, hsatCombined:120})),
        ifHasGrades({gpa: 3, hsatBoth:60})
      )
    )
  },
  "05bbb23c933e6a010ac9dc37505ae9fe": {
    "id": "05bbb23c933e6a010ac9dc37505ae9fe",
    "programs": [
      "WASHINGTON HS: WASHINGTON HS - International Baccalaureate (IB)"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Point<li><strong>GPA: </strong>2.5<li><strong>HS Admissions Exam Minimum for Reading/Math: </strong><ul><li>General Education and 504 Plan Students: 24% / 24%</li><li>IEP and EL Students: Combo of 48%</li></ul></li><li><strong>Priority: </strong>Elem Pref</li></ul>",
    "fn": ibPointSystem
  },
  "5f4e4f378147cf14f440543ce140a7ca": {
    "id": "5f4e4f378147cf14f440543ce140a7ca",
    "programs": [
      "WELLS HS: WELLS HS - Fine & Performing Arts"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>2<li><strong>HS Admissions Exam Minimum for Reading/Math: </strong><ul><li>General Education and 504 Plan Students: None / None</li><li>IEP and EL Students: None / None</li></ul></li><li><strong>Priority: </strong>Attendance Area</li></ul>",
    "fn": conditional(
      {
        filter: ifHasGrades({gpa:2}),
        fn: lottery(
          ATTENDANCE_AREA_LOTTERY_STAGE,
          GENERAL_LOTTERY_STAGE,
        )
      }
    )
  },
  "7044199c3619160d88be2be55ed350d3": {
    "id": "7044199c3619160d88be2be55ed350d3",
    "programs": [
      "WELLS HS: WELLS HS - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>AA-none\noutside AA- 2.5<li><strong>HS Admissions Exam Minimum for Reading/Math: </strong><ul><li>General Education and 504 Plan Students: None / None</li><li>IEP and EL Students: None / None</li></ul></li><li><strong>Priority: </strong>Attendance Area, Sibling, Staff Pref </li></ul>",
    "fn": conditional(
      {
        filter: ifInAttendBound,
        fn: accept(everyone)
      },
      {
        filter: ifHasGrades({gpa:2.5}),
        fn: lottery(
          ATTENDANCE_AREA_LOTTERY_STAGE,
          SIBLING_LOTTERY_STAGE,
          STAFF_PREFERENCE_LOTTERY_STAGE,
          GENERAL_LOTTERY_STAGE,
        )
      }
    )
  },
  "b93299562d834f5f097706676014c039": {
    "id": "b93299562d834f5f097706676014c039",
    "programs": [
      "WELLS HS: WELLS HS - Game Programming"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>None<li><strong>HS Admissions Exam Minimum for Reading/Math: </strong><ul><li>General Education and 504 Plan Students: 24% / 24%</li><li>IEP and EL Students: Combo of 48%</li></ul></li><li><strong>Priority: </strong>Attendance Area<li><strong>Note: </strong>Repeating 8th graders and students pushed into 8th grade from 6th grade due to age requirements qualify for selection but will be placed in a lower preference group.</li></ul>",
    "fn": conditional(
      {
        filter: either(
          both(ifIEPorEL, ifHasGrades({hsatCombined:48})),
          ifHasGrades({hsatBoth:24})
        ),
        fn: lottery(
            ...lowerPriority8thGrade(
            ATTENDANCE_AREA_LOTTERY_STAGE,
            GENERAL_LOTTERY_STAGE,
            )
          )
      }
    )
  },
  "b138a514e60b75725e79296d1b876391": {
    "id": "b138a514e60b75725e79296d1b876391",
    "programs": [
      "HUBBARD HS: HUBBARD HS - JROTC"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>2<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: 50% / 50%</li><li>IEP and EL Students: Combo of 100%</li></ul></li><li><strong>Priority: </strong>Sibling</li></ul>",
    "fn": conditional(
      {
        filter: either(
          both(ifIEPorEL, ifHasGrades({gpa: 2, hsatCombined:100})),
          ifHasGrades({gpa: 2, hsatBoth:50})
        ),
        fn: lottery(
          SIBLING_LOTTERY_STAGE,
          GENERAL_LOTTERY_STAGE,
        )
      }
    )
  },
  "2f8f482d31b7487cb39c21a15eec3787": {
    "id": "2f8f482d31b7487cb39c21a15eec3787",
    "programs": [
      "HUBBARD HS: HUBBARD HS - University Scholars",
      "BRONZEVILLE HS: BRONZEVILLE HS - International Baccalaureate (IB)"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Point<li><strong>GPA: </strong>2.5<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: 24% / 24%</li><li>IEP and EL Students: Combo of 48%</li></ul></li><li><strong>Priority: </strong>None</li></ul>",
    "fn": ibPointSystem
  },
  "b1a1ba5f4c3d6639c508c9e2a6de1bdf": {
    "id": "b1a1ba5f4c3d6639c508c9e2a6de1bdf",
    "programs": [
      "KENWOOD HS: KENWOOD HS - Honors"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>3.5<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: 75% / 75%</li><li>IEP and EL Students: Combo of 150%</li></ul></li><li><strong>Priority: </strong>None</li></ul>",
    "fn": conditional(
      {
        filter: either(
          both(ifIEPorEL, ifHasGrades({gpa: 3.5, hsatCombined:150})),
          ifHasGrades({gpa: 3.5, hsatBoth:75})
        ),
        fn: lottery(
          GENERAL_LOTTERY_STAGE,
        )
      }
    )
  },
  "06e90adef1e39e74994c1ad1f98c5cdd": {
    "id": "06e90adef1e39e74994c1ad1f98c5cdd",
    "programs": [
      "KENWOOD HS: KENWOOD HS - Magnet"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>3<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: 60% / 60%</li><li>IEP and EL Students: Combo of 120%</li></ul></li><li><strong>Priority: </strong>Continuing</li></ul>",
    "fn": conditional(
      {
        filter: either(
          both(ifIEPorEL, ifHasGrades({gpa: 3, hsatCombined:120})),
          ifHasGrades({gpa: 3, hsatBoth:60})
        ),
        fn: lottery(
          CONTINUING_STUDENTS_LOTTERY_STAGE,
          GENERAL_LOTTERY_STAGE,
          
        )
      }
    )
  },
  "d7a5e62c8739bb2ff6158b263f92ea47": {
    "id": "d7a5e62c8739bb2ff6158b263f92ea47",
    "programs": [
      "KENWOOD HS: KENWOOD HS - General Education"
    ],
    "desc": "Continuing or Attendance Area",
    "fn": accept(either(ifStudentAttendsOneOf(KENWOOD_ACADEMIC_CENTER_PROGRAM), ifInAttendBound))
  },
  "f1f1b88447bd2336ff06f960d9158e9c": {
    "id": "f1f1b88447bd2336ff06f960d9158e9c",
    "programs": [
      "KENWOOD HS: KENWOOD HS - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>None<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: None / None</li><li>IEP and EL Students: None / None</li></ul></li><li><strong>Priority: </strong>Continuing, Attendance Area</li></ul>",
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
  "f0d88bde55d598bfa81b404ba254addc": {
    "id": "f0d88bde55d598bfa81b404ba254addc",
    "programs": [
      "CHICAGO AGRICULTURE HS: CHICAGO AGRICULTURE HS - Agricultural Sciences"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>None<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: 24% / 24%</li><li>IEP and EL Students: Combo of 48%</li></ul></li><li><strong>Priority: </strong>Sibling, Staff Preference, Overlay</li></ul>",
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
  "f989e94ad7e79217048429fec7fd11e2": {
    "id": "f989e94ad7e79217048429fec7fd11e2",
    "programs": [
      "CHICAGO MILITARY HS: CHICAGO MILITARY HS at Bronzeville STEM - Service Leadership Academy",
      "CARVER MILITARY HS: CARVER MILITARY HS - Service Leadership Academy"
    ],
    "desc": "Information Session\nEssay\nGrit Survey",
    "fn": notImplemented
  },
  "e4b25bdd08b54f47ba62bb0086c85417": {
    "id": "e4b25bdd08b54f47ba62bb0086c85417",
    "programs": [
      "CHICAGO MILITARY HS: CHICAGO MILITARY HS at Bronzeville STEM - Service Leadership Academy",
      "CARVER MILITARY HS: CARVER MILITARY HS - Service Leadership Academy",
      "PHOENIX MILITARY HS: PHOENIX STEM MILITARY HS - Service Leadership Academy",
      "AIR FORCE HS: AIR FORCE HS - Service Leadership Academy"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Point<li><strong>GPA: </strong>None<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: Combo of 48%</li><li>IEP and EL Students: Combo of 48%</li></ul></li><li><strong>Priority: </strong>None</li></ul>",
    "fn": notImplemented//TODO Military point system
  },
  "74a69286b87c96a88deda15d72a72ed6": {
    "id": "74a69286b87c96a88deda15d72a72ed6",
    "programs": [
      "CURIE HS: CURIE HS - AVID"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>2.5<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: 50% / 50%</li><li>IEP and EL Students: Combo of 100%</li></ul></li><li><strong>Priority: </strong>Sibling, Attendance Area</li></ul>",
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
  "1dcd8295654692800ee08385e0200ce1": {
    "id": "1dcd8295654692800ee08385e0200ce1",
    "programs": [
      "CURIE HS: CURIE HS - Dance",
      "CURIE HS: CURIE HS - Music"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Point<li><strong>GPA: </strong>None<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: 20% / 20%</li><li>IEP and EL Students: Combo of 40%</li></ul></li><li><strong>Priority: </strong>None</li></ul>",
    "fn": notImplemented//TODO Point System
  },
  "00edab8a4c619883162e2766483cc482": {
    "id": "00edab8a4c619883162e2766483cc482",
    "programs": [
      "CURIE HS: CURIE HS - International Baccalaureate (IB)"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Point<li><strong>GPA: </strong>2.5<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: 24% / 24%</li><li>IEP and EL Students: Combo of 48%</li></ul></li><li><strong>Priority: </strong>Attendance Area - additional points\nElementary Preferance<li><strong>Note: </strong>Elem Pref incudes: Edwards Elementary School</li></ul>",
    "fn": ibPointSystem
  },
  "2b054d2dc33ae76c6550dcb82aec870e": {
    "id": "2b054d2dc33ae76c6550dcb82aec870e",
    "programs": [
      "CURIE HS: CURIE HS - Journalism"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>None<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: 30% / 30%</li><li>IEP and EL Students: Combo of 60%</li></ul></li><li><strong>Priority: </strong>Sibling, Attendance Area</li></ul>",
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
  "265f6ef277b0fecdd49f5e2c0804d5bc": {
    "id": "265f6ef277b0fecdd49f5e2c0804d5bc",
    "programs": [
      "CLEMENTE HS: CLEMENTE HS - International Baccalaureate (IB)"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Point<li><strong>GPA: </strong>2.5<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: 24% / 24%</li><li>IEP and EL Students: Combo of 48%</li></ul></li><li><strong>Priority: </strong>Attendance Area - Additional Points</li></ul>",
    "fn": ibPointSystem
  },
  "c1fc16e215598fca3b31fb034521be09": {
    "id": "c1fc16e215598fca3b31fb034521be09",
    "programs": [
      "MARINE LEADERSHIP AT AMES HS: MARINE LEADERSHIP AT AMES HS - Military"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Point<li><strong>GPA: </strong>None<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: None / None</li><li>IEP and EL Students: None / None</li></ul></li><li><strong>Priority: </strong>Sibling</li></ul>",
    "fn": notImplemented//TODO Military
  },
  "2c7a595327e69596af0fd6f1d7b00186": {
    "id": "2c7a595327e69596af0fd6f1d7b00186",
    "programs": [
      "MARINE LEADERSHIP AT AMES HS: MARINE LEADERSHIP AT AMES HS - Service Leadership Academy"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Point<li><strong>GPA: </strong>None<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: Combo of 48%</li><li>IEP and EL Students: Combo of 48%</li></ul></li><li><strong>Priority: </strong>Continuing</li></ul>",
    "fn": notImplemented//TODO military
  },
  "ffbb97004e84d5b9b4b4a66689616ba3": {
    "id": "ffbb97004e84d5b9b4b4a66689616ba3",
    "programs": [
      "CLARK HS: CLARK HS - Early College STEM"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>None<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: 24% / 24%</li><li>IEP and EL Students: Combo of 48%</li></ul></li><li><strong>Priority: </strong>Sibling, Staff Pref, Proximity*, Tier<li><strong>Note: </strong>Proximity preference is only in effect during certain years depending on student population.</li></ul>",
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
          TIER_LOTTERY_STAGE,
          GENERAL_LOTTERY_STAGE,
        )
      }
    )
  },
  "af097a7be1fbf47e84eab396ab245258": {
    "id": "af097a7be1fbf47e84eab396ab245258",
    "programs": [
      "DOUGLASS HS: DOUGLASS HS - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>None<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: None / None</li><li>IEP and EL Students: None / None</li></ul></li><li><strong>Priority: </strong>Sibling, Staff Pref, Proximity</li></ul>",
    "fn": lottery(
      SIBLING_LOTTERY_STAGE,
      STAFF_PREFERENCE_LOTTERY_STAGE,
      PROXIMITY_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE,
    )
  },
  "feebe8734cf0d1433c178ba08e3a37df": {
    "id": "feebe8734cf0d1433c178ba08e3a37df",
    "programs": [
      "BOWEN HS: BOWEN HS - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>AA-none\noutside AA- 2.5<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: None / None</li><li>IEP and EL Students: None / None</li></ul></li><li><strong>Priority: </strong>None</li></ul>",
    "fn": conditional(
      {
        filter: ifInAttendBound,
        fn: accept(everyone)
      },
      {
        filter: ifHasGrades({gpa:2.5}),
        fn: lottery(
          GENERAL_LOTTERY_STAGE,
        )
      }
    )
  },
  "5667d303e70f7852ed3ae854cf10bd7b": {
    "id": "5667d303e70f7852ed3ae854cf10bd7b",
    "programs": [
      "CHICAGO ACADEMY HS: CHICAGO ACADEMY HS - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>None<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: None / None</li><li>IEP and EL Students: None / None</li></ul></li><li><strong>Priority: </strong>Continuing, Sibling, Staff Pref, Proximity, Elem Pref</li></ul>",
    "fn": lottery(
      CONTINUING_STUDENTS_LOTTERY_STAGE,
      SIBLING_LOTTERY_STAGE,
      STAFF_PREFERENCE_LOTTERY_STAGE,
      PROXIMITY_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE,
    )
  },
  "c54fa89f4544e3d4143019e945540f2c": {
    "id": "c54fa89f4544e3d4143019e945540f2c",
    "programs": [
      "CHICAGO ACADEMY HS: CHICAGO ACADEMY HS - Scholars"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>3<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: 70% / 70%</li><li>IEP and EL Students: Combo of 140%</li></ul></li><li><strong>Priority: </strong>Continuing, Sibling, Proximity, Elem Pref</li></ul>",
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
  "4ea41e6e391b4b6ec47618c5bff4eb1a": {
    "id": "4ea41e6e391b4b6ec47618c5bff4eb1a",
    "programs": [
      "SPRY HS: SPRY HS - Three-Year; Year-Round High School"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>None<li><strong>HS Admissions Exam Minimum for Reading/Math: </strong><ul><li>General Education and 504 Plan Students: None / None</li><li>IEP and EL Students: None / None</li></ul></li><li><strong>Priority: </strong>Sibling, Staff Pref</li></ul>",
    "fn": lottery(
      SIBLING_LOTTERY_STAGE,
      STAFF_PREFERENCE_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE,
    )
  },
  "0c3d9aa71fcd2df085621cfa037b0e0f": {
    "id": "0c3d9aa71fcd2df085621cfa037b0e0f",
    "programs": [
      "WILLIAMS HS: WILLIAMS HS - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>None<li><strong>HS Admissions Exam Minimum for Reading/Math: </strong><ul><li>General Education and 504 Plan Students: 24% / 24%</li><li>IEP and EL Students: Combo of 48%</li></ul></li><li><strong>Priority: </strong>Sibling, Staff Pref, Proximity</li></ul>",
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
  "7f3b67d4e4597e97ffa782791cd3b615": {
    "id": "7f3b67d4e4597e97ffa782791cd3b615",
    "programs": [
      "INFINITY HS: LVLHS INFINITY HS - STEM"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>2<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: 55% / 55%</li><li>IEP and EL Students: Combo of 110%</li></ul></li><li><strong>Priority: </strong>Attendance Area, Sibling, Staff Pref</li></ul>",
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
  "3987a38fcacaf0be6b95d497379a6d31": {
    "id": "3987a38fcacaf0be6b95d497379a6d31",
    "programs": [
      "RICKOVER MILITARY HS: RICKOVER MILITARY HS - Service Leadership Academy"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Point<li><strong>GPA: </strong>None<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: Combo of 48%</li><li>IEP and EL Students: Combo of 48%</li></ul></li><li><strong>Priority: </strong>Proximity</li></ul>",
    "fn": notImplemented//TODO military
  },
  "a0b2d3e39e2a7b51d1f8ed868ff9e5a0": {
    "id": "a0b2d3e39e2a7b51d1f8ed868ff9e5a0",
    "programs": [
      "LINDBLOM HS: LINDBLOM HS - Selective Enrollment"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Point<li><strong>GPA: </strong>2.5<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: 45% / 45%</li><li>IEP and EL Students: Minimum of 50% in one subject (ELA or Math) and 40% in the other (ELA or Math)</li></ul></li><li><strong>Priority: </strong>Tier</li></ul>",
    "fn": sePointSystem
  },
  "e3caf0267a965c1a7e21b16861d89328": {
    "id": "e3caf0267a965c1a7e21b16861d89328",
    "programs": [
      "UPLIFT HS: UPLIFT HS - Teaching"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>None<li><strong>HS Admissions Exam Minimum for Reading/Math: </strong><ul><li>General Education and 504 Plan Students: 24% / 24%</li><li>IEP and EL Students: Combo of 48%</li></ul></li><li><strong>Priority: </strong>Proximity<li><strong>Note: </strong>Repeating 8th graders and students pushed into 8th grade from 6th grade due to age requirements qualify for selection but will be placed in a lower preference group.</li></ul>",
    "fn": conditional(
      {
        filter: either(
          both(ifIEPorEL, ifHasGrades({hsatCombined:48})),
          ifHasGrades({hsatBoth:24})
        ),
        fn: lottery(
          PROXIMITY_LOTTERY_STAGE,//TODO 8th grade lower priority
          GENERAL_LOTTERY_STAGE,
        )
      }
    )
  },
  "c717b7881d952ff206705d03dd67d606": {
    "id": "c717b7881d952ff206705d03dd67d606",
    "programs": [
      "UPLIFT HS: UPLIFT HS - Early College STEAM"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>None<li><strong>HS Admissions Exam Minimum for Reading/Math: </strong><ul><li>General Education and 504 Plan Students: None / None</li><li>IEP and EL Students: None / None</li></ul></li><li><strong>Priority: </strong>Sibling, Staff Pref, Elem Pref<li><strong>Note: </strong>Elem Pref includes: students attending Brennemann, Courtenay, Disney, Goudy, Greeley, McCutcheon, or Ravenswood Elementary Schools</li></ul>",
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
          GREELEY_REGIONAL_GIFTED_CENTER_ES_PROGRAM,
          MCCUTCHEON_ES_PROGRAM,
          RAVENSWOOD_ES_PROGRAM
        ),
        size: LotteryStageSize.LARGE
      },
      GENERAL_LOTTERY_STAGE,
    )
  },
  "c7246304f2ceea818d4699db913cf665": {
    "id": "c7246304f2ceea818d4699db913cf665",
    "programs": [
      "COLLINS HS: COLLINS HS - Fine & Performing Arts"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>None<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: None / None</li><li>IEP and EL Students: None / None</li></ul></li><li><strong>Priority: </strong>Proximity</li></ul>",
    "fn": lottery(
      PROXIMITY_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE,
    )
  },
  "88db37ea032bb701ad89b8a085a1ea3f": {
    "id": "88db37ea032bb701ad89b8a085a1ea3f",
    "programs": [
      "COLLINS HS: COLLINS HS - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>None<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: None / None</li><li>IEP and EL Students: None / None</li></ul></li><li><strong>Priority: </strong>Sibling, Staff Pref, Elementary Pref<li><strong>Note: </strong>Elem Pref includes: students attending Chalmers, Dvorak, Herzl, Johnson, or Morton Elementary Schools</li></ul>",
    "fn": lottery(
      SIBLING_LOTTERY_STAGE,
      STAFF_PREFERENCE_LOTTERY_STAGE,
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
      GENERAL_LOTTERY_STAGE,
    )
  },
  "97b7abaa9f10180cd34eaca9ab9d8cdf": {
    "id": "97b7abaa9f10180cd34eaca9ab9d8cdf",
    "programs": [
      "COLLINS HS: COLLINS HS - Scholars"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>2.8<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: 40% / 40%</li><li>IEP and EL Students: Combo of 80%</li></ul></li><li><strong>Priority: </strong>Elementary Preference, Sibling<li><strong>Note: </strong>Elem Pref includes: students attending Chalmers, Dvorak, Herzl, Johnson, or Morton Elementary Schools</li></ul>",
    "fn": conditional(
      {
        filter: either(
          both(ifIEPorEL, ifHasGrades({hsatCombined:80})),
          ifHasGrades({hsatBoth:40})
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
  "db75517a9ff1f879c2006712776bac5f": {
    "id": "db75517a9ff1f879c2006712776bac5f",
    "programs": [
      "AIR FORCE HS: AIR FORCE HS - Service Leadership Academy"
    ],
    "desc": "Screening",
    "fn": notImplemented//TODO Military
  },
  "035f7e161f3d89d71bdfb809d71272b0": {
    "id": "035f7e161f3d89d71bdfb809d71272b0",
    "programs": [
      "ALCOTT HS: ALCOTT HS - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>None<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: None / None</li><li>IEP and EL Students: None / None</li></ul></li><li><strong>Priority: </strong>Guarantee Elementary, Staff Pref, Overlay<li><strong>Note: </strong>Elementary Pref includes: Alcott Elementary School</li></ul>",
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
  "8b5eddead319b0b9e663dbbeaee7cdd2": {
    "id": "8b5eddead319b0b9e663dbbeaee7cdd2",
    "programs": [
      "OGDEN HS: OGDEN HS - International Baccalaureate (IB)"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Point<li><strong>GPA: </strong>2.5<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: 24% / 24%</li><li>IEP and EL Students: Combo of 48%</li></ul></li><li><strong>Priority: </strong>Continuing, Attendance Area- Additional points</li></ul>",
    "fn": ibPointSystem
  },
  "37813d0be44c4bde02d70389e164a377": {
    "id": "37813d0be44c4bde02d70389e164a377",
    "programs": [
      "SOLORIO HS: SOLORIO HS - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>None<li><strong>HS Admissions Exam Minimum for Reading/Math: </strong><ul><li>General Education and 504 Plan Students: None / None</li><li>IEP and EL Students: None / None</li></ul></li><li><strong>Priority: </strong>Attendance Area, Sibling, Staff Pref</li></ul>",
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
  "7ef605fc113282578bf80b9c20dcfd39": {
    "id": "7ef605fc113282578bf80b9c20dcfd39",
    "programs": [
      "SOLORIO HS: SOLORIO HS - Double Honors/Scholars"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>3<li><strong>HS Admissions Exam Minimum for Reading/Math: </strong><ul><li>General Education and 504 Plan Students: 75% / 75%</li><li>IEP and EL Students: Combo of 150%</li></ul></li><li><strong>Priority: </strong>Sibling, Attendance Area</li></ul>",
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
  "78d398482887fc5f744c53e815ba9808": {
    "id": "78d398482887fc5f744c53e815ba9808",
    "programs": [
      "GOODE HS: GOODE HS - Early College STEM"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>None<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: None / None</li><li>IEP and EL Students: None / None</li></ul></li><li><strong>Priority: </strong>Staff Pref, Overlay, In-Network</li></ul>",
    "fn": notImplemented//TODO information session, in network & overlay
  },
  "60c1c6bbbc30d8ecccb319d14b5fa6c7": {
    "id": "60c1c6bbbc30d8ecccb319d14b5fa6c7",
    "programs": [
      "CRANE MEDICAL HS: CRANE MEDICAL HS - Health Sciences"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>None<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: None / None</li><li>IEP and EL Students: None / None</li></ul></li><li><strong>Priority: </strong>Sibling, Staff Prefernce, Proximity, Tier</li></ul>",
    "fn": lottery(
      SIBLING_LOTTERY_STAGE,
      STAFF_PREFERENCE_LOTTERY_STAGE,
      PROXIMITY_LOTTERY_STAGE,
      TIER_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE,
    )
  },
  "05d573c73ab629b36c6ade44376122bf": {
    "id": "05d573c73ab629b36c6ade44376122bf",
    "programs": [
      "BACK OF THE YARDS HS: BACK OF THE YARDS HS - Dual Language"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>2.5<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: None / None</li><li>IEP and EL Students: None / None</li></ul></li><li><strong>Priority: </strong>Sibling, Elementary Preference<li><strong>Note: </strong>Elem Pref includes: a CPS elementary school with a world language or dual language program</li></ul>",
    "fn": conditional(
      {
        filter: 
          ifHasGrades({gpa: 2.5})
        ,
        fn: lottery(
          SIBLING_LOTTERY_STAGE,
          GENERAL_LOTTERY_STAGE,//TODO add world language/dual ES Programs
        )
      }
    )
  },
  "de50a4fe30bdb8dfa55067bfbd5698b0": {
    "id": "de50a4fe30bdb8dfa55067bfbd5698b0",
    "programs": [
      "BACK OF THE YARDS HS: BACK OF THE YARDS HS - General Education"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>None<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: None / None</li><li>IEP and EL Students: None / None</li></ul></li><li><strong>Priority: </strong>Sibling, Staff Preference, Overlay</li></ul>",
    "fn": lottery(
      SIBLING_LOTTERY_STAGE,
      STAFF_PREFERENCE_LOTTERY_STAGE,
      ATTENDANCE_AREA_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE,
    )
  },
  "ca12679acd2cb337a2777594a026adc0": {
    "id": "ca12679acd2cb337a2777594a026adc0",
    "programs": [
      "BACK OF THE YARDS HS: BACK OF THE YARDS HS - International Baccalaureate (IB)"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Point<li><strong>GPA: </strong>2.5<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: 24% / 24%</li><li>IEP and EL Students: Combo of 48%</li></ul></li><li><strong>Priority: </strong>Attendance Area - additional points</li></ul>",
    "fn": ibPointSystem
  },
  "e4607e7b3d00c3df93975acf98287589": {
    "id": "e4607e7b3d00c3df93975acf98287589",
    "programs": [
      "DISNEY II HS: DISNEY II HS - Magnet"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>None<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: None / None</li><li>IEP and EL Students: None / None</li></ul></li><li><strong>Priority: </strong>Sibling, Staff Pref, Proximity, Tier</li></ul>",
    "fn": lottery(
      SIBLING_LOTTERY_STAGE,
      STAFF_PREFERENCE_LOTTERY_STAGE,
      PROXIMITY_LOTTERY_STAGE,
      TIER_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE,
    )
  },
  "e98439e392303394c5678be595989239": {
    "id": "e98439e392303394c5678be595989239",
    "programs": [
      "DISNEY II HS: DISNEY II HS - Fine Arts & Technology"
    ],
    "desc": "<ul><li><strong>Selection Type: </strong>Lottery<li><strong>GPA: </strong>None<li><strong>HS Admissions Exam Minimum for ELA/Math: </strong><ul><li>General Education and 504 Plan Students: 24% / 24%</li><li>IEP and EL Students: Combo of 48%</li></ul></li><li><strong>Priority: </strong>Continuing, Sibling, Staff Pref, Tier</li></ul>",
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

