import { connect } from "react-redux";

import {
  updateStudentHSATPercentileMath,
  updateStudentHSATPercentileRead,
  updateStudentSubjGradeMath,
  updateStudentSubjGradeRead,
  updateStudentSubjGradeSci,
  updateStudentSubjGradeSocStudies,
  updateStudentAttendPercentage
} from "../../../shared/redux/actions";

import { GradesForm, GradesFormProps } from "./grades-form";

type StateProps = Pick<GradesFormProps,
  "hsatMath" |
  "hsatRead" |
  "mathGrade" |
  "readGrade" |
  "scienceGrade" |
  "socialStudiesGrade" |
  "attendancePercentage" |
  "gpa">
const mapStateToProps = (state): StateProps => {
  return {
    hsatMath: state.studentData.hsatPercentileMath,
    hsatRead: state.studentData.hsatPercentileRead,
    mathGrade: state.studentData.subjGradeMath,
    readGrade: state.studentData.subjGradeRead,
    scienceGrade: state.studentData.subjGradeSci,
    socialStudiesGrade: state.studentData.subjGradeSocStudies,
    attendancePercentage: state.studentData.attendancePercentage,
    gpa: state.studentData.gpa
  }
};

type DispatchProps = Pick<GradesFormProps,
  "onHSATMathChange" |
  "onHSATReadChange" |
  "onMathGradeChange" |
  "onReadGradeChange" |
  "onScienceGradeChange" |
  "onSocialStudiesGradeChange" |
  "onAttendancePercentageChange">
const mapDispatchToProps = (dispatch): DispatchProps => {
  return {
    onHSATMathChange: val => dispatch(updateStudentHSATPercentileMath(val)),
    onHSATReadChange: val => dispatch(updateStudentHSATPercentileRead(val)),
    onMathGradeChange: val => dispatch(updateStudentSubjGradeMath(val)),
    onReadGradeChange: val => dispatch(updateStudentSubjGradeRead(val)),
    onScienceGradeChange: val => dispatch(updateStudentSubjGradeSci(val)),
    onSocialStudiesGradeChange: val => dispatch(updateStudentSubjGradeSocStudies(val)),
    onAttendancePercentageChange: val => dispatch(updateStudentAttendPercentage(val))
  }
};

export const GradesFormContainer = connect(mapStateToProps, mapDispatchToProps)(GradesForm);
