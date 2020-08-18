import * as React from "react";

import { SuccessChance } from "../../shared/enums";


import SchoolIcon from "../../shared/components/icons/school";
import DoorOpen from "./icons/door";
import DoorClosed from "../../shared/components/icons/door-closed";

import OutcomeCertainIcon from "../../shared/components/icons/outcome-certain";
import OutcomeLikelyIcon from "../../shared/components/icons/outcome-likely";
import OutcomeUncertainIcon from "../../shared/components/icons/outcome-uncertain";
import OutcomeUnlikelyIcon from "../../shared/components/icons/outcome-unlikely";
import OutcomeNoneIcon from "../../shared/components/icons/outcome-none";
import OutcomeNotImplementedIcon from "../../shared/components/icons/outcome-notimplemented";

import "./program-card.scss";

interface ProgramCardProps {
  outcome: SuccessChance
  displayName: string
  hover: boolean
}

export const ProgramCard: React.SFC<ProgramCardProps> = (props) => {

  const getIcon = (outcome: SuccessChance) => {
    const ICON_SIZE = "16px";
    switch(outcome) {
      case SuccessChance.CERTAIN:
        return <OutcomeCertainIcon invertedColors={true} size={ICON_SIZE} />
      case SuccessChance.LIKELY:
        return <OutcomeLikelyIcon invertedColors={true} size={ICON_SIZE} />;
      case SuccessChance.UNCERTAIN:
        return <OutcomeUncertainIcon invertedColors={true} size={ICON_SIZE} />;
      case SuccessChance.UNLIKELY:
        return <OutcomeUnlikelyIcon invertedColors={true} size={ICON_SIZE} />;
      case SuccessChance.NONE:
        return <OutcomeNoneIcon invertedColors={true} size={ICON_SIZE} />;
      case SuccessChance.NOTIMPLEMENTED:
        return <OutcomeNotImplementedIcon invertedColors={true} size={ICON_SIZE} />;
    }
  };

  const getClassName = (outcome: SuccessChance) => {
    switch(outcome){
      case SuccessChance.CERTAIN:
        return "succ-certain"
      case SuccessChance.LIKELY:
        return "succ-likely"
      case SuccessChance.UNCERTAIN:
        return "succ-uncertain"
      case SuccessChance.UNLIKELY:
        return "succ-unlikely"
      case SuccessChance.NONE:
        return "succ-none"
      case SuccessChance.NOTIMPLEMENTED:
        return "succ-not-implemented"
      default:
        return "succ-not-implemented"
    }
  };
  
  return (
    <div className="program-card">
      <div className={`program-card-icon-container ${getClassName(props.outcome)}`}>
        <div className={`program-card-icon ${getClassName(props.outcome)}`}>
          <DoorOpen width="30px" height="30px" color="#fefefe" open={props.hover}/>
        </div>
        <div className="program-card-outcome-icon">
          { getIcon(props.outcome) }
        </div>
      </div>
      <div className='program-card-displayname'>
        {props.displayName}
      </div>
    </div>
  )

}
