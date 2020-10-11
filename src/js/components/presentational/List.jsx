import React, { Component } from 'react';


export class List extends Component {
  
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      // list: '',
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
  let list = this.props.list;

    return (
      <div className="list-wrapper">
       
        <ul className="list">
        {list.map((item,i) => (
          <li key={i} className="item">{item}</li>
        ))}
       </ul>
      </div>

    );
  }
}