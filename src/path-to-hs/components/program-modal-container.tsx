import { connect } from "react-redux";

import { AppState } from "../../shared/types";

import { closeProgramModal } from "../../shared/redux/actions";

import { ProgramModal } from "./program-modal";

const mapStateToProps = (state: AppState) => {
  return {
    visible: state.programModalState.open,
    program: state.programModalState.program,
    outcome: state.programModalState.outcome
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onCloseButtonClick: () => dispatch(closeProgramModal())
  }
}

export const ProgramModalContainer = connect(mapStateToProps, mapDispatchToProps)(ProgramModal);
