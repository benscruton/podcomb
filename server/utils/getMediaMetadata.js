const axios = require("axios");

const getMediaMetadata = async url => {
  const {headers} = await axios.head(url);
  const metadata = {
    length: headers["content-length"],
    mime: headers["content-type"]
  };
  
  if(!metadata.length){
    const {data} = await axios.get(url);
    metadata.length = data.length;
  }

  return metadata;
};

module.exports = getMediaMetadata;