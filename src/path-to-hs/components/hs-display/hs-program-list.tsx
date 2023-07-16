import * as React from "react";

import {
  AppState,
  Program,
  ProgramOutcome,
  ProgramDictionary,
  ProgramGroup,
  ProgramOutcomeDictionary,
  OutcomeCounts
} from "../../../shared/types";
import { SuccessChance } from "../../../shared/enums";

import { SearchBar } from "./search-bar";
import HSProgramElement from "./hs-program-element";
import { AdditionalRequirementForm } from "./additional-requirement-form";

import SuccessChanceFilter from "./success-chance-filter";
import HSGroup from "./hs-group";
import "./hs-program-list.scss";
import { connect } from "react-redux";
import { updateStudentSETestPercentile } from "../../../shared/redux/actions";

interface HSProgramListProps {
  programs: ProgramDictionary
  programGroups: ProgramGroup[]
  outcomes: ProgramOutcomeDictionary
  onSelectedProgramChange: (program: Program, outcome: ProgramOutcome | undefined) => any
}

interface HSProgramListState {
  searchTerm: string | null;
  selectedSuccessChance: SuccessChance | null
}


/* 
 * FIXME hardcoded additional requirement field and data; move elsewhere
 * ------------------------------------------------
 * */
interface SETEstPercentileFieldProps {
  value: number | null
  onChange: (value: number) => any
}
const SETestPercentileField: React.SFC<SETEstPercentileFieldProps> = props => {
  return (
    <div className="field fixed-width-med">
      <label className="label">Selective Enrollment Test Percentile</label>
      <input 
        className="input" 
        type="number" 
        value={props.value ? props.value : ""} 
        onChange={ ev => props.onChange(ev.currentTarget.valueAsNumber) } 
      />
    </div>
  )
};
const mapStateToProps = (state: AppState) => {
  return {
    value: state.studentData.seTestPercentile
  }
};
const mapDispatchToProps = (dispatch) => {
  return {
    onChange: value => dispatch(updateStudentSETestPercentile(value)) 
  };
};
const SETestPercentileFieldContainer = connect(mapStateToProps, mapDispatchToProps)(SETestPercentileField);

const additionalRequirements = [
  {
    id: "Selective Enrollment Test",
    field: <SETestPercentileFieldContainer />,
    helpText: 
    <div>
      <p><b>What's this?</b> After you apply to a Selective Enrollment school, you need to take a Selective Enrollment test. Your Selective Enrollment test percentile is used along with your grades to calculate a Selective Enrollment score from 1-900. Your Selective Enrollment score decides whether or not your get accepted to a Selective Enrollment School.</p>
      <p><b>If you haven't taken the Selective Enrollment test yet,</b> use this to set a target score for yourself.</p>
    </div>,
    programIDs: [
      "609726-Selective Enrollment High School", 
      "609755-Selective Enrollment High School", 
      "609749-Selective Enrollment High School",
      "610547-Selective Enrollment High School",
      "609693-Selective Enrollment High School",
      "609720-Selective Enrollment High School",
      "609694-Selective Enrollment High School",
      "610391-Selective Enrollment High School",
      "609751-Selective Enrollment High School",
      "609680-Selective Enrollment High School",
      "609678-Selective Enrollment High School",
    ]
  }
];
/* 
 * END FIXME
 * ---------------------
 * */

class HSProgramList extends React.PureComponent<HSProgramListProps, HSProgramListState> {

  constructor(props) {
    super(props);
    this.state = {
      searchTerm: null,
      selectedSuccessChance: null
    };
  }


  render() {
    return (
      <div
        className="hs-program-list-container"
      >
        <div className="hs-program-list-header">
          <SuccessChanceFilter
            selectedSuccessChance={this.state.selectedSuccessChance}
            onSelectedSuccessChanceChange={ succChance => this.setState({selectedSuccessChance: succChance}) }
          />

          <SearchBar 
            placeholder="Search for schools or programs..."
            defaultValue={this.state.searchTerm ? this.state.searchTerm : ""}
            onSearchSubmit={this.handleSearchSubmit}
          />
        </div>

        <div className="hs-program-list">
          {
          /* 
           * Iterate through the hsProgramGroups passed in through props.
           * For each program group, render a HSGroup component containing the programs
           * with the ids specified in the program group.
           * */
          this.props.programGroups.map( group => {
            // get this group's programs by looking up programIDs.
            const programs: Program[] = group.programIDs.map( programID => this.props.programs[programID] );
            // filter the programs by the current search term and by the current filters on SuccessChance.
            let filteredPrograms = programs;
            if (this.state.searchTerm !== null) {
              filteredPrograms = this.filterBySearchTerm(filteredPrograms, this.state.searchTerm);
            }
            if (this.state.selectedSuccessChance !== null) {
              filteredPrograms = this.filterBySuccessChance(filteredPrograms, this.props.outcomes, this.state.selectedSuccessChance);
            }

            const sortedPrograms = filteredPrograms.sort(this.sortByOutcome);

            let programsWithAddlRequirements: Program[] = []; 
            let programsWithoutAddlRequirements: Program[] = [];
            
            sortedPrograms.forEach( program => {
              const programHasAdditionalRequirement = additionalRequirements.some( addlReq => {
                if ( addlReq.programIDs.some( id => id === program.id )) {
                  return true;
                } else {
                  return false;
                }
              });

              if (programHasAdditionalRequirement) {
                programsWithAddlRequirements.push(program);
              } else {
                programsWithoutAddlRequirements.push(program);
              }
            });

            const outcomeCounts = this.getOutcomeCounts(filteredPrograms, this.props.outcomes);

            if (filteredPrograms.length > 0) {
              return (
                <HSGroup
                  key={group.id}
                  title={group.name}
                  outcomeCounts={outcomeCounts}
                >
                {/* First check to see if any programs have additional requirements. If they do,
                  display the programs wrapped in an AdditionalRequirementsForm. */}
                { programsWithAddlRequirements.length > 0 && 
                  additionalRequirements.map( addlReq => {
                  return <AdditionalRequirementForm
                    key={addlReq.id}
                    field={addlReq.field}
                    helpText={addlReq.helpText}
                  >
                    {programsWithAddlRequirements.map( program => {
                      if (addlReq.programIDs.some( id => id === program.id )) {
                        return (
                          <HSProgramElement
                            key={program.id}
                            program={program}
                            outcome={this.props.outcomes[program.id]}
                            onSelect={this.props.onSelectedProgramChange}
                          />
                        )
                      }
                    })}
                  </AdditionalRequirementForm>
                }) } 

                {/* Display all of the remaining programs that do not have additional requirements. */}
                {programsWithoutAddlRequirements.map( program => {
                  return (
                    <HSProgramElement
                      key={program.id}
                      program={program}
                      outcome={this.props.outcomes[program.id]}
                      onSelect={this.props.onSelectedProgramChange}
                    />
                  );
                })}
                </HSGroup>
              )
            }
          })}
        </div>
      </div>
    );
  }

  private sortByOutcome = (a: Program, b: Program): number => {
    const aOutcome = this.props.outcomes[a.id]
    const bOutcome = this.props.outcomes[b.id]

    function toNumber(outcome: ProgramOutcome | undefined): number {
      if (outcome === undefined) {
        return -1;
      }
      switch(outcome.overallChance) {
          case SuccessChance.CERTAIN: return 5; /*change value to collapse Certain and Likely Categories*/
          case SuccessChance.LIKELY: return 5;
          case SuccessChance.UNCERTAIN: return 4;
          case SuccessChance.UNLIKELY: return 3;
          case SuccessChance.NONE: return 2;
          case SuccessChance.NOTIMPLEMENTED: return 1;
          default: return -1;
      }
    }
    return toNumber(bOutcome) - toNumber(aOutcome);
  }

  private getOutcomeCounts = (programs: Program[], outcomes: ProgramOutcomeDictionary): OutcomeCounts => {
    let counts: OutcomeCounts = {
      certain: 0,
      likely: 0,
      uncertain: 0,
      unlikely: 0,
      none: 0,
      notImplemented: 0
    };
    programs.forEach( program => {
      const outcome = outcomes[program.id];
      if (outcome === undefined) {
        counts.notImplemented += 1;
      } else {
        switch(outcome.overallChance){
          /* Commented out to collapse Certain and Likely cases
          case SuccessChance.CERTAIN:
            counts.certain += 1;
            break;
          */
          case SuccessChance.LIKELY:
            counts.likely += 1;
            break;
          case SuccessChance.UNCERTAIN:
            counts.uncertain += 1;
            break;
          case SuccessChance.UNLIKELY:
            counts.unlikely += 1;
            break;
          case SuccessChance.NONE:
            counts.none += 1;
            break;
          case SuccessChance.NOTIMPLEMENTED:
            counts.notImplemented += 1;
            break;
          default:
            console.warn("Unrecognized SuccessChance for program " + program.id);
            break;
        }
      }
    });
    return counts;
  }

  private filterBySearchTerm = (programs: Program[], searchTerm: string): Program[] => {
    // if search term is empty, return early.
    if (searchTerm.trim() === "") {
      return programs;
    }

    const term = searchTerm.trim().toLowerCase();
    const hasTerm = (text: string) => {
      return text.toLowerCase().indexOf(term) != -1;
    };

    return programs.filter( program => {
      return hasTerm(program.programName) || hasTerm(program.schoolNameLong);
    });
  }

  /** 
   * Keep only the programs whose current outcome's overall chance matches the successChance passed as the third argument.
   * */
  private filterBySuccessChance = (programs: Program[], outcomes: ProgramOutcomeDictionary, successChance: SuccessChance): Program[] => {
    return programs.filter( program => {
      const outcome = outcomes[program.id];
      if (outcome === undefined) {
        console.warn(`Missing outcome for program ${program.programName}`);
        return true;
      }
      return successChance === outcome.overallChance;
    });
  }

  private handleSearchSubmit = (newSearchTerm: string | null) => {
    /* if search term was not cleared, unset any selected success chance filters */
    if (newSearchTerm !== null) {
      this.setState({
        searchTerm: newSearchTerm,
        selectedSuccessChance: null
      });
    } else {
      this.setState({searchTerm: null});
    }
  }

};

export default HSProgramList;
