const axios = require("axios");
const xml2js = require("xml2js");

const applyFilter = require("./applyFilter");
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

          feedDataArray.forEach((feedData, idx) => {
            const sourceFeed = comb.sourceFeeds[idx];
            let sfEpisodes = feedData.rss.channel[0].item;

            // Add feed metadata
            xmlMetadata = {
              ...xmlMetadata,
              ...feedData.rss["$"]
            };

            sfEpisodes.forEach(e => {
              // Add relevant categorization data
              e.podcomb = {
                sourceFeedId: sourceFeed.id,
                date: new Date(e.pubDate[0]).getTime(),
              };

              // Add filter array, if applicable
              if(comb.filters.length){
                e.podcomb.filters = [{
                  filterId: "none",
                  priotity: 32767,
                  includeEpisode: true
                }];
              }
              
              // Override episode image, if applicable
              if(sourceFeed.overrideEpisodeImage && (sourceFeed.overrideImageUrl || sourceFeed.imageUrl)){
                e["itunes:image"] = [{
                  "$": {href: sourceFeed.overrideImageUrl || sourceFeed.imageUrl}
                }]
              }
            });

            // Apply filters, if necessary
            comb.filters.forEach(filter => {
              if(
                !filter.isDisabled
                && (
                  filter.data.applyToComb
                  || filter.data.sourceFeedIds.includes(
                    sourceFeed.id
                  )
                )
              ){
                applyFilter(sfEpisodes, filter);
              }
            });

            if(comb.filters.length){
              if(comb.replaceFilteredEpisodeMedia){
                // Replace or delete enclosure
                sfEpisodes.forEach(e => {
                  // For non-filtered episodes, do nothing
                  if(e.podcomb.filters[0].includeEpisode){
                    return;
                  }
                  // For filtered episodes, follow sf settings
                  switch(sourceFeed.filteredMediaReplacement){
                    case "image":
                      e.enclosure = [{"$": {
                        url: sourceFeed.imageUrl,
                        length: sourceFeed.replacementMediaLength,
                        type: sourceFeed.replacementMediaMime
                      }}];
                      break;
                    case null:
                      delete e.enclosure;
                    default:
                      e.enclosure = [{"$": {
                        url: sourceFeed.filteredMediaReplacement,
                        length: sourceFeed.replacementMediaLength,
                        type: sourceFeed.replacementMediaMime
                      }}];
                  }
                })
              }
              else{
                sfEpisodes = sfEpisodes.filter(e =>
                  e.podcomb.filters[0].includeEpisode
                );
              }
            }
            
            // Add episodes
            episodes.push(...sfEpisodes);
          });


          // Sort all episodes by date
          episodes.sort((a, b) => b.podcomb.date - a.podcomb.date);
          episodes.forEach(e => delete e.podcomb);

          return {
            xmlMetadata,
            channel,
            episodes
          };
        });
    });
};

module.exports = combineShows;