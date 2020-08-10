import * as React from "react";

import OutcomeIconProps from "./outcome-icon-props";

import "./outcome-icon.scss";

import { ICON_STROKE_WIDTH } from "./constants";

const OutcomeNotImplementedIcon = (props: OutcomeIconProps) => {
  return (
    <svg
      className={`outcome-icon outcome-notimplemented-icon ${props.invertedColors ? "inverted" : ""} ${props.disabled ? "disabled" : ""}`}
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
        d="M 33.765549,33.564228 C 38.683574,27.023437 48.54118,24.354757 57.154627,27.232269 65.768074,30.109781 70.346272,37.633152 68.752862,45.252511 66.148911,57.704073 49.333904,58.58959 49.333904,58.58959 l 0.79441,11.302297"
        color="#000000"
        clipRule="nonzero"
        display="inline"
        overflow="visible"
        visibility="visible"
        opacity="1"
        fill="none"
        fillOpacity="1"
        fillRule="evenodd"
        stroke="#000000"
        strokeWidth={ICON_STROKE_WIDTH}
        strokeLinecap="butt"
        strokeLinejoin="miter"
        strokeMiterlimit="4"
        strokeDasharray="none"
        strokeDashoffset="0"
        strokeOpacity="1"
        colorRendering="auto"
        imageRendering="auto"
        shapeRendering="auto"
        textRendering="auto"
        enableBackground="accumulate" 
      />
      <circle
        className="fg fg-fill"
        r="5.0912604"
        cy="79.131348"
        cx="50.087566"
        fill="#000000"
        stroke="none"
        strokeWidth="1"
        strokeMiterlimit="4"
        strokeDasharray="none"
      />
  </svg>
  );
};

export default OutcomeNotImplementedIcon;
