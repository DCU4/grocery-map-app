import React, { Component } from "react";

export class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let singleListView = this.props.singleListView;

    // we need to check if the yourlists is showing
    // 
    return (
      <header>
          {singleListView ? (
            <div className="menu">
              <strong onClick={this.props.handleListView}>All lists</strong>
              <p onClick={this.props.handleSearchView}>Add to this list</p>
            </div>
          ) : (
              <div className="menu">
                <strong>Your Lists</strong>
                <p onClick={this.props.createList}>New List</p>
              </div>
            )
          }
        </header>
    );
  }
}
