import { connect } from "react-redux";
import { createSelector } from "reselect";

import { 
  AppState,
  Program,
  ProgramOutcome,
  ProgramGroup
} from "../../../shared/types";

import { openProgramModal } from "../../../shared/redux/actions";

import HSProgramList from "./hs-program-list";

const getProgramGroupDict = (state: AppState) => state.data.hsProgramGroups;
const selectProgramGroups = createSelector(
  [getProgramGroupDict],
  (programGroupDict): ProgramGroup[] => {
    // convert dictionary of program groups to an
    // array of program groups alphabetically sorted by program
    // group display name.
    const programGroups: ProgramGroup[] = Object.keys(programGroupDict).map( groupID => programGroupDict[groupID] );
    return programGroups.sort( (groupA, groupB) => groupA.name.localeCompare(groupB.name) );
  }
);

const getProgramDict = (state: AppState) => state.data.hsPrograms;

const mapStateToProps = (state: AppState) => {
  return {
    programs: state.data.hsPrograms,
    outcomes: state.programOutcomes, 
    programGroups: selectProgramGroups(state),
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSelectedProgramChange: (program: Program, outcome: ProgramOutcome | undefined) => {
      dispatch(openProgramModal(program, outcome))
    }
  }
};

const HSProgramsContainer = connect(mapStateToProps, mapDispatchToProps)(HSProgramList);

export default HSProgramsContainer;


