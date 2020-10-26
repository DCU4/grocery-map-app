
// use position of SVG (ids) to map out the location
// use canvas drawing to draw points from one aisle to the next

// recenter button
// by line items



// map directions
// how to show directions
// need to create a forward element - the "you" element
// how does it know to go right or left?

// coordinates on the canvas
// if the dot is to the left of the canvas go -x ?

//  list items 

import React, { Component } from "react";
import { Map } from '../presentational/freds.js';

export class Directions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      you: {
        x: 0,
        y: 0
      },
      itemPoints: {
        x: 0,
        y: 0
      },
      aisleNums: []
    };
  }

  createPoints = () => {
    let list = this.props.list;
    aisleNums = [];
    list.list.forEach(item => {
      let aisleN = item.aisle.split(':');
      aisleNums.push(aisleN[1]);
    });
    this.setState({
      aisleNums: aisleNums
    })
  }

  loadMap = () => {
    // get svg map


    // add points


    // check based of aisle nums

    this.state.aisleNums.forEach(n => {

    })
  }



  componentDidMount() {
    console.log(this.props.list)
  }

  render() {
    
    return (
      <div class="map-wrapper">
        <Map/>
        <canvas id="map"></canvas>
      </div>
    );
  }
}
