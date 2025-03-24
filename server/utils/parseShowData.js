const parseShowData = (rssData, xmlMetadata = {}) => {
  
  xmlMetadata = {
    ...xmlMetadata,
    ...rssData.rss["$"]
  };
  

  const channelData = rssData.rss.channel[0];

  // Add required tags
  const channel = {
    title: channelData.title[0],
    description: channelData.description[0],
    "itunes:image": channelData["itunes:image"][0]["$"].href,
    image: channelData.image[0],
    language: channelData.language[0],
    "itunes:category": channelData["itunes:category"][0]["$"].text,
    "itunes:explicit": channelData["itunes:explicit"][0]
  };
  // Add recommended tags, if available
  if(channelData["itunes:author"]){
    channel["itunes:author"] = channelData["itunes:author"][0];
  }
  if(channelData.link){
    channel.link = channelData.link[0];
  }

  const episodes = channelData.item;

  return {xmlMetadata, channel, episodes};
};

module.exports = parseShowData;