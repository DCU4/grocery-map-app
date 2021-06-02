'use strict';
const express = require('express');
const request = require('request');
const cors = require('cors');
// const passport = require('passport');
const app = express();
// const User = require("./models/user");
const List = require("./models/list");
const mongoose = require('mongoose');
var expressMongoDb = require('express-mongo-db');
const methodOverride = require('method-override');
const fs = require("fs");
let credentials;
if (fs.existsSync('./credentials.json')) {
  credentials = require('./credentials.json');
}
let secret = process.env.secret ? process.env.secret : credentials.secret;
let client_id = process.env.client_id ? process.env.client_id : credentials.client_id;
let db_name = process.env.db_name ? process.env.db_name : credentials.db_name;
let db_pw = process.env.db_pw ? process.env.db_pw : credentials.db_pw;
let scope = 'product.compact';

// mongoose.connect('mongodb://localhost:27017/lists', { useNewUrlParser: true });



const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${db_name}:${db_pw}@cluster0.px8ou.mongodb.net/lists?retryWrites=true&w=majority`;
mongoose.connect(uri, { useNewUrlParser: true });


app.set('view engine', 'ejs')
app.use(cors());
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride('_method'));
// app.use(passport.initialize());
// app.use(passport.session());

// //reads session and encodes or decodes it
// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());


// your list page
app.get('/', function (req, res, next) {
  //Get all lists from DB -- find.({}) means ALL lists

  console.log('showing lists...')
  if (res.statusCode === 200) {

    List.find({}, function (err, allLists) {
      if (err) {
        throw new Error(err)
      } else {
        res.json({ lists: allLists });
      }
    });
  } else {
    return res.status(404);
  }

});




app.post('/create-list', cors(), (req, res) => {
  console.log('creating list...');
  let locationId = {
    locationId: req.body.locationId
  }
  if (res.statusCode === 200) {
    List.create(locationId, function (err, newlyCreated) {
      if (err) {
        //later this should be front end error message
        throw new Error(err);
      } else {
        console.log('new list', newlyCreated);
        res.json(newlyCreated);
      }
    });
  } else {
    return res.status(404);
  }

});

//update list route
app.put('/:id/item', function (req, res) {
  var item = {
    $push: {
      list:
      {
        item: req.body.list.item,
        aisle: req.body.list.aisle
      }
    }
  };

  List.findByIdAndUpdate(req.params.id, item, function (err, updatedNote) {
    if (err) {
      throw new Error(err);
    } else {
      res.json({ message: 'success' });
    }
  });
});

// update title route
app.put('/:id/title', function (req, res) {
  var title = {
    title: req.body.title,
  };

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
        console.log('authenticated!')
        let authData = JSON.parse(body);
        const options = {
          method: 'GET',
          gzip: true,
          url: `https://api.kroger.com/v1/products?filter.term=${search}&filter.locationId=${locationId}`,
          headers: {
            "Authorization": `Bearer ${authData.access_token}`,
            "Accept": "application/json; charset=utf-8"
          }
        };
        request(options, function (error, response, body) {
          if (error) {
            throw new Error('ERRROR:', error)
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
        console.log('authenticated! sending locations...')
        console.log(data)
        const options = {
          method: 'GET',
          url: `https://api.kroger.com/v1/locations?filter.zipCode.near=${zipcode}`,
          headers: {
            "Authorization": `Bearer ${data.access_token}`,
            "Accept": "application/json; charset=utf-8"
          }
        };

        request(options, function (error, response, body) {
          console.log('start request')
          if (error) {
            throw new Error('erra', error)
          } else {
            let data = JSON.parse(body);
            console.log('dataaaa', data);
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

  if (res.statusCode === 200) {
    authenticate((err, body) => {
      if (err) {
        throw new Error(err)
      } else {
        let data = JSON.parse(body);

        console.log('authenticated! sending single location...')
        console.log(data)
        const options = {
          method: 'GET',
          url: `https://api.kroger.com/v1/locations/${locationId}`,
          headers: {
            "Authorization": `Bearer ${data.access_token}`,
            "Accept": "application/json; charset=utf-8"
          }
        };

        request(options, function (error, response, body) {
          console.log('start request')
          if (error) {
            throw new Error('ERROR!!!', error)
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



// Login routes WIP
// app.get('/login', function(req,res){
//   res.render('login');
// });

// //login logic
// app.post('/login', passport.authenticate('local', {
//   successRedirect: '/',
//   failureRedirect:'/login'
// }), function(req,res){

//   console.log(res);
// });


// app.get('/logout', function(req, res){
//   req.logout();
//   // res.redirect('/login');
// });

// app.get('/account', isLoggedIn, function(req, res, next){

// User.findById(req.user.id,function(err,user){
//   if(err) {
//       console.log(err);
//   } else {
//       res.render('account', {user:user});
//   }
// });

// });


// function isLoggedIn(req, res, next) {
//   if(req.isAuthenticated()){
//       return next();
//   }
//   res.redirect('/login');
// }


function authenticate(callback) {
  console.log('authenticating...')
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


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

module.exports = app;
