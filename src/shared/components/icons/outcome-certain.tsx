import * as React from "react";

import OutcomeIconProps from "./outcome-icon-props";

import "./outcome-icon.scss";

import { ICON_STROKE_WIDTH } from "./constants";

const OutcomeCertainIcon = (props: OutcomeIconProps) => {
  return (
  <svg
    className={`outcome-icon outcome-certain-icon ${props.invertedColors ? "inverted" : ""} ${props.disabled ? "disabled" : ""}`}
    xmlns="http://www.w3.org/2000/svg"
    width={props.size}
    height={props.size}
    viewBox="0 0 100 100"
    version="1.1"
  >
    <circle
      className="bg"
      opacity="1"
      fillOpacity="1"
      stroke="none"
      strokeOpacity="1"
      cx="50"
      cy="50"
      r="48.511395" 
    />
    <path
      className="fg"
      fill="none"
      fillRule="evenodd"
      strokeWidth={ICON_STROKE_WIDTH}
      strokeLinecap="round"
      strokeLinejoin="miter"
      strokeMiterlimit="4"
      strokeDasharray="none"
      strokeOpacity="1"
      d="M 75,25 30.604203,78.502627 19.608671,49.970028"
    />
  </svg> 
  );
};

export default OutcomeCertainIcon;
