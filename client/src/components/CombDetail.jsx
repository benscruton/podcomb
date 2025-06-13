import {useContext, useState} from "react";
import axios from "axios";
import AppContext from "../context/AppContext";
import {
  SourceFeedBox,
  SourceFeedForm
} from ".";

const CombDetail = ({comb, isLoaded, setComb}) => {
  const {serverUrl} = useContext(AppContext);

  const [copyNotification, setCopyNotification] = useState("");

  const removeSourceFeed = e => {
    axios.delete(
      `${serverUrl}/api/combs/${comb.id}/sourcefeeds/${e.target.value}`,
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

  const copyLink = e => {
    navigator.clipboard.writeText(e.target.value);
    setCopyNotification("Copied!");
    setTimeout(() => setCopyNotification(""), 2000)
  };
  
  return (
    <>
      {isLoaded ?
        comb ?
          <>
            <h1 className = "title is-2">
              {comb.title}
            </h1>

            <p className = "mb-2 has-text-success">
              <button
                className = "button is-info mr-2"
                value = {`${serverUrl}/feeds/${comb.id}`}
                onClick = {copyLink}
              >
                Copy RSS link
              </button>
              {copyNotification}
            </p>

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
                removeSourceFeed = {removeSourceFeed}
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