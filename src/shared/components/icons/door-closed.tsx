import * as React from "react";

interface SchoolIconProps {
  width: string
  height: string
  color?: string
}

const DoorClosed: React.SFC<SchoolIconProps> = (props) => {
  return (
    <svg 
      width={props.width} 
      height={props.height} 
      fill={props.color} 
      xmlns="http://www.w3.org/2000/svg" 
      x="0px" 
      y="0px"
      viewBox="0 -50 495 545"
      strokeWidth="2"
    >
      <path d="M0,21.479v451.5h34v-82.953h9.99v82.953h196.598V65.78H43.99v55.652H34V55.479h426.459v65.953h-9.988V65.78H253.873   v407.199h196.598v-82.953h9.988v82.953h34v-451.5H0z M198.105,243.021c7.018,0,12.709,5.688,12.709,12.708   s-5.691,12.708-12.709,12.708s-12.709-5.688-12.709-12.708S191.087,243.021,198.105,243.021z M43.99,168.453v174.55H34v-174.55   H43.99z M296.355,268.438c-7.019,0-12.709-5.688-12.709-12.708s5.69-12.708,12.709-12.708c7.018,0,12.709,5.688,12.709,12.708   S303.373,268.438,296.355,268.438z M450.471,343.003v-174.55h9.986v174.55H450.471z"/>
    </svg>
  );
}

export default DoorClosed;
