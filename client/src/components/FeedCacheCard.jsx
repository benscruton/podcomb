import {useState, useContext} from "react";
import axios from "axios";
import dayjs from "dayjs"
import AppContext from "../context/AppContext";

const FeedCacheCard = ({comb, setComb}) => {
  const {serverUrl} = useContext(AppContext);
  const [isCaching, setIsCaching] = useState(false);
  const [displayInfo, setDisplayInfo] = useState(false);
  const toggleInfo = () => setDisplayInfo(!displayInfo);

  const cacheFeed = () => {
    setIsCaching(true);
    axios.put(
      `${serverUrl}/api/combs/${comb.id}/cache`,
      {cacheNow: true},
      {withCredentials: true}
    )
      .then(({data}) => {
        if(data.success){
          setIsCaching(false);
          setComb({...comb,
            cachedAt: data.cacheTimestamp
          });
        }
        else{
          throw new Error("Error caching feed");
        }
      })
      .catch(e => {
        console.error(e);
        setIsCaching(false);
      });
  };

  const deleteCache = () => {
    axios.delete(
      `${serverUrl}/api/combs/${comb.id}/cache`,
      {withCredentials: true}
    )
      .then(({data}) => {
        console.log(data);
        if(data.success){
          setComb({...comb,
            cachedAt: null
          });
        }
      })
      .catch(e => console.error(e));
  };

  return (
    <div className = "card">
      <div className = "card-content">
        {displayInfo ? 
          <div className = "message"><div className = "message-body">
            <p>
              You can set this comb to use a cached feed, rather than regenerating the combined feed XML every time.
            </p>
            <p>
              Using a cached feed allows Podcomb to send an XML document much faster, which means it won't take as long for your podcatcher to refresh the feed. However, using a cached feed also means there may be a delay in new episodes appearing in your feed.
            </p>
            <p>
              If you believe there is a new episode that isn't appearing in your feed yet, you can manually trigger a refresh of the cache file with the button below.
            </p>
            <p>
              <button
                className = "button"
                onClick = {toggleInfo}
              >
                Hide details
              </button>
            </p>
          </div></div>
          :
          <button
            className = "button mb-2"
            onClick = {toggleInfo}
          >
            Show details
          </button>
        }

        <p>
          {comb.cachedAt ?
            `Cached on ${dayjs(comb.cachedAt).format("MMMM D, YYYY [at] h:mm:ss A ")}`
            :
            "No cache file exists for this comb."
          }
        </p>
      </div>
      <footer className = "card-footer">
        <button
          className = {`card-footer-item button ${isCaching ? "has-background-light has-text-dark" : "has-text-link"}`}
          onClick = {cacheFeed}
          disabled = {isCaching}
        >
          Cache now
        </button>
        
        <button
          className = "card-footer-item button has-text-danger"
          onClick = {deleteCache}
          disabled = {!comb.cachedAt}
        >
          Delete cache file
        </button>
      </footer>
    </div>
  );
};

export default FeedCacheCard;