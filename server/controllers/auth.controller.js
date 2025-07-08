const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  createAuthCookie,
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
  if(!(req.body.username || req.body.email) || !req.body.password){
    const errors = {}
    if(!(req.body.username || req.body.email)){
        errors.username = "Must include username or email";
    }
    if(!req.body.password){
      errors.password = "Must include a password";
    }
    return rsp.json({success: false, errors})
  }
  
  User.findOne({
    attributes: ["id", "username", "email", "password", "createdAt", "updatedAt"],
    where: {
      [req.body.username ? "usernameLowercase" : "email"]: (req.body.username || req.body.email).toLowerCase()
    }
  })
    .then(user => {
      if(!user){
        return rsp.json({
          success: false,
          errors: {username: "User not found"}
        });
      }
      bcrypt.compare(req.body.password, user.password)
        .then(match => {
          if(!match){
            return rsp.json({
              success: false,
              errors: {password: "Invalid password"}
            });
          }
          // If successful login attempt:
          delete user.dataValues.password;
          createAuthCookie(
            rsp, user.id
          ).json({success: true, user});
        })
        .catch(e => {
          console.log(e);
          return rsp.status(400).json({
            success: false,
            errors: {username: e.message}
          });
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


module.exports = {
  register,
  login,
  logout
};