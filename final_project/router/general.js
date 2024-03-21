const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
        return user.username === username
    });
    if(userswithsamename.length > 0){
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if(username && password) {
    if (!doesExist(username)) {
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
        return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
function getBookList() {
    return new Promise((resolve,reject) => {
        resolve(public_users.get('/',function (req, res) {
            res.send(books);
        }));
    });
};
    


// Get book details based on ISBN
function getBookISBN() {
    return new Promise((resolve,reject) => {
        resolve(public_users.get('/isbn/:isbn',function (req, res) {
            const isbn = req.params.isbn;
                res.send(books[isbn])
        }));
    });
};
  
// Get book details based on author
function getBookAuthor() {
    return new Promise((resolve,reject) => {
        resolve(public_users.get('/author/:author',function (req, res) {
            const author = req.params.author;
            let authorBooks = [];
            Object.keys(books).forEach(function (key) {
                const book = books[key];
                if (book.author === author) {
                    authorBooks.push(book);
                }
            });
            res.json(authorBooks);
        }));
    });
};
    


// Get all books based on title
function getBookTitle() {
    return new Promise((resolve,reject) => {
        resolve(public_users.get('/title/:title',function (req, res) {
            const title = req.params.title;
            let titleBooks = [];
            Object.keys(books).forEach(function (key) {
                const book = books[key];
                if (book.title === title) {
                    titleBooks.push(book);
                }
            });
            res.json(titleBooks);
        }));

    });
};

async function getBookDetails(){
    await getBookList();
    await getBookISBN();
    await getBookAuthor();
    await getBookTitle();
};



//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    let reviewBooks = [];
    Object.keys(books).forEach(function (key) {
        const book = books[key];
        if (book.isbn === isbn) {
            reviewBooks.push(book);
        }
    });
    res.json(reviewBooks);
});

module.exports.general = public_users;
