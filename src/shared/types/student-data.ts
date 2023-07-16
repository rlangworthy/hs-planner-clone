import { Gender } from "../../shared/enums";
import { 
  LetterGrade,
  LatLong
} from "../../shared/types";

export interface StudentData {
    gender: Gender | null
    address: string | null
    tier: string | null
    geo: LatLong | null
    gradeLevel: number | null
    prevGradeLevel: number | null
    skippedGrade7OrRepeatedGrade8: boolean | null
    currESProgramID: {value: string} | null
    ell: boolean | null
    iep: boolean | null
    attendancePercentage: number | null
    gpa: number | null
    siblingHSSchoolIDs: string[] | null
    seTestPercentile: number | null
    hsatPercentileMath: number | null
    hsatPercentileRead: number | null
    subjGradeMath: LetterGrade | null
    subjGradeRead: LetterGrade | null
    subjGradeSci: LetterGrade | null
    subjGradeSocStudies: LetterGrade | null
}
