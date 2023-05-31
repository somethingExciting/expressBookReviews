const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

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
  
  if (books[req.params.isbn].reviews.length > 0) {
    for (let i = 0; i < books[req.params.isbn].reviews.length-1; i++) {
      if (books[req.params.isbn].reviews[i].user === user) {
        books[req.params.isbn].reviews[i].review = review
      }
    }
    return res.status(200).send({message: "Review successfully edited!"});
  } else {
    books[req.params.isbn].reviews[0] = {"user": user, "review": review}
    return res.status(200).send({message: "Review successfully posted!"});
  }
});

//delete a book review
regd_users.delete("/auth/review/:isbn", (req,res) => {
  let user = req.session.authenticated.user
  let reviews = Object.keys(books[req.params.isbn].reviews).length
  
  if (reviews > 0) {
    for (let i = 0; i < reviews; i++) {
      if (books[req.params.isbn].reviews[i].user === user) {
        delete books[req.params.isbn].reviews[i]
        return res.status(200).send({message: "Review successfully deleted!"});
      }
    }
  }

  return res.status(400).send({message: "No reviews to delete..."});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
