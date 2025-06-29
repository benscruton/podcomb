const buildXml = require("./buildXml");
const cacheCombXml = require("./cacheCombXml");
const combineShows = require("./combineShows");
const combineShowsExample = require("./combineShowsExample");
const deleteCombXmlCache = require("./deleteCombXmlCache");
const escapeHtmlChars = require("./escapeHtmlChars");
const validators = require("./validators");
const parseShowDataExample = require("./parseShowDataExample");
const getUserIdFromCookie = require("./getUserIdFromCookie");

module.exports = {
  buildXml,
  cacheCombXml,
  combineShows,
  combineShowsExample,
  deleteCombXmlCache,
  escapeHtmlChars,
  getUserIdFromCookie,
  validators,
  parseShowDataExample
};