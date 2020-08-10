import * as React from "react";
import { store } from "../shared/redux/store";
import { closeProgramModal } from "../shared/redux/actions";

import { StudentInfoFormContainer } from "./components/student-info-display/student-info-form-container";
import { GradesFormContainer } from "./components/student-info-display/grades-form-container";
import HSProgramsContainer from "./components/hs-display/hs-programs-container";
import { ProgramModalContainer } from "./components/program-modal-container";

import "./path-to-hs.scss";

const App: React.SFC<any> = (props) => {
  return (
    <div 
      className="main-page"
      onKeyUp={ ev => { 
        if (ev.key === 'Escape') { 
          store.dispatch(closeProgramModal()) 
        }
      }}
    >
      <div className="student-data-form-container">
        <StudentInfoFormContainer />
        <GradesFormContainer />
      </div>
      <div className="hs-programs-container">
        <HSProgramsContainer />
      </div>
      <ProgramModalContainer />
    </div>
  );
};

export default App;
