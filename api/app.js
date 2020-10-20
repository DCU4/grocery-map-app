'use strict';
const express = require('express');
const request = require('request');
const cors = require('cors')
const bodyParser = require('body-parser')
// const ejs = require('ejs');
const app = express();
const User = require("./models/user");
const List = require("./models/list");
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const secret = '6iWG5ZIjtsxFtG8C9QFh7PKnrWBJ0KkgnvQT0JTN';
const client_id = 'dylanjamesconnor-f8de547ab6bccbcb3b53db692a4908148136469803730783131';
let scope = 'product.compact';

// mongoose.connect('mongodb://localhost:27017/lists', { useNewUrlParser: true });
// mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://dc:VamosCadbury4!@cluster0.px8ou.mongodb.net/lists?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  // const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});


app.set('view engine', 'ejs')
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(methodOverride('_method'));


// your list page
app.get('/', function (req, res, next) {
  //Get all kees from DB -- find.({}) means ALL kees

  List.find({}, function (err, allLists) {
      if (err) {
        throw new Error(err)
      } else {
        // console.log(allLists);
          // res.render('/',{notes: allLists });
          res.send({ lists: allLists });
          // res.send('sending data from server');
          // console.log(allNotes);
          // console.log(req.user.username);

      }
  });

});



app.post('/create-list', (req, res) => {
  console.log(req.body.locationId);
  let locationId = {
    locationId: req.body.locationId
  }
  if (res.statusCode === 200) {
    List.create(locationId, function (err, newlyCreated) {
      if (err) {
        //later this should be front end error message
        throw new Error(err);
      } else {
        // res.redirect('/');
        console.log(newlyCreated);
        res.json(newlyCreated);
        // console.log(req.body._id);
      }
  });
  } else {
    return res.status(404);
  }

});

//update list route
app.put('/:id/item', function(req,res) {
  var item = { 
    $push: { list: 
        { item: req.body.list.item, 
          aisle: req.body.list.aisle 
        } 
      } 
    };


  // console.log(req.body)
  List.findByIdAndUpdate(req.params.id, item, function (err, updatedNote) {
    if (err) {
      throw new Error(err);
    } else {
      res.json({ message: 'success' });
    }
  });
});

// update title route
app.put('/:id/title', function(req,res) {
  var title = { 
    title: req.body.title,
    };


  // console.log(req.body)
  List.findByIdAndUpdate(req.params.id, title, function (err, updatedNote) {
    if (err) {
      throw new Error(err);
    } else {
      res.json({ message: 'success' });
    }
  });
});


app.get('/:id', function (req, res) {
  // find list with correct id, render the template
  List.findById(req.params.id, function (err, foundList) {
      if (err) {
          throw new Error(err);
      } else {
        console.log(foundList);
        res.json(foundList);
      }
  });

});




app.post('/get-data', (req, res) => {
  let search = req.body.search;
  let locationId = req.body.locationId;
  
  if (res.statusCode === 200) {
    authenticate((err, body) => {
      if (err) {
        throw new Error('auth ERROR', err);
      } else {
        let data = JSON.parse(body);
        const options = {
          method: 'GET',
          gzip: true,
          url: `https://api.kroger.com/v1/products?filter.term=${search}&filter.locationId=${locationId}`,
          headers: {
            "Authorization": `Bearer ${data.access_token}`,
            "Accept": "application/json; charset=utf-8"
          }
        };
        request(options, function (error, response, body) {
          if (error) {
            throw new Error('ERRROR:',error)
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



app.post('/get-locations', (req, res) => {
  let zipcode = req.body.zipcode;

  if (res.statusCode === 200) {
    authenticate((err, body) => {
      if (err) {
        throw new Error(err)
      } else {
        let data = JSON.parse(body);
        // console.log(data);
        const options = {
          method: 'GET',
          url: `https://api.kroger.com/v1/locations?filter.zipCode.near=${zipcode}`,
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


app.post('/get-single-location', (req, res) => {
  let locationId = req.body.locationId;
  console.log(locationId)

  if (res.statusCode === 200) {
    authenticate((err, body) => {
      if (err) {
        throw new Error(err)
      } else {
        let data = JSON.parse(body);
        const options = {
          method: 'GET',
          url: `https://api.kroger.com/v1/locations/${locationId}`,
          headers: {
            "Authorization": `Bearer ${data.access_token}`,
            "Accept": "application/json; charset=utf-8"
          }
        };

        request(options, function (error, response, body) {
          if (error) {
            throw new Error('ERROR!!!',error)
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


function removeByteOrderMark(str){
  return str.replace(/^\ufeff/g,"")
}

function authenticate(callback) {
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

