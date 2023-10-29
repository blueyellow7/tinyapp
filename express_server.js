const express = require("express");
const app = express();
const PORT = 8000;
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

function generateRandomString() {
  return Math.random().toString(36).slice(2, 8);
}

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index.ejs", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new.ejs");
});

app.post("/urls", (req, res) => {
  const id = generateRandomString(); 
    // generate new short url
  urlDatabase[id] = req.body.longURL; 
    // takes input from form (req.body = { longURL: new link }) and adds it to urlDatabase
  console.log(urlDatabase);
    // make sure new longURL and new id/shortURL are added to database
  res.redirect(`/urls/${id}`); 
    // when submit is clicked, redirect to urls/:id page to display new shortURL
});

app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
  res.render("urls_show.ejs", templateVars);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
