const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const postsRoutes = require('./routes/posts');


const app = express();

mongoose.connect("mongodb+srv://norman:4Vd81x05d1v8B6Bj@cluster0-n4wgc.mongodb.net/node-angular?retryWrites=true&w=majority")
.then(() => {
  console.log('Connected to database!');
})
.catch(() => {
  console.log('Connection Failed');

});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/images", express.static(path.join('backend/images'))); // any request targeting /imagess will be permitted

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

