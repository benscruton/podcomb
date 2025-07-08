const hostUrl = process.env.HOST_URL || "http://localhost:8000";
const {isoLanguageCodes} = require("../utils");

const getHost = (req, rsp) => {
  rsp.json({hostUrl});
};

const getLangCodes = (req, rsp) => {
  rsp.json({isoLanguageCodes});
};

const getInfo = (req, rsp) => {
  rsp.json({
    hostUrl,
    isoLanguageCodes
  });
}

module.exports = {
  getHost,
  getLangCodes,
  getInfo
};