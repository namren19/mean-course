const brcypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.createUser = (req, res, next) => {
  brcypt.hash(req.body.password, 10)
  .then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash
    });
      user.save()
      .then(result => {
        res.status(201).json({
          message: "User created!",
          result: result
        });
      })
    .catch(err => {
      res.status(500).json({
        message: "Invalid credentials"
      });
    });
  });
}

exports.userLogin = (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
  .then(user => {
    console.log(user);
    if (!user) {
      return res.status(401).json({
        message: "Auth Failed"
      });
    }
    fetchedUser = user;
    return brcypt.compare(req.body.password, user.password); // return must be use if there is another code to run after this
  })
  .then(result => {
  //  console.log(result);
      if (!result) {
        return res.status(401).json({
          message: "Auth Failed"
        });
      }

  const token = jwt.sign({ email: fetchedUser.email, userId: fetchedUser._id },
    process.env.JWT_KEY,
    { expiresIn: "1h" }
    );
    // console.log(token);
    res.status(200).json({
      token: token,
      expiresIn: 3600,
      userId: fetchedUser._id
    });
  })
  .catch(err => {
    // console.log(err);
    return res.status(401).json({
      message: "Invalid Credentials"
    });
  });
}
