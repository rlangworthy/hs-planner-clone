import * as React from "react";

import SearchIcon from "../../../shared/components/icons/search";

import "./search-bar.scss";

interface SearchBarProps {
  defaultValue: string
  placeholder?: string
  onSearchSubmit: (searchString: string) => any;
}

interface SearchBarState {
  localValue: string
}

class SearchBar extends React.PureComponent<SearchBarProps, SearchBarState> {

  constructor(props) {
    super(props);
    this.state = {
      localValue: props.defaultValue
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      localValue: nextProps.value
    });
  }

  render() {
    return (
      <div className="search-bar field has-addons">
        <div className="control is-expanded">
          <input 
            className="input is-large"
            type="search" 
            placeholder={this.props.placeholder}
            value={this.state.localValue} 
            onChange={this.handleChange}
        />
        </div>
        <div className="control">
          <button
            className="button is-large"
            onClick={ ev => {
              this.props.onSearchSubmit(this.state.localValue);
            }}
            >
            <SearchIcon width="18px" height="18px"/>
          </button>
        </div>
      </div>
    );
  };

  /* This function is initiaized in constructor */
  private handleChange = (ev) => {
    this.setState({
      localValue: ev.currentTarget.value
    });
  };
};

export default SearchBar;
