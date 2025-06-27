const fs = require("fs");
const path = require("path");
const combineShows = require("./combineShows");
const buildXml = require("./buildXml");

const cacheCombXml = async comb => {
  return combineShows(comb)
    .then(combinedData => {
      const xml = buildXml(combinedData);

      const dirPath = path.join(
        __dirname,
        "..",
        "cache",
        "xml",
        comb.userId
      );

      if(!fs.existsSync(dirPath)){
        fs.mkdirSync(dirPath, {recursive: true});
      }
      const filePath = path.join(dirPath, `${comb.id}.xml`);

      fs.writeFileSync(filePath, xml);
      const cacheTimestamp = Date.now();

      comb.cachedAt = cacheTimestamp;
      comb.save();

      return {
        success: true,
        cacheTimestamp,
        filePath
      };
    })
    .catch(e => {
      console.log(e);
      return {success: false, error: e};
    });
};

module.exports = cacheCombXml;