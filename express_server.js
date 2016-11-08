const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080; // default port 8080
const methodOverride = require("method-override") //gives express ability to allow server to respond to nons differently

const bodyParser = require("body-parser"); //allows user to grab shit from body
// const cookieParser = require('cookie-parser'); //switched from cookie-parser to cookie-session
const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session')

app.use(bodyParser.urlencoded({ extended: true }));
// app.use connects body parser to express
app.set("view engine", "ejs");

// Cookie Sesssion uses REQ.session NOT RES.session!!!!
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


// HEY, YOU! YEAH, YOU! NO USERS WHEN SERVER FIRES UP, NEED TO REGISTER!
//-------------------------------------------DATA

var urlDatabase = {
  "b2xVn2": { url: "http://www.lighthouselabs.ca",
              username: 'Lydia'
            },
  "9sm5xK": { url: "http://www.google.com",
              username: 'Lydia'
            }
};
var users = {};

//-------------------------------------------BASIC ROUTES

app.get("/urls", (req, res) => {
  if(req.session !== null){
    let templateVars = { urls: urlDatabase,
    userid: req.session.user_id,
    username: req.session.username
    };
    res.render("urls_index", templateVars);
  } else {
    res.redirect(403, "/login");
  }
});

app.get("/", (req, res) => {
  //Check if cookie present, not > login
  if (req.session !== null) {
    res.redirect("/urls")
  } else {
    res.redirect("/login");
  }
});

// -----------------------------------------------CREATE URL
app.get("/urls/create", (req, res) => {
   if(req.session !== null){
    let templateVars = { urls: urlDatabase,
    userid: req.session.user_id,
    username: req.session.username
    };
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login");
  }
});

app.post("/urls/create", (req, res) => {
  if(req.session !== null){
    let username = req.session.username
    let longURL = req.body.longURL;
    let newshortURL = generateRandomString();

    urlDatabase[newshortURL] = {url: longURL,
      username: username};
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});

// ---------------------------------------- REDIRECT TO LONG URL BY ENTERING SHORTURL ID
app.get("/u/:shortURL", (req, res) => {
  if (req.session !== null) {
    let shortURL = req.params.shortURL;
    let longURL = urlDatabase[shortURL].url;
    res.redirect(longURL);
  } else {
    res.redirect("/login")
  }
});

// ---------------------------------------- CREATE NEW LONG URL
app.post("/urls/:shortURL/update", (req, res) => {
  if (req.session !== null) {
    let newURL = req.body.longURL;
    let oldURL = urlDatabase[req.params.shortURL];
    urlDatabase[req.params.shortURL] = newURL
    res.redirect("/urls");
  } else {
    res.redirect("/login")
  }
});

// ---------------------------------------- DELETE URL by ID
app.post("/urls/:id/delete", (req, res) => {
  let templateVars = { shortURL: req.params.id,
    urls: urlDatabase,
    userid: req.session.user_id,
    username: req.session.username};
  delete urlDatabase[templateVars.shortURL];
  res.redirect("/urls");
});

//  ---------------------------------------- LOGIN PAGE
app.get("/login", (req, res) => {
    let templateVars = { urls: urlDatabase,
      userid: '',
      username: ''};
  res.render("urls_index", templateVars);
});

app.post("/login", (req, res) => {
    for (let user in users) {
      if (req.body.email === users[user].email && bcrypt.compareSync(req.body.password, users[user].password)){
        req.session.user_id = users[user];
        req.session.username = users[user].username;
        res.redirect("/");
      } else {
        res.redirect(403, "/login")
      }
    }
});

// ----------------------------------------LOGOUT & DELETE COOKIE
app.post("/logout", (req, res) => {
  // let username = req.body.username
  req.session = null;
  res.redirect('/login');
});

// --------------------------------------- REGISTRATION
app.get("/register", (req, res) => {
  res.render("urls_register");
});

app.post("/register", (req, res) => {
  var username = req.body.username;
  var email = req.body.email;
  var password = bcrypt.hashSync(req.body.password, 10);
  var idNum = generateRandomString();

//CHECK IF EMAIL EXISTS
for (let user in users) {
  if (req.body.email === users[user].email){
    res.redirect("/register")
  }
}

//CHECK IF INPUT FIELDS EMPTY
  if (username === "" || email === "" || password === "") {
    console.log("Please enter values for all fields.")
    res.redirect(400, "/register");
  } else {
    var user = {
      username: username,
      email: email,
      password: password
      }
    users[idNum] = user;

    req.session.user_id = idNum;
    req.session.username = username;
    res.redirect("/urls");
  }

});

// FOR USE BY USERID - GENERATES RANDOM USERID
function generateRandomString() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 6; i++ ) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
  return text;
};
