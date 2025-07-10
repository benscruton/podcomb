const axios = require("axios");
const fs = require("fs");
const path = require("path");
const xml2js = require("xml2js");
const {
  buildXml,
  cacheCombXml,
  combineShows,
  createAuthCookie,
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

const xmlCacheDirPath = path.join(
  __dirname,
  "..",
  "cache",
  "xml"
);

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

    createAuthCookie(rsp, user.id);
    return rsp.json({success: true, comb});
  }
  catch(e){
    console.log(e);
    rsp.json({success: false, error: e.message});
  }
};

const getComb = (req, rsp) => {
  const {combId} = req.params;
  const userId = getUserIdFromCookie(req.cookies.userToken);

  Comb.findByPk(
    combId,
    {include: [User, SourceFeed]}
  ).then(comb => {
    if(!comb){
      return rsp.status(404).json({success: false});
    }
    if(!comb.isPublic && comb.userId !== userId){
      return rsp.status(403).json({success: false, error: "Not authorized"});
    }
    
    createAuthCookie(rsp, userId);
    return rsp.json({
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
  const {combId} = req.params;
  const userId = getUserIdFromCookie(req.cookies.userToken);
  try{
    const comb = await Comb.findByPk(
      combId,
      {include: [User, SourceFeed]}
    );
    if(!comb){
      return rsp.status(404).json({success: false});
    }
    if(userId !== comb.userId){
      return rsp.status(403).json({success: false, error: "Not authorized"});
    }

    const combData = req.body.comb;
    const {errors, hasErrors} = combUpdateValidator(combData);
    if(hasErrors){
      return rsp.json({success: false, errors});
    }

    const updatableFields = [
      "title",
      "author",
      "description",
      "language",
      "imageUrl",
      "category",
      "link",
      "isExplicit",
      "isPublic"
    ];
    for(let field in combData){
      if(!updatableFields.includes(field)){
        delete combData[field];
      }
    }
    await comb.update(combData);

    createAuthCookie(rsp, userId);
    return rsp.json({
      success: true,
      comb
    });
  }
  catch(e){
    return rsp.status(400).json({success: false, error: e.message});
  }
};

const deleteComb = async (req, rsp) => {
  const {combId} = req.params;
  const userId = getUserIdFromCookie(req.cookies.userToken);
  try{
    const comb = await Comb.findByPk(combId);
    if(!comb){
      return rsp.status(404).json({success: false});
    }
    if(userId !== comb.userId){
      return rsp.status(403).json({success: false, error: "Not authorized"});
    }

    await comb.destroy();
    createAuthCookie(rsp, userId);
    return rsp.json({success: true, combId});
  }
  catch(e){
    return rsp.status(400).json({success: false, error: e.message});
  }
};

const getUserCombs = async (req, rsp) => {
  const userId = getUserIdFromCookie(req.cookies.userToken);
  const combs = await Comb.findAll({
    where: {userId}
  });
  return rsp.json({
    success: true,
    combs
  });
};

const addSourceFeed = async (req, rsp) => {
  const {combId} = req.params;
  const userId = getUserIdFromCookie(req.cookies.userToken);

  try{
    const comb = await Comb.findByPk(combId);
    if(!comb){
      return rsp.status(404).json({success: false});
    }
    if(userId !== comb.userId){
      return rsp.status(403).json({success: false, error: "Not authorized"});
    }

    const sourceFeedData = req.body.sourceFeed;
    const {errors, hasErrors} = sourceFeedValidator(sourceFeedData);
    if(hasErrors){
      return rsp.json({success: false, errors});
    }

    const sourceFeed = await SourceFeed.create({
      title: sourceFeedData.title,
      url: sourceFeedData.url
    });
    await sourceFeed.setComb(comb);

    createAuthCookie(rsp, userId);
    return rsp.json({success: true, sourceFeed});
  }
  catch(e){
    console.log(e);
    rsp.json({success: false, error: e.message});
  }
};

deleteSourceFeed = async (req, rsp) => {
  const {combId, sourceFeedId} = req.params;
  const userId = getUserIdFromCookie(req.cookies.userToken);
  try{
    const sourceFeed = await SourceFeed.findByPk(
      sourceFeedId,
      {include: Comb}
    );
    if(!sourceFeed?.comb){
      return rsp.status(404).json({success: false});
    }
    if(
      combId !== sourceFeed.comb.id ||
      userId !== sourceFeed.comb.userId
    ){
      return rsp.status(403).json({success: false, error: "Not authorized"});
    }

    await sourceFeed.destroy();
    createAuthCookie(rsp, userId);
    return rsp.json({success: true, sourceFeedId});
  }
  catch(e){
    rsp.status(400).json({success: false, error: e.message});
  }
};

const updateSourceFeed = async (req, rsp) => {
  const {combId, sourceFeedId} = req.params;
  const userId = getUserIdFromCookie(req.cookies.userToken);
  const {refreshImage, sourceFeed: sfData} = req.body;
  try{
    const sourceFeed = await SourceFeed.findByPk(
      sourceFeedId,
      {include: Comb}
    );
    if(!sourceFeed?.comb){
      return rsp.status(404).json({success: false});
    }
    if(
      combId !== sourceFeed.comb.id ||
      userId !== sourceFeed.comb.userId
    ){
      return rsp.status(403).json({success: false, error: "Not authorized"});
    }
    
    if(sfData){
      const updatableFields = [
        "title",
        "url",
        "imageUrl"
      ];
      for(let field in sfData){
        if(!updatableFields.includes(field)){
          delete sfData[field];
        }
      }
      await sourceFeed.update(sfData);
    }
    
    if(refreshImage){
      axios.get(sourceFeed.url)
        .then(({data}) => {
          xml2js.parseString(data, async (e, result) => {
            if(e){
              throw e;
            }
            const imageUrl = result.rss.channel[0].image[0].url[0];
            await sourceFeed.update({imageUrl});

            createAuthCookie(rsp, userId);
            return rsp.json({success: true, sourceFeed});
          })
        })
        .catch(e => rsp.json({success: false, error: e.message}));
    }
    else{
      createAuthCookie(rsp, userId);
      return rsp.json({success: true, sourceFeed});
    }
  }
  catch(e){
    return rsp.json({success: false, error: e.message});
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
  
  // Send cache file if it exists
  if(comb.cachedAt){
    const xmlCacheFilePath = path.join(
      xmlCacheDirPath,
      comb.userId,
      `${comb.id}.xml`
    );
    if(fs.existsSync(xmlCacheFilePath)){
      return fs.readFile(
        xmlCacheFilePath,
        "utf-8",
        (e, xmlData) => {
          if(e){
            return rsp.json({success: false, error: e});
          }
          rsp.set("Content-Type", "text/xml");
          rsp.send(xmlData);
        }
      );
    }
    else{
      // If comb has cachedAt timestamp but no file
      comb.update({cachedAt: null});
    }
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
  const userId = getUserIdFromCookie(req.cookies.userToken);

  const comb = await Comb.findByPk(
    combId,
    {include: SourceFeed}
  );
  if(!comb){
    return rsp.status(404).json({success: false, error: "Comb not found"})
  }
  if(userId !== comb.userId){
    return rsp.status(403).json({success: false, error: "Not authorized"});
  }

  let response = {};
  const {cacheNow, cacheInterval} = req.body;

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

  createAuthCookie(rsp, userId);
  return rsp.json(response);
};

const deleteCache = async (req, rsp) => {
  const {combId} = req.params;
  const userId = getUserIdFromCookie(req.cookies.userToken);
  const comb = await Comb.findByPk(combId);
  if(!comb){
    return rsp.status(404).json({success: false, error: "Comb not found"})
  }
  if(userId !== comb.userId){
    return rsp.status(403).json({success: false, error: "Not authorized"});
  }

  const result = deleteCombXmlCache(comb);
  if(result.error){
    rsp.status(400).json({success: false});
  }
  createAuthCookie(rsp, userId);
  return rsp.json(result);
};

module.exports = {
  createComb,
  getComb,
  updateComb,
  deleteComb,
  getUserCombs,
  addSourceFeed,
  deleteSourceFeed,
  updateSourceFeed,
  sendCombXml,
  cacheFeed,
  deleteCache
};