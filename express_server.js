const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080; // default port 8080
const methodOverride = require("method-override") //gives express ability to allow server to respond to nons differently

const bodyParser = require("body-parser"); //allows use to grab shit from body
const cookieParser = require('cookie-parser'); //
const bcrypt = require('bcrypt');

//connections to mongo

//Route has 2 pieces > HTTP

// app.use(cookieSession(
// const password = "purple-monkey-dinosaur"; // you will probably this from req.params
// const hashed_password = bcrypt.hashSync(password, 10);

//res.cookie - to set values to cookiess
// const cookieSession = require('cookie-session')
app.use(bodyParser.urlencoded({ extended: true }));
// app.use connects body parser to express
app.set("view engine", "ejs");
app.use(cookieParser())


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


//-------------------------------------------DATA

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

var users =  {'123456': { username: 'lydia', email: 'lydia@email.com', password: 'pw0'}};

//-------------------------------------------ROUTES
//GET DATA
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/", (req, res) => {
  //Check if cookie present, not > login
  if (req.cookies) {
    res.redirect("/urls")
  } else {
    res.redirect("/login");
  }
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase,
  email: req.cookies.email};
  // input: req.body.username};
  res.render("urls_index", templateVars);
});


// CREATE URL
app.get("/urls/create", (req, res) => {
  let templateVars = { email: req.cookies.email};
  res.render("urls_new", templateVars);
});

// REDIRECT TO LONGURL BY USING SHORT
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { urls: urlDatabase,
    email: req.cookies.email};
  let longURL = req.body.longURL;
  res.render("urls_show", {shortURL: req.params.shortURL});
});

// LOGIN PAGE
app.get("/login", (req, res) => {
    let templateVars = { urls: urlDatabase,
      email: ''
    };
  // username: req.signedCookies.username};
  // var username = req.body.username;}
  // var hash = bcrypt.hashSync('testing', 10);
  // console.log(hash);
  res.render("urls_index", templateVars);
});

// REDIRECT TO LONG URL BY ENTERING SHORTURL ID
app.get("/u/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  let longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});

// CREATE NEW SHORT URL
app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const newshortURL = generateRandomString();
  urlDatabase[newshortURL] = longURL;
  res.redirect("/urls");
});

// CREATE NEW LONG URL
app.post("/urls/:shortURL/update", (req, res) => {
  const newURL = (req.body.longURL);
  const oldURL = urlDatabase[req.params.shortURL];
  urlDatabase[req.params.shortURL] = newURL
  res.redirect("/urls");
});

// DELETE URL by ID
app.post("/urls/:id/delete", (req, res) => {
  let templateVars = { shortURL: req.params.id };
  delete urlDatabase[templateVars.shortURL];
  res.redirect("/urls");
});

// CHECK IF LOGGED IN
app.post("/login", (req, res) => {
  for (let user in users) {
    if (req.body.email === users[user].email && req.body.password === users[user].password) {
      res.cookie("userid", user)
      res.cookie("email", users[user].email)
      res.redirect("/urls");
    } else {
      res.redirect(403, "/")
    }
  }
});

// LOGOUT & DELETE COOKIE
app.post("/logout", (req, res) => {
  const username = req.body.username
  res.clearCookie('email');
  res.redirect('/login');
  });

// REGISTRATION
app.get("/register", (req, res) => {
  res.render("urls_register");
});

app.post("/register", (req, res) => {
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;
  var idNum = generateRandomString();
  // var username1 = req.body.username;

  //CHECK if
  if (username === "" || email === "" || password === "") {
    console.log("Please enter values for all fields.")
    res.redirect(400, "/regiser");
  } else {
    var user = {
      username: username,
      email: email,
      password: password
      }

      users[idNum] = user;
      //change all username cookies to userid
      res.cookie("email", email);
      res.redirect("/urls");
  }

});

// app.use((req, res, next) => {
//   if(!req.signedCookies.username) {
//     res.redirect("/login")
//   }
//   next();
// });

function generateRandomString() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 6; i++ ) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
  return text;
};
