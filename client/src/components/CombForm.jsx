import {useContext, useState} from "react";
import axios from "axios";
import AppContext from "../context/AppContext";

const CombForm = () => {
  const {
    serverUrl,
    userData
  } = useContext(AppContext);
  
  const emptyInputs = {
    title: "",
    description: "",
    language: "",
    imageUrl: "",
    category: "",
    author: "",
    link: "",
    isExplicit: false,
    isPublic: false
  };

  const [inputs, setInputs] = useState(emptyInputs);
  
  const handleChange = e => {
    if(e.target.type === "checkbox"){
      return setInputs({
        ...inputs,
        [e.target.name]: e.target.checked
      });
    }
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = e => {
    e.preventDefault();
    const comb = {...inputs, userId: userData.id};
    axios.post(
      `${serverUrl}/api/combs/`,
      {comb},
      {withCredentials: true}
    )
      .then(rsp => console.log(rsp.data))
      .catch(e => console.error(e));
  };

  return (
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

      {/* AUTHOR */}
      <div className = "field">
        <label
          className = "label"
          htmlFor = "author"
        >
          Author(s)
        </label>
        <div className = "control">
          <input
            className = "input"
            type = "text"
            name = "author"
            id = "author"
            onChange = {handleChange}
            value = {inputs.author}
          />
        </div>
      </div>
      
      {/* DESCRIPTION*/}
      <div className = "field">
        <label
          className = "label"
          htmlFor = "description"
        >
          Description
        </label>
        <textarea
          className = "textarea"
          name = "description"
          id = "description"
          onChange = {handleChange}
          value = {inputs.description}
        />
      </div>

      {/* LANGUAGE */}
      <div className = "field">
        <label
          className = "label"
          htmlFor = "language"
        >
          Language
        </label>
        <div className = "control">
          <input
            className = "input"
            type = "text"
            name = "language"
            id = "language"
            onChange = {handleChange}
            value = {inputs.language}
            placeholder = "Default: en"
          />
        </div>
      </div>
      
      {/* IMAGE URL */}
      <div className = "field">
        <label
          className = "label"
          htmlFor = "imageUrl"
        >
          Image URL
        </label>
        <div className = "control">
          <input
            className = "input"
            type = "text"
            name = "imageUrl"
            id = "imageUrl"
            onChange = {handleChange}
            value = {inputs.imageUrl}
            placeholder = "Direct link to an image"
          />
        </div>
      </div>

      {/* CATEGORY */}
      <div className = "field">
        <label
          className = "label"
          htmlFor = "category"
        >
          Category
        </label>
        <div className = "control">
          <input
            className = "input"
            type = "text"
            name = "category"
            id = "category"
            onChange = {handleChange}
            value = {inputs.category}
          />
        </div>
      </div>

      {/* LINK */}
      <div className = "field">
        <label
          className = "label"
          htmlFor = "link"
        >
          Link (optional)
        </label>
        <div className = "control">
          <input
            className = "input"
            type = "text"
            name = "link"
            id = "link"
            onChange = {handleChange}
            value = {inputs.link}
          />
        </div>
      </div>

      <div className = "field columns">
        {/* EXPLICIT ? */}
        <div className = "column is-half">
          <label className = "checkbox">
            <input
              type = "checkbox"
              name = "isExplicit"
              id = "isExplicit"
              onChange = {handleChange}
              checked = {inputs.isExplicit}
            />
            <strong className = "pl-2">
              Explicit
            </strong>
          </label>
        </div>

        {/* PUBLIC ? */}
        <div className = "column is-half">
          <label className = "checkbox">
            <input
              type = "checkbox"
              name = "isPublic"
              id = "isPublic"
              onChange = {handleChange}
              checked = {inputs.isPublic}
            />
            <strong className = "pl-2">
              Public
            </strong>
          </label>
        </div>
      </div>

      {/* SUBMIT BUTTON */}
      <div className = "has-text-centered">
        <button
          className = "button is-success"
          type = "submit"
        >
          Create
        </button>
      </div>
    </form>
  );
};

export default CombForm;