const userValidator = user => {
  const errors = {};
  let hasErrors = false;
  
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
  
  return {errors, hasErrors};
};

module.exports = {
  userValidator
};