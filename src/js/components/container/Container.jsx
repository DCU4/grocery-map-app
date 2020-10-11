import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Directions } from "../presentational/Directions.jsx";


class Container extends Component {
    constructor(props) {
        super(props);
        this.state = { 
          data: '',
          search: ''
        }
    }

    getData = async (event) => {
      let search = this.state.search;
      event.preventDefault();
      const call = await fetch(`http://localhost:3000/get-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({search:search})
      });
      const data = await call.json();
      console.log('products',data)
      this.setState({
        data: data
      });
    }

    getLocation = async () => {
      // let search = this.state.search;/
      // event.preventDefault();
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

    handleChange = (event) => {
      this.setState({search: event.target.value});
    }
    

    componentDidMount () {
      console.log('mount');
      this.getLocation();
    }

    render() {
      let data = this.state.data;
      // const res = this.state.res;
      // const compare = this.state.compare;

      // // console.log(deg)
      // if (!this.state.data || data == undefined) {
      //   return <div className="spinner">Loading Data...<span></span></div>;
      // }
      return (
          <main>
            <form id="search" onSubmit={this.getData}>
              <label htmlFor="search">Search Fred's in Bend, Oregon</label>
              <input id="search" value={this.state.value} type="search" name="search" onChange={this.handleChange} />
            </form>
            <Directions
            data={data}
            />

          </main>

        );
    }
}
export default Container;

const wrapper = document.getElementById("app");
wrapper ? ReactDOM.render(<Container />, wrapper) : false;
