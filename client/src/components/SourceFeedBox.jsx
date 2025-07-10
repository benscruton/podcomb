import {useState, useContext} from "react";
import {useParams} from "react-router";
import axios from "axios";
import AppContext from "../context/AppContext";
import FormField from "./FormField";

const SourceFeedBox = ({sourceFeed, idx, removeSourceFeed, comb, setComb, isOwner}) => {
  const {combId} = useParams();
  const {serverUrl} = useContext(AppContext);

  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const updateCombImage = () => {
    axios.put(
      `${serverUrl}/api/combs/${combId}`,
      {comb: {imageUrl: sourceFeed.imageUrl}},
      {withCredentials: true}
    )
      .then(({data}) => {
        if(data.success){
          setComb(data.comb);
        }
      })
      .catch(e => console.error(e));
  };

  const updateSourceFeed = (e, data) => {
    e.preventDefault();
    console.log(e.target.value, data);

    if(data.refreshImage){
      setIsRefreshing(true);
    }

    axios.put(
      `${serverUrl}/api/combs/${combId}/sourcefeeds/${sourceFeed.id}`,
      data,
      {withCredentials: true}
    )
      .then(({data}) => {
        console.log(data);
        setComb({...comb,
          sourceFeeds: [
            ...comb.sourceFeeds.slice(0, idx),
            data.sourceFeed,
            ...comb.sourceFeeds.slice(idx + 1)
          ]
        });
      })
      .catch(e => console.error(e))
      .finally(() => setIsRefreshing(false));
  };
  
  return (
    <div
      className = "box has-background-light"
    >
      <div className = "media">
        <div className = "media-left">
          <figure className = "image is-96x96">
            <img
              src = {sourceFeed.imageUrl}
              alt = {`${sourceFeed.title} main image`}
            />
          </figure>
        </div>
        <div className = "media-content">
          <p className = "title is-5">
            {sourceFeed.title}
          </p>
          <p>
            {sourceFeed.url}
          </p>
        </div>
      </div>

      {/* OVERRIDE EPISODE IMAGE */}
      <FormField
        label = "Override episode image"
        name = "overrideEpisodeImage"
        inputType = "checkbox"
        value = {sourceFeed.overrideEpisodeImage}
        handleChange = {e => updateSourceFeed(
          e, {sourceFeed: {overrideEpisodeImage: e.target.checked}}
        )}
        classes = "has-text-centered mb-2"
      />
      
      
      {isOwner ?
        <p className = "has-text-centered">
          <button
            className = "button is-danger mx-2"
            value = {sourceFeed.id}
            onClick = {removeSourceFeed}
          >
            Remove feed
          </button>

          <button
            className = "button mx-2"
            value = {sourceFeed.id}
            onClick = {e => updateSourceFeed(
              e, {refreshImage: true}
            )}
            disabled = {isRefreshing}
          >
            Refresh image
          </button>
        
          {sourceFeed.imageUrl ?
            <button
              className = "button mx-2"
              value = {sourceFeed.imageUrl}
              onClick = {updateCombImage}
              disabled = {sourceFeed.imageUrl === comb.imageUrl}
            >
              Use As Cover Image
            </button>
            : <></>
          }
        </p>
        : <></>
      }
    </div>
  );
};

export default SourceFeedBox;