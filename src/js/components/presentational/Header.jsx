import React, { Component } from "react";

export class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let singleListView = this.props.singleListView;
    let addToList = this.props.addToList;
    // we need to check if the yourlists is showing
    // 
    return (
      <header>
          {singleListView ? (
            <div className="menu">
              {addToList ? (
                <div className="menu-items">
                  <strong onClick={this.props.handleSearchView}>View List</strong>
                  {/* <p onClick={this.props.handleSearchView}>Add to this list</p> */}
                </div>
              ) : (
                <div className="menu-items">
                  <strong onClick={this.props.handleListView}>All lists</strong>
                  <p onClick={this.props.handleSearchView}>Add to this list</p>
                </div>
              )}
            </div>
          ) : (
              <div className="menu">
                <p>Account</p>
                <p><strong>Lists</strong></p>
                <p onClick={this.props.handleLocationSearchView}>New List +</p>
              </div>
            )
          }
        </header>
    );
  }
}
