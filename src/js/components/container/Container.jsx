import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Header } from "../presentational/Header.jsx";
import { SingleList } from "../presentational/SingleList.jsx";
import { LocationSearch } from "../presentational/LocationSearch.jsx";
import { AllLists } from "../presentational/AllLists.jsx";


class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      singleListView: false,
      list: [],
      listId: '',
      addToList: false,
      locationSearch: false,
      newList: '',
      loggedIn: false
    }
  }

  handleSearchView = () => {
    let addToList = this.state.addToList;
    let handle = !addToList ? true : false;
    this.setState({
      addToList: handle
    });
  }

  // handle location search view
  handleLocationSearchView = () => {
    let locationSearch = this.state.locationSearch;
    let handle = !locationSearch ? true : false;
    this.setState({
      locationSearch: handle,
      singleListView: true
    });
  }


  handleListView = () => {
    let singleListView = this.state.singleListView;
    let handle = !singleListView ? true : false;
    this.setState({
      singleListView: handle,
      locationSearch: false
    });
  }

  handleLoginView = () => {
    let loggedIn = this.state.loggedIn;
    let handle = !loggedIn ? true : false;
    this.setState({
      singleListView: handle
    });
  }



  // getLocation = async () => {
  //   let url = 'https://grocery-map-app.herokuapp.com/get-location'
  //   // let url = 'http://localhost:3000/get-location'
  //   const call = await fetch(url, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     // body: JSON.stringify({search:search})
  //   });
  //   const data = await call.json();
  //   console.log('location', data);
  //   // this.setState({
  //   //   data: data
  //   // });
  // }




  // create list
  createList = async (e) => {
    console.log('create list')

    // create new list 
    // open SingleList with Title already filled - first line, bold
    let locationId = e.currentTarget.id;
    let url = 'https://grocery-map-app.herokuapp.com/create-list'
    // let url = 'http://localhost:3000/create-list'
    const call = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ locationId: locationId })
    });
    const data = await call.json();
    console.log('list created', data);

    data && this.setState({
      singleListView: true,
      locationSearch: false,
      newList: data,
      listId: data._id
    });
  }

  showSingleNote = e => {
    this.setState({
      singleListView: true,
      listId: e.currentTarget.id
    });
  }

  componentDidMount() {
    console.log('mount container');
  }

  render() {
    // let data = this.state.data;
    // let list = this.state.list;
    let listId = this.state.listId;
    let newList = this.state.newList;
    let addToList = this.state.addToList;
    let locationSearch = this.state.locationSearch;
    let singleListView = this.state.singleListView;
    let loggedIn = this.state.loggedIn;
    let view = this.state.view;
    return (
      <main>
        
        {/* {!loggedIn && <Login />} */}
        
        <Header
          singleListView={singleListView}
          listId={listId}
          addToList={addToList}
          createList={this.createList}
          handleListView={this.handleListView}
          handleSearchView={this.handleSearchView}
          handleLocationSearchView={this.handleLocationSearchView}
          />

          <div className="container">
            {singleListView == true ? (
            locationSearch ? (
              <LocationSearch
                createList={this.createList}
              />
            ) : (
                <SingleList
                  listId={listId}
                  addToList={addToList}
                  newList={newList}
                />
              )
            ) : (
              <AllLists
                showSingleNote={this.showSingleNote}
              />
            )}
        </div>
      </main>

    );
  }
}
export default Container;

const wrapper = document.getElementById("app");
wrapper ? ReactDOM.render(<Container />, wrapper) : false;
