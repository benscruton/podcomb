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
  sourceFeedValidator,
  userValidator
};