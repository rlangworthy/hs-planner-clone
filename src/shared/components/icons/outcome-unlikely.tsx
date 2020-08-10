import * as React from "react";

import OutcomeIconProps from "./outcome-icon-props";

import "./outcome-icon.scss";

import { ICON_STROKE_WIDTH } from "./constants";

const OutcomeUnlikelyIcon = (props: OutcomeIconProps) => {
  return (
    <svg
      className={`outcome-icon outcome-unlikely-icon ${props.invertedColors ? "inverted" : ""} ${props.disabled ? "disabled" : ""}`}
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox="0 0 100 100"
      height={props.size}
      width={props.size}
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
        display="inline"
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

export default OutcomeUnlikelyIcon;
