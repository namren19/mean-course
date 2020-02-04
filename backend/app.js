const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");  // allows any domain to access our resources
    res.setHeader("Access-Control-Allow-Headers",        //
    "Origin, X-Requested-Width, Content-Type, Accept"
    );
    res.setHeader("Access-Control-Allow-Methods", // Allow HTTP VERB methods
     "GET, POST, PATCH, DELETE, OPTIONS"
    );
    next();

  });

app.post("/api/posts", (req, res, next) => {
    const post = req.body;
    console.log(post);
    res.status(201).json({
        message: 'Post Added Successfully'

    });
})

app.get("/api/posts", (req, res, next) => {
  const posts = [
    {
      id: 'asdsadas',
      title: 'First Server Side Post',
      content: 'This is coming from server'
    },
    {
      id: 'asdsadas',
      title: 'Second Server Side Post',
      content: 'This is coming from server'
    }

  ];
  return res.status(200).json({
    message: 'POST fetch successfully',
    posts: posts
  });
});

module.exports = app;

