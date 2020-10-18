import React, { Component } from 'react';
import { Search } from "../presentational/Search.jsx";

export class SingleList extends Component {
  
  constructor(props) {
    super(props);
    // this.handleChange = this.handleChange.bind(this);
    this.state = {
      list: ''
    }
    
  }

  

  showList = async () => {
    let id = this.props.listId;
    console.log('id',id);
    let url = 'http://localhost:3000/' + id;
    const call = await fetch(url);
    const data = await call.json();
    console.log('single list',data);
    this.setState({
      list: data
    });

  }

  addToList = (e) => {
    // post request to add to a list


    let list = this.state.list;
    let item = e.currentTarget.querySelector('.product-info:nth-of-type(2) p:nth-of-type(2)').innerText;
    let aisle = e.currentTarget.querySelector('.product-info:nth-of-type(3) p:nth-of-type(2)').innerText;
    let listItem = {};
    listItem.item = item;
    listItem.aisle = aisle;
    list.push(listItem);
    console.log(list)
    this.setState({
      list: list
    })
  }
  
  componentDidUpdate(){
  }

  componentDidMount () {
    // console.log('mount');
    this.showList();
    
  }

render() {
  let handleExistence = (item) => {
    return item ? item : 'N/A';
  }
  let list = this.state.list;
  let listId = this.props.listId
  let addToList = this.props.addToList;
  if (!list) {
    return <div className="spinner">Loading List...<span></span></div>;
  }

  let date = new Date(list.created)
    return (
      <div className="list-wrapper">
        <p>{list.title}</p>
        <p>Created: {date.toDateString()}</p>
        {addToList ? (
          <Search
              listId={listId}
              list={list}
              addToList={this.addToList}
            />
        ) : (
      <ul className="list">
        
        {list.length > 0 ? list.map((item,i) => (
          <li key={i} className="item"><span>{item.item}</span><span>{item.aisle}</span></li>
        )) : (
          <p>No items in your list</p>
        )}
      </ul>
        )}
      </div>

    );
  }
}