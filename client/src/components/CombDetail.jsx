import {useContext, useState, useEffect} from "react";
import {useNavigate} from "react-router";
import axios from "axios";
import AppContext from "../context/AppContext";
import {
  SourceFeedBox,
  SourceFeedForm
} from ".";

const CombDetail = ({combId}) => {
  const {serverUrl} = useContext(AppContext);
  const navigate = useNavigate();

  const [comb, setComb] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    axios.get(
      `${serverUrl}/api/combs/${combId}`,
      {withCredentials: true}
    )
      .then(({data}) => {
        setComb(data.comb);
      })
      .catch(e => console.error(e))
      .finally(() => setIsLoaded(true));
  }, []);

  const deleteComb = () => {
    axios.delete(
      `${serverUrl}/api/combs/${combId}`,
      {withCredentials: true}
    )
      .then(({data}) => {
        if(data.success){
          navigate("/users");
        }
      })
      .catch(e => console.error(e));
  };

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

            <p>
              <button
                className = "button has-background-danger mb-2"
                onClick = {deleteComb}
              >
                Delete This Comb
              </button>
            </p>
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