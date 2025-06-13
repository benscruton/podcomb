const axios = require("axios");
const xml2js = require("xml2js");
const fs = require("fs");
const path = require("path");
const {
  buildXml,
  combineShows,
  parseShowDataExample
} = require("../utils");

const test = (req, rsp) => rsp.json({pass: true});

const relay = (req, rsp) => {
  const urls = {
    hrr: "https://rss.art19.com/hey-riddle-riddle",
    trees: "https://rss.art19.com/completely-arbortrary",
    ling: "https://feeds.soundcloud.com/users/soundcloud:users:237055046/sounds.rss",
    hpatb: "https://anchor.fm/s/eb29d7e0/podcast/rss",
    digham: "https://feeds.buzzsprout.com/652870.rss",
  };

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
  const urls = {
    hrr: "https://rss.art19.com/hey-riddle-riddle",
    trees: "https://rss.art19.com/completely-arbortrary",
    ling: "https://feeds.soundcloud.com/users/soundcloud:users:237055046/sounds.rss",
    hpatb: "https://anchor.fm/s/eb29d7e0/podcast/rss",
    digham: "https://feeds.buzzsprout.com/652870.rss",
  };

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
  const urls = {
    hrr: "https://rss.art19.com/hey-riddle-riddle",
    trees: "https://rss.art19.com/completely-arbortrary",
    ling: "https://feeds.soundcloud.com/users/soundcloud:users:237055046/sounds.rss",
    hpatb: "https://anchor.fm/s/eb29d7e0/podcast/rss",
    digham: "https://feeds.buzzsprout.com/652870.rss",
  };

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

module.exports = {
  test,
  relay,
  transform,
  combine
};