const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const {
    static
} = require("express");
const db = require('./db');
const port = 3000;

app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));



//route homePage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "views/HomePage.html"));
});

//route aboutuspage
app.get('/aboutuspage', (req, res) => {
    res.sendFile(path.join(__dirname, "views/aboutuspage.html"));
});

//route searchpage
app.get('/searchpage', (req, res) => {
    res.sendFile(path.join(__dirname, "views/searchpage.html"));
});

//route tipspage
app.get('/tipspage', (req, res) => {
    res.sendFile(path.join(__dirname, "views/tipspage.html"));
});

app.get('/create-database', (req, res) => {
    return db.create_database(req, res);
});

app.get('/mock-database', (req, res) => {
    return db.mock_database(req, res);
});

app.get('/delete-database', (req, res) => {
    return db.delete_database(req, res);
});

app.get("/search-dogs", function (req, res) {
    return db.search_dogs(req, res);
 });


//create Tables
app.get("/create-dogs-table", function (req, res) {
    return db.create_dogs_table(req, res);
});

app.get("/create-adoptions-table", function (req, res) {
    return db.create_adoptions_table(req, res);
});


//insert into Tables
app.get("/insert-into-dogs-table", function (req, res) {
    return db.insert_into_dogs_table(req, res);
});

app.get("/insert-into-adoptions-table", function (req, res) {
    return db.insert_into_adoptions_table(req, res);
});

//select Tables
app.get("/select-dogs-table", function (req, res) {
    return db.select_dogs_table(req, res);
});

app.get("/select-adoptions-table", function (req, res) {
    return db.select_adoptions_table(req, res);
});

//drop Tables
app.get("/drop-tables", function (req, res) {
    return db.drop_tables(req, res);
});

app.post("/i-want-to-adopt", function (req, res) {
    return db.i_want_to_adopt(req, res);
});

app.listen(port, () => {
    console.log("Server is running on port ",port);
});