import React, { Component } from 'react';


export class Search extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      search: '',
      data: null,
      searching: false,
      listId: '',
      location: false
    }

  }


  // favorite items

  // previously added items 

  getLocation = async () => {
    let locationId = this.props.locationId;
    let url = 'https://grocery-map-app.herokuapp.com/get-single-location'
    // let url = 'http://localhost:3000/get-single-location'
    const call = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ locationId: locationId })
    });
    const data = await call.json();
    console.log('location', data);
    this._isMounted &&
      this.setState({
        location: data
      });
  }

  getData = async (event) => {
    this.setState({
      searching: true
    });
    let search = this.state.search;
    let locationId = this.props.locationId;

    event.preventDefault();
    let url = 'https://grocery-map-app.herokuapp.com/get-data';
    // let url = 'http://localhost:3000/get-data';
    const call = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        search: search,
        locationId: locationId
      })
    });
    const data = await call.json();
    // we need more info
    console.log('products', data)
    this._isMounted &&
      this.setState({
        data: data,
        searching: false
      });
  }


  handleChange = event => {
    this.setState({ search: event.target.value });
  }

  componentDidMount() {
    this._isMounted = true;
    this.getLocation();
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.props.showList();
  }

  render() {
    let handleExistence = (item) => {
      return item ? item : 'N/A';
    }
    let list = this.props.list;
    let listId = this.props.listId;
    let data = this.state.data;
    let searching = this.state.searching;
    let location = this.state.location;
    if (searching) {
      return <div className="spinner">Loading Data...<span></span></div>;
    }
    if (!location && !location.data) {
      return <div className="spinner">Loading Location...<span></span></div>;
    }

    let chain = location.data.chain == 'HART' ? 'Harris Teeter' : location.data.chain;
    let state = location.data.address.state;
    let city = location.data.address.city;
    return (
      <div className="search-list">
        {/* <p>Editing: {this.props.title}</p> */}
        <form className="fade-in" id="search" onSubmit={this.getData}>

          <label htmlFor="search">Search {chain} in {city}, {state}</label>
          <input value={this.state.value} type="search" name="search" onChange={this.handleChange} />
        </form>
        <p>Search Results</p>
        {data && data.data.length > 0 ?

          data.data.map((d, i) => {
            let found = list.list.some(l => l.item == d.description)

            return (
              <div className="product-wrapper fade-in" key={i} >

                <form data-listid={listId} className="product" onSubmit={this.props.addToList}>
                  <input type="hidden" name="productName" value={d.description} />
                  <input type="hidden" name="aisle" value={d.aisleLocations[0] ? d.aisleLocations[0].number : ''} />
                  <input type="hidden" name="shelfNum" value={d.aisleLocations[0] ? d.aisleLocations[0].shelfNumber : ''} />
                  <input type="hidden" name="side" value={d.aisleLocations[0] ? d.aisleLocations[0].side : ''} />
                  <div className="product-info-wrapper ">
                    <div className="product-info fade-in">
                      <p className="title">Brand:</p>
                      <p>{d.brand}</p>
                    </div>
                    <div className="product-info fade-in">
                      <p className="title">Product:</p>
                      <p className="product-name">{handleExistence(d.description)}</p>
                    </div>

                    {d.aisleLocations[0] ?
                      <div className="product-info fade-in">
                        <p className="title">Location:</p>
                        <div className="grid">
                          {d.aisleLocations[0].description.includes(d.aisleLocations[0].number) ? (
                            <p className="location">{handleExistence(d.aisleLocations[0].description)}</p>
                          ) : (
                            <>
                              <p className="location">{handleExistence(d.aisleLocations[0].description)}</p>
                              <p className="aisle-num">Aisle {handleExistence(d.aisleLocations[0].number)}</p>
                            </>
                          )}
                          <p className="shelf-num">Shelf Number: {handleExistence(d.aisleLocations[0].shelfNumber)}</p>
                          <p className="side">{d.aisleLocations[0].side === "L" ? 'Left Side' : 'Right Side'}</p>
                        </div>
                      </div>
                      :
                      <div className="product-info fade-in">
                        <p>no aisle info</p>
                      </div>
                    }
                    {found ? (

                      <p><strong className="add-item fade-in oml">On My List</strong></p>
                    ) : (

                      <button><strong className="add-item fade-in">Add To List +</strong></button>
                    )}
                  </div>

                  <div className="product-image">
                    {d.images.map((img, i) => {
                      let src = img.sizes.filter(size => (size.size == 'xlarge'));
                      return img.featured && src[0] &&
                        <img key={i} src={src[0].url} />

                    })}
                  </div>

                </form>
              </div>
            );
          }
          ) : (
            data &&
            <div className="product-info ">
              <p>Sorry no products</p>
            </div>
          )}

      </div>

    );
  }
}