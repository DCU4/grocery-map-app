import React, { Component } from 'react';
import { SingleList } from "./SingleList.jsx";

export class AllLists extends Component {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      lists: '',
    }

  }

  getYourLists = async () => {
    let url = 'https://grocery-map-app.herokuapp.com/'
    // let url = 'http://localhost:3000/'
    const call = await fetch(url);
    const data = await call.json();
    console.log('your list', data);
    this.setState({
      lists: data
    });
  }

  handleChange = () => {
    // this.props.onClick();
  }


  componentDidMount() {
    this.getYourLists();
  }

  render() {
    let lists = this.state.lists;
    lists && lists.lists.sort((a, b) => new Date(b.created) - new Date(a.created));
    let truncate = (input) => input.length > 15 ? `${input.substring(0, 15)}...` : input;
    if (!lists) {
      return <div className="spinner">Loading Your Lists...<span></span></div>;
    }
    return (
      <div className="your-list-wrapper">

        <ul className="your-list">
          {lists ? lists.lists.map((list, i) => {

            let date = new Date(list.created);
            let year = date.getFullYear();
            let month = date.getMonth();
            let day = date.getDate();

            return (
              <li onClick={this.props.showSingleNote} id={list._id} key={i} className="list">
                <span>{truncate(list.title)}</span>
                <span>{month+1}/{day}/{year}</span>
                {/* <span>Store</span> */}
              </li>)

          }) : (
              <p>No lists... yet</p>
            )}
        </ul>
      </div>

    );
  }
}