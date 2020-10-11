const express =  require('express')
const { v4: uuidv4 } = require('uuid');
const app = express()
const port = 1000
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const items = require('./services/items');
const users = require('./services/users');

app.use(bodyParser.json());


app.get('/', (req, res) => 
{
    res.send('This is an online marketplace!')
})

//method used to get all items
app.get('/items', (req, res) => 
{
    const t = items.getAllItems();
    res.json(t);
})


//method used to get an item by id
app.get('/items/:itemId', (req, res) => 
{
  //make the link 
  const itemId = req.params.itemId;
  //get a response
  const t = items.getItem(itemId);
  if (t !== undefined)
  {
    //send ok status
    //return the item data with the specific itemId
    res.json(t);
    res.sendStatus(200);
  }
  else
  {
    //not found
    res.sendStatus(404);
  }
})    

//method used to get an item by category
app.get('/items/searchByCategory/:category', (req, res) => 
{
  //make the link 
  const category = req.params.category;
  //get a response
  const t = items.getItemsCategory(category);
  if (t !== undefined)
  {
    //send ok status
    //return the item(s) data within the specific category
    res.json(t);
    res.sendStatus(200);
  }
  else
  {
    //not found
    res.sendStatus(404);
  }
})

//method used to get an item by location
app.get('/items/searchByLocation/:location.city', (req, res) => 
{
  //make the link 
  const location = req.params.location.city
  //get a response
  const t = items.getItemsLocation(location);
  if (t !== undefined)
  {
    //send ok status
    //return the item(s) data with the specific location
    res.json(t);
    res.sendStatus(200);
  }
  else
  {
    //not found
    t.sendStatus(404);
  }
})

//method used to get an item by postingDate
app.get('/items/searchByPostingDate/:postingDate', (req, res) => 
{
  //make the link 
  const postingDate = req.params.postingDate;
  //get a response
  const t = items.getItemsPostingDate(postingDate);
  if (t !== undefined)
  {
    //send ok status
    //return the item(s) data with the specific postingDate
    res.json(t);
    res.sendStatus(200);
  }
  else
  {
    //not found
    t.sendStatus(404);
  }
})


app.get('/users/:id', (req, res) => 
{
    //res.send('You requested id ' + req.params.id);

    const results = users.find(u => u.id == req.params.id);
    
    if(results !== undefined)
    {
        res.json(results);
        res.sendStatus(200);
    }
    else
    {
        res.sendStatus(404);
    }
})


app.put('/users/:id', (req, res) => 
{
    const results = users.find(s => s.id == req.params.id);
    
    if(results !== undefined)
    {
        for (const key in req.body)
        {
            results[key] = req.body[key];
        }
        res.sendStatus(200)
    }
    else
    {
        req.sendStatus(404);
    }
})


app.delete('/users/:id', (req, res) => {
    const results = users.findIndex(t => t.id == req.params.id);

    //if it's found
    if(results !== -1)
    {
        //call the splice
        users.splice(results, 1);
        res.sendStatus(200);
    }
    else
    {
        //nothing is found
        res.sendStatus(404);
    }
})

/*********************************************
 * HTTP Basic Authentication
 * Passport module used
 * http://www.passportjs.org/packages/passport-http/
 ********************************************/
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;

passport.use(new BasicStrategy(
  function(username, password, done) 
  {

    const user = users.getUserByName(username);
    if(user == undefined) 
    {
      // Username not found
      console.log("HTTP Basic username not found");
      return done(null, false, { message: "HTTP Basic username not found" });
    }

    /* Verify password match */
    if(bcrypt.compareSync(password, user.password) == false) 
    {
      // Password does not match
      console.log("HTTP Basic password not matching username");
      return done(null, false, { message: "HTTP Basic password not found" });
    }
    return done(null, user);
  }
));

app.get('/httpBasicProtectedResource',
        passport.authenticate('basic', { session: false }),
        (req, res) => 
{
  res.json({ yourProtectedResource: "profit" });
});

//method used to register a new user with the HTTP basic 
app.post('/registerBasic',
        (req, res) => 
{
  if('username' in req.body == false ) 
  {
    res.status(400);
    res.json({status: "Missing username from body"})
    return;
  }
  if('password' in req.body == false ) 
  {
    res.status(400);
    res.json({status: "Missing password from body"})
    return;
  }
  if('email' in req.body == false ) 
  {
    res.status(400);
    res.json({status: "Missing email from body"})
    return;
  }

  //hash the password
  const hashedPassword = bcrypt.hashSync(req.body.password, 6);
  console.log(hashedPassword);
  //add the user to the users array with the introduced credentials
  users.addUser(req.body.username, hashedPassword, req.body.name, req.body.birthDate, req.body.email, req.body.address);

  //send the created status
  res.sendStatus(201);
});

/*********************************************
 * JWT authentication
 * Passport module is used, see documentation
 * http://www.passportjs.org/packages/passport-jwt/
 ********************************************/
const jwt = require('jsonwebtoken');
const JwtStrategy = require('passport-jwt').Strategy,
      ExtractJwt = require('passport-jwt').ExtractJwt;
const jwtSecretKey = require('./jwt-key.json');


let options = {}

/* Configure the passport-jwt module to expect JWT
   in headers from Authorization field as Bearer token */
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

/* This is the secret signing key.
   You should NEVER store it in code  */
options.secretOrKey = jwtSecretKey.secret;

passport.use(new JwtStrategy(options, function(jwt_payload, done) 
{
  console.log("Processing JWT payload for token content:");
  console.log(jwt_payload);


  /* Here you could do some processing based on the JWT payload.
  For example check if the key is still valid based on expires property.
  */
  const now = Date.now() / 1000;
  if(jwt_payload.exp > now) 
  {
    done(null, jwt_payload.user);
  }
  else 
  {// expired
    done(null, false);
  }
}));

app.get(
  '/jwtProtectedResource',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    console.log("jwt");
    res.json(
      {
        status: "Successfully accessed protected resource with JWT",
        user: req.user
      }
    );
  }
);

//method only for logged in users
//returns all items posted by a specific user identified by sellerInfo
app.get('/itemsJWT', 
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    console.log('GET /itemsJWT')
    //search for specific item(s) based on sellerInfo   
    const t = items.getAllUserItems(req.user.id);
    if(t !== undefined)
    {
      //send status ok
      res.json(t);
      res.sendStatus(200);
      //displaying the item(s) found for the specific sellerInfo introduced
    }
    else
    {
      //no items found for that specific sellerInfo
      res.sendStatus(404);
    }
})

//method only for logged in users
//create a new item as a logged in user
app.post('/itemsJWT', 
  passport.authenticate('jwt', { session: false }),
  (req, res) => 
  {
    console.log('POST /itemsJWT');
    console.log(req.body);
    //if all required fields are introduced then we can create a new item
    if(('title' in req.body) && ( 'description' in req.body) && ( 'category' in req.body) && ( 'location' in req.body) && ( 'images' in req.body) && ( 'price' in req.body) && ( 'deliveryType' in req.body) && ( 'sellerInfo' in req.body)) 
    {
      //posting date assumed as current date in the format yyyy-mm-dd
      let today = new Date().toISOString().slice(0, 10)
      //insert the new item in the items array
      items.insertItem(req.body.title, req.body.description, req.body.category, req.body.location, req.body.images, req.body.price, today, req.body.deliveryType, req.body.sellerInfo, req.user.id);
      
      //display all items added by this user
      res.json(items.getAllUserItems(req.user.id));
      
    }
    else 
    {
      //bad request otherwise
      res.sendStatus(400);
    }  
})

//method only for logged in users
//modify an item found by id
app.put('/itemsJWT/:itemId', 
  passport.authenticate('jwt', { session: false }),
  (req, res) => 
{
  const itemId = req.params.itemId;
  const t = items.getItem(itemId);
  
  const results1 = items.getItem(req.params.itemId);

    if(results1.userId !== req.user.id)
    {
      //user unauthorized
      return res.status(401).json({
        "message": "Unauthorized"
      });
    }


  if(t !== undefined)
    {
      for (const key in req.body)
      {
        t[key] = req.body[key];
      }  
      res.sendStatus(200);
      res.json(items.getAllUserItems(req.user.id));
    }
    else
    {
        res.sendStatus(404);
    }
    
})

  /*
    console.log('PUT /itemsJWT');
    console.log(req.body);

    //search for the item to be modified by id
    const results = items.getItem(req.body.itemId)
    
    if(results !== undefined)
    {
      //if all the required fields are entered we can modify the item, except for the item id, posting date and seller info
      if(('title' in req.body) && ( 'description' in req.body) && ( 'category' in req.body) && ( 'location' in req.body) && ( 'images' in req.body) && ( 'price' in req.body) && ( 'deliveryType' in req.body)) 
      {
        //search for the item and make the replacements
        for (const key in req.body)
        {
          results[key] = req.body[key];
        }
  
        //item modified
        res.sendStatus(200);

        //display all items added/modified by this user
        res.json(items.getAllUserItems(req.body.sellerInfo));
      }
      else 
      {
        //bad request otherwise
        res.sendStatus(400);
      }
    }
    else
    {
      //item not found
      res.sendStatus(404);
    }
})*/

//method only for logged in users
//delete an item based on id
app.delete('/itemsJWT/:itemId', 
            passport.authenticate('jwt', { session: false }), 
            (req, res) => 
{
    //request itemId and search for the item index
    const results = items.getItemIndex(req.params.itemId);

    //get the item to be deleted body 
    const results1 = items.getItem(req.params.itemId);

    if(results1.userId !== req.user.id)
    {
      //user unauthorized
      return res.status(401).json({
        "message": "Unauthorized"
      });

    }

    //if it's found
    if(results !== -1)
    {
        //call the splice
        items.deleteItem(results);
        //send ok status
        res.sendStatus(200);
    }
    else
    {
        //item id not found
        res.sendStatus(404);
    }
}) 


//log in 
app.get(
  '/loginForJWT',
  passport.authenticate('basic', { session: false }),
  (req, res) => 
  {
    const body = {
      id: req.user.id,
      email : req.user.email
    };

    const payload = 
    {
      user : body
    };

    const options = 
    {
      expiresIn: '1d'
    }

    /* Sign the token with payload, key and options.
       Detailed documentation of the signing here:
       https://github.com/auth0/node-jsonwebtoken#readme */
    const token = jwt.sign(payload, jwtSecretKey.secret, options);

    return res.json({ token });
})

//////AUTHENTICATION ENDS HERE






    /*
app.post('/items', (req, res) =>
{
    const newItem = 
    {
        id: uuidv4(),
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        price: req.body.price,
        postingDate: req.body.postingDate,
        location: {
            city: req.body.location.city,
            country: req.body.location.country
        },
        deliveryType: 
            {
              shipping: req.body.deliveryType.shipping,
              pickup: req.body.deliveryType.pickup
            },
        images: 
            {
              image0: req.body.images.image0,
              image1: req.body.images.image1,
              image2: req.body.images.image2,
              image3: req.body.images.image3
            },
        sellerInfo: 
            {
                name: req.body.sellerInfo.name,
                contactInfo: req.body.sellerInfo.email
            }
    }

    //push into users array
    items.push(newItem);

    if(req.body)
        res.sendStatus(200);
    else
        res.sendStatus(400);
    
})
*/
/*app.get('/items/:location.city', (req, res) => 
{
    //res.send('You requested id ' + req.params.id);

    const results = items.find(i => i.location.city == req.params.location.city);
    
    if(results !== undefined)
    {
        res.json(results);
        res.sendStatus(200);
    }
    else
    {
        res.sendStatus(404);
    }
})*/

/*app.get('/items/:location/:country', (req, res) => 
{
    //res.send('You requested id ' + req.params.id);

    const results = items.find(i => i.location.country == req.params.location.country);
    
    if(results !== undefined)
    {
        res.json(results);
        res.sendStatus(200);
    }
    else
    {
        res.sendStatus(404);
    }
})

app.get('/items/:category', (req, res) => 
{
    //res.send('You requested id ' + req.params.id);

    const results = items.find(i => i.category === req.params.category);
    
    if(results !== undefined)
    {
        res.json(results);
        res.sendStatus(200);
    }
    else
    {
        res.sendStatus(404);
    }
})
*/


/*app.get('/items/:postingDate', (req, res) => 
{
    //res.send('You requested id ' + req.params.id);

    const results = items.find(i => i.postingDate === req.params.postingDate);
    
    if(results !== undefined)
    {
        res.json(results);
        res.sendStatus(200);
    }
    else
    {
        res.sendStatus(404);
    }
})*/

 


app.listen(port, () =>
{
    console.log('Example app listening at http://localhost:$(port)');
})

/*
let apiInstance = null;
exports.start = () => {
  apiInstance = app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })
}

exports.stop = () => {
  apiInstance.close();
}*/