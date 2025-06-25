import {useContext, useState} from "react";
import axios from "axios";
import AppContext from "../context/AppContext";

const SourceFeedForm = ({comb, setComb}) => {
  const {serverUrl} = useContext(AppContext);

  const emptyInputs = {
    title: "",
    url: ""
  };

  const [inputs, setInputs] = useState(emptyInputs);
  const [isPending, setIsPending] = useState(false);

  const handleChange = e => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = e => {
    e.preventDefault();
    setIsPending(true);
    axios.post(
      `${serverUrl}/api/combs/${comb.id}/sourcefeeds`,
      {sourceFeed: inputs},
      {withCredentials: true}
    )
      .then(({data}) => {
        if(data.success){
          setComb({
            ...comb,
            sourceFeeds: [
              ...comb.sourceFeeds,
              data.sourceFeed
            ]
          });
          setInputs(emptyInputs);
        }
      })
      .catch(e => console.error(e))
      .finally(() => setIsPending(false));
  };

  return (
    <>
      <form
        className = "card-content"
        onSubmit = {handleSubmit}
      >
        {/* TITLE */}
        <div className = "field">
          <label
            className = "label"
            htmlFor = "title"
          >
            Title
          </label>
          <div className = "control">
            <input
              className = "input"
              type = "text"
              name = "title"
              id = "title"
              onChange = {handleChange}
              value = {inputs.title}
            />
          </div>
        </div>

        {/* TITLE */}
        <div className = "field">
          <label
            className = "label"
            htmlFor = "url"
          >
            Source Feed URL
          </label>
          <div className = "control">
            <input
              className = "input"
              type = "text"
              name = "url"
              id = "url"
              onChange = {handleChange}
              value = {inputs.url}
            />
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className = "has-text-centered">
        <button
          className = "button is-success"
          type = "submit"
          disabled = {isPending}
        >
          Add
        </button>
      </div>
      </form>
    </>
  );
};

export default SourceFeedForm;