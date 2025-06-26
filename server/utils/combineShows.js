const axios = require("axios");
const xml2js = require("xml2js");
const escapeHtmlChars = require("./escapeHtmlChars");

const combineShows = comb => {
  const feedPromises = comb.sourceFeeds.map(feed =>
    axios.get(feed.url)
  );

  return Promise.all(feedPromises)
    .then(feeds => {
      const feedDataPromises = feeds.map(feed =>
        xml2js.parseStringPromise(feed.data)
      );

      return Promise.all(feedDataPromises)
        .then(feedDataArray => {
          const channel = {
            title: escapeHtmlChars(comb.title),
            description: comb.description,
            image: comb.imageUrl,
            language: escapeHtmlChars(comb.language),
            category: escapeHtmlChars(comb.category),
            explicit: comb.isExplicit ?
              "yes" : "no",
            author: escapeHtmlChars(comb.author),
            isPublic: comb.isPublic
          };
          if(comb.link){
            channel.link = comb.link;
          }

          let xmlMetadata = {
            "xmlns:itunes": "http://www.itunes.com/dtds/podcast-1.0.dtd",
            "xmlns:googleplay": "http://www.google.com/schemas/play-podcasts/1.0/"
          };
          const episodes = [];

          for(let feedData of feedDataArray){
            // Add feed metadata
            xmlMetadata = {
              ...xmlMetadata,
              ...feedData.rss["$"]
            };
            // Add episodes
            episodes.push(...feedData.rss.channel[0].item);
          }

          // Sort all episodes by date
          episodes.forEach(e =>
            e.dateInt = new Date(e.pubDate[0]).getTime()
          );
          episodes.sort((a, b) => b.dateInt - a.dateInt);
          episodes.forEach(e => delete e.dateInt);

          return {
            xmlMetadata,
            channel,
            episodes
          };
        });
    });
};

module.exports = combineShows;