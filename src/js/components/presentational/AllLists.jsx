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
    console.log('your list',data);
    this.setState({
      lists: data
    });
  }


  

  handleChange =  () =>{
    // this.props.onClick();
  }

  showSingleList = () => {
    // on list click 
  }


  
  componentDidUpdate(){
  }

  componentDidMount () {
    this.getYourLists();
  }

render() {
  let handleExistence = (item) => {
    return item ? item : 'N/A';
  }
  let lists = this.state.lists;
  // lists.sort();
    return (
      <div className="your-list-wrapper">
        
        <ul className="your-list">
          {/* needs ID from single list */}
        {lists ? lists.lists.map((list,i) => (
          <li onClick={this.props.showSingleNote} id={list._id} key={i} className="list">{list.title}</li>
          
        )) : (
          <p>No lists... yet</p>
        )}
       </ul>
      </div>

    );
  }
}