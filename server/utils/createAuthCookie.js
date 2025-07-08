const jwt = require("jsonwebtoken");

const createAuthCookie = (rsp, id) => {
  const oneHour = 3600000;
  rsp.cookie(
    // Name
    "userToken",

    // Payload
    jwt.sign(
      {id},
      process.env.JWT_KEY
    ),

    // Options
    {
      httpOnly: true,
      maxAge: 4 * oneHour
    }
  );

  return rsp;
};

module.exports = createAuthCookie;