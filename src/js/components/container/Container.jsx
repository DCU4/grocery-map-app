import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Search } from "../presentational/Search.jsx";
import { List } from "../presentational/List.jsx";


class Container extends Component {
    constructor(props) {
        super(props);
        this.state = { 
          data: '',
          search: '',
          listView: true,
          list: ''
        }
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
      console.log('location',data);
      // this.setState({
      //   data: data
      // });
    }

    

    handleListView = () => {
      let listView = this.state.listView;
      let handle = listView ? false : true;
      this.setState({
        listView: handle
      });
    }

    addToList = (e) => {

    }

    deleteFromList = (e) => {

    }
    


    componentDidMount () {
      console.log('mount');
      this.getLocation();
    }

    render() {
      let data = this.state.data;
      let listView = this.state.listView;
      console.log(listView);
      // const res = this.state.res;
      // const compare = this.state.compare;

      // // console.log(deg)
      // if (!this.state.data || data == undefined) {
      //   return <div className="spinner">Loading Data...<span></span></div>;
      // }
      return (
          <main>
            <header>
              <p onClick={this.handleListView}>{listView ? 'Hide List' : 'Show List'}</p>
            </header>
            
            { listView ? (
              <List 
              data={data} 
              />
            ) : (
              <Search
              data={data}
              // getData={this.getData}
              />
            )}

          </main>

        );
    }
}
export default Container;

const wrapper = document.getElementById("app");
wrapper ? ReactDOM.render(<Container />, wrapper) : false;
