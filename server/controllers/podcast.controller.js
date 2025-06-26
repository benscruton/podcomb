const axios = require("axios");
const xml2js = require("xml2js");
const path = require("path");
const fs = require("fs");
const {
  buildXml,
  combineShows,
  parseShowDataExample
} = require("../utils");

const urls = {
  hrr: "https://rss.art19.com/hey-riddle-riddle",
  trees: "https://rss.art19.com/completely-arbortrary",
  ling: "https://feeds.soundcloud.com/users/soundcloud:users:237055046/sounds.rss",
  hpatb: "https://anchor.fm/s/eb29d7e0/podcast/rss",
  digham: "https://feeds.buzzsprout.com/652870.rss",
};

const test = (req, rsp) => rsp.json({pass: true});

const relay = (req, rsp) => {
  const {show} = req.params;

  if(!urls[show]){
    return rsp.json({
      show,
      error: "Show not found"
    });
  }

  axios.get(urls[show])
    .then(({data}) => {
      rsp.set("Content-Type", "text/xml");
      rsp.send(data);
    })
    .catch(e => {
      console.log(e);
      return rsp.json({error: e});
    });
};

const transform = (req, rsp) => {
  const {show} = req.params;
  if(!urls[show]){
    return rsp.json({
      show,
      error: "Show not found"
    })
  };

  axios.get(urls[show])
    .then(({data}) => {
      xml2js.parseString(data, (err, result) => {
        if(err)
          throw new Error(err);

        const showData = parseShowDataExample(result);
        const xml = buildXml(showData);

        rsp.set("Content-Type", "text/xml");
        rsp.send(xml);
      });
    })
    .catch(e => {
      console.log(e);
      return rsp.json({error: e});
    });
};

const combine = (req, rsp) => {
  const {show1, show2} = req.params;
  if(!urls[show1] || !urls[show2]){
    return rsp.json({
      shows: [show1, show2],
      error: "Show not found."
    });
  }

  combineShows([urls[show1], urls[show2]])
    .then(combinedData => {
      const xml = buildXml(combinedData);

      rsp.set("Content-Type", "text/xml");
      rsp.send(xml);
    })
    .catch(e => console.log(e));
};

const staticXml = (req, rsp) => {
  const {file} = req.params;
  const filepath = path.join(
    __dirname,
    "..",
    "..",
    "samples",
    `${file}.xml`
  );
  fs.readFile(filepath, "utf-8", (e, xmlData) => {
    if(e){
      return rsp.json({success: false, error: e});
    }
    rsp.set("Content-Type", "text/xml");
    rsp.send(xmlData);
  });
};

const cacheFeed = (req, rsp) => {
  const {show} = req.params;
  if(!urls[show]){
    return rsp.json({
      show,
      error: "Show not found"
    });
  }

  axios.get(urls[show])
    .then(({data: xmlData}) => {
      const filepath = path.join(
        __dirname,
        "..",
        "..",
        "samples",
        `${show}.xml`
      );

      fs.writeFile(filepath, xmlData, e => {
        if(e){
          return rsp.json({success: false, error: e});
        }
        return rsp.json({success: true, show});
      });
    });
};

module.exports = {
  test,
  relay,
  transform,
  combine,
  staticXml,
  cacheFeed
};