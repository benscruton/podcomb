const fs = require("fs");
const path = require("path");

const deleteCombXmlCache = comb => {
  try{
    const filePath = path.join(
      __dirname,
      "..",
      "cache",
      "xml",
      comb.userId,
      `${comb.id}.xml`
    );
    if(!fs.existsSync(filePath)){
      return {
        success: false,
        message: "No cache file exists for this comb"
      };
    }
    fs.rmSync(filePath);
    comb.cachedAt = null;
    comb.save();
    return {success: true};
  }
  catch(e){
    return {success: false, error: e.message};
  }
};

module.exports = deleteCombXmlCache;