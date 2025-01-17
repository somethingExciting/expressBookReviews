const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  if(!req.query.username || !req.query.password) {
    return res.status(400).json({message: "Username and/or Password cannot be blank"});
  }

  if(isValid(req.query.username)) {
    users.push({"username": req.query.username, "password": req.query.password})
    return res.status(200).json({message: "User successfully registered!"});
  } else {
    return res.status(400).json({message: "Username is taken"});
  }  
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  let getBooks = new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve(res.status(200).send(JSON.stringify(books)))
    },3000)
  })

  getBooks.then(() => {
    console.log("getBooks resolved")
  })

  //return res.status(200).send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let getIsbn = new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve(res.status(200).send(books[req.params.isbn]))
    },3000)
  })

  getIsbn.then(() => {
    console.log("getIsbn resolved")
  })

  //return res.status(200).send(books[req.params.isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let getAuthor = new Promise((resolve,reject) => {
    setTimeout(() => {
      let bookVals = Object.values(books);
      let allBooks = [];
    
      for (let i = 0; i < Object.keys(books).length-1; i++) {
        if (bookVals[i].author === req.params.author) {
          allBooks.push(bookVals[i]);
        }
      }

      resolve(res.status(200).send(allBooks))
    },3000)
  })

  getAuthor.then(() => {
    console.log("getAuthor resolved")
  })

  //return res.status(200).send(allBooks);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let getTitle = new Promise((resolve,reject) => {
    setTimeout(() => {
      let bookVals = Object.values(books);

      for (let i = 0; i < Object.keys(books).length-1; i++) {
        if(bookVals[i].title === req.params.title) {
          resolve(res.status(200).send(bookVals[i]))
          //return res.status(200).send(bookVals[i]);
        }
      }
    },3000)
  })

  getTitle.then(() => {
    console.log("getTitle resolved")
  })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  return res.status(200).send(books[req.params.isbn].reviews);
});

module.exports.general = public_users;
