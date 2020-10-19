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
    const call = await fetch(`http://localhost:3000/`);
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
    let truncate = (input) => input.length > 8 ? `${input.substring(0, 8)}...` : input;
    if (!lists) {
      return <div className="spinner">Loading Your Lists...<span></span></div>;
    }
    return (
      <div className="your-list-wrapper">

        <ul className="your-list">
          {lists ? lists.lists.map((list, i) => {

            let date = new Date(list.created);
            return (
              <li onClick={this.props.showSingleNote} id={list._id} key={i} className="list">
                <span>{truncate(list.title)}</span>
                <span>{date.toDateString()}</span>
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