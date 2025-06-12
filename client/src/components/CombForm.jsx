import {useContext, useState} from "react";
import {useNavigate} from "react-router";
import axios from "axios";
import AppContext from "../context/AppContext";

const CombForm = ({comb, setComb, setIsEditing}) => {
  const {serverUrl} = useContext(AppContext);
  const navigate = useNavigate();
  
  const initialInputs = {
    title: comb?.title || "",
    description: comb?.description || "",
    language: comb?.language || "",
    imageUrl: comb?.imageUrl || "",
    category: comb?.category || "",
    author: comb?.author || "",
    link: comb?.link || "",
    isExplicit: comb?.isExplicit || false,
    isPublic: comb?.isPublic || false
  };

  const [inputs, setInputs] = useState(initialInputs);
  
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
  
  const createComb = e => {
    e.preventDefault();
    axios.post(
      `${serverUrl}/api/combs/`,
      {comb: inputs},
      {withCredentials: true}
    )
      .then(({data}) => {
        navigate(`/combs/${data.comb.id}`);
      })
      .catch(e => console.error(e));
  };

  const updateComb = e => {
    e.preventDefault();
    axios.put(
      `${serverUrl}/api/combs/${comb.id}`,
      {comb: inputs},
      {withCredentials: true}
    )
      .then(({data}) => {
        if(data.success){
          setComb(data.comb);
          setIsEditing(false);
        }
      })
      .catch(e => console.error(e));
  };

  return (
    <form
      className = "card-content"
      onSubmit = {comb ? updateComb : createComb}
    >

      {comb ?
        <p className = "mb-4 has-text-centered">
          <img
            style = {{maxWidth: "200px"}}
            src = {comb.imageUrl}
            alt = "Podcast cover image"
          />
        </p>
        : <></>
      }
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
          className = "button is-success mx-2"
          type = "submit"
        >
          {comb ? "Update Comnb" : "Create Comb"}
        </button>

        {comb ?
          <button
            className = "button has-background-warning mx-2"
            onClick = {() => setIsEditing(false)}
          >
            Cancel
          </button>
          : <></>
        }
      </div>
    </form>
  );
};

export default CombForm;