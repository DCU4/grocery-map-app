import React, { Component } from 'react';
import { Search } from "../presentational/Search.jsx";

export class SingleList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      list: '',
      title: ''
    }
  }



  showList = async () => {
    let id = this.props.listId;
    console.log('id', id);
    let url = 'https://grocery-map-app.herokuapp.com/' + id;
    // let url = 'http://localhost:3000/' + id;
    const call = await fetch(url);
    const data = await call.json();
    console.log('single list', data);
    this.setState({
      list: data,
      added: false
    });

  }

  addToList = async (e) => {
    e.preventDefault();

    let item = e.currentTarget.querySelector('.product-info:nth-of-type(2) p:nth-of-type(2)').innerText;
    let aisle = e.currentTarget.querySelector('.product-info:nth-of-type(3) p:nth-of-type(2)').innerText;
    let listItem = {};
    listItem.item = item;
    listItem.aisle = aisle;
    let id = e.currentTarget.dataset.listid;
    console.log(listItem)
    let url = 'https://grocery-map-app.herokuapp.com/' + id + '/item?_method=PUT';
    // let url = 'http://localhost:3000/' + id + '/item?_method=PUT';
    const call = await fetch(url, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ list: listItem })
    });
    const data = await call.json();
    console.log('updated list', data);
    this.setState({
      added: true
    });
  }

  deleteFromList = (e) => {

  }

  handleBlur = async (e) => {
    // save title
    let title = e.target.value;
    let id = e.target.id;
    let url = 'https://grocery-map-app.herokuapp.com/' + id + '/title?_method=PUT';
    // let url = 'http://localhost:3000/' + id + '/title?_method=PUT';
    const call = await fetch(url, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title: title })
    });
    const data = await call.json();
    console.log('updated title', data);
  }

  handleChange = e => {
    this.setState({title: e.target.value});
  }

  handleFocus = e => {
    this.setState({title: ''});
  }

  componentDidMount() {
    this.showList();
  }

  render() {
    let list = this.state.list;
    let title = this.state.title;
    let listId = this.props.listId
    let addToList = this.props.addToList;
    let newList = this.props.newList;
    list.list && list.list.sort((a, b) => a.aisle.split(':')[1] - b.aisle.split(':')[1])
    if (!list) {
      return <div className="spinner">Loading List...<span></span></div>;
    }

    let date = new Date(newList ? newList.created : list.created)
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();
    return (
      <div className="list-wrapper">
        {addToList ? (
          <p>Editing {list.title}</p>
        ) : (
            <div className="list-header">
              <input
                id={newList ? newList._id : listId}
                type="text"
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
                value={title}
                onChange={this.handleChange}
                placeholder={newList ? newList.title : (title != '' ? title : list.title)}
              />

              <p>{month+1}/{day}/{year}</p>
            </div>
          )}

        {addToList ? (
          <Search
            locationId={list.locationId}
            listId={listId}
            list={list}
            addToList={this.addToList}
            showList={this.showList}
          />
        ) : (
            <ul className="list">
              <li className="item">
                <span>Item</span>
                <span>Aisle Number</span>
              </li>
              {list.list && list.list.length > 0 ? list.list.map((item, i) => {
                let splitAisleText = item.aisle.split(':');
                return (
                  <li key={i} className="item">
                    <span>{item.item}</span>
                    <span>{splitAisleText[1]}</span>
                  </li>
                );
              }) : (
                  <p>No items in your list</p>
                )}
            </ul>
          )}
      </div>

    );
  }
}