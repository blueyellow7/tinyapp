const { assert } = require("chai");
const { generateRandomString, userObjectfromEmail, urlsForUser } = require("../helpers.js");

// VARIABLES 

const testUsers = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "randomstring",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "123456",
  }
};

const testUrlDatabase = {
  "b2xVn2": {
    longUrl: "http://www.lighthouselabs.ca",
    userID: 'userRandomID'
  },
  "9sm5xK": {
    longUrl: "http://www.google.com",
    userID: 'user2RandomID'
  },
  "35n4h3": {
    longUrl: "http://www.youtube.com",
    userID: 'user2RandomID'
  }
};


// TESTS 

describe("generateRandomString", () => {
  it("should return string length of 6", function() {
    const actualOutput = generateRandomString().length
    const expectedOutput = 6
    assert.strictEqual(actualOutput, expectedOutput);
  });
});


describe("userObjectfromEmail", () => {
  it("should return the nested user object with a valid email", function() {
    const actualOutput = userObjectfromEmail("user@example.com", testUsers);
    const expectedOutput = testUsers['userRandomID'];
    assert.deepEqual(actualOutput, expectedOutput);
  });

  it("should return undefined with an invalid email", function() {
    const actualOutput = userObjectfromEmail("random@example.com", testUsers);
    const expectedOutput = undefined;
    assert.strictEqual(actualOutput, expectedOutput);
  });
});


describe("urlsForUser", () => {
  it("should return object with all urls of a given user id", function() {
    const actualOutput = urlsForUser("user2RandomID", testUrlDatabase);
    const expectedOutput = {
      '9sm5xK': { longUrl: 'http://www.google.com', userID: 'user2RandomID' },
      '35n4h3': { longUrl: 'http://www.youtube.com', userID: 'user2RandomID' }
    }
    assert.deepEqual(actualOutput, expectedOutput);
  });

  it("should return empty object as there are no urls belonging to given user id", function() {
    const actualOutput = urlsForUser("user3RandomID", testUrlDatabase);
    const expectedOutput = {}
    assert.deepEqual(actualOutput, expectedOutput);
  });
});