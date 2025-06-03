const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  validators: {userValidator}
} = require("../utils");
const {User} = require("../models");

const oneHour = 3600000;

const register = (req, rsp) => {
  const user = req.body.user;

  const {errors, hasErrors} = userValidator(user);  
  if(hasErrors){
    return rsp.json({success: false, errors});
  }

  User.create(user)
    .then(userRecord => {
      rsp.status(200).json({success: true, user: userRecord});
    })
    .catch(e => {
      if(e.name === "SequelizeUniqueConstraintError"){
        let field = e.fields[0];
        if(field === "username_lowercase") field = "username";
        const errors = {
          [field]: `A user with this ${field} already exists`
        };
        return rsp.json({success: false, errors});
      }
      console.log(e);
      rsp.status(400).json({success: false, error: e});
    });
};

const login = (req, rsp) => {
  if(!req.body.password || !(req.body.username || req.body.email)){
    return rsp.json({success: false, error: "Must include an email or a username, as well as a password."});
  }
  
  User.findOne({
    attributes: ["id", "username", "email", "password", "createdAt", "updatedAt"],
    where: {
      [req.body.username ? "usernameLowercase" : "email"]: (req.body.username || req.body.email).toLowerCase()
    }
  })
    .then(user => {
      if(!user){
        return rsp.json({success: false, error: "User not found"});
      }
      bcrypt.compare(req.body.password, user.password)
        .then(match => {
          if(!match){
            return rsp.json({
              success: false,
              error: "Passwords didn't match."
            });
          }
          // If successful login attempt:
          delete user.dataValues.password;
          rsp
            .cookie(
              "userToken",
              jwt.sign({id: user.id}, process.env.JWT_KEY),
              {
                httpOnly: true,
                maxAge: 4 * oneHour
              }
            ).json({success: true, user});
        })
        .catch(e => {
          console.log(e);
          return rsp.status(400).json({success: false, error: e});
        });

    })
    .catch(e => {
      console.log(e);
      rsp.json({error: e});
    });
};

const logout = (req, rsp) => {
  rsp.clearCookie("userToken");
  rsp.json({success: true, message: "Logged out"});
};

const testClient = (req, rsp) => {
  rsp.json({
    success: true,
    message: "hello"
  });
};


module.exports = {
  register,
  login,
  logout,
  testClient
};