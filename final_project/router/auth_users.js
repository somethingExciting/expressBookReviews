const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
let reviewCount = 0;

//check if username is valid
const isValid = (username)=>{ //returns boolean
  let hasUser = users.filter((user) => {
    return user.username === username
  });
  if (hasUser.length > 0){
    return false;
  } return true;
}

//check if username and password match the one we have in records
const authenticatedUser = (username,password)=>{ //returns boolean
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
  const user = req.query.username;
  const pass = req.query.password;

  if(!user || !pass) {
    return res.status(404).json({message: "Username and/or Password not provided"});
  }

  if (!authenticatedUser(user,pass)) {
    return res.status(404).json({message: "User does not exist"});
  }
  
  let accessToken = jwt.sign({
    data: user
  }, 'access', {expiresIn: 60 * 60});

  req.session.authenticated = {
    accessToken,
    user
  }

  return res.status(200).send("User successfully logged in");
});

// Add a book review
//TODO: if user has existing review, then update; otherwise add
regd_users.put("/auth/review/:isbn", (req, res) => {
  let review = req.query.review
  let user = req.session.authenticated.user
  let bookVals = Object.values(books);
  
  for (let i = 0; i < Object.keys(books).length-1; i++) {
    for (let j = 0; j < Object.keys(books[i].reviews).length-1; j++) {
      if (books[i].reviews[j].user === user) {
        books[i].reviews[j]
      }
    }
  } 
  
  books[req.params.isbn].reviews[reviewCount++] = {"user": user, "review": review}

  return res.status(200).send({message: "Review successfully posted!"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
