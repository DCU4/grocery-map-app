import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Header } from "../presentational/Header.jsx";
import { SingleList } from "../presentational/SingleList.jsx";
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
      addToList: false
    }
  }

  handleSearchView = () => {
    
    let addToList = this.state.addToList;
    let handle = addToList ? true : false;
    console.log(addToList);
    this.setState({
      addToList: true
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

  

  // create list
  createList = async () => {
    console.log('create list')
    
    // create new list 
    // open SingleList with Title already filled - first line, bold

    const call = await fetch(`http://localhost:3000/create-list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      // body: JSON.stringify({search:search})
    });
    const data = await call.json();
    console.log('list created', data);
    
    data && this.setState({
      singleListView: true
    });
  }



  handleListView = () => {
    let singleListView = this.state.singleListView;
    let handle = singleListView ? true : false;
    this.setState({
      singleListView: false
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
    let addToList = this.state.addToList;
    let singleListView = this.state.singleListView;
    return (
      <main>
        <Header 
          singleListView={singleListView}
          createList={this.createList}
          handleListView={this.handleListView}
          handleSearchView={this.handleSearchView}
        />
        
          
        {singleListView == true ? (
          
          <SingleList
          // data={data} 
          list={list}
          listId={listId}
          addToList={addToList}
          />
        
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
