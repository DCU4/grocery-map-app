'use strict';
const express = require('express');
const request = require('request');
const cors = require('cors')
const bodyParser = require('body-parser')
// const ejs = require('ejs');
const app = express();
const secret = '6iWG5ZIjtsxFtG8C9QFh7PKnrWBJ0KkgnvQT0JTN';
const client_id = 'dylanjamesconnor-f8de547ab6bccbcb3b53db692a4908148136469803730783131';
let scope = 'product.compact';


app.set('view engine', 'ejs')
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.post('/get-data', (req, res) => {
    let search = req.body.search;
    const btoa = (data) => Buffer.from(data).toString('base64');
    const auth = {
      method: 'POST',
      url: `https://api.kroger.com/v1/connect/oauth2/token?grant_type=client_credentials&scope=${scope}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${btoa(`${client_id}:${secret}`)}`
      }
    };
  
  if (res.statusCode === 200) {
    request(auth, function (error, response, body) {
      if (error) {
        throw new Error(error)
      } else {

        let data = JSON.parse(body);
        const options = {
          method: 'GET',
          url: `https://api.kroger.com/v1/products?filter.term=${search}&filter.locationId=70100021`,
          headers: {
              "Authorization": `Bearer ${data.access_token}`,
              "Accept": "application/json; charset=utf-8"
            }
        };

        request(options, function (error, response, body) { 
          if (error) {
            throw new Error(error)
          } else {
            let data = JSON.parse(body);
            res.json(data);
          }
        });
        
        
      };
    });

  } else {
    return res.status(404);
  }

});



app.post('/get-location', (req, res) => {
  // let search = req.body.search;


if (res.statusCode === 200) {
  authenticate((err, body) => {
    if (err) {
      throw new Error(err)
    } else {
    let data = JSON.parse(body);
    console.log(data);
    const options = {
      method: 'GET',
      url: `https://api.kroger.com/v1/locations?filter.zipCode.near=97701`,
      headers: {
          "Authorization": `Bearer ${data.access_token}`,
          "Accept": "application/json; charset=utf-8"
        }
    };

    request(options, function (error, response, body) { 
      if (error) {
        throw new Error(error)
      } else {
        let data = JSON.parse(body);
        res.json(data);
      }
    });
      }
  });

} else {
  return res.status(404);
}

});


function authenticate(callback) {
  let data;
  const btoa = (data) => Buffer.from(data).toString('base64');
  const auth = {
    method: 'POST',
    url: `https://api.kroger.com/v1/connect/oauth2/token?grant_type=client_credentials&scope=${scope}`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": `Basic ${btoa(`${client_id}:${secret}`)}`
    }
  };

  request(auth, function (error, response, body) {
    if (error) {
      throw new Error(error)
    } else {   
      return callback(error, body);
    }
  });

}



// // Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

module.exports = app;

