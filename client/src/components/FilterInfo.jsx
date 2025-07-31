import dayjs from "dayjs";

const FilterInfo = ({comb, filter}) => {
  if(filter.type === "blacklist"){
    const Intro = () => (
      <>
        <p className = "mb-5">
          Filtering out episodes from
        </p>

        <ul className = "columns is-multiline">
          {comb.sourceFeeds
            .filter(sf =>
              filter.data.applyToComb ||
              filter.data.sourceFeedIds.includes(sf.id)
            ).map(sf =>
              <li
                key = {sf.id}
                className = "mr-3"
              >
                <div className = "box">
                  <div className = "media">
                    <div className = "media-left">
                      <figure className = "image is-64x64">
                        <img
                          src = {sf.imageUrl}
                          alt = {sf.title + " main image"}
                        />
                      </figure>
                    </div>
                    <div className = "media-content">
                      {sf.title}
                    </div>
                  </div>
                </div>
              </li>
            )
          }
        </ul>
      </>
    );

    if(filter.data.subtype === "Text"){
      return (
        <>
          <Intro />
          <p>
            whose {filter.data.episodeField} includes the following exact text ({filter.data.isCaseSensitive ? "" : "not "}case sensitive):
          </p>
          <code>
            {filter.data.exactText}
          </code>
        </>
      );
    }
    if(filter.data.subtype === "Date"){
      return (
        <>
          <Intro />
          <p>
            published {filter.data.timeframe} {dayjs(filter.data.date).format("MMMM D, YYYY")}
          </p>
        </>
      );
    }
  }
};

export default FilterInfo;