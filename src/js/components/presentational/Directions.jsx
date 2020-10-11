import React, { Component } from 'react';


export class Directions extends Component {
  
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      changeChart: false,
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

    return data && (
      <div className="directions-list">
        {data.data.map((d,i)=> {
          return (
          <div key={i} className="product">
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
            <div className="product-info">
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