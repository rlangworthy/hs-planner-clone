import {
  RequirementFunction,
} from "../../shared/types";

import {
  SuccessChance,
} from "../../shared/enums";


import {
  accept, 
  lottery,
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


} from "./constants";

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
import { store } from "../../shared/redux/store";
const getAttendBoundDict = () => store.getState().data.schoolAttendanceBoundaryTable;
const getSECutoffScores = () => store.getState().data.seCutoffScores;
const getNonSECutoffScores = () => store.getState().data.nonSECutoffScores;

const ifInAttendBound = createIfInAttendBound(getAttendBoundDict);
const ibPointSystem: RequirementFunction = createIBPointSystem(getNonSECutoffScores, ifInAttendBound);
const sePointSystem: RequirementFunction = createSEPointSystem(getSECutoffScores);

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
    "783216956d119ad64639725fa9f4d44b": {
        "desc": "Students who live within the school's attendance boundary can be admitted automatically. This program only accepts students who live within the school's attendance boundary.",
        "programs": [
            "FARRAGUT HS - General Education - Selection",
            "WASHINGTON HS - General Education - Selection",
            "HUBBARD HS - General Education - Selection",
            "KENNEDY HS - General Education - Selection",
            "KELLY HS - General Education - Selection",
            "ROOSEVELT HS - General Education - Selection",
            "BOGAN HS - General Education - Selection",
            "CURIE HS - Fine Arts & Technology - NEIGHBORHOOD - Selection",
            "SENN HS - General Education - Selection"
        ],
      "fn": accept(ifInAttendBound)
    },
    "d3ddea21fb0e360b470bf095ce6bdfef": {
        "desc": "Students are randomly selected by computerized lottery. The lottery is conducted in the following order: proximity, general.",
        "programs": [
            "FARRAGUT HS - JROTC - Selection",
            "ROBESON HS - Allied Health - Selection",
            "DUNBAR HS - Chicago Builds - Selection",
            "SCHURZ HS - AVID - Selection",
            "PROSSER HS - Career Academy - Selection"
        ],
        "fn": lottery(
          PROXIMITY_LOTTERY_STAGE,
          GENERAL_LOTTERY_STAGE
        )
    },
    "618315c228cf8e591d1909fc8ca41206": {
        "desc": "Students are selected on a point system. Points are based on 7th grade final GPA and NWEA MAP scores. The school determines the minimum cutoff score for selections.",
        "programs": [
            "WELLS HS - Pre-Law - Selection",
            "ALCOTT HS - Pre-Engineering - Selection",
            "SULLIVAN HS - Medical & Health Careers - Selection",
            "FARRAGUT HS - Pre-Law - Selection",
            "SOUTH SHORE INTL HS - Medical & Health Careers - Selection",
            "JULIAN HS - Allied Health - Selection",
            "JUAREZ HS - Medical & Health Careers - Selection",
            "BOWEN HS - Pre-Engineering - Selection",
            "WILLIAMS HS - Medical & Health Careers - Selection",
            "CLEMENTE HS - Allied Health - Selection",
            "DUNBAR HS - Allied Health - Selection",
            "CHICAGO VOCATIONAL HS - Medical Assisting - Selection",
            "SCHURZ HS - Pre-Engineering - Selection"
        ],
      "fn": notImplemented
    },
    "5096cc5a97943badb78efd427ee13eb6": {
        "name": "",
        "desc": "Eligible students are randomly selected by computerized lottery.",
        "programs": [
            "STEINMETZ HS - JROTC - Selection"
        ],
      "fn": lottery(
        GENERAL_LOTTERY_STAGE
      )
    },
    "f6b1cadaa52f894d87ad4246bd4c9b0a": {
        "name": "",
        "desc": "Students are randomly selected by computerized lottery. The lottery is conducted in the following order: sibling, proximity, general.",
        "programs": [
            "DOUGLASS HS - General Education - Selection",
            "WILLIAMS HS - General Education - Selection",
            "SENN HS - Digital Journalism - Selection",
            "NORTH LAWNDALE - CHRISTIANA HS - General Education - Selection",
            "NORTH LAWNDALE - COLLINS HS - General Education - Selection"
        ],
      "fn": lottery(
        SIBLING_LOTTERY_STAGE,
        PROXIMITY_LOTTERY_STAGE,
        GENERAL_LOTTERY_STAGE
      )
    },
    "70d67060ab98f9cd752d741b32e207ba": {
        "name": "",
        "desc": "Student selections are based on points. Students are assigned points for 7th grade final GPA and 7th grade stanines. Each school determines a minimum cutoff score for selections.",
        "programs": [
            "ROOSEVELT HS - Medical & Health Careers - Selection",
            "NORTH-GRAND HS - Pre-Engineering - Selection",
            "NORTH-GRAND HS - Allied Health - Selection",
            "SCHURZ HS - Allied Health - Selection",
            "RABY HS - Pre-Law - Selection",
            "MATHER HS - Pre-Law - Selection",
            "ROOSEVELT HS - Cisco Networking - Selection"
        ],
      "fn": notImplemented
    },
    "8f4240fa22d2281a32186e7a65e75011": {
        "name": "",
        "desc": "Spry is a three-year, year-round school. Students are randomly selected by computerized lottery. The lottery is conducted in the following order: sibling, general.",
        "programs": [
            "SPRY HS - General Education - Selection"
        ],
      "fn": lottery(
        SIBLING_LOTTERY_STAGE,
        GENERAL_LOTTERY_STAGE
      )
    },
    "736b7d124b6930cf8ae642563037eeb9": {
        "name": "",
        "desc": "Attendance at an Information Session is not required, but preference is given to students who attend an Information Session.",
        "programs": [
            "GOODE HS - Early College STEM - Application"
        ],
      // TODO: how to handle this??
      "fn": accept(everyone)
    },
    "85463a98c5a7ba21313aacdaeda48cd0": {
        "name": "",
        "desc": "Students are randomly selcted by computerized lottery. The lottery is conducted in the following order: students who live within the school's overlay boundary and attend an Information Session; students who live within the school's network and attend an Information Session; students who live outside of the network and attend an Information Session; students who live within the school's overlay boundary and do not attend an Information Session; students who live within the school's network and do not attend an Information Session; students who live outside of the network and do not attend an Information Session.",
        "programs": [
            "GOODE HS - Early College STEM - Selection"
        ],
      // TODO incorporate info session?
      // TODO what is school's 'network'?
      "fn": notImplemented
    },
    "87bdb6caf5cf899ddb8041511761e58b": {
        "name": "",
        "desc": "Students are randomly selected by computerized lottery. The lottery is conducted in the following order: sibling, general.",
        "programs": [
            "INTRINSIC HS - General Education - Selection",
            "YOUNG WOMENS HS - General Education - Selection",
            "INSTITUTO - HEALTH - General Education - Selection"
        ],
      "fn": lottery(
        SIBLING_LOTTERY_STAGE,
        GENERAL_LOTTERY_STAGE
      )
    },
    "d1b719a6ff9e6979e8f14b2c05b63352": {
        "name": "",
        "desc": "Students are randomly selected by computerized lottery. The lottery is conducted in the following order: Alcott Elementary School students, proximity, general.",
        "programs": [
            "ALCOTT HS - General Education - Selection"
        ],
      "fn": lottery(
        {
          filter: ifStudentAttendsOneOf(ALCOTT_ES_PROGRAM),
          size: LotteryStageSize.LARGE
        },
        SIBLING_LOTTERY_STAGE,
        PROXIMITY_LOTTERY_STAGE,
        GENERAL_LOTTERY_STAGE
      )
    },
    "fd100fd06ddf9bd72e2809f6d659faf2": {
        "name": "",
        "desc": "Students are randomly selected by computerized lottery. The lottery is conducted in the following order: students who live within the attendance boundaries of Chavez, Daley, Hamline, Hedges, Lara, or Seward Elementary Schools; general.",
        "programs": [
            "BACK OF THE YARDS HS - General Education - Selection"
        ],
        // TODO find attendance bound geometries for these schools
        "fn": lottery(
          GENERAL_LOTTERY_STAGE
        )
    },
    "a105512ab5a0eb6536021215baf98ea8": {
        "name": "",
        "desc": "Students are randomly selected by computerized lottery. The lottery is conducted in the following order: students currently enrolled in Chalmers, Dvorak, Herzl, Johnson, or Morton Elementary Schools; sibling; general.",
        "programs": [
            "COLLINS HS - General Education - Selection"
        ],
        "fn": lottery(
          {
            filter: ifStudentAttendsOneOf(
              CHALMERS_ES_PROGRAM, 
              DVORAK_ES_PROGRAM,
              HERZL_ES_PROGRAM,
              JOHNSON_ES_PROGRAM,
              MORTON_ES_PROGRAM
            ),
            size: LotteryStageSize.LARGE
          },
          SIBLING_LOTTERY_STAGE,
          GENERAL_LOTTERY_STAGE
        )
    },
    "65f9f712e101af2ba0f44401e01ca729": {
        "name": "",
        "desc": "Students are selected on a point system. Points are based on 7th grade final GPA and NWEA MAP scores. The school determines the minimum cutoff score for selections. Preference is given to students who live within the school's attendance boundary.",
        "programs": [
            "AUSTIN CCA HS - Pre-Engineering - Selection"
        ],
        "fn": notImplemented
    },
    "536556326f56a1875afccbeedde85fb9": {
        "name": "",
        "desc": "Students are randomly selected by computerized lottery. The lottery is conduced in the following order: sibling, general.",
        "programs": [
            "LEGAL PREP HS - General Education - Selection"
        ],
        "fn": lottery(
          SIBLING_LOTTERY_STAGE,
          GENERAL_LOTTERY_STAGE
        )
    },
  "879a7018afe10fdba3bb57e12bdc8449": {
    "id": "879a7018afe10fdba3bb57e12bdc8449",
    "programs": [
      "ASPIRA - EARLY COLLEGE HS: General Education",
      "ASPIRA - BUSINESS & FINANCE HS: General Education"
    ],
    "desc": "Students are randomly selected by computerized lottery. The lottery is conducted in the following order: students who are currently enrolled in Aspira Haugan Middle School; sibling; general.",
    "fn": lottery(
      {
        filter: ifStudentAttendsOneOf(ASPIRA_MS_PROGRAM),
        size: LotteryStageSize.LARGE
      },
      SIBLING_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE
    )
  },
  "1ce9e8c34ffd852aef20e2d7250cd2af": {
    "id": "1ce9e8c34ffd852aef20e2d7250cd2af",
    "programs": [
      "CICS - ELLISON HS: Science/Technology/Engineering/Math",
      "CICS - NORTHTOWN HS: General Education",
      "CICS - CHICAGOQUEST HS: General Education"
    ],
    "desc": "Students are randomly selected by computerized lottery. The lottery is conducted in the following order: students currently enrolled in one of the following CICS schools: Avalon, Basil, Bucktown, Irving Park, Longwood, Prairie, Washington Park, West Belden, or Wrightwood; sibling; general.",
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
        GENERAL_LOTTERY_STAGE
      )
  },
  "50ed4ff8ae4d625471c35f4fa0d51dea": {
    "id": "50ed4ff8ae4d625471c35f4fa0d51dea",
    "programs": [
      "U OF C - WOODLAWN HS: General Education"
    ],
    "desc": "Students are randomly selected by computerized lottery. The lottery is conducted in the following order: students currently enrolled in University of Chicago Woodlawn, sibling, proximity, general.",
    "fn": lottery(
      {
        filter: ifStudentAttendsOneOf(
          U_OF_C_WOODLAWN_GENERAL_EDUCATION_JOINT_ES_HS_PROGRAM, 
        ),
        size: LotteryStageSize.LARGE
      },
      SIBLING_LOTTERY_STAGE,
      PROXIMITY_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE
    )
  },
  "93c44f16ea5e424e00449d018b357e4c": {
    "id": "93c44f16ea5e424e00449d018b357e4c",
    "programs": [
      "ACERO - GARCIA HS: General Education"
    ],
    "desc": "Students are randomly selected by computerized lottery. The lottery is conducted in the following order: students currently enrolled in 8th grade at an Acero Elementary Charter School, sibling, general.",
    "fn": lottery(
      {
        filter: ifStudentAttendsOneOf(...ACERO_ES_PROGRAMS),
        size: LotteryStageSize.LARGE
      },
      SIBLING_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE
    )
  },
  "8533c48c2dab7aaefba8095ffebbc6c7": {
    "id": "8533c48c2dab7aaefba8095ffebbc6c7",
    "programs": [
      "ACERO - SOTO HS: General Education"
    ],
    "desc": "Students are randomly selected by computerized lottery. The lottery is conducted in the following order: students currently enrolled in eighth grade at an Acero Elementary Charter School, sibling, general.",
    "fn": lottery(
      {
        filter: ifStudentAttendsOneOf(...ACERO_ES_PROGRAMS),
        size: LotteryStageSize.LARGE
      },
      SIBLING_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE
    )
  },
  "f20ca1ea9f236a3dba8a031b1534ea9d": {
    "id": "f20ca1ea9f236a3dba8a031b1534ea9d",
    "programs": [
      "CHICAGO VOCATIONAL HS: Agricultural Sciences",
      "CHICAGO VOCATIONAL HS: Carpentry",
      "CHICAGO VOCATIONAL HS: Cosmetology",
      "CHICAGO VOCATIONAL HS: Culinary Arts",
      "CHICAGO VOCATIONAL HS: Diesel Technology",
      "CHICAGO VOCATIONAL HS: Early College STEM",
      "RICHARDS HS: Accounting",
      "RICHARDS HS: Culinary Arts",
      "NORTH-GRAND HS: Culinary Arts",
      "BOGAN HS: Entrepreneurship",
      "FARRAGUT HS: Automotive Technology",
      "FENGER HS: Carpentry",
      "FENGER HS: Culinary Arts",
      "FOREMAN HS: Digital Media",
      "FOREMAN HS: Web Design",
      "HARLAN HS: Digital Media",
      "HARLAN HS: Web Design",
      "HARPER HS: Culinary Arts",
      "HARPER HS: Digital Media",
      "HYDE PARK HS: Broadcast Technology",
      "HYDE PARK HS: Digital Media",
      "KELLY HS: Digital Media",
      "MANLEY HS: Culinary Arts",
      "MARSHALL HS: Agricultural Sciences",
      "MARSHALL HS: Culinary Arts",
      "MATHER HS: Game Programming & Web Design",
      "PHILLIPS HS: Digital Media",
      "ROOSEVELT HS: Culinary Arts",
      "ROOSEVELT HS: Early Childhood",
      "ROOSEVELT HS: Game Programming",
      "SCHURZ HS: Accounting & Entrepreneurship",
      "SCHURZ HS: Automotive Technology",
      "SCHURZ HS: Digital Media",
      "SULLIVAN HS: Accounting",
      "TILDEN HS: Culinary Arts",
      "WELLS HS: Game Programming",
      "CURIE HS: Accounting",
      "CURIE HS: Architecture",
      "CURIE HS: Automotive Technology",
      "CURIE HS: Broadcast Technology",
      "CURIE HS: Culinary Arts",
      "CURIE HS: Digital Media",
      "CURIE HS: Early Childhood & Teaching",
      "CURIE HS: Game Programming & Web Design",
      "CLEMENTE HS: Broadcast Technology",
      "CLEMENTE HS: Culinary Arts",
      "JULIAN HS: Broadcast Technology",
      "JULIAN HS: Digital Media",
      "JULIAN HS: Entrepreneurship",
      "JULIAN HS: Game Programming",
      "JUAREZ HS: Architecture",
      "JUAREZ HS: Automotive Technology",
      "JUAREZ HS: Culinary Arts",
      "JUAREZ HS: Game Programming & Web Design",
      "BOWEN HS: Manufacturing",
      "RABY HS: Broadcast Technology",
      "RABY HS: Culinary Arts",
      "RABY HS: Entrepreneurship",
      "UPLIFT HS: Teaching",
      "AUSTIN CCA HS: Manufacturing"
    ],
    "desc": "Students are randomly selected by computerized lottery. General Education and 504 Plan students: Preference is given to students with percentiles of 24 and above on the NWEA MAP in reading and math. A total of 30% of the seats will be made available to attendance area applicants.IEP and EL students: Preference is given to students with combined NWEA MAP scores that equal 48 or above.Note: Repeating 8th graders and students pushed into 8th grade from 6th grade due to age requirements qualify for selection but will be placed in a lower preference group.",
      // custom req fn -- req fn builders a little ungainly for handling
      // this kind of branching.
      "fn": (s, p) => {
        if( ifInAttendBound(s,p) ) {
          return SuccessChance.LIKELY;
        }
        if( ifSkipped7OrRepeated8(s,p) ) {
          return SuccessChance.UNLIKELY
        } else if ( ifIEPorEL(s,p) ) {
          const passesGrades = ifHasGrades({nweaCombined: 48})(s, p);
          if( passesGrades ) { 
            return SuccessChance.LIKELY;
          } else {
            return SuccessChance.UNCERTAIN;
          }

        } else {
          const passesGrades = ifHasGrades({nweaBoth: 24})(s, p);
          if ( passesGrades ) {
            return SuccessChance.LIKELY;
          } else {
            return SuccessChance.UNCERTAIN;
          }
        }
      }
  },
  "ff47e67648939ff64830ddf7f1ad5ecb": {
    "id": "ff47e67648939ff64830ddf7f1ad5ecb",
    "programs": [
      "CHICAGO VOCATIONAL HS: General Education",
      "FENGER HS: General Education",
      "FOREMAN HS: General Education",
      "GAGE PARK HS: General Education",
      "HARPER HS: General Education",
      "HIRSCH HS: General Education",
      "MANLEY HS: General Education",
      "MARSHALL HS: General Education",
      "SCHURZ HS: General Education",
      "JULIAN HS: General Education",
      "HOPE HS: General Education",
      "BOWEN HS: General Education",
      "INFINITY HS: Science/Technology/Engineering/Math",
      "ORR HS: General Education",
      "AUSTIN CCA HS: General Education"
    ],
    "desc": "Students who live within the school's attendance boundary can be admitted automatically.Students who live outside of the school's attendance boundary are randomly selected by computerized lottery. The lottery is conducted in the following order: sibling, general.",
      "fn": conditional(
        {
          filter: ifInAttendBound,
          fn: accept(everyone)
        },
        {
          filter: everyone,
          fn: lottery(
            SIBLING_LOTTERY_STAGE,
            GENERAL_LOTTERY_STAGE
          )
        }
      )
  },
  "0a48374cc62558e04883ad444c85d185": {
    "id": "0a48374cc62558e04883ad444c85d185",
    "programs": [
      "JONES HS: Pre-Engineering",
      "JONES HS: Pre-Law",
      "HANCOCK HS: Pre-Engineering",
      "HANCOCK HS: Pre-Law",
      "VON STEUBEN HS: Science",
      "CHICAGO AGRICULTURE HS: Agricultural Sciences",
      "CLARK HS: Early College STEM",
      "CRANE MEDICAL HS: Health Sciences",
      "DISNEY II HS: Fine Arts & Technology"
    ],
    "desc": "General Education and 504 Plan students: Minimum percentile of 24 in both reading and math on NWEA MAP.IEP and EL students: Minimum combined percentile of 48 in reading and math on NWEA MAP.",
        "fn": conditional(
          {
            filter: ifIEPorEL,
            fn: accept(ifHasGrades({
              nweaCombined: 48,
            }))
          },
          {
            filter: everyone,
            fn: accept(ifHasGrades({
              nweaBoth: 24,
            }))
          }
        )
  },
  "be95903c95005a6422740fb8d3937098": {
    "id": "be95903c95005a6422740fb8d3937098",
    "programs": [
      "JONES HS: Pre-Engineering",
      "JONES HS: Pre-Law",
      "HANCOCK HS: Pre-Engineering",
      "HANCOCK HS: Pre-Law"
    ],
    "desc": "Eligible students are selected on a point system based on NWEA MAP scores and 7th grade final GPA. Students are ranked and selected from high to low. Students residing within the attendance overlay boundary of the school are selected first.",
    "fn": notImplemented
  },
  "91648015588db93f700a12d6e2825a41": {
    "id": "91648015588db93f700a12d6e2825a41",
    "programs": [
      "JONES HS: Selective Enrollment High School",
      "PAYTON HS: Selective Enrollment High School",
      "WESTINGHOUSE HS: Selective Enrollment High School",
      "HANCOCK HS: Selective Enrollment High School",
      "LANE TECH HS: Selective Enrollment High School",
      "BROOKS HS: Selective Enrollment High School",
      "KING HS: Selective Enrollment High School",
      "YOUNG HS: Selective Enrollment High School",
      "LINDBLOM HS: Selective Enrollment High School",
      "SOUTH SHORE INTL HS: Selective Enrollment High School"
    ],
    "desc": "General Education and 504 Plan students: Minimum percentile of 24 in both reading and math on NWEA MAP.IEP and EL students: Minimum combined percentile of 48 in reading and math on NWEA MAP.Testing is required for all eligible applicants.",
        "fn": conditional(
          {
            filter: ifIEPorEL,
            fn: accept(ifHasGrades({
              nweaCombined: 48,
            }))
          },
          {
            filter: everyone,
            fn: accept(ifHasGrades({
              nweaBoth: 24,
            }))
          }
        )
  },
  "5431b69db92fda0a54a40471ceeaffbe": {
    "id": "5431b69db92fda0a54a40471ceeaffbe",
    "programs": [
      "JONES HS: Selective Enrollment High School",
      "WESTINGHOUSE HS: Selective Enrollment High School",
      "HANCOCK HS: Selective Enrollment High School",
      "NORTHSIDE PREP HS: Selective Enrollment High School",
      "KING HS: Selective Enrollment High School",
      "SOUTH SHORE INTL HS: Selective Enrollment High School"
    ],
    "desc": "Eligible students are selected on a point system with a maximum of 900 points. Students are assigned points for 7th grade final grades, NWEA MAP scores, and the admissions test, each worth a maximum of 300 points. The first 30% of the available seats are filled by the top scoring students based on rank score; the remaining seats are equally distributed among the four socio-economic tiers and filled by the top-scoring students in each tier.",
    "fn": sePointSystem
  },
  "533b612ef295f4f1434c15d3788f2ac7": {
    "id": "533b612ef295f4f1434c15d3788f2ac7",
    "programs": [
      "PROSSER HS: International Baccalaureate (IB)",
      "AMUNDSEN HS: International Baccalaureate (IB)",
      "BOGAN HS: International Baccalaureate (IB)",
      "KELLY HS: International Baccalaureate (IB)",
      "KENNEDY HS: General Education",
      "KENNEDY HS: International Baccalaureate (IB)",
      "MORGAN PARK HS: International Baccalaureate (IB)",
      "SCHURZ HS: International Baccalaureate (IB)",
      "STEINMETZ HS: International Baccalaureate (IB)",
      "TAFT HS: International Baccalaureate (IB)",
      "WASHINGTON HS: International Baccalaureate (IB)",
      "JUAREZ HS: International Baccalaureate (IB)",
      "OGDEN HS: International Baccalaureate (IB)",
      "SOUTH SHORE INTL HS: International Baccalaureate (IB)",
      "BACK OF THE YARDS HS: International Baccalaureate (IB)"
    ],
    "desc": "General Education and 504 Plan students: Minimum percentile of 24 in both reading and math on NWEA MAP and minimum 2.5 GPA in 7th grade.IEP and EL students: Minimum combined percentile of 48 in reading and math on NWEA MAP and minimum 2.5 GPA in 7th grade.Attendance at an Information Session is required for all eligible applicants.",
        "fn": conditional(
          {
            filter: ifIEPorEL,
            fn: accept(ifHasGrades({
              nweaCombined: 48,
              gpa: 2.5
            }))
          },
          {
            filter: everyone,
            fn: accept(ifHasGrades({
              nweaBoth: 24,
              gpa: 2.5
            }))
          }
        )
  },
  "aac7cb82120d654deed9d6b90099ad43": {
    "id": "aac7cb82120d654deed9d6b90099ad43",
    "programs": [
      "PROSSER HS: International Baccalaureate (IB)",
      "BOGAN HS: International Baccalaureate (IB)",
      "KELLY HS: International Baccalaureate (IB)",
      "KENNEDY HS: International Baccalaureate (IB)",
      "SCHURZ HS: International Baccalaureate (IB)",
      "STEINMETZ HS: International Baccalaureate (IB)",
      "LINCOLN PARK HS: International Baccalaureate (IB)",
      "WASHINGTON HS: International Baccalaureate (IB)",
      "HUBBARD HS: International Baccalaureate (IB)",
      "CLEMENTE HS: International Baccalaureate (IB)",
      "JUAREZ HS: International Baccalaureate (IB)",
      "BRONZEVILLE HS: International Baccalaureate (IB)",
      "SOUTH SHORE INTL HS: International Baccalaureate (IB)",
      "BACK OF THE YARDS HS: International Baccalaureate (IB)"
    ],
    "desc": "Eligible students are selected on a point system. Points are based on NWEA MAP scores and 7th grade GPA. Students who live within the school's attendance boundary will be given 50 additional points. The school determines the minimum cutoff score for selections.",
    "fn": ibPointSystem
  },
  "a6d13f7782335a549d5570b549593ae8": {
    "id": "a6d13f7782335a549d5570b549593ae8",
    "programs": [
      "PAYTON HS: Selective Enrollment High School"
    ],
    "desc": "Eligible students are selected on a point system with a maximum of 900 points. Points are based on 7th grade final grades, NWEA MAP scores, and the admissions test, each worth a maximum of 300 points. The first 30% of the available seats are filled by the top scoring students based on rank score; the remaining seats are equally distributed among the four socio-economic tiers and filled by the top-scoring students in each tier.",
    "fn": sePointSystem
  },
  "7f6b2cf9083a60bc8f3fb117aed8aad5": {
    "id": "7f6b2cf9083a60bc8f3fb117aed8aad5",
    "programs": [
      "RICHARDS HS: General Education",
      "TILDEN HS: General Education",
      "SOLORIO HS: General Education"
    ],
    "desc": "Students who live within the school's attendance boundary can be admitted automatically.Students who live outside of the school's attendance boundary are randomly selected by computerized lottery.",
      "fn": conditional(
        {
          filter: ifInAttendBound,
          fn: accept(everyone)
        },
        {
          filter: everyone,
          fn: lottery(
            GENERAL_LOTTERY_STAGE
          )
        }
      )
  },
  "4135e6341f9465c5a7398fd3935ca278": {
    "id": "4135e6341f9465c5a7398fd3935ca278",
    "programs": [
      "NORTH-GRAND HS: General Education",
      "ROBESON HS: General Education",
      "STEINMETZ HS: General Education"
    ],
    "desc": "Students who live within the school's attendance boundary can be admitted automatically.Eligible students who live outside of the school's attendance boundary are randomly selected by computerized lottery. The lottery is conducted in the following order: sibling, general.",
      "fn": conditional(
        {
          filter: ifInAttendBound,
          fn: accept(everyone)
        },
        {
          filter: everyone,
          fn: lottery(
            SIBLING_LOTTERY_STAGE,
            GENERAL_LOTTERY_STAGE
          )
        }
      )
  },
  "d197c70a1f66489e4fb8a1e8357b5d43": {
    "id": "d197c70a1f66489e4fb8a1e8357b5d43",
    "programs": [
      "SIMEON HS: Career Academy"
    ],
    "desc": "Eligible students are selected on a point system. Points are based on the combined NWEA MAP scores and the interview.",
    "fn": notImplemented
  },
  "d00aa9a9fd5f38a78517ef3d60ddaa39": {
    "id": "d00aa9a9fd5f38a78517ef3d60ddaa39",
    "programs": [
      "WESTINGHOUSE HS: Career Academy"
    ],
    "desc": "General Education and 504 Plan students: Minimum percentile of 24 in both reading and math on NWEA MAP, minimum 3.0 GPA in 7th grade, and 7th grade minimum attendance percentage of 95.IEP and EL students: Minimum combined percentile of 48 in reading and math on NWEA MAP, minimum 3.0 GPA in 7th grade, and 7th grade minimum attendance percentage of 95.",
        "fn": conditional(
          {
            filter: ifIEPorEL,
            fn: accept(ifHasGrades({
              nweaCombined: 48,
              gpa: 3.0,
              attendance: 95
            }))
          },
          {
            filter: everyone,
            fn: accept(ifHasGrades({
              nweaBoth: 24,
              gpa: 3.0,
              attendance: 95
            }))
          }
        )
  },
  "7d739a7671ca60aeee72cf4dd6972a6a": {
    "id": "7d739a7671ca60aeee72cf4dd6972a6a",
    "programs": [
      "WESTINGHOUSE HS: Career Academy"
    ],
    "desc": "Eligible students are randomly selected by compterized lottery. The lottery is conducted in the following order: proximity, general.",
      "fn": lottery(
        PROXIMITY_LOTTERY_STAGE,
        GENERAL_LOTTERY_STAGE,
      )
  },
  "81d8618c886c7e6c4befe2e9084fa465": {
    "id": "81d8618c886c7e6c4befe2e9084fa465",
    "programs": [
      "AMUNDSEN HS: Game Programming & Web Design",
      "STEINMETZ HS: Digital Media"
    ],
    "desc": "Students are randomly selected by computerized lottery.General Education and 504 Plan students: Preference is given to students with percentiles of 24 and above on the NWEA MAP in reading and math. A total of 30% of the seats will be made available to attendance area applicants.IEP and EL students: Preference is given to students with combined NWEA MAP scores that equal 48 or above.Note: Repeating 8th graders and students pushed into 8th grade from 6th grade due to age requirements qualify for selection but will be placed in a lower preference group.",
      // custom req fn -- req fn builders a little ungainly for handling
      // this kind of branching.
      "fn": (s, p) => {
        if( ifInAttendBound(s,p) ) {
          return SuccessChance.LIKELY;
        }
        if( ifSkipped7OrRepeated8(s,p) ) {
          return SuccessChance.UNLIKELY
        } else if ( ifIEPorEL(s,p) ) {
          const passesGrades = ifHasGrades({nweaCombined: 48})(s, p);
          if( passesGrades ) { 
            return SuccessChance.LIKELY;
          } else {
            return SuccessChance.UNCERTAIN;
          }

        } else {
          const passesGrades = ifHasGrades({nweaBoth: 24})(s, p);
          if ( passesGrades ) {
            return SuccessChance.LIKELY;
          } else {
            return SuccessChance.UNCERTAIN;
          }
        }
      }
  },
  "9577eb2bbb20c7dd18219dc8dd34b213": {
    "id": "9577eb2bbb20c7dd18219dc8dd34b213",
    "programs": [
      "BOGAN HS: Accounting"
    ],
    "desc": "Students are randomly selected by computerized lottery. General Education and 504 Plan Students: Preference is given to students with percentiles of 24 and above on the NWEA MAP in reading and math. A total of 30% of the seats will be made available to attendance area applicants.IEP and EL students: Preference is given to students with combined NWEA MAP scores that equal 48 or above.Note: Repeating 8th graders and students pushed into 8th grade from 6th grade due to age requirements qualify for selection but will be placed in a lower preference group.",
      // custom req fn -- req fn builders a little ungainly for handling
      // this kind of branching.
      "fn": (s, p) => {
        if( ifInAttendBound(s,p) ) {
          return SuccessChance.LIKELY;
        }
        if( ifSkipped7OrRepeated8(s,p) ) {
          return SuccessChance.UNLIKELY
        } else if ( ifIEPorEL(s,p) ) {
          const passesGrades = ifHasGrades({nweaCombined: 48})(s, p);
          if( passesGrades ) { 
            return SuccessChance.LIKELY;
          } else {
            return SuccessChance.UNCERTAIN;
          }

        } else {
          const passesGrades = ifHasGrades({nweaBoth: 24})(s, p);
          if ( passesGrades ) {
            return SuccessChance.LIKELY;
          } else {
            return SuccessChance.UNCERTAIN;
          }
        }
      }
  },
  "abc2682d6f919356f6a88a788fa844ae": {
    "id": "abc2682d6f919356f6a88a788fa844ae",
    "programs": [
      "BOGAN HS: General Education"
    ],
    "desc": "Students who live within the school's attendance boundary have no eligibility requirements.All applicants who live outside of the school's attendance boundary: Minimum GPA of 2.5 in 7th grade and 7th grade minimum attendance percentage of 93.",
      "fn": conditional(
        {
          filter: ifInAttendBound,
          fn: accept(everyone)
        },
        {
          filter: everyone,
          fn: accept(ifHasGrades({
            gpa: 2.5,
            attendance: 93
          }))
        }
      )
  },
  "484e8b5e43183ac6bbcdf8a7c3714e31": {
    "id": "484e8b5e43183ac6bbcdf8a7c3714e31",
    "programs": [
      "BOGAN HS: General Education"
    ],
    "desc": "Students who live within the school's attendance boundary have no eligibility requirements and can be admitted automatically.Eligible students who live outside of the school's attendance boundary are randomly selected by computerized lottery.",
      "fn": conditional(
        {
          filter: ifInAttendBound,
          fn: accept(everyone)
        },
        {
          filter: everyone,
          fn: lottery(
            GENERAL_LOTTERY_STAGE
          )
        }
      )
  },
  "8f3ccb74778282abfef8bf72d76518ca": {
    "id": "8f3ccb74778282abfef8bf72d76518ca",
    "programs": [
      "FARRAGUT HS: International Baccalaureate (IB)",
      "HYDE PARK HS: International Baccalaureate (IB)",
      "CURIE HS: International Baccalaureate (IB)",
      "CLEMENTE HS: International Baccalaureate (IB)",
      "BRONZEVILLE HS: International Baccalaureate (IB)"
    ],
    "desc": "General Education and 504 Plan students: Minimum percentile of 24 in both reading and math on NWEA MAP and minimum 2.5 GPA in 7th grade.IEP and EL students: Minimum combined percentile of 48 in reading and math on NWEA MAP and minimum 2.5 GPA in 7th grade.Attendance is required at an Information Session for all eligible applicants.",
        "fn": conditional(
          {
            filter: ifIEPorEL,
            fn: accept(ifHasGrades({
              nweaCombined: 48,
              gpa: 2.5
            }))
          },
          {
            filter: everyone,
            fn: accept(ifHasGrades({
              nweaBoth: 24,
              gpa: 2.5
            }))
          }
        )
  },
  "95f2aa5966a32abd7c66ff17401c2563": {
    "id": "95f2aa5966a32abd7c66ff17401c2563",
    "programs": [
      "FARRAGUT HS: JROTC",
      "SCHURZ HS: AVID"
    ],
    "desc": "All applicants: Minimum 2.0 GPA in 7th grade and 7th grade minimum attendance percentage of 85.",
      "fn": accept(ifHasGrades({
        gpa: 2.0,
        attendance: 85
      }))
  },
  "394b2ab44d3edd7932e911773190e3fb": {
    "id": "394b2ab44d3edd7932e911773190e3fb",
    "programs": [
      "FARRAGUT HS: JROTC",
      "ROBESON HS: Allied Health",
      "SCHURZ HS: AVID"
    ],
    "desc": "Eligible students are randomly selected by computerized lottery. The lottery is conducted in the following order: proximity, general.",
      "fn": lottery(
        PROXIMITY_LOTTERY_STAGE,
        GENERAL_LOTTERY_STAGE,
      )
  },
  "58b93dcecb9a7394e8533ae1aea76b29": {
    "id": "58b93dcecb9a7394e8533ae1aea76b29",
    "programs": [
      "FENGER HS: Honors"
    ],
    "desc": "General Education and 504 Plan students: Minimum percentile of 50 in both reading and math on NWEA MAP, and minimum 2.0 GPA in 7th grade.IEP and EL students: Minimum combined percentile of 100 in reading and math on NWEA MAP, and minimum 2.0 GPA in 7th grade.",
        "fn": conditional(
          {
            filter: ifIEPorEL,
            fn: accept(ifHasGrades({
              nweaCombined: 100,
              gpa: 2.0
            }))
          },
          {
            filter: everyone,
            fn: accept(ifHasGrades({
              nweaBoth: 50,
              gpa: 2.0
            }))
          }
        )
  },
  "256c0431ffbca307c8ee290e713123a5": {
    "id": "256c0431ffbca307c8ee290e713123a5",
    "programs": [
      "HYDE PARK HS: General Education"
    ],
    "desc": "Students who live within the school's attendance area can be admitted automatically.Students who live outside of the school's attendance boundary are randomly selected by computerized lottery. The lottery is conducted in the following order: students currently enrolled in Carnegie Elementary School, sibling, general.",
      "fn": lottery(
        {
          filter: ifStudentAttendsOneOf(...CARNEGIE_ES_PROGRAMS),
          size: LotteryStageSize.LARGE
        },
        SIBLING_LOTTERY_STAGE,
        GENERAL_LOTTERY_STAGE
      )
  },
  "2a0bc8e57026e371be1ef1a488163abd": {
    "id": "2a0bc8e57026e371be1ef1a488163abd",
    "programs": [
      "KELLY HS: AVID"
    ],
    "desc": "Eligible students are selected on a point system. Points are based on teacher recommendation letter(s), the essay, and the interview.",
    "fn": notImplemented
  },
  "b64c24c07288e5ad3949ba2d6fb33b2d": {
    "id": "b64c24c07288e5ad3949ba2d6fb33b2d",
    "programs": [
      "MATHER HS: General Education"
    ],
    "desc": "Students who live within the school's attendance boundary can be admitted automatically.Students who live outside of the school's attendance boundary are randomly selected by computerized lottery. The lottery is conducted in the following order: Students currently enrolled in Boone, Clinton, Jamieson, Peterson, Rogers, or West Ridge; sibling; general.",
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
                BOONE_ES_PROGRAM,
                CLINTON_ES_PROGRAM,
                JAMIESON_ES_PROGRAM,
                PETERSON_ES_PROGRAM,
                ROGERS_ES_PROGRAM,
                WEST_RIDGE_ES_PROGRAM,
              ),
              size: LotteryStageSize.LARGE
            },
            SIBLING_LOTTERY_STAGE,
            GENERAL_LOTTERY_STAGE
          )
        }
      )
  },
  "0161de8a29d2c7e258b53297e2f82d8a": {
    "id": "0161de8a29d2c7e258b53297e2f82d8a",
    "programs": [
      "PHILLIPS HS: General Education",
      "CLEMENTE HS: General Education",
      "MULTICULTURAL HS: Fine & Performing Arts",
      "WORLD LANGUAGE HS: General Education"
    ],
    "desc": "Students who live within the school's attendance boundary have no eligibility requirements and can be admitted automatically.Eligible students who live outside of the school's attendance boundary are randomly selected by computerized lottery. The lottery is conducted in the following order: sibling, general.",
      "fn": conditional(
        {
          filter: ifInAttendBound,
          fn: accept(everyone)
        },
        {
          filter: everyone,
          fn: lottery(
            SIBLING_LOTTERY_STAGE,
            GENERAL_LOTTERY_STAGE
          )
        }
      )
  },
  "22c191a196cc6cf2b5450138ac49347e": {
    "id": "22c191a196cc6cf2b5450138ac49347e",
    "programs": [
      "SCHURZ HS: Dual Language",
      "BACK OF THE YARDS HS: Dual Language"
    ],
    "desc": "Eligible students are randomly selected by computerized lottery. The lottery is conducted in the following order: sibling, students currently enrolled in a CPS elementary school with a world language or dual language program, general.",
     // TODO implement if and when we have application requirements; getting hold of an updated list of ES schools with world language programs is also difficult.
    "fn": notImplemented
  },
  "25695a38888ae79b4b319f55325a8fc8": {
    "id": "25695a38888ae79b4b319f55325a8fc8",
    "programs": [
      "SENN HS: Dance",
      "SENN HS: Music",
      "SENN HS: Theatre",
      "CURIE HS: Dance",
      "CURIE HS: Music"
    ],
    "desc": "General Education and 504 Plan students: Minimum percentile of 24 in both reading and math on NWEA MAP.IEP and EL students: Minimum combined percentile of 48 in reading and math on NWEA MAP.An audition is required for all eligible applicants.",
        "fn": conditional(
          {
            filter: ifIEPorEL,
            fn: accept(ifHasGrades({
              nweaCombined: 48,
            }))
          },
          {
            filter: everyone,
            fn: accept(ifHasGrades({
              nweaBoth: 24
            }))
          }
        )
  },
  "2e9faab0334f16aee514c34ebc1b64f8": {
    "id": "2e9faab0334f16aee514c34ebc1b64f8",
    "programs": [
      "SENN HS: Dance",
      "SENN HS: Music",
      "SENN HS: Theatre",
      "CURIE HS: Dance",
      "CURIE HS: Music"
    ],
    "desc": "Eligible students are selected on a point system. Points are based on the student's NWEA MAP scores in reading and math, 7th grade final (cumulative) grades, and the audition.",
    "fn": notImplemented
  },
  "60e87e808d7bef3e367ab81e2a91e97a": {
    "id": "60e87e808d7bef3e367ab81e2a91e97a",
    "programs": [
      "SENN HS: International Baccalaureate (IB)"
    ],
    "desc": "General Education/504 Plan students: Minimum percentile of 24 in both reading and math on NWEA MAP and minimum 2.5 GPA in 7th grade.IEP and EL students: Minimum combined percentile of 48 in reading and math on NWEA MAP and minimum 2.5 GPA in 7th grade.Attendance at an Information Session is required for all eligible applicants.",
        "fn": conditional(
          {
            filter: ifIEPorEL,
            fn: accept(ifHasGrades({
              nweaCombined: 48,
              gpa: 2.5
            }))
          },
          {
            filter: everyone,
            fn: accept(ifHasGrades({
              nweaBoth: 24,
              gpa: 2.5
            }))
          }
        )
  },
  "fe8d319e29e73aa0ac0cf0bf1e3b3909": {
    "id": "fe8d319e29e73aa0ac0cf0bf1e3b3909",
    "programs": [
      "SENN HS: Visual Arts"
    ],
    "desc": "General Education and 504 Plan students: Minimum percentile of 24 in both reading and math on NWEA MAP.IEP and EL students: Minimum combined percentile of 48 in reading and math on NWEA MAP.A portfolio review is required for all eligible applicants.",
        "fn": conditional(
          {
            filter: ifIEPorEL,
            fn: accept(ifHasGrades({
              nweaCombined: 48,
            }))
          },
          {
            filter: everyone,
            fn: accept(ifHasGrades({
              nweaBoth: 24
            }))
          }
        )
  },
  "07bc9ef974959f3e241aa2c8dd6909a6": {
    "id": "07bc9ef974959f3e241aa2c8dd6909a6",
    "programs": [
      "SENN HS: Visual Arts"
    ],
    "desc": "Eligible students are selected on a point system. Points are based on the student's NWEA MAP scores in reading and math, 7th grade final (cumulative) grades, and the portfolio review.",
    "fn": notImplemented
  },
  "166b2c2699276401188c5f1a52f4505b": {
    "id": "166b2c2699276401188c5f1a52f4505b",
    "programs": [
      "STEINMETZ HS: JROTC"
    ],
    "desc": "General Education and 504 Plan students: Minimum percentile of 45 in both reading and math on NWEA MAP and minimum 2.0 GPA in 7th grade.IEP and EL students: Minimum combined percentile of 90 in reading and math on NWEA MAP, and minimum 2.0 GPA in 7th grade.",
      "fn": conditional(
        {
          filter: ifIEPorEL,
          fn: accept(ifHasGrades({
            nweaCombined: 90,
            gpa: 2.0,
          }))
        },
        {
          filter: everyone,
          fn: accept(ifHasGrades({
            nweaBoth: 45,
            gpa: 2.0,
          }))
        }
      )
  },
  "aa1c5d5c87446be3413ddbb110e63e59": {
    "id": "aa1c5d5c87446be3413ddbb110e63e59",
    "programs": [
      "SULLIVAN HS: General Education"
    ],
    "desc": "Students who live within the school's attendance boundary can be admitted automatically.Students who live outside of the school's attendance boundary are randomly selected by computerized lottery. The lottery is conducted in the following order: students attending Boone, Field, Gale, Hayt, Jordan, Kilmer, McCutcheon, McPherson, or West Ridge Elementary Schools; sibling; general.",
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
                BOONE_ES_PROGRAM,
                FIELD_ES_PROGRAM,
                GALE_ES_PROGRAM,
                HAYT_ES_PROGRAM,
                JORDAN_ES_PROGRAM,
                KILMER_ES_PROGRAM,
                MCCUTCHEON_ES_PROGRAM,
                MCPHERSON_ES_PROGRAM,
                WEST_RIDGE_ES_PROGRAM
              ),
              size: LotteryStageSize.LARGE
            },
            SIBLING_LOTTERY_STAGE,
            GENERAL_LOTTERY_STAGE
          )
        }
      )
  },
  "fc080e1ea8e3103d38a6970255becd5a": {
    "id": "fc080e1ea8e3103d38a6970255becd5a",
    "programs": [
      "TAFT HS: NJROTC"
    ],
    "desc": "Eligible students are selected on a point system. Points are based on the student's NWEA MAP scores and the interview.",
    "fn": notImplemented
  },
  "e64b5c5d6ac69f8bd45231e20ca63aed": {
    "id": "e64b5c5d6ac69f8bd45231e20ca63aed",
    "programs": [
      "VON STEUBEN HS: Scholars"
    ],
    "desc": "General Education and 504 Plan students: Minimum percentile of 60 in both reading and math on NWEA MAP and minimum 3.0 GPA in 7th grade.IEP and EL students: Minimum combined percentile of 120 in reading and math on NWEA MAP and minimum 3.0 GPA in 7th grade.Eligible students must submit teacher recommendations and an essay. Online applicants will be prompted to upload their documents via the online application site. Paper applicants should visit www.vonsteuben.org for submission details (click 'Apply' and 'Scholars Program').Applicants who are not eligible will automatically be included in the computerized lottery selection process for the Von Steuben Science Program.",
      "fn": conditional(
        {
          filter: ifIEPorEL,
          fn: accept(ifHasGrades({
            nweaCombined: 120,
            gpa: 3.0
          }))
        },
        {
          filter: everyone,
          fn: accept(ifHasGrades({
            nweaBoth: 60,
            gpa: 3.0,
          }))
        }
      )
  },
  "531ae8396ef38697b0d289d9282a0f84": {
    "id": "531ae8396ef38697b0d289d9282a0f84",
    "programs": [
      "VON STEUBEN HS: Scholars"
    ],
    "desc": "Eligible students are selected on a point system. Points are based on the teacher recommendations and the essay.",
    "fn": notImplemented
  },
  "1186691804ec1aadb878d4be54269174": {
    "id": "1186691804ec1aadb878d4be54269174",
    "programs": [
      "VON STEUBEN HS: Science",
      "CHICAGO AGRICULTURE HS: Agricultural Sciences",
      "CLARK HS: Early College STEM",
      "CRANE MEDICAL HS: Health Sciences"
    ],
    "desc": "Eligible students are randomly selected by computerized lottery. The lottery is conducted in the following order: sibling, proximity, tiers.",
      "fn": lottery(
        SIBLING_LOTTERY_STAGE,
        PROXIMITY_LOTTERY_STAGE,
        TIER_LOTTERY_STAGE
      )
  },
  "fe44452f3084984bede04dc96152eabf": {
    "id": "fe44452f3084984bede04dc96152eabf",
    "programs": [
      "LINCOLN PARK HS: Drama"
    ],
    "desc": "General Education and 504 Plan students: Minimum percentile of 60 in both reading and math on NWEA MAP and minimum 2.75 GPA in 7th grade.IEP and EL students: Minimum combined percentile of 120 in reading and math on NWEA MAP and minimum 2.75 GPA in 7th grade.An audition is required for eligible applicants.",
      "fn": conditional(
        {
          filter: ifIEPorEL,
          fn: accept(ifHasGrades({
            nweaCombined: 120,
            gpa: 2.75
          }))
        },
        {
          filter: everyone,
          fn: accept(ifHasGrades({
            nweaBoth: 60,
            gpa: 2.75,
          }))
        }
      )
  },
  "d801dab5b4c1b17fd4f87ff20b0a8cbc": {
    "id": "d801dab5b4c1b17fd4f87ff20b0a8cbc",
    "programs": [
      "LINCOLN PARK HS: Honors/Double Honors"
    ],
    "desc": "Students who live within the school's attendance boundary have no eligibility requirements and can be admitted automatically.Eligible students who live outside the school's attendance boundary are selected on a point system. Points are based on the student's NWEA MAP scores in reading and math and 7th grade GPA.",
      "fn": conditional(
        {
          filter: ifInAttendBound,
          fn: accept(everyone)
        },
        {
          filter: everyone,
          fn:  notImplemented
        }
      )
  },
  "2868d8b48df2bb6085568f0889ff859d": {
    "id": "2868d8b48df2bb6085568f0889ff859d",
    "programs": [
      "LINCOLN PARK HS: International Baccalaureate (IB)"
    ],
    "desc": "General Education and 504 Plan students: Minimum percentile of 24 in both reading and math on NWEA MAP and minimum 2.5 GPA in 7th grade.IEP and EL students: Minimum combined percentile of 48 in reading and math on NWEA MAP and minimum 2.5 GPA in 7th grade.Attendance at an Information Session is required for all eliglble applicants.",
      "fn": conditional(
        {
          filter: ifIEPorEL,
          fn: accept(ifHasGrades({
            nweaCombined: 48,
            gpa: 2.5
          }))
        },
        {
          filter: everyone,
          fn: accept(ifHasGrades({
            nweaBoth: 24,
            gpa: 2.5
          }))
        }
      )
  },
  "008a4500cad9fe736b957742a53eff81": {
    "id": "008a4500cad9fe736b957742a53eff81",
    "programs": [
      "HUBBARD HS: International Baccalaureate (IB)"
    ],
    "desc": "General Education and 504 Plan students: Minimum percentile of 24 in both reading and math on NWEA MAP and minimum 2.5 GPA in 7th grade.IEP and EL students: Minimum combined percentile of 48 in reading and math on NWEA MAP and minimum 2.5 GPA in 7th grade.Attendance is required at an Information Session for all eliglble applicants.",
      "fn": conditional(
        {
          filter: ifIEPorEL,
          fn: accept(ifHasGrades({
            nweaCombined: 48,
            gpa: 2.5
          }))
        },
        {
          filter: everyone,
          fn: accept(ifHasGrades({
            nweaBoth: 24,
            gpa: 2.5
          }))
        }
      )
  },
  "4993478e646debe0c8efaf8653ef3baf": {
    "id": "4993478e646debe0c8efaf8653ef3baf",
    "programs": [
      "HUBBARD HS: University Scholars"
    ],
    "desc": "Eligible students are selected on a point system. Points are based on NWEA MAP scores and 7th grade GPA. The school determines the minimum cutoff score for selections.",
    "fn": notImplemented
  },
  "9509f556b27eaab0224329cf49ba04f3": {
    "id": "9509f556b27eaab0224329cf49ba04f3",
    "programs": [
      "KENWOOD HS: Honors"
    ],
    "desc": "General Education and 504 Plan students: Minimum percentile of 75 in both reading and math on NWEA MAP, minimum 3.5 GPA in 7th grade, and 7th grade minimum attendance percentage of 95.IEP and EL students: Minimum combined percentile of 150 in reading and math on NWEA MAP, minimum 3.5 GPA in 7th grade, and 7th grade minimum attendance percentage of 95.",
      "fn": conditional(
        {
          filter: ifIEPorEL,
          fn: accept(ifHasGrades({
            nweaCombined: 150,
            gpa: 3.5,
            attendance: 95
          }))
        },
        {
          filter: everyone,
          fn: accept(ifHasGrades({
            nweaBoth: 75,
            gpa: 3.5,
            attendance: 95
          }))
        }
      )
  },
  "e30c46bef170a78818b6fb771b4fbe66": {
    "id": "e30c46bef170a78818b6fb771b4fbe66",
    "programs": [
      "KENWOOD HS: Magnet Program"
    ],
    "desc": "General Education and 504 Plan students: Minimum percentile of 60 in both reading and math on NWEA MAP, minimum 3.0 GPA in 7th grade, and 7th grade minimum attendance percentage of 95.IEP and EL students: Minimum combined percentile of 160 in reading and math on NWEA MAP, minimum 3.0 GPA in 7th grade, and 7th grade minimum attendance percentage of 95.",
      "fn": conditional(
        {
          filter: ifIEPorEL,
          fn: accept(ifHasGrades({
            nweaCombined: 160,
            gpa: 3.0,
            attendance: 95
          }))
        },
        {
          filter: everyone,
          fn: accept(ifHasGrades({
            nweaBoth: 60,
            gpa: 3.0,
            attendance: 95
          }))
        }
      )
  },
  "87db4e18b51d7b1bd4fcd5968130a830": {
    "id": "87db4e18b51d7b1bd4fcd5968130a830",
    "programs": [
      "KENWOOD HS: Magnet Program"
    ],
    "desc": "Eligible sudents are randomly selected by computerized lottery. The lottery is conducted in the following order: students currently enrolled in the Kenwood Academic Center, general.",
      "fn": lottery(
        {
          filter: ifStudentAttendsOneOf(KENWOOD_ACADEMIC_CENTER_PROGRAM),
          size: LotteryStageSize.SMALL
        },
        GENERAL_LOTTERY_STAGE
      )
  },
  "d0672ee42c09b7d4d4db5b835ff8595d": {
    "id": "d0672ee42c09b7d4d4db5b835ff8595d",
    "programs": [
      "NORTHSIDE PREP HS: Selective Enrollment High School"
    ],
    "desc": "General Education and 504 Plan students: Minimum percentile of 24 in both reading and math on NWEA MAP. IEP and EL students: Minimum combined percentile of 48 in reading and math on NWEA MAP.Testing is required for all eligible applicants.",
      "fn": conditional(
        {
          filter: ifIEPorEL,
          fn: accept(ifHasGrades({
            nweaCombined: 48,
          }))
        },
        {
          filter: everyone,
          fn: accept(ifHasGrades({
            nweaBoth: 24,
          }))
        }
      )
  },
  "3f2a9b5205159da71a0f8a30c8e04642": {
    "id": "3f2a9b5205159da71a0f8a30c8e04642",
    "programs": [
      "CHICAGO MILITARY HS: Service Learning (Military)",
      "CARVER MILITARY HS: Service Learning (Military)",
      "MARINE LEADERSHIP AT AMES HS: Service Learning Academy (Military)",
      "PHOENIX MILITARY HS: Service Learning (Military)",
      "RICKOVER MILITARY HS: Service Learning (Military)",
      "AIR FORCE HS: Service Learning (Military)"
    ],
    "desc": "All applicants: Minimum combined percentile of 48 in reading and math on NWEA MAP.Attendance at an Information Session is required for eligible applicants.",
      "fn": accept(ifHasGrades({
        nweaCombined: 48,
      }))
  },
  "66fee04c701c66e7f3005d9f501d7a5c": {
    "id": "66fee04c701c66e7f3005d9f501d7a5c",
    "programs": [
      "CURIE HS: Visual Arts"
    ],
    "desc": "General Education and 504 Plan students: Minimum percentile of 24 in both reading and math on NWEA MAP.IEP and EL students: Minimum combined percentile of 48 in reading and math on NWEA MAP. All eligible applicants must participate in a portfolio review.",
      "fn": conditional(
        {
          filter: ifIEPorEL,
          fn: accept(ifHasGrades({
            nweaCombined: 48,
          }))
        },
        {
          filter: everyone,
          fn: accept(ifHasGrades({
            nweaBoth: 24,
          }))
        }
      )
  },
  "390d92bc8ab25779c792bdb26c30d580": {
    "id": "390d92bc8ab25779c792bdb26c30d580",
    "programs": [
      "CLEMENTE HS: General Education"
    ],
    "desc": "Students who live within the school's attendance boundary have no eligibility requirements.All applicants who live outside of the school's attendance boundary: Minimum GPA of 2.5 in 7th grade and 7th grade minimum attendance percentage of 85.",
      "fn": conditional(
        {
          filter: ifInAttendBound,
          fn: accept(everyone)
        },
        {
          filter: everyone,
          fn: accept(ifHasGrades({
            gpa: 2.5,
            attendance: 85
          }))
        }
      )
  },
  "5d9d249d090ed48839ac6157459a4646": {
    "id": "5d9d249d090ed48839ac6157459a4646",
    "programs": [
      "CORLISS HS: Early College STEM"
    ],
    "desc": "Students who live within the school's attendance boundary can be admitted automatically.Students who live outside of the schools attendance boundary are randomly selected by computerized lottery. The lottery is conducted in the following order: sibling, general.",
      "fn": conditional(
        {
          filter: ifInAttendBound,
          fn: accept(everyone)
        },
        {
          filter: everyone,
          fn: lottery(
            SIBLING_LOTTERY_STAGE,
            GENERAL_LOTTERY_STAGE
          )
        }
      )
  },
  "25320ed803230a54cb5890b440bc91f5": {
    "id": "25320ed803230a54cb5890b440bc91f5",
    "programs": [
      "JUAREZ HS: General Education"
    ],
    "desc": "Students who live within the school's attendance boundary can be admitted automatically.Students who live outside of the school's attendance boundary will be randomly selected by computerized lottery. The lottery will be conducted in the following order: sibling, general.",
      "fn": conditional(
        {
          filter: ifInAttendBound,
          fn: accept(everyone)
        },
        {
          filter: everyone,
          fn: lottery(
            SIBLING_LOTTERY_STAGE,
            GENERAL_LOTTERY_STAGE
          )
        }
      )
  },
  "f743bb47a2e39c13b90bcca6a3bd50ab": {
    "id": "f743bb47a2e39c13b90bcca6a3bd50ab",
    "programs": [
      "MARINE LEADERSHIP AT AMES HS: Service Learning (Military)"
    ],
    "desc": "Attendance at an Information Session is required for all applicants.",
    "fn": accept(everyone)
  },
  "886a33612cc92e2d918b95c729be91f5": {
    "id": "886a33612cc92e2d918b95c729be91f5",
    "programs": [
      "CHICAGO ACADEMY HS: General Education"
    ],
    "desc": "General Education and 504 Plan students: Minimum percentile of 25 in both reading and math on NWEA MAP, and 7th grade minimum attendance percentage of 85.IEP and EL students: Minimum combined percentile of 50 in reading and math on NWEA MAP, and 7th grade minimum attendance percentage of 85.",
      "fn": conditional(
        {
          filter: ifIEPorEL,
          fn: accept(ifHasGrades({
            nweaCombined: 50,
            attendance: 85
          }))
        },
        {
          filter: everyone,
          fn: accept(ifHasGrades({
            nweaBoth: 25,
            attendance: 85
          }))
        }
      )
  },
  "6a05db9fd142fc9b46e16c608376af27": {
    "id": "6a05db9fd142fc9b46e16c608376af27",
    "programs": [
      "CHICAGO ACADEMY HS: Scholars"
    ],
    "desc": "General Education and 504 Plan students: Minimum percentile of 70 in both reading and math on NWEA MAP, minimum 3.0 GPA in 7th grade, and 7th grade minimum attendance percentage of 93.IEP and EL students: Minimum combined percentile of 140 in reading and math on NWEA MAP, minimum 3.0 GPA in 7th grade, and 7th grade minimum attendance percentage of 93.",
      "fn": conditional(
        {
          filter: ifIEPorEL,
          fn: accept(ifHasGrades({
            nweaCombined: 140,
            gpa: 3.0,
            attendance: 93
          }))
        },
        {
          filter: everyone,
          fn: accept(ifHasGrades({
            nweaBoth: 70,
            gpa: 3.0,
            attendance: 93
          }))
        }
      )
  },
  "26dd2726801c47bc0f19541e3b8e8d40": {
    "id": "26dd2726801c47bc0f19541e3b8e8d40",
    "programs": [
      "WILLIAMS HS: General Education"
    ],
    "desc": "General Education and 504 Plan students: Minimum percentile of 24 in both reading and math on NWEA MAP and 7th grade minimum attendance percentage of 85.IEP and EL students: Minimum combined percentile of 48 in reading and math on NWEA MAP, and 7th grade minimum attendance percentage of 85.",
      "fn": conditional(
        {
          filter: ifIEPorEL,
          fn: accept(ifHasGrades({
            nweaCombined: 48,
            attendance: 85
          }))
        },
        {
          filter: everyone,
          fn: accept(ifHasGrades({
            nweaBoth: 24,
            attendance: 85
          }))
        }
      )
  },
  "3779bffcce018fc1fd8fad66dff192e8": {
    "id": "3779bffcce018fc1fd8fad66dff192e8",
    "programs": [
      "WILLIAMS HS: General Education"
    ],
    "desc": "Eligible students are randomly selected by computerized lottery. The lottery is conducted in the following order: sibling, proximity, general.",
      "fn": lottery(
        SIBLING_LOTTERY_STAGE,
        PROXIMITY_LOTTERY_STAGE,
        GENERAL_LOTTERY_STAGE
      )
  },
  "c76e1504e5999bc87571ecb931e54494": {
    "id": "c76e1504e5999bc87571ecb931e54494",
    "programs": [
      "COLLINS HS: Scholars"
    ],
    "desc": "General Education and 504 Plan students: Minimum percentile of 40 in both reading and math on NWEA MAP, minimum 2.8 GPA in 7th grade, and 7th grade minimum attendance percentage of 92.IEP and EL students: Minimum combined percentile of 80 in reading and math on NWEA MAP, minimum 2.8 GPA in 7th grade, and 7th grade minimum attendance percentage of 92.",
        "fn": conditional(
          {
            filter: ifIEPorEL,
            fn: accept(ifHasGrades({
              nweaCombined: 80,
              gpa: 2.8,
              attendance: 92
            }))
          },
          {
            filter: everyone,
            fn: accept(ifHasGrades({
              nweaBoth: 40,
              gpa: 2.8,
              attendance: 92
            }))
          }
        )
  },
  "3e37937bfb0c7a06aa6a6fc2446a6b6e": {
    "id": "3e37937bfb0c7a06aa6a6fc2446a6b6e",
    "programs": [
      "SOLORIO HS: Double Honors/Scholars"
    ],
    "desc": "General Education and 504 Plan students: Minimum percentile of 75 in both reading and math on NWEA MAP, minimum 3.0 GPA in 7th grade, and 7th grade minimum attendance percentage of 95.IEP and EL students: Minimum combined percentile of 150 in reading and math on NWEA MAP, minimum 3.0 GPA in 7th grade, and 7th grade minimum attendance percenage of 95.",
        "fn": conditional(
          {
            filter: ifIEPorEL,
            fn: accept(ifHasGrades({
              nweaCombined: 150,
              gpa: 3.0,
              attendance: 95
            }))
          },
          {
            filter: everyone,
            fn: accept(ifHasGrades({
              nweaBoth: 75,
              gpa: 3.0,
              attendance: 95
            }))
          }
        )
  },
  "990c695f3250714f567360a0fa5a0404": {
    "id": "990c695f3250714f567360a0fa5a0404",
    "programs": [
      "BACK OF THE YARDS HS: General Education"
    ],
    "desc": "None. All interested students, including students who live within the overlay boundary of the school, must apply.",
    "fn": accept(everyone)
  },
  "2b80129a324a0b944ca9c89219957bc3": {
    "id": "2b80129a324a0b944ca9c89219957bc3",
    "programs": [
      "TAFT HS: General Education for Preference Zone"
    ],
    "desc": "Students are randomly selected by computerized lottery. This program only accepts students who live within the school's Preference Zone.",
    // FIXME: This is some politics. Taft's preference zone, according to a news report, extends over Bridge, Canty, Denver, and part of Smyser ES's attendance area [1] (http://nadignewspapers.com/2018/11/02/no-guarantee-for-dunning-students-to-enroll-at-taft/)
    "fn": notImplemented
  },
  "f6ddc0ae7fb9f8dc8a73f328f7d00474": {
    "id": "f6ddc0ae7fb9f8dc8a73f328f7d00474",
    "programs": [
      "CURIE HS: Engineering"
    ],
    "desc": "Students are selected on a point system. Points are based on the student's NWEA MAP scores and 7th grade GPA. The school determines the minimum cutoff for selections.",
    // TODO get point system for curie hs
    "fn": notImplemented
  },
  "01fa691b6b9b9b764d1c2158b23bb0e3": {
    "id": "01fa691b6b9b9b764d1c2158b23bb0e3",
    "programs": [
      "NOBLE - BULLS HS: General Education",
      "NOBLE - ITW SPEER HS: STEM",
      "NOBLE - UIC HS: General Education"
    ],
    "desc": "Students are randomly selected by computerized lottery. The lottery is conducted in the following order: sibling, overlay, general.",
    // FIXME Overlay lottery stage?????????
    "fn": lottery(
      SIBLING_LOTTERY_STAGE,
      ATTENDANCE_AREA_LOTTERY_STAGE, // FIXME confirm that this is the same as overlay
      GENERAL_LOTTERY_STAGE
    )
  },
  "d8b2920353f19f6d9d3fd1d6615c77b7": {
    "id": "d8b2920353f19f6d9d3fd1d6615c77b7",
    "programs": [
      "LAKE VIEW HS: Early College STEM"
    ],
    "desc": "Eligible students are randomly selected by computerized lottery. The lottery is conducted in the following order: sibling, general.",
    "fn": lottery(
      SIBLING_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE
    )
  },
  "ef724d2b79616b996ac8ee00503ab460": {
    "id": "ef724d2b79616b996ac8ee00503ab460",
    "programs": [
      "RICKOVER MILITARY HS: Service Leadership Academy",
      "AIR FORCE HS: Service Leadership Academy",
      "PHOENIX MILITARY HS: Service Leadership Academy",
      "MARINE LEADERSHIP AT AMES HS: Service Leadership Academy",
      "CHICAGO MILITARY HS: Service Leadership Academy",
      "CARVER MILITARY HS: Service Leadership Academy"
    ],
    "desc": "Eligible students must attend an Information Session, during which they will sign a Commitment Agreement, complete a Motivation and Perseverance Assessment and write a brief essay. Selections will be based on a point system with a maximum of 500 points, derived from 7th grade final (cumulative) grades (150 points), 7th grade NWEA MAP scores (150 points), the two-part assessment (50 for each part), and the essay (100 points).",
    // FIXME implement military school point system
    "fn": notImplemented
  },
  "391975c917916b73589bb85808e125f5": {
    "id": "391975c917916b73589bb85808e125f5",
    "programs": [
      "MARINE LEADERSHIP AT AMES HS: Service Leadership Academy (7-8)"
    ],
    "desc": "This school does not have an attendance boundary. Students must submit a Choice Elementary Schools application between October and December. Selections are on a point system, based on the assessment and essay completed at the Information Session.",
    // TODO get hold of point system
    "fn": notImplemented
  },
  "9cb5f9a4f2516816d51cb60f6cad045b": {
    "id": "9cb5f9a4f2516816d51cb60f6cad045b",
    "programs": [
      "SOLORIO HS: Engineering",
      "FOREMAN HS: Engineering"
    ],
    "desc": "Students are selected on a point system. Points are based on 7th grade final GPA and NWEA MAP scores. The school determines the minimum cutoff for selections.",
    // TODO get hold of point system
    "fn": notImplemented
  },
  "32344ef9871ba4c93b6d9bbc379e1191": {
    "id": "32344ef9871ba4c93b6d9bbc379e1191",
    "programs": [
      "SCHURZ HS: Chicago Ballet Center",
      "CHIARTS HS: Dance",
      "CHIARTS HS: Instrumental",
      "CHIARTS HS: Vocal",
      "CHIARTS HS: Musical Theatre",
      "CHIARTS HS: Theatre"
    ],
    "desc": "Eligible students are selected on a point system. Points are based on the audition.",
    "fn": notImplemented
  },
  "4d99baeb6f395ef382c7f9b4d4d0665e": {
    "id": "4d99baeb6f395ef382c7f9b4d4d0665e",
    "programs": [
      "STEINMETZ HS: International Baccalaureate (IB)"
    ],
    "desc": "Eligible students are selected on a point system. Points are based on NWEA MAP scores and 7th grade GPA. Students who live within the school's attendance boundary will be given 50 additional points. Preference is given to students who meet the minimum eligibility requirements, attend an Information Session, and are enrolled in the school's Middle Years Programme partner, Locke Elementary School. The school determines the minimum cutoff score for selections.",
    "fn": ibPointSystem
  },
  "b9a9215be3bcd288944a4d48ebdff943": {
    "id": "b9a9215be3bcd288944a4d48ebdff943",
    "programs": [
      "MATHER HS: AVID"
    ],
    "desc": "Eligible students are randomly selected by computerized lottery. The lottery is conducted in the following order: attendance area, general.",
    "fn": lottery(
      ATTENDANCE_AREA_LOTTERY_STAGE,
      GENERAL_LOTTERY_STAGE
    )
  },
  "a653b55662f2797f775c09849f0f063e": {
    "id": "a653b55662f2797f775c09849f0f063e",
    "programs": [
      "CURIE HS: Visual Arts"
    ],
    "desc": "Eliglble students are selected on a point system. Points are based on the portfolio review.",
    // FIXME get point system
    "fn": notImplemented
  },
  "daafb1f391aa405c7f50921b7e17ecaf": {
    "id": "daafb1f391aa405c7f50921b7e17ecaf",
    "programs": [
      "UPLIFT HS: General Education"
    ],
    "desc": "Students are randomly selected by computerized lottery. The lottery is conducted in the following order: sibling; students who attend Brennemann, Courtenay, Disney, Goudy, Greeley, McCutcheon, or Ravenswood Elementary Schools; general.",
    "fn": lottery(
      SIBLING_LOTTERY_STAGE,
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
      GENERAL_LOTTERY_STAGE
    )
  },
  "a311f584960d0e75a9a8f87e62ad2e0a": {
    "id": "a311f584960d0e75a9a8f87e62ad2e0a",
    "programs": [
      "CHIARTS HS: Visual Arts",
      "CHIARTS HS: Creative Writing"
    ],
    "desc": "Eligible students are selected on a point system. Points are based on the portfolio review.",
    "fn": notImplemented
  },
  "038a4f6decd3a070221f3117fcf14c1a": {
    "id": "038a4f6decd3a070221f3117fcf14c1a",
    "programs": [
      "KELLY HS: AVID"
    ],
    "desc": "Students must submit letters of recommendation, write an essay, and participate in an interview.",
    // FIXME confirm that this is the acceptance req fn
    "fn": accept(everyone)
  },
  //New For 2019 School Year
  "0265349f86cbe1cb692aa1088a3c2460": {
    "id": "0265349f86cbe1cb692aa1088a3c2460",
    "programs": [
      "ENGLEWOOD STEM HS: STEM"
    ],
    "desc": "Students who live within the school's attendance boundary can be admitted automatically.Students who live outside of the school's attendance boundary are randomly selected by computerized lottery. The lottery is conducted in the following order: staff preference, general.",
    "fn": conditional(
      {
        filter: ifInAttendBound,
        fn: accept(everyone)
      },
      {
        filter: everyone,
        fn: lottery(
          STAFF_PREFERENCE_LOTTERY_STAGE,
          GENERAL_LOTTERY_STAGE
        )
      }
    )
  },
  "39c75a9dc53500af65f6fc0cff282f74": {
    "id": "39c75a9dc53500af65f6fc0cff282f74",
    "programs": [
      "PERSPECTIVES - MATH & SCI HS: STEM",
      "CHICAGO MATH & SCIENCE HS: General Education",
      "CHICAGO COLLEGIATE: General Education",
      "FOUNDATIONS: General Education",
      "INTRINSIC HS: General Education",
      "PERSPECTIVES - JOSLIN HS: General Education"
    ],
    "desc": "Students currently enrolled in the school's eighth grade will receive an offer.Students who are not currently enrolled in the school are randomly selected by computerized lottery. The lottery is conducted in the following order: sibling, general.",
    "fn": conditional(
      {
        filter: ifStudentAttendsOneOf(
          CHICAGO_MATH_AND_SCIENCE_GENERAL_EDUCATION_JOINT_ES_HS_PROGRAM,
          CHICAGO_COLLEGIATE_GENERAL_EDUCATION_JOINT_ES_HS_PROGRAM,
          FOUNDATIONS_COLLEGE_PREP_JOINT_ES_HS_PROGRAM,
          ),//FIXME add perspectives and intrinsic 8th grades
        fn: accept(everyone)
      },
      {
        filter: everyone,
        fn: lottery(
          SIBLING_LOTTERY_STAGE,
          GENERAL_LOTTERY_STAGE
        )
      }
    )
  },
  "feddb9bba229c6efb66d931e11f22981": {
    "id": "feddb9bba229c6efb66d931e11f22981",
    "programs": [
      "CICS - LONGWOOD: General Education"
    ],
    "desc": "Students currently enrolled in the school's eighth grade will receive an offer.Students who are not currently enrolled in the school are randomly selected by computerized lottery. The lottery is conducted in the following order: students currently enrolled in one of the following CICS schools: Avalon, Basil, Bucktown, Irving Park, Longwood, Prairie, Washington Park, West Belden, or Wrightwood; sibling; general.",
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
          GENERAL_LOTTERY_STAGE
        )
      }
    )
  },
  "735a935ab565b641776d14ab6c00af28": {
    "id": "735a935ab565b641776d14ab6c00af28",
    "programs": [
      "HARLAN HS: General Education",
      "SOLORIO HS: General Education",
      "KELLY HS: General Education"
    ],
    "desc": "Students who live within the school's attendance boundary can be admitted automatically.Students who live outside of the school's attendance boundary are randomly selected by computerized lottery. The lottery is conducted in the following order: sibling, staff preference, general.",
    "fn": conditional(
      {
        filter: ifInAttendBound,
        fn: accept(everyone)
      },
      {
        filter: everyone,
        fn: lottery(
          SIBLING_LOTTERY_STAGE,
          STAFF_PREFERENCE_LOTTERY_STAGE,
          GENERAL_LOTTERY_STAGE
        )
      }
    )
  },
  "a3965fc99a2c9079a31b424b10b96bcd": {
    "id": "a3965fc99a2c9079a31b424b10b96bcd",
    "programs": [
      "NOBLE - COMER: General Education"
    ],
    "desc": "Students currently enrolled in the school's eighth grade will receive an offer.Students who are not currently enrolled in the school are randomly selected by computerized lottery. The lottery is conducted in the following order: sibling, overlay general.",
    "fn": conditional(
      {
        filter: ifStudentAttendsOneOf(), //FIXME add noble-comer 8th grade 
        fn: accept(everyone)
      },
      {
        filter: everyone,
        fn: lottery(
          SIBLING_LOTTERY_STAGE,
          ATTENDANCE_AREA_LOTTERY_STAGE, // FIXME confirm that this is the same as overlay
          GENERAL_LOTTERY_STAGE
        )
      }
    )
  },
  "46359aa2fe28c190fe45b27ed68ff98c": {
    "id": "46359aa2fe28c190fe45b27ed68ff98c",
    "programs": [
      "BROOKS HS: Selective Enrollment High School",
      "LINDBLOM HS: Selective Enrollment High School",
      "YOUNG HS: Selective Enrollment High School",
      "LANE TECH HS: Selective Enrollment High School"
    ],
    "desc": "Students currently enrolled in the school's Academic Center will receive an offer.Eligible students who are not currently enrolled in the school are selected on a point system with a maximum of 900 points. Students are assigned points for 7th grade final grades, NWEA MAP scores, and the admissions test, each worth a maximum of 300 points. The first 30% of the available seats are filled by the top scoring students based on rank score; the remaining seats are equally distributed among the four socio-economic tiers and filled by the top-scoring students in each tier.",
    "fn": conditional(
      {
        filter: ifInAttendBound,
        fn: accept(everyone)
      },
      {
        filter: everyone,
        fn: sePointSystem
      }
    )
  },
  "67dbe7541c75cb9443194c10e79d5f0b": {
    "id": "67dbe7541c75cb9443194c10e79d5f0b",
    "programs": [
      "MORGAN PARK HS: General Education"
    ],
    "desc": "Students currently enrolled in the school's Academic Center will receive an offer.Students who live within the school's attendance boundary can be admitted automatically.Students who live outside of the school's attendance boundary are randomly selected by computerized lottery. The lottery is conducted in the following order: sibling, general.",
    "fn": conditional(
      {
        filter: ifInAttendBound,
        fn: accept(everyone)
      },
      {
        filter: everyone,
        fn: lottery(
          SIBLING_LOTTERY_STAGE,
          GENERAL_LOTTERY_STAGE
        )
      }
    )
  },
  "1c3c63b4ea4660af4304c2137d2cca66": {
    "id": "1c3c63b4ea4660af4304c2137d2cca66",
    "programs": [
      "SULLIVAN HS: Newcomers"
    ],
    "desc": "Students who live within the school's attendance boundary can be accepted automatically.Students who live outside of the school's attendance boundary are randomly selected by computerized lottery. The lottery is conducted in the following order: students attending Boone, Field, Gale, Hayt, Jordan, Kilmer, McCutcheon, McPherson, or West Ridge Elementary Schools; sibling; general.",
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
          GENERAL_LOTTERY_STAGE
        )
      }
    )
  },
  "c7eddadce63ebdc786265f591ccc1bb0": {
    "id": "c7eddadce63ebdc786265f591ccc1bb0",
    "programs": [
      "LINCOLN PARK HS: Instrumental",
      "LINCOLN PARK HS: Vocal"
    ],
    "desc": "Students who live within the school's attendance boundary have no eligibility requirements.Students who live outside of the school's attendance boundary:General Education and 504 Plan students: Minimum percentile of 60 in both reading and math on NWEA MAP and minimum 2.75 GPA in 7th grade.IEP and EL students: Minimum combined percentile of 100 in reading and math on NWEA MAP and minimum 2.75 GPA in 7th grade.An audition is required for students who live outside of the school's attendance boundary.",
    "fn": conditional(
      {
        filter: ifInAttendBound,
        fn: accept(everyone)
      },
      {
        filter: ifIEPorEL,
        fn: accept(ifHasGrades(
          {
            gpa: 2.75,
            nweaCombined: 100
          }
        ))
      },
      {
        filter: everyone,
        fn: accept(ifHasGrades(
          {
            gpa: 2.75,
            nweaBoth: 60
          }
        ))
      }
    )
  },
  "c18af300cd9e5d44b18023d612edef5e": {
    "id": "c18af300cd9e5d44b18023d612edef5e",
    "programs": [
      "LINCOLN PARK HS: Visual Arts"
    ],
    "desc": "General Education and 504 Plan students: Minimum percentile of 60 in both reading and math on NWEA MAP and minimum 2.75 GPA in 7th grade.IEP and EL students: Minimum combined percentile of 120 in reading and math on NWEA MAP and minimum 2.75 GPA in 7th grade.A portfolio review is required for eligible applicants.",
    "fn": conditional(
      {
        filter: ifIEPorEL,
        fn: accept(ifHasGrades(
          {
            gpa: 2.75,
            nweaCombined: 100
          }
        ))
      },
      {
        filter: everyone,
        fn: accept(ifHasGrades(
          {
            gpa: 2.75,
            nweaBoth: 60
          }
        ))
      }
    )
  },
  "f85eca2619c54c61a3f9a9df4adab773": {
    "id": "f85eca2619c54c61a3f9a9df4adab773",
    "programs": [
      "INFINITY HS: STEM"
    ],
    "desc": "General Education and 504 Plan students: Minimum percentile of 55 in both reading and math on NWEA MAP, minimum 2.0 GPA in 7th grade, and 7th grade minimum attendance percentage of 93.IEP and EL students: Minimum combined percentile of 110 in reading and math on NWEA MAP, minimum 2.0 GPA in 7th grade, and 7th grade minimum attendance percentage of 93.",
    "fn": conditional(
      {
        filter: ifIEPorEL,
        fn: accept(ifHasGrades(
          {
            gpa: 2,
            nweaCombined: 110,
            attendance: 93
          }
        ))
      },
      {
        filter: everyone,
        fn: accept(ifHasGrades(
          {
            gpa: 2,
            nweaBoth: 55,
            attendance: 93
          }
        ))
      }
    )
  },
  "1e77127816b27c9e8238149ef7a8aa96": {
    "id": "1e77127816b27c9e8238149ef7a8aa96",
    "programs": [
      "KELVYN PARK HS: Open Enrollment"
    ],
    "desc": "Students who live within the school's attendance boundary can be enrolled automatically and do not have to apply. Contact the school for registration instructions.Students who live outside of the school's attendance boundary must submit a Choice Elementary Schools application between October and December. Available seats, if any, are filled via computerized lottery. Priority is given to applicants with a sibling who is currently enrolled in the school in grade K-7, and who will remain enrolled in the school for the coming school year.",
    "fn": conditional(
      {
        filter: ifInAttendBound,
        fn: accept(everyone)
      },
      {
        filter: everyone, //FIXME - ask about choice elementary school applications
        fn: lottery(
          SIBLING_LOTTERY_STAGE,
          GENERAL_LOTTERY_STAGE
        )
      }
    )
  },
  "d4186c5b6a1d5e744185d25f75df213e": {
    "id": "d4186c5b6a1d5e744185d25f75df213e",
    "programs": [
      "CHICAGO VIRTUAL: General Education"
    ],
    "desc": "Students currently enrolled in the school's eighth grade will have a guaranteed offer to this program.Students are randomly selected by computerized lottery.",
    "fn": conditional(
      {
        filter: ifStudentAttendsOneOf(CHICAGO_VIRTUAL_GENERAL_EDUCATION_JOINT_ES_HS_PROGRAM),
        fn: accept(everyone)
      },
      {
        filter: everyone,
        fn: lottery(GENERAL_LOTTERY_STAGE)
      }
    )
  },
  "4c0f7d456bb3bcdcf96b1a2252a3f7b1": {
    "id": "4c0f7d456bb3bcdcf96b1a2252a3f7b1",
    "programs": [
      "DYETT ARTS HS: Band",
      "DYETT ARTS HS: Choir",
      "DYETT ARTS HS: Dance",
      "DYETT ARTS HS: Digital Media",
      "DYETT ARTS HS: General Education",
      "DYETT ARTS HS: Theater",
      "DYETT ARTS HS: Visual Arts"
    ],
    "desc": "Students who live within the school's attendance boundary have no eligibility requirements.Students who live outside of the school's attendance boundary:Minimum percentile of 48 in both reading and math on NWEA MAP, minimum 2.0 GPA in 7th grade, and 7th grade minimum attendance percentage of 90.Completion of a written interview is required for eligible students who live outside of the school's attendance boundary. Applicants must complete form at www.newdyett.org. Paper applicants or applicants without computer access should picke up a copy of the form from the school or call the school to have the form emailed.",
    "fn": conditional(
      {
        filter: ifInAttendBound,
        fn: accept(everyone)
      },
      {
        filter: ifIEPorEL,
        fn: accept(ifHasGrades(
          {
            nweaCombined:90
          }))
      },
      {
        filter: everyone,
        fn: accept(ifHasGrades(
          {
            nweaBoth: 48,
            gpa: 2
          }
        ))
      }
    )
  },
  "b9914d57d2b652a3368b71004c4684f1": {
    "id": "b9914d57d2b652a3368b71004c4684f1",
    "programs": [
      "DYETT ARTS HS: Band",
      "DYETT ARTS HS: Choir",
      "DYETT ARTS HS: Dance",
      "DYETT ARTS HS: Digital Media",
      "DYETT ARTS HS: General Education",
      "DYETT ARTS HS: Theater",
      "DYETT ARTS HS: Visual Arts"
    ],
    "desc": "Students who live within the school's attendance boundary have no eligibility requirements and can be admitted automatically.Eligible students are selected on a point system. Points are based on the student's NWEA MAP scores in reading and math and the written interview.",
    "fn": conditional(
      {
        filter: ifInAttendBound,
        fn: accept(everyone)
      },
      {
        filter: everyone,
        fn: notImplemented
      }
    )
  },
  "976b01cc4c2fe96aae852a0e49e0df4b": {
    "id": "976b01cc4c2fe96aae852a0e49e0df4b",
    "programs": [
      "FARRAGUT HS: General Education"
    ],
    "desc": "Students currently enrolled in the school's eighth grade will receive an offer.Students who live within the school's attendance boundary can be admitted automatically. This program only accepts students who are currently enrolled or who live within the school's attendance boundary.",
    "fn": conditional(
      {
        filter: ifInAttendBound,
        fn: accept(everyone)
      },
      {
        filter: ifStudentAttendsOneOf(),//FIXME add farragut 8th grade
        fn: accept(everyone)
      }
    )
  },
  "6f3b345db571ecf2523aa41d336feacc": {
    "id": "6f3b345db571ecf2523aa41d336feacc",
    "programs": [
      "FARRAGUT HS: Teaching",
      "UPLIFT HS: Teaching"
    ],
    "desc": "Students are randomly selected by computerized lottery. General Education and 504 Plan students: Preference is given to students with percentiles of 24 and above on the NWEA MAP in reading and math. A total of 30% of the seats will be made available to applicants who live in the school's proximity.IEP and EL students: Preference is given to students with combined NWEA MAP scores that equal 48 or above.Note: Repeating 8th graders and students pushed into 8th grade from 6th grade due to age requirements qualify for selection but will be placed in a lower preference group.",
    "fn": notImplemented //FIXME no idea what's up with this thing
  },
  "e8506677ffb5e84bed96682f18ab0908": {
    "id": "e8506677ffb5e84bed96682f18ab0908",
    "programs": [
      "PERSPECTIVES - LEADERSHIP HS: General Education"
    ],
    "desc": "Students currently enrolled in the school's eighth grade will receive an offer.Students who are not currently enrolled in the school are randomly selected by computerized lottery. The lottery is conducted in the following order: sibling, proximity, general.",
    "fn": conditional(
      {
        filter: ifStudentAttendsOneOf(),//FIXME add perspectives leadership 8th grade
        fn: accept(everyone)
      },
      {
        filter: everyone,
        fn: lottery(
          SIBLING_LOTTERY_STAGE,
          PROXIMITY_LOTTERY_STAGE,
          GENERAL_LOTTERY_STAGE
        )
      }
    )
      
  },
  "acfda3cdeb08155356c715cdfef7c20d": {
    "id": "acfda3cdeb08155356c715cdfef7c20d",
    "programs": [
      "HUBBARD HS: University Scholars"
    ],
    "desc": "General Education and 504 Plan students: Minimum percentile of 24 in both reading on math on NWEA MAP, minimum 2.5 GPA in 7th grade, and 7th grade minimum attendance percentage of 85.IEP and EL students: Minimum combined percentile of 48 in reading and math on NWEA MAP, minimum 2.5 GPA in 7th grade, and 7th grade minimum attendance percentage of 85.",
    "fn": conditional(
      {
        filter: ifIEPorEL,
        fn: accept(ifHasGrades(
          {
            gpa: 2.5,
            nweaCombined: 48,
            attendance: 85
          }))
      },
      {
        filter: everyone,
        fn: accept(ifHasGrades(
          {
            gpa: 2.5,
            nweaBoth: 24,
            attendance: 85
          }))
      }
    )
  },
  "417755e760de6b8e0defee0556fdbd5e": {
    "id": "417755e760de6b8e0defee0556fdbd5e",
    "programs": [
      "ROOSEVELT HS: General Education"
    ],
    "desc": "Students currently enrolled in the school's eighth grade will receive an offer.Students who live within the school's attendance boundary can be admitted automatically.Students who live outside of the school's attendance boundary are randomly selected through computerized lottery. The lottery is conducted in the following order: sibling, staff preference, general.",
    "fn": conditional(
      {
        filter: ifInAttendBound,
        fn: accept(everyone)
      },
      {
        filter: ifStudentAttendsOneOf(),//FIXME add roosevelt gen ed 8th grade
        fn: accept(everyone)
      },
      {
        filter: everyone,
        fn: lottery(
          SIBLING_LOTTERY_STAGE,
          STAFF_PREFERENCE_LOTTERY_STAGE,
          GENERAL_LOTTERY_STAGE
        )
      }
    )
  },
  "c55294d755cbd1ca052340fe6517693b": {
    "id": "c55294d755cbd1ca052340fe6517693b",
    "programs": [
      "COLLINS HS: Game Programming"
    ],
    "desc": "Students are randomly selected by computerized lottery. General Education and 504 Plan students: Preference is given to students with percentiles of 24 and above on the NWEA MAP in reading and math. A total of 30% of the seats will be made available to applicants who reside within the school's proximity.IEP and EL students: Preference is given to students with combined NWEA MAP scores that equal 48 or above.Note: Repeating 8th graders and students pushed into 8th grade from 6th grade due to age requirements qualify for selection but will be placed in a lower preference group.",
    "fn": notImplemented //FIXME
  },
  "727f3c50374cfb4fe971e7b4b2ac10a3": {
    "id": "727f3c50374cfb4fe971e7b4b2ac10a3",
    "programs": [
      "WELLS HS: General Education"
    ],
    "desc": "Students who live within the school's attendance boundary have no eligibility requirements.Students who live outside of the school's attendance boundary:General Education and 504 Plan students: Minimum 2.5 GPA in 7th grade, and 7th grade minimum attendance percentage of 90.",
    "fn": conditional(
      {
        filter: ifInAttendBound,
        fn: accept(everyone)
      },
      {
        filter: everyone,
        fn: accept(ifHasGrades({
          gpa: 2.5,
          attendance: 90
        }))
      }
    )
  },
  "29787751d9a212e55d88a419dcf5d5cc": {
    "id": "29787751d9a212e55d88a419dcf5d5cc",
    "programs": [
      "WELLS HS: General Education"
    ],
    "desc": "Students who live within the school's attendance boundary have no eligibility requirements and can be admitted automatically.Eligible students who live outside of the school's attendance boundary are randomly selected by computerized lottery. The lottery is conducted in the following order: sibling, staff preference, general.",
    "fn": conditional(
      {
        filter: ifInAttendBound,
        fn: accept(everyone)
      },
      {
        filter: everyone,
        fn: lottery(
          SIBLING_LOTTERY_STAGE,
          STAFF_PREFERENCE_LOTTERY_STAGE,
          GENERAL_LOTTERY_STAGE
        )
      }
    )
  },
  "a1a1cf6327183b3989eebdaf18dfccf3": {
    "id": "a1a1cf6327183b3989eebdaf18dfccf3",
    "programs": [
      "RABY HS: Broadcast Technology",
      "RABY HS: Culinary Arts",
      "RABY HS: Entrepreneurship"
    ],
    "desc": "Students are randomly selected by computerized lottery. General Education and 504 Plan students: Preference is given to students with percentiles of 24 and above on the NWEA MAP in reading and math.  A total of 30% of the seats will be made available to applicants who live in the school's proximity.IEP and EL students: Preference is given to students with combined NWEA MAP scores that equal 48 or above.Note: Repeating 8th graders and students pushed into 8th grade from 6th grade due to age requirements qualify for selection but will be placed in a lower preference group.",
    "fn": notImplemented //FIXME
  },
  "e9046085c529aa64749154c02c8acce4": {
    "id": "e9046085c529aa64749154c02c8acce4",
    "programs": [
      "DISNEY II HS: Fine Arts & Technology"
    ],
    "desc": "Students currently enrolled in the school's eighth grade will receive an offer.Eligible students who are not currently enrolled in the school are randomly selected by computerized lottery. The lottery is conducted in the following order: sibling, proximity, tiers.",
    "fn": conditional(
      {
        filter: ifStudentAttendsOneOf(DISNEY_II_ES_PROGRAM),
        fn: accept(everyone)
      },
      {
        filter: everyone,
        fn: lottery(
          SIBLING_LOTTERY_STAGE,
          PROXIMITY_LOTTERY_STAGE,
          TIER_LOTTERY_STAGE
        )
      }
    )
  },
  "41ad51caf930d4a671bc1a62db18dbc5": {
    "id": "41ad51caf930d4a671bc1a62db18dbc5",
    "programs": [
      "TAFT HS: General Education"
    ],
    "desc": "Students currently enrolled in the school's eighth grade will receive an offer.Students enrolled in the Taft Academic Center or students who live within the school's attendance boundary can be admitted automatically.This program only accepts students who live within the school's attendance boundary or who attend the school's Academic Center.",
    "fn": conditional(
      {
        filter: ifStudentAttendsOneOf(TAFT_ACADEMIC_CENTER_PROGRAM), //FIXME needs taft 8th grade
        fn: accept(everyone)
      },
      {
        filter: ifInAttendBound,
        fn: accept(everyone)
      }
    )
  },
  "7f46c4d6dfe5d0f8dadfd8f657026516": {
    "id": "7f46c4d6dfe5d0f8dadfd8f657026516",
    "programs": [
      "TAFT HS: NJROTC"
    ],
    "desc": "General Education and 504 Plan students: Minimum percentile of 50 in both reading and math on NWEA MAP.IEP and EL students: Minimum combined percentile of 100 in reading and math on NWEA MAP.Eligible applicants must participate in an interview.",
    "fn": conditional(
      {
        filter: ifIEPorEL,
        fn: accept(ifHasGrades(
          {
            nweaCombined: 100
          }
        ))
      },
      {
        filter: everyone,
        fn: accept(ifHasGrades(
          {
            nweaBoth: 50
          }
        ))
      }
    )
  },
  "cdfbcbcded156138cadffd0aa3de8065": {
    "id": "cdfbcbcded156138cadffd0aa3de8065",
    "programs": [
      "CURIE HS: AVID"
    ],
    "desc": "General Education and 504 Plan students: Minimum percentile of 50 in both reading and math on NWEA MAP, minimum 2.5 GPA in 7th grade, and 7th grade minimum attendance percentage of 93.IEP and EL students: Minimum combined percentile of 100 in reading and math on NWEA MAP, minimum 2.5 GPA in 7th grade, and 7th grade minimum attendance percentage of 93.",
    "fn": conditional(
      {
        filter: ifIEPorEL,
        fn: accept(ifHasGrades(
          {
            nweaCombined: 100,
            gpa: 2.5,
            attendance: 93
          }
        ))
      },
      {
        filter: everyone,
        fn: accept(ifHasGrades(
          {
            nweaBoth: 50,
            gpa: 2.5,
            attendance: 93
          }
        ))
      }
    )
  },
  "c5458f56e94153bb8c850ab81472d9f5": {
    "id": "c5458f56e94153bb8c850ab81472d9f5",
    "programs": [
      "CURIE HS: Dance",
      "CURIE HS: Music"
    ],
    "desc": "General Education and 504 Plan students: Minimum percentile of 20 in both reading and math on NWEA MAP.IEP and EL students: Minimum combined percentile of 40 in reading and math on NWEA MAP.An audition is required for all eligible applicants.",
    "fn": conditional(
      {
        filter: ifIEPorEL,
        fn: accept(ifHasGrades(
          {
            nweaCombined: 40
          }
        ))
      },
      {
        filter: everyone,
        fn: accept(ifHasGrades(
          {
            nweaBoth: 20
          }
        ))
      }
    )
  },
  "296feb50cda84ee2a2b91aee32d899df": {
    "id": "296feb50cda84ee2a2b91aee32d899df",
    "programs": [
      "SIMEON HS: Career Academy"
    ],
    "desc": "All applicants: Minimum combined percentile of 30 in reading and math on NWEA MAP, minimum 2.0 GPA in 7th grade, and 7th grade minimum attendance percentage of 85.Eligible students are required to participate in an interview.",
    "fn": accept(ifHasGrades(
      {
        nweaBoth: 30,
        gpa: 2,
        attendance: 85
      }
    ))
  },
  "39c0535104720db22d35fe93f1ffcff0": {
    "id": "39c0535104720db22d35fe93f1ffcff0",
    "programs": [
      "KENWOOD HS: General Education"
    ],
    "desc": "Students currently enrolled in the school's Academic Center will receive an  offer.Students who live within the school's attendance boundary can be admitted automatically.This program only accepts students who live within the school's attendance boundary or who are enrolled in the school's Academic Center.",
    "fn": conditional(
      {
        filter: ifStudentAttendsOneOf(KENWOOD_ACADEMIC_CENTER_PROGRAM),
        fn: accept(everyone)
      },
      {
        filter: ifInAttendBound,
        fn: accept(everyone)
      }
    )
  },
  "b137257a7242a3aea171bf6635060c3b": {
    "id": "b137257a7242a3aea171bf6635060c3b",
    "programs": [
      "STEINMETZ HS: General Education"
    ],
    "desc": "Students who live within the school's attendance boundary have no eligibility requirements.Students who live outside of the school's attendance boundary:General Education and 504 Plan students: Minimum percentile of 20 in both reading and math on NWEA MAP, minimum GPA of 2.0 in 7th grade, and 7th grade minimum attendance percentage of 85.IEP and EL students: Minimum combined percentile of 40 in reading and math on NWEA MAP, minimum GPA of 2.0 in 7th grade, and 7th grade minimum percentage of 85.",
    "fn": conditional(
      {
        filter: ifInAttendBound,
        fn: accept(everyone)
      },
      {
        filter: ifIEPorEL,
        fn: accept(ifHasGrades(
          {
            gpa: 2,
            nweaCombined: 40,
            attendance: 85
          }
        ))
      },
      {
        filter: everyone,
        fn: accept(ifHasGrades(
          {
            gpa: 2,
            nweaBoth: 20,
            attendance: 85
          }
        ))
      }
    )
  },
  "e2c159b65fea9fe9f0d39a504b269d66": {
    "id": "e2c159b65fea9fe9f0d39a504b269d66",
    "programs": [
      "PROSSER HS: Career Academy"
    ],
    "desc": "All applicants must have a minimum GPA of 2.5 in 7th grade and a 7th grade minimum attendance percentage of 90.Attendance at an Information Session is required for all eligible applicants.",
    "fn": accept(ifHasGrades(
      {
        gpa: 2.5,
        attendance: 90
      }
    ))
  }
}
