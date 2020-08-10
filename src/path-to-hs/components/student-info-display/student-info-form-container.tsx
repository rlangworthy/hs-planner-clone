import { connect } from "react-redux";
import { createSelector } from "reselect";
import {
  updateStudentIEPStatus,
  updateStudentELLStatus,
  updateStudentAddress,
  updateStudentCurrESProgram,
  updateStudentSiblingHSSchools,
  updateStudentSkip7OrRepeated8,
} from "../../../shared/redux/actions";

import { AppState } from "../../../shared/types";

import StudentInfoForm from "./student-info-form";

const selectNonHSProgramDict = (state: AppState) => state.data.nonHSPrograms;
const selectNonHSProgramOptions = createSelector(
  [selectNonHSProgramDict],
  (programDict) => {
    let options: any[] = [];
    options.push({value: "%%none%%", label: "Other"});
    Object.keys(programDict).forEach( id => {
      const program = programDict[id];
      options.push({
        value: program.id,
        label: program.programName
      });
    });
    return options;
  }
);

const selectHSSchoolDict = (state: AppState) => state.data.hsSchools;
const selectHSSchoolOptions = createSelector(
  [selectHSSchoolDict],
  (hsSchoolDict) => {
    let options: any[] = [];
    Object.keys(hsSchoolDict).forEach( id => {
      const school = hsSchoolDict[id];
      options.push({
        value: school.id,
        label: school.shortName
      });
    });
    return options;
  }
);

const mapStateToProps = (state: AppState) => {
  return {
    addressIsLoading: state.loadingStatus.loadingTier,
    currEsProgramOptions: selectNonHSProgramOptions(state),
    siblingHSSchoolOptions: selectHSSchoolOptions(state),

    iep: state.studentData.iep,
    el: state.studentData.ell,
    address: state.studentData.address,
    tier: state.studentData.tier,
    skip7OrRepeat8: state.studentData.skippedGrade7OrRepeatedGrade8,
    currESProgram: state.studentData.currESProgramID,
    siblingHSSchools: state.studentData.siblingHSSchoolIDs,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onIEPChange: newVal => dispatch(updateStudentIEPStatus(newVal)),
    onELChange: newVal => dispatch(updateStudentELLStatus(newVal)),
    onAddressChange: newVal => dispatch(updateStudentAddress(newVal)),
    onSkip7OrRepeat8Change: newVal => dispatch(updateStudentSkip7OrRepeated8(newVal)),
    onCurrESProgramChange: newVal => dispatch(updateStudentCurrESProgram(newVal)),
    onSiblingHSSchoolChange: newVal => dispatch(updateStudentSiblingHSSchools(newVal))
  }
};

export const StudentInfoFormContainer = connect(mapStateToProps, mapDispatchToProps)(StudentInfoForm);
