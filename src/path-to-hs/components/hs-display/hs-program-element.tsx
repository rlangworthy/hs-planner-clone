import * as React from "react";

import { 
  Program, 
  ProgramOutcome
} from "../../../shared/types";

import { SuccessChance } from "../../../shared/enums";

import { shallowCompare } from "../../../shared/util/shallow-compare";
import { ProgramCard } from "../../../shared/components/program-card";

interface HSProgramElemProps {
  program: Program
  outcome: ProgramOutcome | undefined
  onSelect: (program: Program, outcome: ProgramOutcome | undefined) => any
}

interface HSProgramElemState {
  visited: boolean
  combinedSuccessChance: SuccessChance
}

import "./hs-program-element.scss";

class HSProgramElement extends React.Component<HSProgramElemProps, HSProgramElemState> {

  constructor(props) {
    super(props);
    this.state = { 
      visited: false,
      combinedSuccessChance: props.outcome === undefined ? SuccessChance.NOTIMPLEMENTED : props.outcome.overallChance,
    };
  }

  shouldComponentUpdate(nextProps: HSProgramElemProps, nextState: HSProgramElemState) {
    // assume props.program does not change
    
    // compare props.onSelect
    if (nextProps.onSelect !== this.props.onSelect) {
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
    return (
      <button 
        className="hs-list-element"
        onClick={this.handleClick}
      >
      <ProgramCard 
        outcome={this.state.combinedSuccessChance}
        displayName={this.props.program.programType}
      />
      </button>
    )
  }

  private handleClick = (ev) => {
    this.setState({visited: true});
    this.props.onSelect(this.props.program, this.props.outcome);
  }

}

export default HSProgramElement;
