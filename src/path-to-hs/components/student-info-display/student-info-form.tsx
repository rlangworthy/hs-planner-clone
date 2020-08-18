import * as React from "react"

import { Tooltip } from "react-tippy";
import "react-tippy/dist/tippy.css";
import Select from "react-select";

import "./student-info-form.scss";

interface StudentInfoFormProps {
  addressIsLoading?: boolean

  currEsProgramOptions: string[]
  siblingHSSchoolOptions: string[]

  iep: boolean | null
  onIEPChange: (newVal: boolean) => any
  el: boolean | null
  onELChange: (newVal: boolean) => any
  address: string | null
  onAddressChange: (newVal: string) => any
  tier: string | null
  skip7OrRepeat8: boolean | null
  onSkip7OrRepeat8Change: (newVal: boolean) => any
  currESProgram: {value: string} | null
  onCurrESProgramChange: (newVal: string) => any
  siblingHSSchools: string[]
  onSiblingHSSchoolChange: (newVal: string[]) => any
}

interface StudentInfoFormState {
  showSiblingHSSchools: boolean | null
  showIEPTooltip: boolean
  showELTooltip: boolean
}

export class StudentInfoForm extends React.Component<StudentInfoFormProps, StudentInfoFormState> {

  constructor(props) {
    super(props);
    this.state = {
      showSiblingHSSchools: null,
      showIEPTooltip: false,
      showELTooltip: false
    }
  }

  render() {
    return (
      <div className="student-info-form">
          <h3>Your info</h3>
          <div className="field-group">

            <div className="field fixed-width-small">
              <Tooltip
                html={<span className="tooltip-text-small">An IEP (Individual Education Plan) is a national program for Special Education students with learning disabilities. Not all Special Education students have an IEP. If you don't know whether or not you have an IEP, ask your school's counselor.</span>}
                tabIndex={0}
                arrow={true}
              >
                <label tabIndex={0} className="label is-small multiline has-tooltip">Do you have an IEP?</label>
              </Tooltip>
              <div className="control">
                <div className="select">
                  
                  <select 
                    value={this.props.iep === null 
                      ? "placeholder" 
                      : (this.props.iep === true ? "yes" : "no") }
                    onChange={ ev => ev.currentTarget.value === "yes" 
                      ? this.props.onIEPChange(true) 
                      : this.props.onIEPChange(false) }
                  >
                    <option value="placeholder" disabled></option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>

                </div>
              </div>
            </div>

            <div className="field fixed-width-small">
              <Tooltip
                html={<span className="tooltip-text-small">You are an English Learner student if you qualify for a bilingual education program or an English as a Second Language (ESL) program at your school. Not all bilingual students are English Learners. If you don't know whether or not you are an English Learner student, ask your school's counselor.</span>}
                tabIndex={0}
                arrow={true}
              >
                <label data-tip data-for="el-tooltip" className="label is-small multiline has-tooltip">Are you an English Learner student?</label>
              </Tooltip>
              <div className="control">
                <div className="select">

                  <select 
                    value={this.props.el === null 
                      ? "placeholder" 
                      : (this.props.el === true ? "yes" : "no") }
                    onChange={ ev => ev.currentTarget.value === "yes" 
                      ? this.props.onELChange(true) 
                      : this.props.onELChange(false) }
                  >
                    <option value="placeholder" disabled></option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>

                </div>
              </div>
            </div>

            <div className="field fixed-width-small">
              <label className="label is-small multiline">Did you skip 7th grade or repeat 8th grade?</label>
              <div className="control">
                <div className="select">

                  <select
                    value={this.props.skip7OrRepeat8 === null 
                      ? "placeholder" 
                      : (this.props.skip7OrRepeat8 === true ? "yes" : "no")}
                    onChange={ ev => ev.currentTarget.value === "yes"
                      ? this.props.onSkip7OrRepeat8Change(true) 
                      : this.props.onSkip7OrRepeat8Change(false) }
                  >
                    <option value="placeholder" disabled></option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>

                </div>
              </div>
            </div>
          </div>
          <div className="field-group nowrap">

            <div className="field">
              <label className="label is-small">Your address</label>
              <div className="field has-addons">
                <div className="control is-expanded">
                  
                  <input 
                    value={this.props.address ? this.props.address : ""}
                    onChange={ ev => this.props.onAddressChange(ev.currentTarget.value) }
                    className="input" 
                    type="text" 
                    placeholder="42 Wallaby Way" 
                  />

                </div>
                <div className="control">
                  <div className="button is-static">
                    Chicago, IL
                  </div>
                </div>
              </div>
            </div>

            <div className="field">
              <label className="label is-small">CPS Tier</label>
              <div className="field">
                <div className={`control tier-display-input ${this.props.addressIsLoading ? 'is-loading' : ''}`}>

                  <input 
                    value={this.props.tier && !this.props.addressIsLoading
                      ? this.props.tier 
                      : ""}
                    readOnly 
                    disabled 
                    className="input" 
                    type="text" />

                </div>
              </div>
            </div>
          </div>
            
          <div className="field">
            <label className="label is-small">What elementary school are you in now?</label>
            <div className="control">

              <Select 
                options={this.props.currEsProgramOptions}
                value={this.props.currESProgram}
                onChange={ value => this.props.onCurrESProgramChange(value) }
                placeholder=""
              />

            </div>
          </div>

          <div className="field">
            <label className="label is-small">Do you have a brother or sister at a CPS high school?</label>
              <div className="control">
                <div className="select">

                  <select
                    value={ this.state.showSiblingHSSchools === null ? "placeholder" : (this.state.showSiblingHSSchools === true ? "yes" : "no") }
                    onChange={ ev => {
                      const showSiblingHSSchools = ev.currentTarget.value === "yes" ? true : false;
                      this.setState({
                        showSiblingHSSchools: showSiblingHSSchools
                      });
                      // wipe the student's sibling hs schools if the field is disabled.
                      if (showSiblingHSSchools === false) {
                        this.props.onSiblingHSSchoolChange([]);
                      }
                    }}
                  >
                    <option value="placeholder" disabled></option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>

                </div>
              </div>
          </div>

          <div className="field">
            <label className="label is-small">Which high schools do your brother or sister go to?</label>
            <div className="control">
              <Select 
                disabled={!this.state.showSiblingHSSchools}
                multi
                simpleValue
                options={this.props.siblingHSSchoolOptions}
                value={this.state.showSiblingHSSchools ? this.props.siblingHSSchools.join(",") : ""}
                onChange={ joinedValues => this.props.onSiblingHSSchoolChange(joinedValues.split(",")) }
                placeholder=""
              />
            </div>
          </div>
    </div>
    );
  }
};

export default StudentInfoForm;
