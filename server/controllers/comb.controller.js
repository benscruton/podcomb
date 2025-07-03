const {
  buildXml,
  cacheCombXml,
  combineShows,
  deleteCombXmlCache,
  getUserIdFromCookie,
  validators: {
    combValidator,
    combUpdateValidator,
    sourceFeedValidator
  },
  startXmlCacheCronJob,
} = require("../utils");
const {
  Comb,
  SourceFeed,
  User
} = require("../models");
const crontab = require("../config/cron");

const createComb = async (req, rsp) => {
  try{
    const combData = req.body.comb;
    const userId = getUserIdFromCookie(req.cookies.userToken);

    const {errors, hasErrors} = combValidator(combData);
    if(hasErrors){
      return rsp.json({success: false, errors});
    }

    const user = await User.findByPk(userId);

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
    rsp.json({success: false, error: e.message});
  }
};

const getComb = (req, rsp) => {
  const {combId} = req.params;

  Comb.findByPk(
    combId,
    {include: SourceFeed}
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
    rsp.status(400).json({success: false, error: e.message});
  });
};

const updateComb = async (req, rsp) => {
  try{
    const {combId} = req.params;
    const combData = req.body.comb;
    const {errors, hasErrors} = combUpdateValidator(combData);
    if(hasErrors){
      return rsp.json({success: false, errors});
    }

    const [count] = await Comb.update(
      combData,
      {
        where: {id: combId},
        fields: [
          "title",
          "author",
          "description",
          "language",
          "imageUrl",
          "category",
          "link",
          "isExplicit",
          "isPublic"
        ]
      }
    );

    const comb = await Comb.findByPk(
      combId,
      {include: SourceFeed}
    );
    rsp.json({
      success: true,
      updated: !!count,
      comb
    });
  }
  catch(e){
    rsp.status(400).json({success: false, error: e.message});
  }
};

const deleteComb = async (req, rsp) => {
  const {combId} = req.params;
  try{
    const comb = await Comb.findByPk(combId);
    await comb.destroy();
    rsp.json({success: true, combId});
  }
  catch(e){
    rsp.status(400).json({success: false, error: e.message});
  }
};

const getUserCombs = async (req, rsp) => {
  const userId = getUserIdFromCookie(req.cookies.userToken);
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
    rsp.json({success: false, error: e.message});
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
    rsp.status(400).json({success: false, error: e.message});
  }
};

const sendCombXml = async (req, rsp) => {
  const {combId} = req.params;
  const comb = await Comb.findByPk(
    combId,
    {include: SourceFeed}
  );

  if(!comb){
    return rsp.status(404).json({success: false, error: "Comb not found"})
  }
  

  combineShows(comb)
    .then(combinedData => {
      const xml = buildXml(combinedData);

      rsp.set("Content-Type", "text/xml");
      rsp.send(xml);
    })
    .catch(e => {
      console.log(e);
      rsp.status(400).json({success: false, error: e.message});
    })
};

const cacheFeed = async (req, rsp) => {
  const {combId} = req.params;
  const comb = await Comb.findByPk(
    combId,
    {include: SourceFeed}
  );
  
  if(!comb){
    return rsp.status(404).json({success: false, error: "Comb not found"})
  }

  const {cacheNow, cacheInterval} = req.body;

  let response = {};
  
  if(cacheNow){
    const cacheResult = await cacheCombXml(comb);
    if(cacheResult.success === false){
      return rsp.json(cacheResult);
    }
    response = {...response, ...cacheResult};
  }

  if(cacheInterval !== undefined){
    comb.cacheInterval = parseInt(cacheInterval) || null;
    comb.save();
    const jobResult = startXmlCacheCronJob(comb, crontab);
    if(jobResult.success === false){
      return rsp.json(jobResult);
    }
    response = {...response, ...jobResult};
  }

  rsp.json(response);
};

const deleteCache = async (req, rsp) => {
  const {combId} = req.params;
  const comb = await Comb.findByPk(combId);
  if(!comb){
    return rsp.status(404).json({success: false, error: "Comb not found"})
  }
  const result = deleteCombXmlCache(comb);
  if(result.error){
    rsp.status(400);
  }
  rsp.json(result);
};

module.exports = {
  createComb,
  getComb,
  updateComb,
  deleteComb,
  getUserCombs,
  addSourceFeed,
  deleteSourceFeed,
  sendCombXml,
  cacheFeed,
  deleteCache
};