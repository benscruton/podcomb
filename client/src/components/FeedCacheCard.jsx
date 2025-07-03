import {useState, useContext} from "react";
import axios from "axios";
import dayjs from "dayjs"
import AppContext from "../context/AppContext";

const FeedCacheCard = ({comb, setComb}) => {
  const {serverUrl} = useContext(AppContext);
  const [isCaching, setIsCaching] = useState(false);
  const [displayInfo, setDisplayInfo] = useState(false);
  const toggleInfo = () => setDisplayInfo(!displayInfo);

  const cacheIntervalOptions = [
    {value: 0, text: "Do not cache this comb"},
    {value: 1, text: "hour"},
    {value: 2, text: "2 hours"},
    {value: 3, text: "3 hours"},
    {value: 4, text: "4 hours"},
    {value: 6, text: "6 hours"},
    {value: 8, text: "8 hours"},
    {value: 12, text: "12 hours"},
    {value: 24, text: "day"}
  ];

  const [intervalInput, setIntervalInput] = useState(comb.cacheInterval || 0);

  const cacheFeed = () => {
    setIsCaching(true);
    axios.put(
      `${serverUrl}/api/combs/${comb.id}/cache`,
      {cacheNow: true},
      {withCredentials: true}
    )
      .then(({data}) => {
        console.log(data);
        if(data.success){
          setIsCaching(false);
          setComb({...comb,
            cachedAt: new Date(data.cacheTimestamp)
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

  const handleSelect = e => {
    setIntervalInput(e.target.value);
  };

  const handleSubmitInterval = e => {
    e.preventDefault();
    axios.put(
      `${serverUrl}/api/combs/${comb.id}/cache`,
      {cacheInterval: intervalInput},
      {withCredentials: true}
    )
      .then(({data}) => {
        if(data.success){
          setComb({...comb,
            cacheInterval: parseInt(intervalInput)
          });
        }
        else{
          throw new Error("Error scheduling cache");
        }
      })
      .catch(e => {
        console.error(e);
      });
  };

  return (
    <div className = "card">
      <div className = "card-content">
        <p>
          Current cache setting: {comb.cacheInterval ? 
            "Once every" + cacheIntervalOptions.filter(o => o.value === comb.cacheInterval)[0]?.text || "Sorry, something went wrong"
            :
            "No caching"
          }
        </p>

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
            More info
          </button>
        }

        <form
          className = "my-5"
          onSubmit = {handleSubmitInterval}
        >
          <h3 className = "title is-5">
            Update Cache Frequency
          </h3>
          <p>
            Cache this comb every...
          </p>
          <p className = "my-2 select">
            <select
              value = {intervalInput}
              onChange = {handleSelect}
            >
              {cacheIntervalOptions.map(option =>
                <option
                  key = {option.value}
                  value = {option.value}
                >
                  {option.text}
                </option>
              )}
            </select>
          </p>
          <p>
            <button
              className = "button"
              type = "submit"
              disabled = {intervalInput == comb.cacheInterval}
            >
              Update cache interval
            </button>
          </p>
        </form>

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