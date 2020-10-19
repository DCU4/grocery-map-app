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
      // data: '',
      search: '',
      singleListView: false,
      list: [],
      listId: '',
      addToList: false,
      locationSearch: false,
      newList: ''
    }
  }

  handleSearchView = () => {
    let addToList = this.state.addToList;
    let handle = !addToList ? true : false;
    this.setState({
      addToList: handle
    });
  }

  getLocation = async () => {
    const call = await fetch(`http://localhost:3000/get-location`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      // body: JSON.stringify({search:search})
    });
    const data = await call.json();
    console.log('location', data);
    // this.setState({
    //   data: data
    // });
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


  // create list
  createList = async (e) => {
    console.log('create list')
    
    // create new list 
    // open SingleList with Title already filled - first line, bold
    let locationId = e.currentTarget.id;
    const call = await fetch(`http://localhost:3000/create-list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({locationId:locationId})
    });
    const data = await call.json();
    console.log('list created', data);
    
    data && this.setState({
      singleListView: true,
      newList: data
    });
  }



  handleListView = () => {
    let singleListView = this.state.singleListView;
    let handle = !singleListView ? true : false;
    this.setState({
      singleListView: handle
    });
  }

  showSingleNote = e => {
    console.log(e.currentTarget.id);
    this.setState({
      singleListView: true,
      listId: e.currentTarget.id
    });
  }


 



  deleteFromList = (e) => {

  }



  componentDidMount() {
    console.log('mount');

  }

  render() {
    // let data = this.state.data;
    let list = this.state.list;
    let listId = this.state.listId;
    let newList = this.state.newList;
    let addToList = this.state.addToList;
    let locationSearch = this.state.locationSearch;
    let singleListView = this.state.singleListView;
    return (
      <main>
        <Header 
          singleListView={singleListView}
          addToList={addToList}
          createList={this.createList}
          handleListView={this.handleListView}
          handleSearchView={this.handleSearchView}
          handleLocationSearchView={this.handleLocationSearchView}
        />
        
          
        {singleListView == true ? (
          locationSearch ? (
          <LocationSearch 
            createList={this.createList}
          />
        ) : (
        <SingleList
          // data={data} 
          list={list}
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

      </main>

    );
  }
}
export default Container;

const wrapper = document.getElementById("app");
wrapper ? ReactDOM.render(<Container />, wrapper) : false;
