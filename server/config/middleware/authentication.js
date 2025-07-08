const jwt = require("jsonwebtoken");

const clientToken = (req, rsp, next) => {
  jwt.verify(
    req.cookies.userToken,
    process.env.JWT_KEY,
    (err, payload) => {
      if(err){
        return rsp.status(401).json({
          success: false,
          message: "Verification failed; please log in again"
        });
      }
      next();
    }
  );
};

const apiKey = (req, rsp, next) => {
  try{
    const validApiKeys = JSON.parse(process.env.API_KEYS);
    const key = req.headers["api-key"];
    if(!validApiKeys.includes(key)){
      return rsp.status(401).json({success: false, message: "Invalid API key. Please include a valid API key as \"api-key\" in request headers."});
    }
    next();
  }
  catch(e){
    console.log(e);
    return rsp.json({success: false, error: e});
  }
};

module.exports = {
  clientToken,
  apiKey
};