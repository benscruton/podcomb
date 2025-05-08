const axios = require("axios");
const xml2js = require("xml2js");
const fs = require("fs");
const path = require("path");
const {
  buildXml,
  parseShowData
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

        const showData = parseShowData(result);
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

  const showPromise1 = axios.get(urls[show1]);
  const showPromise2 = axios.get(urls[show2]);

  // Get original XML from show URL
  Promise.all([showPromise1, showPromise2])
    .then(shows => {
      // Parse with xml2js asynchronously, return promise array
      const showDataPromises = shows.map(show =>
        xml2js.parseStringPromise(show.data)
      );

      // Resolve these to non-promise JSON data
      Promise.all(showDataPromises)
        .then(showDataArray => {
          let xmlMetadata = {};
          const channel = {};
          const episodes = [];

          for(let showData of showDataArray){
            const {
              xmlMetadata: showMetadata,
              channel: showChannel,
              episodes: showEpisodes
            } = parseShowData(showData);

            // Update metadata with new show data
            xmlMetadata = {
              ...xmlMetadata,
              ...showMetadata
            };

            // If first show, borrow channel data
            if(!channel.title){
              for(let field in showChannel){
                channel[field] = showChannel[field];
              }
            }
            // Otherwise, append new show title and description, 
            // and mark as explicit if any show is explicit
            else{
              channel.title += ` | ${showChannel.title}`;
              channel.description += `\n\n***\n\n${showChannel.description}`;

              channel["itunes:explicit"] = (
                channel["itunes:explicit"] === "true" ||
                showChannel["itunes:explicit"] === "true" ?
                  "true" : "false"
              )
            }

            // Add episodes
            episodes.push(...showEpisodes);
          }

          // Sort episodes by date
          episodes.forEach(e =>
            e.dateInt = new Date(e.pubDate[0]).getTime()
          );
          episodes.sort((a, b) => b.dateInt - a.dateInt);
          episodes.forEach(e => delete e.dateInt);

          const xml = buildXml({
            xmlMetadata,
            channel,
            episodes
          })

          rsp.set("Content-Type", "text/xml");
          rsp.send(xml);
        })
      .catch(e => console.log(e));
    });

}

module.exports = {
  test,
  relay,
  transform,
  combine
};