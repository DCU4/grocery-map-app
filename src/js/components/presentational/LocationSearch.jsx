import React, { Component } from "react";

export class LocationSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locationData: false,
      zipcode: '',
      searching: false
    };
  }

  // search stores in zip
  locationSearch = async (e) => {
    e.preventDefault();
    this.setState({
      searching: true
    });
    let zipcode = this.state.zipcode;
    let url = 'https://grocery-map-app.herokuapp.com/get-locations'
    // let url = 'http://localhost:3000/get-locations'
    const call = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({zipcode:zipcode})
    });
    const data = await call.json();
    console.log('location', data);
    data && this.setState({
      locationData: data,
      searching: false
    });
  }
  

  handleChange = event => {
    this.setState({zipcode: event.target.value});
  }

  handleChangeLocationView = () => {
    this.setState({locationData: false});
  }

  render() {
    let locationData = this.state.locationData;
    let searching = this.state.searching;
    let zipcode = this.state.zipcode;

    if (searching) {
      return <div className="spinner">Loading Data...<span></span></div>;
    }
    return (
      <div className="location-search">

        {!locationData ? (
          <form onSubmit={this.locationSearch}>
          <label>Enter Zipcode</label>
          <input onChange={this.handleChange} name="zipcode" type="text"/>
        </form>
        ): (
          <ul className="list">
          <li className="item">
            <p>Locations in <strong>{zipcode}</strong></p>
            <p onClick={this.handleChangeLocationView}>Change location</p>
          </li>
          {locationData.data.map((store,i) => (
            <li className="item" onClick={this.props.createList} id={store.locationId} key={i}>
              <p>{store.chain =='HART' ? 'Harris Teeter' : store.chain}</p>
              <p>{store.address.city}, {store.address.state}</p>
            </li>
          ))}
          </ul>
        )}
       
      </div>
      
    );
  }
}
