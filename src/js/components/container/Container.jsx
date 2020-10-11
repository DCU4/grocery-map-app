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
          list: []
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
      let list = this.state.list;
      let item = e.currentTarget.querySelector('.product-info:nth-of-type(2) p:nth-of-type(2)').innerText;
      console.log(item)
      list.push(item);
      this.setState({
        list: list
      })
    }

    deleteFromList = (e) => {

    }
    


    componentDidMount () {
      console.log('mount');
      this.getLocation();
    }

    render() {
      let data = this.state.data;
      let list = this.state.list;
      let listView = this.state.listView;
      console.log(this.state.list)
      return (
          <main>
            <header>
            {listView ? (
              <div className="menu">
              <strong>Your list</strong>
              <p onClick={this.handleListView}>Search Store</p>
              </div>
              ) : (
                <div className="menu">
                  <p onClick={this.handleListView}>Show List</p>
                </div>
               )
               }
            </header>
            
            {listView ? (
              <List 
              data={data} 
              list={list}
              />
            ) : (
              <Search
              data={data}
              addToList={this.addToList}
              />
            )}

          </main>

        );
    }
}
export default Container;

const wrapper = document.getElementById("app");
wrapper ? ReactDOM.render(<Container />, wrapper) : false;
