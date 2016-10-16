const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080; // default port 8080
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.end("Hello!");
});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});
//req = client request
//res = server response

// app.get("/urls/:id", (req, res) => {
//   let templateVars = { shortURL: req.params.id };
//   res.render("urls_show", templateVars);
// });

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls/create", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { urls: urlDatabase };
  let longURL = req.body.longURL;
  res.render("urls_show", {shortURL: req.params.shortURL});
});

// create new url entry
app.post("/urls", (req, res) => {
  // console.log(req.body);  // debug statement to see POST parameters
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = longURL;
  res.redirect("/urls");
});

// ***********************************************************************************
// update url
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

// app.post("/urls/:longURL", (req, res) => {

//   });

app.get("/u/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  let longURL = urlDatabase[shortURL];
  res.redirect(longURL);
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
