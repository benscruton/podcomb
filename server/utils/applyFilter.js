const applyTextFilter = (episodes, filter) => {
  const defaultInclusion = filter.type === "blacklist"

  if(!filter.data.isCaseSensitive){
    filter.data.exactText = filter.data.exactText.toLowerCase();
  }
  episodes.forEach(e => {
    let compareText = e[filter.data.episodeField][0];
    if(!filter.data.isCaseSensitive){
      compareText = compareText.toLowerCase();
    }
    const isMatch = compareText.includes(filter.data.exactText);

    e.podcomb.filters.unshift({
      filterId: filter.id,
      priority: filter.priority || 100,
      includeEpisode: isMatch ?
        // If match, apply filter
        !defaultInclusion
        :
        // If no match, keep most recent inclusion state
        e.podcomb.filters[0].includeEpisode
    });
  });
};

const applyDateFilter = (episodes, filter) => {
  const defaultInclusion = filter.type === "blacklist"

  const compareTimestamp = (new Date(filter.data.date)
    // Convert date to integer
    .getTime() +
    // Use end-of-day timestamp for "after" filter
    (filter.data.timeframe === "after" ? 86399999 : 0)
  );
  episodes.forEach(e => {
    isMatch = (filter.data.timeframe === "after" ?
      e.podcomb.date > compareTimestamp
      :
      e.podcomb.date < compareTimestamp
    );

    e.podcomb.filters.unshift({
      filterId: filter.id,
      priority: filter.priority || 100,
      includeEpisode: isMatch ?
        // If match, apply filter
        !defaultInclusion
        :
        // If no match, keep most recent inclusion state
        e.podcomb.filters[0].includeEpisode
    });
  });
};

const applyFilter = (episodes, filter) => {
  if(filter.data.subtype === "Text"){
    applyTextFilter(episodes, filter);
  }
  if(filter.data.subtype === "Date"){
    applyDateFilter(episodes, filter);
  }
};

module.exports = applyFilter;