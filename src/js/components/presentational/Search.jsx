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


  // to check search results based on the list you are adding to
  getSingleListData = () => {
    let listId = this.props.listId;

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
    let url = 'https://grocery-map-app.herokuapp.com/get-data'
    // let url = 'http://localhost:3000/get-data'
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

    // console.log('search list', data.data);
    return (
      <div className="search-list">
        <form className="fade-in" id="search" onSubmit={this.getData}>

          <label htmlFor="search">Search {location.data.chain} in {location.data.address.city}, {location.data.address.state}</label>
          <input value={this.state.value} type="search" name="search" onChange={this.handleChange} />
        </form>
        {data && data.data.length > 0 ?

          data.data.map((d, i) => {
            let found = list.list.some(l => l.item == d.description)

              return (
                <div className="product-wrapper fade-in" key={i} >
                  <p>Search Results</p>
                  <form data-listid={listId} className="product" onSubmit={this.props.addToList}>
                    <input type="hidden" name="item" value={d.description} />
                    <input type="hidden" name="aisle" value={d.aisleLocations[0] ? d.aisleLocations[0].number : ''} />
                    <div className="product-info-wrapper ">
                      <div className="product-info fade-in">
                        <p>Brand:</p>
                        <p>{d.brand}</p>
                      </div>
                      <div className="product-info fade-in">
                        <p>Product:</p>
                        <p>{handleExistence(d.description)}</p>
                      </div>

                      {d.aisleLocations[0] ?
                        <div className="product-info fade-in">
                          <p>Location: {handleExistence(d.aisleLocations[0].description)}</p>
                          <p>Aisle Number: {handleExistence(d.aisleLocations[0].number)}</p>
                          <p>Shelf Number: {handleExistence(d.aisleLocations[0].shelfNumber)}</p>
                        </div>
                        :
                        <div className="product-info fade-in">
                          <p>no aisle info</p>
                        </div>
                      }
                      {found ? (

                        <strong className="add-item fade-in">On My List</strong>
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