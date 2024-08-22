import * as React from "react";

import { 
  Program, 
  ProgramOutcome
} from "../../../shared/types";

import { SuccessChance } from "../../../shared/enums";

import { shallowCompare } from "../../../shared/util/shallow-compare";
import { ProgramCard } from "../../../shared/components/program-card";
import "./hs-program-element.scss";

interface HSProgramElemProps {
  program: Program
  outcome: ProgramOutcome | undefined
  onSelect: (program: Program, outcome: ProgramOutcome | undefined) => any
}

interface HSProgramElemState {
  visited: boolean
  hover: boolean
  combinedSuccessChance: SuccessChance
}


class HSProgramElement extends React.Component<HSProgramElemProps, HSProgramElemState> {

  constructor(props) {
    super(props);
    this.state = { 
      visited: false,
      hover: false,
      combinedSuccessChance: props.outcome === undefined ? SuccessChance.NOTIMPLEMENTED : props.outcome.overallChance,
    };
  }

  shouldComponentUpdate(nextProps: HSProgramElemProps, nextState: HSProgramElemState) {
    // assume props.program does not change
    
    // compare props.onSelect
    if (nextProps.onSelect !== this.props.onSelect) {
      return true;
    }
    if (nextState.hover !== this.state.hover) {
      return true;
    }
   
    // shallow compare outcome
    if (nextProps.outcome === undefined || this.props.outcome === undefined) {
      if (nextProps.outcome !== this.props.outcome) {
        return true;
      }
    } else {
      if (shallowCompare(nextProps.outcome, this.props.outcome) === false) {
        return true;
      }
    }

    return false;
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      combinedSuccessChance: nextProps.outcome.overallChance
    });
  }

  render() {
    function shortenProgramInfo(programType) {
      // cte info takes up a lot of space - we can shorten it to just say cte where relevant
      // also applicable to other common starts of programs (not yet implemented)
      if (programType.includes("CTE - Pre-Law")) {
        return "Pre-Law"
      }
      if (programType.startsWith("Career & Technical Education (CTE)")) {
        return programType.replace("Career & Technical Education (CTE)", "CTE");
      }
      return programType;
    }

    return (
      <button 
        className="hs-list-element"
        onClick={this.handleClick}
        onMouseEnter={this.handleEnter}
        onMouseLeave={this.handleLeave}
      >
      <ProgramCard 
        hover={this.state.hover}
        outcome={this.state.combinedSuccessChance}
        //displayName={this.props.program.programType}
        displayName={shortenProgramInfo(this.props.program.programType)}
      />
      </button>
    )
  }

  private handleClick = (ev) => {
    this.setState({visited: true});
    this.props.onSelect(this.props.program, this.props.outcome);
  }

  private handleEnter = (ev) => {
    this.setState({hover: true})
  }

  private handleLeave = (ev) => {
    this.setState({hover: false})
  }

}

export default HSProgramElement;
