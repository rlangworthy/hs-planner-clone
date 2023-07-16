import * as React from "react";

import { 
  OutcomeCounts
} from "../../../shared/types";

import OutcomeCertainIcon from "../../../shared/components/icons/outcome-certain";
import OutcomeLikelyIcon from "../../../shared/components/icons/outcome-likely";
import OutcomeUncertainIcon from "../../../shared/components/icons/outcome-uncertain";
import OutcomeUnlikelyIcon from "../../../shared/components/icons/outcome-unlikely";
import OutcomeNoneIcon from "../../../shared/components/icons/outcome-none";
import OutcomeNotImplementedIcon from "../../../shared/components/icons/outcome-notimplemented";

import "./hs-group.scss";

interface HSGroupProps {
  title: string
  outcomeCounts: OutcomeCounts
}

interface HSGroupState {
  collapsed: boolean
}

class HSGroup extends React.PureComponent<HSGroupProps, HSGroupState> {

  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
    }
  }

  render() {
    const ICON_SIZE = "18px";
    return (
      <div 
        className={`hs-category-container ${this.state.collapsed ? "collapsed" : ""}`}
      >
        <div 
          className="hs-category-header"
          onClick={ ev => this.setState({collapsed: !this.state.collapsed}) }
        >
          <button 
            className={`hs-category-collapse-button ${this.state.collapsed ? "collapsed" : ""}`}
            onClick={ ev => this.setState({collapsed: !this.state.collapsed}) }
          >
            <div className="hs-category-collapse-button-icon">
              {">"}
            </div>
          </button>
          <div className="hs-category-info-container">
            <div className="hs-category-title">
              {this.props.title}
            </div>
            <div className="outcome-counts-wrapper">
              
              {/*commenting out to collapse Certain and Likely Categories
                <div className="outcome-count">
                <div className="outcome-count-icon">
                  <OutcomeCertainIcon 
                    disabled={this.props.outcomeCounts.certain === 0}
                    size={ICON_SIZE}
                  />
                </div>
                <div className="outcome-count-text">
                  {this.props.outcomeCounts.certain > 0 && 
                  this.props.outcomeCounts.certain 
                  }
                </div>
              </div>
                */}
              <div className="outcome-count">
                <div className="outcome-count-icon">
                  <OutcomeLikelyIcon 
                    disabled={this.props.outcomeCounts.likely === 0}
                    size={ICON_SIZE}
                  />
                </div>
                <div className="outcome-count-text">
                  {this.props.outcomeCounts.likely > 0 && 
                  this.props.outcomeCounts.likely 
                  }
                </div>
              </div>

              <div className="outcome-count">
                <div className="outcome-count-icon">
                  <OutcomeUncertainIcon 
                    disabled={this.props.outcomeCounts.uncertain === 0}
                    size={ICON_SIZE}
                  />
                </div>
                <div className="outcome-count-text">
                  {this.props.outcomeCounts.uncertain > 0 && 
                  this.props.outcomeCounts.uncertain 
                  }
                </div>
              </div>

              <div className="outcome-count">
                <div className="outcome-count-icon">
                  <OutcomeUnlikelyIcon 
                    disabled={this.props.outcomeCounts.unlikely === 0}
                    size={ICON_SIZE}
                  />
                </div>
                <div className="outcome-count-text">
                  {this.props.outcomeCounts.unlikely > 0 && 
                  this.props.outcomeCounts.unlikely 
                  }
                </div>
              </div>

              <div className="outcome-count">
                <div className="outcome-count-icon">
                  <OutcomeNoneIcon 
                    disabled={this.props.outcomeCounts.none === 0}
                    size={ICON_SIZE}
                  />
                </div>
                <div className="outcome-count-text">
                  {this.props.outcomeCounts.none > 0 && 
                  this.props.outcomeCounts.none 
                  }
                </div>
              </div>

              <div className="outcome-count">
                <div className="outcome-count-icon">
                  <OutcomeNotImplementedIcon 
                    disabled={this.props.outcomeCounts.notImplemented === 0}
                    size={ICON_SIZE}
                  />
                </div>
                <div className="outcome-count-text">
                  {this.props.outcomeCounts.notImplemented > 0 && 
                  this.props.outcomeCounts.notImplemented 
                  }
                </div> 
              </div>

            </div>
          </div>
        </div>

        <div className="hs-list">
          { this.props.children }
        </div>
    </div>
    );
  }
};

export default HSGroup;
