import React, { Component } from 'react';


export class Search extends Component {
  
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      search: '',
      data: '',
      searching: false
    }
    
  }

  getData = async (event) => {
    this.setState({
      searching: true
    });
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
      data: data,
      searching: false
    });
  }


  handleChange = event => {
    this.setState({search: event.target.value});
  }
  
  // componentDidUpdate(){
  // }

  // componentDidMount () {
  //   // console.log('mount');
    
  // }

  render() {
    let handleExistence = (item) => {
      return item ? item : 'N/A';
    }
    let data = this.state.data;
    let searching = this.state.searching;
    if (searching) {
      return <div className="spinner">Loading Data...<span></span></div>;
    }
    return (
      <div className="search-list">
        <form id="search" onSubmit={this.getData}>
          <label htmlFor="search">Search Fred's in Bend, Oregon</label>
          <input id="search" value={this.state.value} type="search" name="search" onChange={this.handleChange} />
        </form>
        <p>Search Results</p>
        {data && data.data.map((d,i)=> {
          return (
          <div key={i} className="product" onClick={this.props.addToList}>
            <div className="product-info-wrapper">
              <div className="product-info">
                <p>Brand:</p>
                <p>{d.brand}</p>
              </div>
              <div className="product-info">
                <p>Product:</p>
                <p>{handleExistence(d.description)}</p>
              </div>

              {d.aisleLocations[0] ? 
              <div className="product-info">
                <p>Location: {handleExistence(d.aisleLocations[0].description)}</p>
                <p>Aisle Number: {handleExistence(d.aisleLocations[0].number)}</p>
                <p>Shelf Number: {handleExistence(d.aisleLocations[0].shelfNumber)}</p>
              </div>
              :
              <div className="product-info">
                <p>no aisle info</p>
              </div>
              }
              {/* check and change if it is on your list already */}
              <strong>Add To List +</strong>
            </div>

            <div className="product-image">
              {
              d.images.map((img,i)=> {
                let src = img.sizes.filter(size => (size.size == 'xlarge'));
                 return img.featured && src[0] &&
                 <img key={i} src={src[0].url } />
                  
              })
            }
            </div>

          </div>
          );
        })}
      </div>

    );
  }
}