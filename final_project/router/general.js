
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!users.find((user) => user.username === username)) {
            users.push({ username, password });
            return res.status(200).json({ message: "User successfully registered. Now you can login." });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }

    return res.status(404).json({ message: "Unable to register user." });
});

// Get all books
public_users.get('/', function (req, res) {
    return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    return res.status(200).json(books[isbn] || { message: "Book not found" });
});

// Get books by author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const result = Object.values(books).filter(
        (book) => book.author.toLowerCase() === author.toLowerCase()
    );
    return res.status(200).json(result);
});

// Get books by title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const result = Object.values(books).filter(
        (book) => book.title.toLowerCase().includes(title.toLowerCase())
    );
    return res.status(200).json(result);
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    }
    return res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;
