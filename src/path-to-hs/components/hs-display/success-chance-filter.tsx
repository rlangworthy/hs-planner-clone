import * as React from "react";

import { SuccessChance } from "../../../shared/enums";

import OutcomeCertainIcon from "../../../shared/components/icons/outcome-certain";
import OutcomeLikelyIcon from "../../../shared/components/icons/outcome-likely";
import OutcomeUncertainIcon from "../../../shared/components/icons/outcome-uncertain";
import OutcomeUnlikelyIcon from "../../../shared/components/icons/outcome-unlikely";
import OutcomeNoneIcon from "../../../shared/components/icons/outcome-none";
import OutcomeNotImplementedIcon from "../../../shared/components/icons/outcome-notimplemented";

import "./success-chance-filter.scss";

interface SuccessChanceFilterProps {
  selectedSuccessChance: SuccessChance | null
  onSelectedSuccessChanceChange: (value: SuccessChance | null) => any
}

const ICON_SIZE = "48px";

const SuccessChanceFilter: React.SFC<SuccessChanceFilterProps> = (props) => {
  return (
    <div className="success-chance-filter">
      {/*
      //Commenting out Certain Button to collapse certain and more likely buttons
        <button 
          className={`success-chance-filter-button ${props.selectedSuccessChance === SuccessChance.CERTAIN ? "depressed" : ""}`}
          onClick={ ev => props.selectedSuccessChance === SuccessChance.CERTAIN
            ? props.onSelectedSuccessChanceChange(null)
            : props.onSelectedSuccessChanceChange(SuccessChance.CERTAIN)
          }
        >
          <div className="success-chance-filter-button-icon">
            <OutcomeCertainIcon 
              size={ICON_SIZE} 
              disabled={props.selectedSuccessChance !== null && props.selectedSuccessChance !== SuccessChance.CERTAIN}
            />
          </div>
          <div className="success-chance-filter-button-text">
            You will almost certainly be accepted.
          </div>
        </button>
        */}
      <button 
        className={`success-chance-filter-button ${props.selectedSuccessChance === SuccessChance.LIKELY ? "depressed" : ""}`}
        onClick={ ev => props.selectedSuccessChance === SuccessChance.LIKELY
          ? props.onSelectedSuccessChanceChange(null)
          : props.onSelectedSuccessChanceChange(SuccessChance.LIKELY)
        }
      >
        <div className="success-chance-filter-button-icon">
          <OutcomeLikelyIcon 
            size={ICON_SIZE} 
            disabled={props.selectedSuccessChance !== null && props.selectedSuccessChance !== SuccessChance.LIKELY}
          />
        </div>
        <div className="success-chance-filter-button-text">
          You're more likely to be accepted than other students.
        </div>
      </button>

      <button 
        className={`success-chance-filter-button ${props.selectedSuccessChance === SuccessChance.UNCERTAIN ? "depressed" : ""}`}
        onClick={ ev => props.selectedSuccessChance === SuccessChance.UNCERTAIN
          ? props.onSelectedSuccessChanceChange(null)
          : props.onSelectedSuccessChanceChange(SuccessChance.UNCERTAIN)
        }
      >
        <div className="success-chance-filter-button-icon">
          <OutcomeUncertainIcon
            size={ICON_SIZE}
            disabled={props.selectedSuccessChance !== null && props.selectedSuccessChance !== SuccessChance.UNCERTAIN}
          />
        </div>
        <div className="success-chance-filter-button-text">
          You're about as likely to be accepted as other students.
        </div>
      </button>

      <button 
        className={`success-chance-filter-button ${props.selectedSuccessChance === SuccessChance.UNLIKELY ? "depressed" : ""}`}
        onClick={ ev => props.selectedSuccessChance === SuccessChance.UNLIKELY
          ? props.onSelectedSuccessChanceChange(null)
          : props.onSelectedSuccessChanceChange(SuccessChance.UNLIKELY)
        }
      >
        <div className="success-chance-filter-button-icon">
          <OutcomeUnlikelyIcon 
            size={ICON_SIZE}
            disabled={props.selectedSuccessChance !== null && props.selectedSuccessChance !== SuccessChance.UNLIKELY}
          />
        </div>
        <div className="success-chance-filter-button-text">
          You're less likely to be accepted than other students.
        </div>
      </button>

      <button 
        className={`success-chance-filter-button ${props.selectedSuccessChance === SuccessChance.NONE ? "depressed" : ""}`}
        onClick={ ev => props.selectedSuccessChance === SuccessChance.NONE
          ? props.onSelectedSuccessChanceChange(null)
          : props.onSelectedSuccessChanceChange(SuccessChance.NONE)
        }
      >
        <div className="success-chance-filter-button-icon">
          <OutcomeNoneIcon 
            size={ICON_SIZE}
            disabled={props.selectedSuccessChance !== null && props.selectedSuccessChance !== SuccessChance.NONE}
          />
        </div>
        <div className="success-chance-filter-button-text">
          You probably won't be accepted.
        </div>
      </button>

      <button 
        className={`success-chance-filter-button ${props.selectedSuccessChance === SuccessChance.NOTIMPLEMENTED ? "depressed" : ""}`}
        onClick={ ev => props.selectedSuccessChance === SuccessChance.NOTIMPLEMENTED
          ? props.onSelectedSuccessChanceChange(null)
          : props.onSelectedSuccessChanceChange(SuccessChance.NOTIMPLEMENTED)
        }
      >
        <div className="success-chance-filter-button-icon">
          <OutcomeNotImplementedIcon
            size={ICON_SIZE}
            disabled={props.selectedSuccessChance !== null && props.selectedSuccessChance !== SuccessChance.NOTIMPLEMENTED}
          />
        </div>
        <div className="success-chance-filter-button-text">
          We don't have enough information to tell you.
        </div>
      </button>

    </div>
  )
};

export default SuccessChanceFilter;
