import React, { Component } from 'react';
import { Search } from "../presentational/Search.jsx";
import { Directions } from "../presentational/Directions.jsx";

export class SingleList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      list: '',
      title: '',
      directions: false
    }
  }



  showList = async () => {
    let id = this.props.listId;
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
    this.setState({ title: e.target.value });
  }

  handleFocus = e => {
    this.setState({ title: '' });
  }

  getDirections = () => {
    this.setState({
      directions: true
    })
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
    let directions = this.state.directions;
    list.list && list.list.sort((a, b) => a.aisle.split(':')[1] - b.aisle.split(':')[1])
    if (!list) {
      return <div className="spinner">Loading List...<span></span></div>;
    }

    let date = new Date(newList ? newList.created : list.created)
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();
    return (

      <div className="list-container">

        {directions ? (
          <Directions 
            list={list}
          />
        ) :


          addToList ? (
            <Search
              title={list.title}
              locationId={list.locationId}
              listId={listId}
              list={list}
              addToList={this.addToList}
              showList={this.showList}
            />
          ) : (
              <div className="list-wrapper">
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

                  <p>{month + 1}/{day}/{year}</p>

                </div>
                <ul className="list">
                  <li className="item">
                    <span>Items</span>
                    <span>Aisle #</span>
                  </li>
                  {list.list && list.list.length > 0 ? list.list.map((item, i) => {
                    let splitAisleText = item.aisle.split(':');
                    let aisleNum;
                    if (splitAisleText[1] == ' 0') { 
                      aisleNum = 'Produce Section';
                    } else if(splitAisleText[1] == ' 400') {
                      aisleNum = 'Organic Section';
                    } else { 
                      aisleNum = splitAisleText[1];
                    };

                    return (
                      <li key={i} className="item">
                        <span>{item.item}</span>
                        <span>{aisleNum}</span>
                      </li>
                    );
                  }) : (
                    <li className="item jk">No items in your list</li>
                    )}
                  {/* <p onClick={this.getDirections}>Directions</p> */}
                </ul>
              </div>
            )}

      </div>

    );
  }
}