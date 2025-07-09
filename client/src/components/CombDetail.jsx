import {useContext, useState} from "react";
import axios from "axios";
import AppContext from "../context/AppContext";
import {
  BoxMessage,
  FeedCacheCard,
  SourceFeedBox,
  SourceFeedForm
} from ".";

const CombDetail = ({comb, isLoaded, setComb, isOwner}) => {
  const {
    serverUrl,
    hostUrl,
    isoLanguageCodes
  } = useContext(AppContext);

  const [copyNotification, setCopyNotification] = useState("");
  const [isStaleMsgDismissed, setIsStaleMsgDismissed] = useState(false);

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

            <p className = "mb-3">
              Created by <strong>{comb.user.username}</strong>
            </p>

            {comb.cachedAt && !comb.cacheInterval && !isStaleMsgDismissed ?
              <BoxMessage
                message = {{
                  color: "warning",
                  title: "Warning: Possible Stale Feed",
                  text: "This comb currently has a cache file, but does not have a cache interval set. This means the cache won't update unless you perform a manual update. With these settings, you may miss new episodes that are added to the feed. For best results, it is recommended either to set a cache interval or to delete your cache file."
                }}
                clear = {() => setIsStaleMsgDismissed(true)}
              />
              : <></>
            }

            <p className = "mb-2 has-text-success">
              <button
                className = "button is-info mr-2"
                value = {`${hostUrl}/feeds/${comb.id}`}
                onClick = {copyLink}
              >
                Copy RSS link
              </button>
              {copyNotification}
            </p>

            
            <img
              style = {{maxWidth: "200px"}}
              src = {comb.imageUrl || null}
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
              {isoLanguageCodes ?
                isoLanguageCodes[comb.language].name
                :
                "Loading languages..."
              }
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
                <a
                  target = "_blank"
                  rel = "noreferrer"
                  href = {comb.link}
                >
                  {comb.link}
                </a>
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
              Feed Caching
            </h2>
            <FeedCacheCard
              comb = {comb}
              setComb = {setComb}
              isOwner = {isOwner}
            />

            <h2 className = "title is-3 mt-4 mb-1">
              Source Feeds
            </h2>

            {comb.sourceFeeds.map((sourceFeed, idx) =>
              <SourceFeedBox
                key = {sourceFeed.id}
                sourceFeed = {sourceFeed}
                idx = {idx}
                removeSourceFeed = {removeSourceFeed}
                comb = {comb}
                setComb = {setComb}
                isOwner = {isOwner}
              />
            )}

            {isOwner ?
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
              : <></>
            }
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