const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postsRoutes = require('./routes/posts');


const app = express();

mongoose.connect("mongodb+srv://norman:W8O7Z9YpjjkTWYBm@cluster0-n4wgc.mongodb.net/node-angular?retryWrites=true&w=majority")
.then(() => {
  console.log('Connected to database!');
})
.catch(() => {
  console.log('Connection Failed');

});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");  // allows any domain to access our resources
    res.setHeader("Access-Control-Allow-Headers",        //
    "Origin, X-Requested-Width, Content-Type, Accept"
    );
    res.setHeader("Access-Control-Allow-Methods", // Allow HTTP VERB methods
     "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next();

  });

app.use("/api/posts", postsRoutes);

module.exports = app;

