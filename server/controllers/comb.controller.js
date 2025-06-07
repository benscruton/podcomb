const {
  getShowImageUrl,
  validators: {combValidator}
} = require("../utils");
const {Comb, User} = require("../models");

const createComb = async (req, rsp) => {
  try{
    const combData = req.body.comb;

    const {errors, hasErrors} = combValidator(combData);
    if(hasErrors){
      return rsp.json({success: false, errors});
    }

    const user = await User.findByPk(combData.userId);

    const comb = await Comb.create({
      title: combData.title,
      author: combData.author,
      description: combData.description,
      language: combData.language,
      imageUrl: combData.imageUrl,
      category: combData.category,
      link: combData.link,
      isExplicit: combData.isExplicit,
      isPublic: combData.isPublic
    });
    await comb.setUser(user);

    return rsp.json({success: true, comb});
  }
  catch(e){
    console.log(e);
    rsp.json({success: false, error: e});
  }
};

module.exports = {
  createComb
};