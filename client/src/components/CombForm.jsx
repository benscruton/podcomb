import {useContext, useState} from "react";
import {useNavigate} from "react-router";
import axios from "axios";
import AppContext from "../context/AppContext";
import {FormField} from ".";

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
      <FormField
        label = "Title"
        name = "title"
        inputType = "text"
        value = {inputs.title}
        handleChange = {handleChange}
      />

      {/* AUTHOR */}
      <FormField
        label = "Author(s)"
        name = "author"
        inputType = "text"
        value = {inputs.author}
        handleChange = {handleChange}
      />
      
      {/* DESCRIPTION */}
      <FormField
        label = "Description"
        name = "description"
        inputType = "textarea"
        value = {inputs.description}
        handleChange = {handleChange}
      />

      {/* LANGUAGE */}
      <FormField
        label = "Language"
        name = "language"
        inputType = "text"
        value = {inputs.language}
        handleChange = {handleChange}
        placeholder = "Default: en"
      />
      
      {/* IMAGE URL */}
      <FormField
        label = "Image URL"
        name = "imageUrl"
        inputType = "text"
        value = {inputs.imageUrl}
        handleChange = {handleChange}
        placeholder = "Direct link to an image"
      />

      {/* CATEGORY */}
      <FormField
        label = "Category"
        name = "category"
        inputType = "text"
        value = {inputs.category}
        handleChange = {handleChange}
      />

      {/* LINK */}
      <FormField
        label = "Link (optional"
        name = "link"
        inputType = "text"
        value = {inputs.link}
        handleChange = {handleChange}
      />

      <div className = "field columns">
        {/* EXPLICIT ? */}
        <FormField
          label = "Explicit"
          name = "isExplicit"
          inputType = "checkbox"
          value = {inputs.isExplicit}
          handleChange = {handleChange}
          classes = "column is-half"
        />

        {/* PUBLIC ? */}
        <FormField
          label = "Publicly discoverable"
          name = "isPublic"
          inputType = "checkbox"
          value = {inputs.isPublic}
          handleChange = {handleChange}
          classes = "column is-half"
        />
      </div>

      {/* SUBMIT BUTTON */}
      <div className = "has-text-centered">
        <button
          className = "button is-success mx-2"
          type = "submit"
        >
          {comb ? "Update Comb" : "Create Comb"}
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