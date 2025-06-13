const axios = require("axios");
const xml2js = require("xml2js");

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
            title: comb.title,
            description: comb.description,
            "itunes:image": comb.imageUrl,
            language: comb.language,
            "itunes:category": comb.category,
            "itunes:explicit": comb.isExplicit ?
              "yes" : "no",
            "itunes:author": comb.author
          };
          if(comb.link){
            channel.link = comb.link;
          }

          let xmlMetadata = {};
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