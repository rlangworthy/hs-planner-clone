import * as React from "react";

import { Program, ProgramOutcome } from "../../shared/types";
import { SuccessChance }from "../../shared/enums";

import { ProgramCard } from "../../shared/components/program-card";

import "./program-modal.scss";

export interface ProgramModalProps {
  visible: boolean
  program: Program | null
  outcome: ProgramOutcome | null
  onCloseButtonClick: (ev) => any
} 

export const ProgramModal: React.SFC<ProgramModalProps> = (props) => {
  
  const toHTML = (string: string):React.ReactElement|null => {
    return <div className="Container" dangerouslySetInnerHTML={{__html: string}}></div>
  }

  const toMessage = (success: SuccessChance): string => {
    let msg: string = "";
    switch(success) {
        /* Commented out to collapse Certain and Likely categories
        case SuccessChance.CERTAIN:
          msg = "You meet this requirement.";
        break;
        */
        case SuccessChance.LIKELY:
          msg = "You are more likely to meet this requirement than other people who apply.";
        break;
        case SuccessChance.UNCERTAIN:
          msg = "You are just as likely to meet this requirement as everyone else.";
        break;
        case SuccessChance.UNLIKELY:
          msg = "You are less likely to meet this requirement than other people who apply."
        break;
        case SuccessChance.NONE:
          msg = "You do not meet this requirement.";
        break;
        case SuccessChance.NOTIMPLEMENTED:
          msg = "We don't know enough about this requirement to tell you.";
        break;
    }
    return msg;
  };

  return (
    <div 
      className={`program-modal-bg-overlay ${props.visible ? "program-modal-active" : ""}`} 
      onClick={props.onCloseButtonClick}
    >
      <div 
        className="program-modal"
        onClick={ ev => ev.stopPropagation() }
      >
        <button 
          className="program-modal-close-button"
          onClick={props.onCloseButtonClick}
        >
          X
        </button>
        <div className="program-modal-header">
          { props.program && props.outcome &&
          <div className="program-modal-program-card-container">
            <ProgramCard outcome={props.outcome.overallChance} displayName={props.program.schoolNameShort} hover={false}/>
          </div>
          }
          { props.program && 
          <span className="program-modal-header-text">{props.program.programName}</span>
          }
        </div>
        <div className="program-modal-body">
          <table className="program-modal-requirements">
            <tbody>
              <tr>
                <td className="program-modal-requirement-type">To Apply:</td>
                <td className="program-modal-requirement-desc">{props.program && props.program.applicationReqDescription}</td>
                <td className="program-modal-requirement-outcome">{props.outcome && toMessage(props.outcome.applicationChance)}</td>
              </tr>
              <tr>
                <td className="program-modal-requirement-type">To Be Selected:</td>
                <td className="program-modal-requirement-desc">{props.program && toHTML(props.program.selectionReqDescription)}</td>
                <td className="program-modal-requirement-outcome">{props.outcome && toMessage(props.outcome.selectionChance)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        { props.program && 
        <div className="program-modal-footer">
          <a className="program-modal-button" target="_none" href={props.program.cpsPageURL}>CPS School Page</a>
          <a className="program-modal-button" target="_none" href={props.program.schoolPageURL}>School Website</a>
          <a className="program-modal-button" target="_none" href={props.program.hsBoundURL}>HS Bound School Page</a>
        </div>
        }
      </div>

    </div>
  )
};
