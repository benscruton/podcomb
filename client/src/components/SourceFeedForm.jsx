import {useContext, useState} from "react";
import axios from "axios";
import AppContext from "../context/AppContext";
import FormField from "./FormField";

const SourceFeedForm = ({comb, setComb, classes}) => {
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
    <form
      className = {classes}
      onSubmit = {handleSubmit}
    >
      {/* TITLE */}
      <FormField
        label = "Title"
        name = "title"
        inputType = "text"
        value = {inputs.title}
        handleChange = {handleChange}
      />

      {/* URL */}
      <FormField
        label = "Source Feed URL"
        name = "url"
        inputType = "text"
        value = {inputs.url}
        handleChange = {handleChange}
      />

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
  );
};

export default SourceFeedForm;