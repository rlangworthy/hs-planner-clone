import * as React from "react";

import OutcomeIconProps from "./outcome-icon-props";

import "./outcome-icon.scss";

import { ICON_STROKE_WIDTH } from "./constants";

const OutcomeLikelyIcon = (props: OutcomeIconProps) => {
  return (
    <svg
      className={`outcome-icon outcome-likely-icon ${props.invertedColors ? "inverted" : ""} ${props.disabled ? "disabled" : ""}`}
      height={props.size}
      width={props.size}
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox="0 0 100 100"
    >
    <circle
      className="bg"
      r="48.511395"
      cy="50"
      cx="50"
      opacity="1"
      fill="none"
      fillOpacity="1"
      stroke="none"
      strokeWidth="0.97720796"
      strokeLinecap="butt"
      strokeLinejoin="miter"
      strokeMiterlimit="1"
      strokeDasharray="none"
      strokeDashoffset="0"
      strokeOpacity="1" 
    />
    <path
      className="fg"
      d="m 15,50 70,0"
      fill="none"
      fillRule="evenodd"
      stroke="#000000"
      strokeWidth={ICON_STROKE_WIDTH}
      strokeLinecap="round"
      strokeLinejoin="miter"
      strokeMiterlimit="4"
      strokeDasharray="none"
      strokeOpacity="1" 
    />
    <path
      className="fg"
      d="m 50,15 0,70"
      fill="none"
      fillRule="evenodd"
      stroke="#000000"
      strokeWidth={ICON_STROKE_WIDTH}
      strokeLinecap="round"
      strokeLinejoin="miter"
      strokeMiterlimit="4"
      strokeDasharray="none"
      strokeOpacity="1" 
    />
  </svg>
  );
}

export default OutcomeLikelyIcon;
