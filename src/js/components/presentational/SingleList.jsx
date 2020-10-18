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
      list: data,
      added: false
    });

  }

  addToList = async (e) => {
    // post request to add to a list
    e.preventDefault();
    

    // let list = this.state.list;
    let item = e.currentTarget.querySelector('.product-info:nth-of-type(2) p:nth-of-type(2)').innerText;
    let aisle = e.currentTarget.querySelector('.product-info:nth-of-type(3) p:nth-of-type(2)').innerText;
    let listItem = {};
    listItem.item = item;
    listItem.aisle = aisle;
    // list.push(listItem);
    // console.log(list)
    // this.setState({
    //   list: list
    // })
    // let form = document.querySelector('')
    // let data = 
    console.log(e.currentTarget)
    let id = e.currentTarget.dataset.listid;
    console.log(listItem)
    let url = 'http://localhost:3000/' + id + '?_method=PUT';
    const call = await fetch(url, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      // headers: {
      //   "Content-Type": "application/x-www-form-urlencoded"
      // },
      // body: new FormData(e.currentTarget)
      body: JSON.stringify({list:listItem})
    });
    const data = await call.json();
    console.log('updated list', data);
    this.setState({
      added: true
    });
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
        {/* {console.log(list.list)} */}
        {list.list.length > 0 ? list.list.map((item,i) => (
        
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