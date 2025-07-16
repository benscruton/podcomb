const isoLanguageCodes = require("./isoLanguageCodes.json");

const filterTypes = [
  "blacklist"
];

const combValidator = comb => {
  const errors = {};
  let hasErrors = false;

  if(!comb){
    hasErrors = true;
    errors.comb = "No comb object included with request";
  }
  else{
    if(!comb.title){
      hasErrors = true;
      errors.title = "Must include a title";
    }
    if(!(comb.language in isoLanguageCodes)){
      hasErrors = true;
      errors.language = "Language code not valid";
    }
  }
  
  return {errors, hasErrors};
};

const combUpdateValidator = comb => {
  const errors = {};
  let hasErrors = false;

  if("language" in comb && !(comb.language in isoLanguageCodes)){
    hasErrors = true;
    errors.language = "Language code not valid";
  }
  if("title" in comb && !comb.title){
    hasErrors = true;
    errors.title = "Title cannot be empty";
  }

  return {errors, hasErrors};
};

const filterValidator = filter => {
  const errors = {};
  let hasErrors = false;

  if(!filter){
    hasErrors = true;
    errors.filter = "No sourceFeed object included with request.";
  }
  else{
    if(!filter.name){
      hasErrors = true;
      errors.name = "Filter must have a name";
    }
    if(!filterTypes.includes(filter.type)){
      hasErrors = true;
      errors.type = "Invalid filter type";
    }
  }

  return {errors, hasErrors};
};

const filterUpdateValidator = filter => {
  const errors = {};
  let hasErrors = false;

  if("name" in filter && !filter.name){
    hasErrors = true;
    errors.name = "Filter must have a name";
  }
  if("type" in filter && !filterTypes.includes(filter.type)){
    hasErrors = true;
    errors.type = "Invalid filter type";
  }

  return {errors, hasErrors};
};

const sourceFeedValidator = sourceFeed => {
  const errors = {};
  let hasErrors = false;

  if(!sourceFeed){
    hasErrors = true;
    errors.sourceFeed = "No sourceFeed object included with request.";
  }
  else {
    if(!sourceFeed.title){
      hasErrors = true;
      errors.title = "Must include a title";
    }
    if(!sourceFeed.url){
      hasErrors = true;
      errors.url = "Must include a feed URL";
    }
  }

  return {errors, hasErrors};
};

const userValidator = user => {
  const errors = {};
  let hasErrors = false;

  if(!user){
    hasErrors = true;
    errors.user = "No user object included with request.";
  }
  else{
    if(!user.username){
      hasErrors = true;
      errors.username = "Must include a username";
    }
    const nonAlphaNumericRegex = /[^a-zA-Z0-9]/;
    if(nonAlphaNumericRegex.test(user.username)){
      hasErrors = true;
      errors.username = "Username can only include letters and numbers.";
    }
    if(!user.password || user.password.length < 8){
      hasErrors = true;
      errors.password = "Must have a password at least 8 characters long";
    }
    if(user.confirmPassword && user.password !== user.confirmPassword){
      hasErrors = true;
      errors.confirmPassword = "Passwords did not match";
    }
  }
  
  return {errors, hasErrors};
};

module.exports = {
  combValidator,
  combUpdateValidator,
  filterValidator,
  filterUpdateValidator,
  sourceFeedValidator,
  userValidator
};