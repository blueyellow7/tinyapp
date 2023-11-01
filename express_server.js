const express = require("express");
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());
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

const emailLookup = function (mail, database) {
  for (let user in database) {
    if (mail === database[user].email) {
      return mail;
    }
  }
  return undefined; // returns undefined if email does't already exist in the database
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// Display all urls (READ)
app.get("/urls", (req, res) => {
  const templateVars = { 
    urls: urlDatabase,
    user: users[req.cookies["user_id"]]
  };
  res.render("urls_index.ejs", templateVars);
});

// Display page to input new url (READ) 
app.get("/urls/new", (req, res) => {
  const templateVars = { 
    user: users[req.cookies["user_id"]]
  };
  res.render("urls_new.ejs", templateVars);
});

// Create new url. Redirect to its single url page (CREATE)
app.post("/urls", (req, res) => {
  const id = generateRandomString(); 
  urlDatabase[id] = req.body.longURL; 
    // key = id, value = req.body.longURL -> add entry to urlDatabase object
  console.log(urlDatabase);
  res.redirect(`/urls/${id}`); 
});

// Set input from username form as a cookie
app.post("/login", (req, res) => {
  res.cookie("username", req.body.username);
  res.redirect("/urls");
});
// clear cookie (logs you out) 
app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
});

// display registration form
app.get("/register", (req, res) => {
  const templateVars = { 
    user: users[req.cookies["user_id"]]
  };
  res.render("urls_register.ejs", templateVars);
});

// handle registration form
app.post("/register", (req, res) => {
  const user = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;

  const emailInUsers = emailLookup(email, users);

  if (!email || !password) {
    res.status(400).end('<h1>400: Bad request!</h1><h2>Both username and password are required</h2>');
  } else if (emailInUsers) {
    res.status(400).end('<h1>400: Bad request!</h1><h2>This email is already registered</h2>');
  } else {
    users[user] = { 
      id: `${user}`,
      email: `${email}`,
      password: `${password}` 
    };
    res.cookie("user_id", user);
    res.redirect("/urls");
  }
  console.log(users)
});

// Display single url (READ)
app.get("/urls/:id", (req, res) => {
  const templateVars = { 
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
    user: users[req.cookies["user_id"]]
  };
  res.render("urls_show.ejs", templateVars);
});

// Redirect to actual website from given shortened url (READ)
app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id]
  res.redirect(longURL);
});

// Delete url in 'all urls page'. Redirect back to all urls page (DELETE)
app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id]
  res.redirect("/urls");
});

// Edit and update url (UPDATE)
app.post("/urls/:id", (req, res) => {
  console.log(req.body)
  urlDatabase[req.params.id] = req.body.urlEdit
  res.redirect("/urls");
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
