import {useState, useContext} from "react";
import axios from "axios";
import AppContext from "../context/AppContext";
import FormField from "./FormField";

const SourceFeedBox = ({sourceFeed, idx, removeSourceFeed, comb, setComb, isOwner}) => {
  const {serverUrl} = useContext(AppContext);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [inputs, setInputs] = useState({
    overrideImageUrl: sourceFeed.overrideImageUrl || ""
  });
  const [showSettings, setShowSettings] = useState(false);
  
  const updateCombImage = () => {
    axios.put(
      `${serverUrl}/api/combs/${comb.id}`,
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

    if(data.refreshImage){
      setIsRefreshing(true);
    }

    axios.put(
      `${serverUrl}/api/combs/${comb.id}/sourcefeeds/${sourceFeed.id}`,
      data,
      {withCredentials: true}
    )
      .then(({data}) => {
        if(data.success){
          setComb({...comb,
            sourceFeeds: [
              ...comb.sourceFeeds.slice(0, idx),
              data.sourceFeed,
              ...comb.sourceFeeds.slice(idx + 1)
            ]
          });
        }
      })
      .catch(e => console.error(e))
      .finally(() => setIsRefreshing(false));
  };

  const handleChange = e => {
    setInputs({...inputs,
      [e.target.name]: e.target.value
    });
  }
  
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

      {isOwner ?
        <p
          className = "has-text-link has-text-right"
          onClick = {() => setShowSettings(!showSettings)}
        >
          {showSettings ? "Hide settings" : "Settings"}
        </p>
        : <></>
      }

      {/* ACTIONS (available to comb owner only) */}
      {showSettings ?
        <>
          {/* OVERRIDE EPISODE IMAGE */}
          <FormField
            label = {"Override episode image" + (sourceFeed.overrideEpisodeImage ? " (enter URL below)" : "")}
            name = "overrideEpisodeImage"
            inputType = "checkbox"
            value = {sourceFeed.overrideEpisodeImage}
            handleChange = {e => updateSourceFeed(
              e, {sourceFeed: {overrideEpisodeImage: e.target.checked}}
            )}
            classes = "has-text-centered"
          />

          {sourceFeed.overrideEpisodeImage ?
            <form
              className = "columns is-vcentered"
              onSubmit = {e => updateSourceFeed(
                e, {sourceFeed: {
                  overrideImageUrl: inputs.overrideImageUrl || null
                }}
              )}
            >
              {/* OVERRIDE IMAGE PREVIEW */}
              <div className = "column is-2">
                {sourceFeed.overrideImageUrl ?
                  <figure className = "image is-96x96">
                    <img
                      src = {sourceFeed.overrideImageUrl}
                      alt = {`${sourceFeed.title} episode override image`}
                    />
                  </figure>
                  : <></>
                }
              </div>

              <FormField
                name = "overrideImageUrl"
                inputType = "text"
                value = {inputs.overrideImageUrl}
                handleChange = {handleChange}
                placeholder = "Defaults to source feed image"
                classes = "column is-8 mt-0 mb-1 mb-0-mobile"
              />
              <div className = "column is-2 has-text-centered-mobile mt-0-mobile">
                <button
                  type = "submit"
                  className = "button is-success"
                  disabled = {inputs.overrideImageUrl === sourceFeed.overrideImageUrl || (!inputs.overrideImageUrl && !sourceFeed.overrideImageUrl)}
                >
                  Update
                </button>
              </div>
            </form>
            : <></>
          }
        
          <p className = "has-text-centered mt-3">
            <button
              className = "button is-danger mx-2 mb-1"
              value = {sourceFeed.id}
              onClick = {removeSourceFeed}
            >
              Remove feed
            </button>

            <button
              className = "button mx-2 mb-1"
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
                className = "button mx-2 mb-1"
                value = {sourceFeed.imageUrl}
                onClick = {updateCombImage}
                disabled = {sourceFeed.imageUrl === comb.imageUrl}
              >
                Use As Comb Image
              </button>
              : <></>
            }
          </p>
        </>
        : <></>
      }
    </div>
  );
};

export default SourceFeedBox;