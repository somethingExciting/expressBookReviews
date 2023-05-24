const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  return res.status(200).send(books[req.params.isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let bookVals = Object.values(books);
  let allBooks = [];

  for (let i = 0; i < Object.keys(books).length-1; i++) {
    if (bookVals[i].author === req.params.author) {
      allBooks.push(bookVals[i]);
    }
  }

  return res.status(200).send(allBooks);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let bookVals = Object.values(books);

  for (let i = 0; i < Object.keys(books).length-1; i++) {
    if(bookVals[i].title === req.params.title) {
      return res.status(200).send(bookVals[i]);
    }
  }  
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
