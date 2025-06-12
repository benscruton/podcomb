import {useContext} from "react";
import axios from "axios";
import AppContext from "../context/AppContext";
import {
  SourceFeedBox,
  SourceFeedForm
} from ".";

const CombDetail = ({comb, isLoaded, setComb}) => {
  const {serverUrl} = useContext(AppContext);

  const removeFeed = e => {
    axios.delete(
      `${serverUrl}/api/combs/${combId}/sourcefeeds/${e.target.value}`,
      {withCredentials: true}
    )
      .then(({data}) => {
        setComb({
          ...comb,
          sourceFeeds: comb.sourceFeeds.filter(sf =>
            sf.id !== data.sourceFeedId
          )
        });
      })
      .catch(e => console.error(e));

  };
  
  return (
    <>
      {isLoaded ?
        comb ?
          <>
            <h1 className = "title is-2">
              {comb.title}
            </h1>

            <img
              style = {{maxWidth: "200px"}}
              src = {comb.imageUrl}
              alt = "Podcast cover image"
            />
            
            <p>
              <span className = "has-text-weight-bold mr-3">
                Author:
              </span>
              {comb.author}
            </p>

            <p>
              <span className = "has-text-weight-bold mr-3">
                Description:
              </span>
              {comb.description}
            </p>

            <p>
              <span className = "has-text-weight-bold mr-3">
                Language:
              </span>
              {comb.language}
            </p>

            <p>
              <span className = "has-text-weight-bold mr-3">
                Category:
              </span>
              {comb.category}
            </p>

            {
              comb.link ?
                <p>
                <span className = "has-text-weight-bold mr-3">
                  Link:
                </span>
                {comb.link}
              </p>
              : <></>
            }

            <p>
              <span className = "has-text-weight-bold mr-3">
                Explicit:
              </span>
              {comb.isExplicit ? "Yes" : "No"}
            </p>

            <p>
              <span className = "has-text-weight-bold mr-3">
                Publicly discoverable:
              </span>
              {comb.isPublic ? "Yes" : "No"}
            </p>

            <h2 className = "title is-3 mt-4 mb-1">
              Source Feeds
            </h2>

            {comb.sourceFeeds.map(sourceFeed =>
              <SourceFeedBox
                key = {sourceFeed.id}
                sourceFeed = {sourceFeed}
                removeFeed = {removeFeed}
                combImageUrl = {comb.imageUrl}
                setComb = {setComb}
              />
            )}
            <div className = "card">
              <header className = "card-header has-background-light">
                <p className = "card-header-title">
                  Add New Source Feed
                </p>
              </header>
              <SourceFeedForm
                comb = {comb}
                setComb = {setComb}
              />
            </div>
          </>
          :
          <p>Comb loading failed.</p>
        :
        <p>Loading...</p>
      }

    </>
  );
};

export default CombDetail;