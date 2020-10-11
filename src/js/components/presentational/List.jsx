import React, { Component } from 'react';


export class List extends Component {
  
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      list: '',
    }
    
  }

  handleChange =  () =>{
     this.props.onClick();
  }

  
  componentDidUpdate(){
  }

  componentDidMount () {
    // console.log('mount');
    
  }

render() {
  let handleExistence = (item) => {
    return item ? item : 'N/A';
  }
  let data = this.props.data;

    return (
      <div className="list">
       <p>Your list</p>
      </div>

    );
  }
}