import {useContext} from "react";
import {useParams} from "react-router";
import axios from "axios";
import AppContext from "../context/AppContext";

const SourceFeedBox = ({sourceFeed, removeSourceFeed, combImageUrl, setComb, isOwner}) => {
  const {combId} = useParams();
  const {serverUrl} = useContext(AppContext);
  
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
  
  return (
    <div
      className = "box has-background-light"
      key = {sourceFeed.id}
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
      
      {isOwner ?
        <p className = "has-text-centered">
          <button
            className = "button is-danger mx-2"
            value = {sourceFeed.id}
            onClick = {removeSourceFeed}
          >
            Remove feed
          </button>
        
          {sourceFeed.imageUrl ?
            <button
              className = "button is-info mx-2"
              value = {sourceFeed.imageUrl}
              onClick = {updateCombImage}
              disabled = {sourceFeed.imageUrl === combImageUrl}
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