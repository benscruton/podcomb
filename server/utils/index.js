const buildXml = require("./buildXml");
const cacheCombXml = require("./cacheCombXml");
const combineShows = require("./combineShows");
const combineShowsExample = require("./combineShowsExample");
const deleteCombXmlCache = require("./deleteCombXmlCache");
const escapeHtmlChars = require("./escapeHtmlChars");
const getUserIdFromCookie = require("./getUserIdFromCookie");
const isoLanguageCodes = require("./isoLanguageCodes.json");
const parseShowDataExample = require("./parseShowDataExample");
const startXmlCacheCronJob = require("./startXmlCacheCronJob")
const validators = require("./validators");

module.exports = {
  buildXml,
  cacheCombXml,
  combineShows,
  combineShowsExample,
  deleteCombXmlCache,
  escapeHtmlChars,
  getUserIdFromCookie,
  isoLanguageCodes,
  parseShowDataExample,
  startXmlCacheCronJob,
  validators
};