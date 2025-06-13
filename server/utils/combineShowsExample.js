const axios = require("axios");
const xml2js = require("xml2js");
const parseShowDataExample = require("./parseShowDataExample");

const combineShowsExample = shows => {

  const showPromises = shows.map(show =>
    axios.get(show)
  );

  // Get original XML from show URL
  return Promise.all(showPromises)
    .then(shows => {
      // Parse with xml2js asynchronously, return promise array
      const showDataPromises = shows.map(show =>
        xml2js.parseStringPromise(show.data)
      );

      // Resolve these to non-promise JSON data
      return Promise.all(showDataPromises)
        .then(showDataArray => {

          console.log(showDataArray);

          let xmlMetadata = {};
          const channel = {};
          const episodes = [];

          for(let showData of showDataArray){
            const {
              xmlMetadata: showMetadata,
              channel: showChannel,
              episodes: showEpisodes
            } = parseShowDataExample(showData);

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

          return {
            xmlMetadata,
            channel,
            episodes
          };
        });
    });
};

module.exports = combineShowsExample;