const xml2js = require("xml2js");
const xmlBuilder = new xml2js.Builder({cdata: true});

const buildEpisode = ep => {
  let xmlData = xmlBuilder.buildObject(ep);
  xmlData = xmlData.substring(xmlData.indexOf("\n") + 1);
  xmlData = xmlData.split("\n");
  xmlData[0] = "<item>";
  xmlData[xmlData.length - 1] = "</item>";
  xmlData = xmlData.map(line =>
      line.trim()[0] === "<" ?
        `    ${line}` : line
    )
    .join("\n");

  return xmlData;
};


const buildXml = ({xmlMetadata, channel, episodes}) => {
  // Initialize XML
  let xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";

  // Add version and namespace data
  xml += `\n<rss${
    Object
      .entries(xmlMetadata)
      .map(([key, value]) =>
        ` ${key}="${value}"`
      )
      .join("")
  }>`;

  // Add channel data
  xml += "\n  <channel>";

  xml += `\n    <title>${channel.title}</title>`;
  xml += `\n    <description><![CDATA[${channel.description}]]></description>`;
  xml += `\n    <language>${channel.language}</language>`;
  xml += `\n    <itunes:image href="${channel.image}" />`;
  xml += `\n    <itunes:category text="${channel.category}" />`
  xml += `\n    <itunes:explicit>${channel.explicit}</itunes:explicit>`;

  if(channel.link){
    xml += `\n    <link>${channel.link}</link>`
  }
  if(channel.author){
    xml += `\n    <itunes:author>${channel.author}</itunes:author>`;
  }
  if(!channel.isPublic){
    xml += "\n    <itunes:block>Yes</itunes:block>";
    xml += "\n    <googleplay:block>yes</googleplay:block>";
  }

  // Add episodes
  episodes.forEach(ep => {
    xml += "\n" + buildEpisode(ep);
  });

  xml += "\n  </channel>";
  
  // Close RSS tag
  xml += "\n</rss>";

  return xml;
};

module.exports = buildXml;


const sample = [
  {
    'atom:link': [ [Object], [Object] ],
    title: [
      "Lingthusiasm - A podcast that's enthusiastic about linguistics"
    ],
    link: [ 'https://lingthusiasm.com' ],
    pubDate: [ 'Thu, 20 Feb 2025 23:40:11 +0000' ],
    lastBuildDate: [ 'Thu, 20 Feb 2025 23:40:11 +0000' ],
    ttl: [ '60' ],
    language: [ 'en' ],
    copyright: [ 'All rights reserved' ],
    webMaster: [ 'feeds@soundcloud.com (SoundCloud Feeds)' ],
    description: [
      `A podcast that's enthusiastic about linguistics by Gretchen McCulloch and Lauren Gawne. "A fascinating listen that will change the way you see everyday communications." –New York Times. "Joyously nerdy" –Buzzfeed.  \n` +
        '\n' +
        'Weird and deep half-hour conversations about language on the third Thursday of the month.\n' +
        '\n' +
        'Listened to all the episodes here and wish there were more? Want to talk with other people who are enthusiastic about linguistics? Get bonus episodes and access to our Discord community at www.patreon.com/lingthusiasm \n' +
        'Shownotes and transcripts: www.lingthusiasm.com'
    ],
    'itunes:subtitle': [ "A podcast that's enthusiastic about linguistics b…" ],
    'itunes:owner': [ [Object] ],
    'itunes:author': [ 'Gretchen McCulloch and Lauren Gawne' ],
    'itunes:explicit': [ 'no' ],
    'itunes:image': [ [Object] ],
    image: [ [Object] ],
    'itunes:category': [ [Object] ],
    item: [
      "episodes go here"
    ]
  }
];