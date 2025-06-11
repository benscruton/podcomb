const {
  validators: {
    combValidator,
    sourceFeedValidator
  },
  getUserIdFromCookie
} = require("../utils");
const {
  Comb,
  SourceFeed,
  User
} = require("../models");

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
      language: combData.language || "en",
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

const getComb = (req, rsp) => {
  const {combId} = req.params;

  Comb.findByPk(
    combId,
    {
      include: {
        model: SourceFeed,
        as: "sourceFeeds"
      }
    }
  ).then(comb => {
    if(!comb){
      return rsp.status(404).json({success: false});
    }
    rsp.json({
      success: true,
      comb
    });
  })
  .catch(e => {
    console.log(e);
    rsp.status(400).json({success: false, error: e});
  });
};

const deleteComb = async (req, rsp) => {
  const {combId} = req.params;
  try{
    const comb = await Comb.findByPk(combId);
    await comb.destroy();
    rsp.json({success: true, combId});
  }
  catch(e){
    rsp.status(400).json({success: false, error: e});
  }
};

const getUserCombs = async (req, rsp) => {
  const userId = getUserIdFromCookie(req.cookies.userToken);
  // const user = await User.findByPk(userId);
  const combs = await Comb.findAll({
    where: {userId}
  });
  rsp.json({
    success: true,
    combs
  });
};

const addSourceFeed = async (req, rsp) => {
  const {combId} = req.params;

  try{
    const sourceFeedData = req.body.sourceFeed;

    const {errors, hasErrors} = sourceFeedValidator(sourceFeedData);
    if(hasErrors){
      return rsp.json({success: false, errors});
    }

    const comb = await Comb.findByPk(combId);

    const sourceFeed = await SourceFeed.create({
      title: sourceFeedData.title,
      url: sourceFeedData.url,
      imageUrl: sourceFeedData.imageUrl
    });
    await sourceFeed.setComb(comb);

    return rsp.json({success: true, sourceFeed});
  }
  catch(e){
    console.log(e);
    rsp.json({success: false, error: e});
  }
};

deleteSourceFeed = async (req, rsp) => {
  const {sourceFeedId} = req.params;
  try{
    const sourceFeed = await SourceFeed.findByPk(sourceFeedId);
    await sourceFeed.destroy();
    rsp.json({success: true, sourceFeedId});
  }
  catch(e){
    rsp.status(400).json({success: false, error: e});
  }
};

module.exports = {
  createComb,
  getComb,
  deleteComb,
  getUserCombs,
  addSourceFeed,
  deleteSourceFeed
};