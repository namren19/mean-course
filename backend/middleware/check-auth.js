const jwt = require('jsonwebtoken');



module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, 'norman_will_be_success');
    next();
  }
  catch (error) {
    res.status(401).json({ // not authenticated
        message: "Auth failed!"
    });
  }

}
