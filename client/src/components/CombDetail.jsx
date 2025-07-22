import {useContext, useState} from "react";
import axios from "axios";
import AppContext from "../context/AppContext";
import {
  BoxMessage,
  FeedCacheCard,
  FilterBox,
  FilterForm,
  SourceFeedBox,
  SourceFeedForm
} from ".";

const CombDetail = ({comb, isLoaded, setComb, isOwner}) => {
  const {
    serverUrl,
    hostUrl,
    isoLanguageCodes
  } = useContext(AppContext);

  const emptyFilterInputs = {
    name: "",
    type: "",
    data: {
      applyToComb: false,
      sourceFeedIds: []
    }
  };

  const [copyNotification, setCopyNotification] = useState("");
  const [isStaleMsgDismissed, setIsStaleMsgDismissed] = useState(false);
  const [filterInputs, setFilterInputs] = useState(emptyFilterInputs);
  const [filterErrors, setFilterErrors] = useState(emptyFilterInputs);

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

  const handleChangeFilter = e => {
    setFilterInputs({...filterInputs,
      [e.target.name]: e.target.value
    });
    setFilterErrors({...filterErrors,
      [e.target.name]: ""
    });
  };

  const frontEndFilterValidator = () => {
    const errors = {};
    let hasErrors = false;
    if(!filterInputs.name){
      hasErrors = true;
      errors.name = "Filter must have a name";
    }
    if(!filterInputs.type){
      hasErrors = true;
      errors.type = "Must select a type";
    }
    return {errors, hasErrors};
  };

  const addFilter = e => {
    e.preventDefault();
    const {errors, hasErrors} = frontEndFilterValidator();
    if(hasErrors){
      return setFilterErrors({
        ...filterErrors,
        ...errors
      });
    }
    axios.post(
      `${serverUrl}/api/combs/${comb.id}/filters`,
      {filter: filterInputs},
      {withCredentials: true}
    )
      .then(({data}) => {
        if(!data.success){
          return setFilterErrors({
            ...filterErrors,
            ...data.errors
          });
        }
        setComb({...comb,
          filters: [
            ...comb.filters,
            data.filter
          ]
        });
        setFilterInputs(emptyFilterInputs);
      })
      .catch(e => console.error(e));
  };
  
  const removeFilter = e => {
    axios.delete(
      `${serverUrl}/api/combs/${comb.id}/filters/${e.target.value}`,
      {withCredentials: true}
    )
      .then(({data}) => {
        if(data.success){
          setComb({...comb,
            filters: comb.filters.filter(f => f.id !== data.filterId)
          })
        }
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
                  classes = "card-content"
                />
              </div>
              : <></>
            }


            <h2 className = "title is-3 mt-4 mb-1">
              Filters
            </h2>
            {comb.filters.map(filter =>
              <FilterBox
                key = {filter.id}
                comb = {comb}
                filter = {filter}
                isOwner = {isOwner}
                removeFilter = {removeFilter}
              />
            )}
            {isOwner ?
              <div className = "card">
                <header className = "card-header has-background-light">
                  <p className = "card-header-title">
                    Add New Filter
                  </p>
                </header>
                <FilterForm
                  comb = {comb}
                  filter = {filterInputs}
                  setFilter = {setFilterInputs}
                  errors = {filterErrors}
                  setErrors = {setFilterErrors}
                  handleChange = {handleChangeFilter}
                  handleSubmit = {addFilter}
                  classes = "card-content"
                />

                <button onClick = {() => console.log(filterInputs)} className = "button">
                  Log
                </button>
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