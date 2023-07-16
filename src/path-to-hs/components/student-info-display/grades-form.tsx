import * as React from "react";

import { Tooltip } from "react-tippy";
import "react-tippy/dist/tippy.css";
import { LetterGrade } from "../../../shared/types";

import "./grades-form.scss";

export interface GradesFormProps {
  hsatMath: number | null
  onHSATMathChange: (newVal: number) => any
  hsatRead: number | null
  onHSATReadChange: (newVal: number) => any

  attendancePercentage: number | null;
  onAttendancePercentageChange: (newVal: number) => any

  mathGrade: LetterGrade | null
  onMathGradeChange: (newVal: LetterGrade) => any
  readGrade: LetterGrade | null
  onReadGradeChange: (newVal: LetterGrade) => any
  scienceGrade: LetterGrade | null
  onScienceGradeChange: (newVal: LetterGrade) => any
  socialStudiesGrade: LetterGrade | null
  onSocialStudiesGradeChange: (newVal: LetterGrade) => any

  gpa: number | null
}

export const GradesForm: React.SFC<GradesFormProps> = (props) => {
  return (
    <div className="grades-form">

      <h3>Grades and Attendance</h3>

      <div className="field fixed-width-small">
        <Tooltip
          html={<span className="tooltip-text">Your attendance percentage measures how many days you attended school. If you missed 10 days of school in a normal school year, your attendance percentage would be around 94%.<br/>You can find your attendance percentage on your report card.</span>}
          tabIndex={0}
          arrow={true}
        >
          <label tabIndex={0} className="label is-small has-tooltip">Attendance Percentage</label>
        </Tooltip>
        <div className="control">

          <input
            value={props.attendancePercentage === null ? "" : props.attendancePercentage}
            onChange={ ev => props.onAttendancePercentageChange(ev.currentTarget.valueAsNumber) }
            className="input"
            type="number"
          />

        </div>
      </div>

      <div className="field-group distribute-left">
        <div className="field fixed-width-med">
          <label className="label is-small">HSAT Math percentile</label>
          <div className="control">

            <input 
              value={props.hsatMath === null ? "" : props.hsatMath}
              onChange={ ev => props.onHSATMathChange(ev.currentTarget.valueAsNumber) }
              className="input" 
              type="number" 
            />

          </div>
        </div>

        <div className="field fixed-width-med">
          <label className="label is-small">HSAT Reading percentile</label>
          <div className="control">

          <input 
              value={props.hsatRead === null ? "" : props.hsatRead}
              onChange={ ev => props.onHSATReadChange(ev.currentTarget.valueAsNumber) }
              className="input" 
              type="number" 
            />

          </div>
        </div>
      </div>

      <div className="field-group">
        <div className="field fixed-width-small">
          <label className="label is-small multiline">Math Grade</label>
          <div className="control">
            <div className="select">

              <select
                value={props.mathGrade === null ? "placeholder" : props.mathGrade}
                onChange={ ev => props.onMathGradeChange(ev.currentTarget.value as LetterGrade) }
              >
                <option value="placeholder" disabled></option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="F">F</option>
              </select>

            </div>
          </div>
        </div>

        <div className="field fixed-width-small">
          <label className="label is-small multiline">Reading Grade</label>
          <div className="control">
            <div className="select">

              <select
                value={props.readGrade === null ? "placeholder" : props.readGrade}
                onChange={ ev => props.onReadGradeChange(ev.currentTarget.value as LetterGrade) }
              >
                <option value="placeholder" disabled></option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="F">F</option>
              </select>

            </div>
          </div>
        </div>

        <div className="field fixed-width-small">
          <label className="label is-small multiline">Science Grade</label>
          <div className="control">
            <div className="select">

              <select
                value={props.scienceGrade === null ? "placeholder" : props.scienceGrade}
                onChange={ ev => props.onScienceGradeChange(ev.currentTarget.value as LetterGrade) }
              >
                <option value="placeholder" disabled></option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="F">F</option>
              </select>

            </div>
          </div>
        </div>

        <div className="field fixed-width-small">
          <label className="label is-small multiline">Social Studies Grade</label>
          <div className="control">
            <div className="select">

              <select
                value={props.socialStudiesGrade === null ? "placeholder" : props.socialStudiesGrade}
                onChange={ ev => props.onSocialStudiesGradeChange(ev.currentTarget.value as LetterGrade) }
              >
                <option value="placeholder" disabled></option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="F">F</option>
              </select>

            </div>
          </div>
        </div>

        <div className="field fixed-width-small">
          <Tooltip
            html={<span className="tooltip-text">A GPA (Grade Point Average) combines all of your grades together into one number. If all of your grades are 'A', you have a 4.0 GPA. If all of your grades are 'B's, you have a 3.0 GPA.</span>}
            tabIndex={0}
            arrow={true}
          >
            <label tabIndex={0} className="label is-small multiline has-tooltip">GPA</label>
          </Tooltip>
          <div className="control gpa-display">
            <input 
              value={props.gpa === null ? "" : props.gpa.toFixed(2)}
              readOnly 
              disabled 
              className="input" 
              type="text" 
            />
          </div>
        </div>

      </div>
    </div>
  );
}
