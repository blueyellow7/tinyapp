/////////////////////////////////////////////////////////////////////////////
// Set-up / Config
/////////////////////////////////////////////////////////////////////////////

const express = require("express");
const app = express();
const PORT = 8000;

const cookieSession = require("cookie-session");
const bcrypt = require("bcryptjs");


/////////////////////////////////////////////////////////////////////////////
// Middleware
/////////////////////////////////////////////////////////////////////////////

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({ name: "session", keys: ["key1", "key2"] }))


/////////////////////////////////////////////////////////////////////////////
// Functions / Variables
/////////////////////////////////////////////////////////////////////////////

const { generateRandomString, userObjectfromEmail, urlsForUser } = require("./helpers")

const urlDatabase = {
  "b2xVn2": {
    longUrl: "http://www.lighthouselabs.ca",
    userID: 'userRandomID'
  },
  "9sm5xK": {
    longUrl: "http://www.google.com",
    userID: 'user2RandomID'
  }
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
  }
};


/////////////////////////////////////////////////////////////////////////////
// Listener
/////////////////////////////////////////////////////////////////////////////

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


/////////////////////////////////////////////////////////////////////////////
// Routes
/////////////////////////////////////////////////////////////////////////////

// Display all urls - GET
app.get("/urls", (req, res) => {
  if (req.session.user_id) {
    const usersURLobject = urlsForUser(req.session.user_id, urlDatabase)
      // return object of urls only pretaining to 1 user_id
    const templateVars = { 
      urls: usersURLobject,
      user: users[req.session.user_id]
    };
    res.render("urls_index.ejs", templateVars);
  } else {
    res.status(403).end('<h1>403: Forbidden</h1><h2>Please log in to see your urls</h2>');
  }
});

// Display page to input new url - GET
app.get("/urls/new", (req, res) => {
  if (req.session.user_id) {
    const templateVars = { 
      user: users[req.session.user_id]
    };
    res.render("urls_new.ejs", templateVars);
  } else {
    res.redirect('/login')
  }
});

// Create new url. Redirect to its single url page - POST
app.post("/urls", (req, res) => {
  if (req.session.user_id) {
    const shortUrl = generateRandomString(); 

    urlDatabase[shortUrl] = {
      longUrl: req.body.longUrl,
      userID: req.session.user_id
    } //--> add entry to urlDatabase object -> { shortUrl: { longUrl: www... , userID: 2h23hz } }

    res.redirect(`/urls/${shortUrl}`); 
    console.log(urlDatabase)

  } else {
    res.status(401).end('<h1>401: Forbidden</h1><h2>Must log in to shorten url</h2>');
  }

});

// Display registration form - GET
app.get("/register", (req, res) => {
  const templateVars = { 
    user: users[req.session.user_id]
  };

  if (req.session.user_id) {
    res.redirect('/urls')
  } else {
    res.render("urls_register.ejs", templateVars);
  }
  
});

// Handle registration form - POST
app.post("/register", (req, res) => {
  const user = generateRandomString();
  const mail = req.body.email;
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  const existingUserObject = userObjectfromEmail(mail, users);

  if (!mail || !req.body.password) {
    res.status(400).end('<h1>400: Bad request</h1><h2>Both username and password are required</h2>');
  } else if (existingUserObject) {
    res.status(400).end('<h1>400: Bad request</h1><h2>This email is already registered</h2>');
  } else {
    users[user] = { 
      id: `${user}`,
      email: `${mail}`,
      password: `${hashedPassword}` 
    };
    req.session.user_id = user;
    res.redirect("/urls");
  }
  console.log(users)
});

// Display login form - GET
app.get("/login", (req, res) => {
  const templateVars = { 
    user: users[req.session.user_id]
  };

  if (req.session.user_id) {
    res.redirect('/urls')
  } else {
    res.render("urls_login.ejs", templateVars);
  }

});

// Handle login form - GET
app.post("/login", (req, res) => {
  const mail = req.body.email;
  const pw = req.body.password;
  const userObject = userObjectfromEmail(mail, users);

  if (!userObject) {
    res.status(403).end('<h1>403: Forbidden</h1><h2>Email is not registered</h2>');
  } else if (mail !== userObject.email || !bcrypt.compareSync(pw, userObject.password)) {
    res.status(403).end('<h1>403: Forbidden</h1><h2>Email and password do not match</h2>');
  } else {
    req.session.user_id = userObject.id;
    res.redirect("/urls"); 
  }
});

// Clear cookie (logs you out) - POST
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});

// Display single url (GET)
app.get("/urls/:shortUrl", (req, res) => { 
  if (!urlDatabase[req.params.shortUrl]) {
    res.status(404).end('<h1>404: Page not found</h1><h2>Short URL is not in database</h2>');
  } else if (!req.session.user_id) {
    res.status(403).end('<h1>403: Forbidden</h1><h2>Must log in to see short url</h2>');
  } else {
    const usersURLobject = urlsForUser(req.session.user_id, urlDatabase);

    const templateVars = { 
      shortUrl: req.params.shortUrl,
      longUrl: usersURLobject[req.params.shortUrl].longUrl,
      user: users[req.session.user_id]
    };

    res.render("urls_show.ejs", templateVars);
  }
});

// Redirect to website from given shortened url - GET
app.get("/u/:shortUrl", (req, res) => {
  const longUrl = urlDatabase[req.params.shortUrl].longUrl
  if (longUrl) {
    res.redirect(longUrl);
  } else {
    res.status(404).end('<h1>404: Page not found</h1><h2>Short URL is not in database</h2>');
  }
});

// Edit and update a url - POST
app.post("/urls/:shortUrl", (req, res) => {
  if (!urlDatabase[req.params.shortUrl]) {
    res.status(404).end('<h1>404: Page not found</h1><h2>Short URL is not in database</h2>');
    
  } else if (req.session.user_id !== urlDatabase[req.params.shortUrl].userID) {
    res.status(403).send('<h1>403: Forbidden</h1><h2>You are not authorized to view this page.</h2>');

  } else {
    urlDatabase[req.params.shortUrl].longUrl = req.body.urlEdit;
    console.log(urlDatabase)
    res.redirect("/urls");
  }
  
});

// Delete url - POST
app.post("/urls/:shortUrl/delete", (req, res) => {
  if (!urlDatabase[req.params.shortUrl]) {
    res.status(404).end('<h1>404: Page not found</h1><h2>Short URL is not in database</h2>');

  } else if (req.session.user_id !== urlDatabase[req.params.shortUrl].userID) {
    res.status(403).send('<h1>403: Forbidden</h1><h2>You are not authorized to view this page.</h2>');

  } else {
    delete urlDatabase[req.params.shortUrl]
    res.redirect("/urls");
  }

});