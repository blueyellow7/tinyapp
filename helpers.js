// Function that generates string thats 6 alphanumeric characters long
const generateRandomString = function () {
  return Math.random().toString(36).slice(2, 8);
}

// Function that returns user object from email. Returns undefined if email isn't in databse
const userObjectfromEmail = function (mail, database) {
  for (let user in database) {
    if (mail === database[user].email) {
      return database[user];
    }
  }
  return undefined;
};

// Function that returns object containing all long and short urls of a user
const urlsForUser = function (id, urlDatabase) {
  let objectOfUserURLS = {};
  for (const shortUrl in urlDatabase) {
    if (id === urlDatabase[shortUrl].userID) {
      objectOfUserURLS[shortUrl] = urlDatabase[shortUrl];
    }
  }
  return objectOfUserURLS; 
};

module.exports = { generateRandomString, userObjectfromEmail, urlsForUser };