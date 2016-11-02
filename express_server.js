const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080; // default port 8080
const methodOverride = require("method-override") //gives express ability to allow server to respond to nons differently

const bodyParser = require("body-parser"); //allows use to grab shit from body
const cookieParser = require('cookie-parser'); //
const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session')

app.use(bodyParser.urlencoded({ extended: true }));
// app.use connects body parser to express
app.set("view engine", "ejs");
app.use(cookieSession())


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


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
// users['123456'] = { username: 'lydia', email: 'lydia@email.com', password: 'pw0'};
//-------------------------------------------ROUTES
//GET DATA

app.get("/urls", (req, res) => {
  if(req.cookies !== {}){
    let templateVars = { urls: urlDatabase,
    userid: req.cookies.userid,
    username: req.cookies.username
    };
    res.render("urls_index", templateVars);
  } else {
    res.redirect("/login");
  }
});

app.get("/", (req, res) => {
  //Check if cookie present, not > login
  if (req.cookies) {
    debugger;
    res.redirect("/urls")
  } else {
    res.redirect("/login");
    debugger;
  }
});

app.get("/urls.json", (req, res) => {
  let templateVars = { urls: urlDatabase,
  userid: req.cookies.userid};
  // input: req.body.username};
  res.render("urls_index", templateVars);
});


// -----------------------------------------------CREATE URL
app.get("/urls/create", (req, res) => {
   if(req.cookies !== {}){
    let templateVars = { urls: urlDatabase,
    userid: req.cookies.userid,
    username: req.cookies.username
    };
    res.render("urls_new", templateVars);
  } else {
    debugger;
    res.redirect("/login");
  }
});

app.post("/urls/create", (req, res) => {
  debugger;
  if(req.cookies !== {}){
    console.log("CREATE IF")
    let username = req.cookies.username
    const longURL = req.body.longURL;
    const newshortURL = generateRandomString();
    // urlDatabase[newshortURL] = longURL

    urlDatabase[newshortURL] = {url: longURL,
      username: username};
    debugger;
    res.redirect("/urls");
  } else {
    console.log("CREATE ELSE")
    debugger;
    res.redirect("/login");
  }
});

// REDIRECT TO LONGURL BY USING SHORT
app.get("/urls/:shortURL", (req, res) => {
  debugger;
  let templateVars = { urls: urlDatabase,
     userid: req.cookies.userid };
  let longURL = req.body.longURL;
  res.render("urls_show", {shortURL: req.params.shortURL});
});

// LOGIN PAGE
app.get("/login", (req, res) => {
  debugger;
    let templateVars = { urls: urlDatabase,
      userid: ''
    };
  // username: req.signedCookies.username};
  // var username = req.body.username;}
  // var hash = bcrypt.hashSync('testing', 10);
  // console.log(hash);
  res.render("urls_index", templateVars);
});

// REDIRECT TO LONG URL BY ENTERING SHORTURL ID
app.get("/u/:shortURL", (req, res) => {
  debugger;
  let shortURL = req.params.shortURL;
  let longURL = urlDatabase[shortURL];
   debugger;
  res.redirect(longURL);
});

// CREATE NEW LONG URL
app.post("/urls/:shortURL/update", (req, res) => {
  debugger;
  const newURL = (req.body.longURL);
  const oldURL = urlDatabase[req.params.shortURL];
  urlDatabase[req.params.shortURL] = newURL
   debugger;
  res.redirect("/urls");
});

// DELETE URL by ID
app.post("/urls/:id/delete", (req, res) => {
  debugger;
  let templateVars = { shortURL: req.params.id };
  delete urlDatabase[templateVars.shortURL];
   debugger;
  res.redirect("/urls");
});

// CHECK IF LOGGED IN
app.post("/login", (req, res) => {
  //If no users available:
  // if(users = {}){
  //     res.redirect(403, "/login")
  // } else {
  // // users is poplulate
  debugger;
    for (let user in users) {
      debugger;
      // var inputPW = bcrypt.hashSync(req.body.password, 10);
      // bcrypt.compareSync(req.body.password, user.password);
      if (req.body.email === users[user].email && bcrypt.compareSync(req.body.password, users[user].password)){
        debugger;
        res.cookie("userid", user)
        res.redirect("/");
      } else {
        debugger;
        res.redirect(403, "/login")
      }
    }
  // }
  debugger;
});

// LOGOUT & DELETE COOKIE
app.post("/logout", (req, res) => {
  const username = req.body.username
  res.clearCookie('userid');
  res.redirect('/login');
  });

// REGISTRATION
app.get("/register", (req, res) => {
  res.render("urls_register");
});

app.post("/register", (req, res) => {
  var username = req.body.username;
  var email = req.body.email;
  var password = bcrypt.hashSync(req.body.password, 10);
  var idNum = generateRandomString();
  // var username1 = req.body.username;

  //CHECK if
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
      //change all username cookies to userid
      res.cookie("userid", idNum);
      res.cookie("username", username);
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
