import * as React from "react";
import * as Autosuggest from "react-autosuggest";

import { AppState, ProgramDictionary } from "../../../shared/types";
import { store } from "../../../shared/redux/store";
import SearchIcon from "../../../shared/components/icons/search";

import "./search-bar.scss";
interface Suggestion {
  value: string
  matchStart: number
  matchEnd: number
}
type Suggestions = Array<{
  title: "Programs" | "Program Types" | "Schools"
  suggestions: Suggestion[]
}>;


const getProgramDict = (state: AppState) => state.data.hsPrograms;

/* getSuggestions gets a list of search suggestions for highschool programs from 
 * a ProgramDictionary. The numSuggestions argument determines how many suggestions to return. */
const getSuggestions = (programDict: ProgramDictionary, query: string, numSuggestions = 10 ): Suggestions => {

  const getMatch = (query: string, str: string): {doesMatch: boolean, start: number, end: number} => {
    const q = query.trim().toLowerCase();
    const s = str.trim().toLowerCase();
    const isLeftSubstring = (q,s) => s.slice(0, q.length) === q;

    let start = 0;
    let end = 0;

    // at the start of each word boundary in s, check for a match
    const doesMatch = s.split('').some( (char, i) => {
      if (i === 0) {
        if (isLeftSubstring(q, s)) {
          start = i;
          end = start + q.length;
          return true;
        }
      }
      if (char === " ") {
        const rightString = s.slice(i + 1);
        if (isLeftSubstring(q, rightString)) {
          start = i + 1;
          end = start + q.length;
          return true;
        }
      }
      return false;
    });

    return {doesMatch, start, end};
  };

  // use hash maps to store matches without repeats.
  // (programTypes and schools are not unique to programs,
  // so we would have to check for duplicates otherwise).
  let programTypeMatches = {};
  let schoolMatches = {};
  let programMatches = {};

  // Iterate through ProgramDict until we have numSuggestions matches.
  // Object.some is used here to exit from the iteration early. We'll
  // return true once we've got ten matches, or we'll reach
  // the end of the array.
  Object.keys(programDict).some( programID => {
    const program = programDict[programID];

    const programTypeMatch = getMatch(query, program.programType);
    if (programTypeMatch.doesMatch) {
      programTypeMatches[program.programType] = programTypeMatch;
    }
    const schoolMatch = getMatch(query, program.schoolNameLong);
    if (schoolMatch.doesMatch) {
      schoolMatches[program.schoolNameLong] = schoolMatch;
    }
    const programMatch = getMatch(query, program.programName);
    if (programMatch.doesMatch) {
      programMatches[program.programName] = programMatch;
    }

    // see how many matches we have; if we have enough, exit early.
    const numProgramTypeMatches = Object.keys(programTypeMatches).length;
    const numSchoolMatches = Object.keys(schoolMatches).length;
    const numProgramMatches = Object.keys(programMatches).length;
    if (numProgramTypeMatches + numSchoolMatches + numProgramMatches >= numSuggestions) {
      return true;
    } else {
      return false;
    }
  });

  // convert our hash maps of matches to a Suggestions object
  let suggestions: Suggestions = [];
  if (Object.keys(programTypeMatches).length !== 0) {
    suggestions.push({
      title: "Program Types",
      suggestions: Object.keys(programTypeMatches).map( value => {
        const match = programTypeMatches[value];
        return {
          value: value,
          matchStart: match.start,
          matchEnd: match.end
        }
      })
    });
  }
  if (Object.keys(schoolMatches).length !== 0) {
    suggestions.push({
      title: "Schools",
      suggestions: Object.keys(schoolMatches).map( value => {
        const match = schoolMatches[value];
        return {
          value: value,
          matchStart: match.start,
          matchEnd: match.end
        }
      })
    });
  }
  if (Object.keys(programMatches).length !== 0) {
    suggestions.push({
      title: "Programs",
      suggestions: Object.keys(programMatches).map( value => {
        const match = programMatches[value];
        return {
          value: value,
          matchStart: match.start,
          matchEnd: match.end
        }
      })
    })
  }
  return suggestions;
};



interface SearchBarProps {
  placeholder: string
  defaultValue: string
  onSearchSubmit: (searchTerm: string | null) => any
}

interface SearchBarState {
  query: string
  suggestions: Suggestions
}

export class SearchBar extends React.PureComponent<SearchBarProps, SearchBarState> {

  constructor(props) {
    super(props);
    this.state = {
      query: props.defaultValue,
      suggestions: []
    }
  }

  render() {
    return (
      <div 
        className="program-search-bar field has-addons"
        onKeyUp={ ev => ev.key === "Enter" && this.props.onSearchSubmit(this.state.query) }
      >
        <div className="control is-expanded">
          <Autosuggest
            inputProps={{
              className:"input",
              type:"search",
              placeholder:"Search for schools or programs...",
              value: this.state.query,
              onChange: this.handleQueryChange
            }}
            multiSection={true}
            suggestions={this.state.suggestions}
            renderSuggestion={this.renderSuggestion}
            renderSectionTitle={this.renderSectionTitle}
            getSectionSuggestions={ section => section.suggestions }
            getSuggestionValue={ suggestion => {
              return suggestion.value;
            }}
            onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
            onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
            onSuggestionSelected={this.handleSuggestionSelected}
          />
        </div>
        <div className="control">
          <button
            className="button"
            onClick={ ev => {
              this.props.onSearchSubmit(this.state.query);
            }}
          >
          <SearchIcon width="18px" height="18px"/>
          Search
        </button>
      </div>
    </div>
    );
  }

  /*
   * renderSuggestion returns the DOM of each suggestion in react-autosuggest element
   * */
  private renderSuggestion = (suggestion: Suggestion, {query, isHighlighted}): React.ReactNode => {
    // boldface the query part of each search suggestion
    return <div className={`suggestion-item ${isHighlighted ? "is-highlighted" : ""}`}>
      {suggestion.value.slice(0, suggestion.matchStart)}
      <strong>{suggestion.value.slice(suggestion.matchStart, suggestion.matchEnd)}</strong>
      {suggestion.value.slice(suggestion.matchEnd)}
    </div>
  }
  private renderSectionTitle = (section): React.ReactNode => {
    return <div className="section-title">{section.title}</div>
  }

  private handleSuggestionsFetchRequested = ({value}): void => {
    this.setState({
      suggestions: getSuggestions(getProgramDict(store.getState() as AppState), value)
    });
  }

  private handleSuggestionsClearRequested = (): void => {
    this.setState({
      suggestions: []
    });
  }

  private handleQueryChange = (ev, {newValue}) => {
    if (newValue === "") {
      this.props.onSearchSubmit(null);
    }
    this.setState({
      query: newValue,
    });
  }

  private handleSuggestionSelected = (ev, {suggestionValue}) => {
    this.props.onSearchSubmit(suggestionValue);
  }
}
