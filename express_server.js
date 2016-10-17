const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080; // default port 8080
const bodyParser = require("body-parser");
var cookieParser = require('cookie-parser')

//res.cookie - to set values to cookiess
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }));

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const data = {
  users: [
  { username: 'lydia'}
  ]
};

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  let templateVars = { username: req.cookies["username"]};
  res.render("index", templateVars);
  res.end("Hello!");
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase,
  username: req.cookies["username"]};
  res.render("urls_index", templateVars);
});
//req = client request
//res = server response

// app.get("/urls/:id", (req, res) => {
//   let templateVars = { shortURL: req.params.id };
//   res.render("urls_show", templateVars);
// });

app.get("/urls.json", (req, res) => {
  let templateVars = { username: req.cookies["username"]};
  res.json(urlDatabase);
});

app.get("/urls/create", (req, res) => {
  let templateVars = { username: req.cookies["username"]};
  res.render("urls_new", templateVars);
});

// app.get("/urls/new", (req, res) => {
//   res.render("urls_new");
// });

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { urls: urlDatabase,
  username: req.cookies["username"]};
  let longURL = req.body.longURL;
  res.render("urls_show", {shortURL: req.params.shortURL});
});

app.get("/login", (req, res) => {
  // only need login
  let templateVars = { urls: urlDatabase,
  username: req.cookies["username"]};
  res.render("urls_index", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  let longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});

// create new url entry
app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = longURL;
  res.redirect("/urls");
});

app.post("/urls/:shortURL/update", (req, res) => {
  const newURL = (req.body.longURL);
  const oldURL = urlDatabase[req.params.shortURL];
  urlDatabase[req.params.shortURL] = newURL
  res.redirect("/urls");
});

app.post("/urls/:id/delete", (req, res) => {
  let templateVars = { shortURL: req.params.id };
  delete urlDatabase[templateVars.shortURL];
  res.redirect("/urls");
});

// login post
app.post("/login", (req, res) => {
  const username = req.body.username
  // same for password
  // for password:
  // const user = data.users.find((user) => {
  //   // console.log('user in data', user);
  //   // console.log('username in req', username)
  //   return user.name === username
  // });
  if (username) {
    res.cookie('username', username);
    res.redirect('/urls');
  } else {
    res.redirect('/login')
  }
  });

//logout
app.post("/logout", (req, res) => {
  const username = req.body.username
  // same for password
  // const user = data.users.find((user) => {
  //   return user.name === username});
  res.clearCookie('username');
  // req.session.destroy(function () {
  //   res.redirect('/urls');
  // })
  res.redirect('/login');
  });


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


function generateRandomString() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 6; i++ ) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };
