const jwt = require("jsonwebtoken");

const getUserIdFromCookie = userToken => {
  return jwt.verify(
    userToken,
    process.env.JWT_KEY,
    (err, payload) => {
      return payload.id;
    }
  );
};

module.exports = getUserIdFromCookie;