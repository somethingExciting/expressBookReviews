const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let hasUser = users.filter((user) => {
    return user.username === username
  });
  if (hasUser.length > 0){
    return true;
  } else { 
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let validUser = users.filter((user) => {
    return (user.username === username && user.password === password)
  });
  if (validUser.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const user = req.body.user;

  if(!user) {
    return res.status(404).json({message: "Body empty"});
  }
  
  let accessToken = jwt.sign({
    data: user
  }, 'access', {expiresIn: 60 * 60});

  req.session.authenticated = {
    accessToken
  }

  return res.status(200).send("User successfully logged in");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
