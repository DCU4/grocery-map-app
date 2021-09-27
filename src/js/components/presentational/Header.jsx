import React, { Component } from "react";

export class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listTitle: ''
    };
  }

  showList = async () => {
    let id = this.props.listId;
    let url = 'https://grocery-map-app.herokuapp.com/' + id;
    // let url = 'http://localhost:3000/' + id;
    const call = await fetch(url);
    const data = await call.json();
    console.log('header showList', data);
    this.setState({
      listTitle: data.title
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.listId !== this.props.listId) {
      this.showList();
    }
  }



  render() {
    let singleListView = this.props.singleListView;
    let addToList = this.props.addToList;
    return (
      <header>
          {singleListView ? (
            <div className="menu">
              {addToList ? (
                <div className="menu-items">
                  <strong onClick={this.props.handleSearchView}>View List</strong>
                  <strong>{this.state.listTitle}</strong>
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
