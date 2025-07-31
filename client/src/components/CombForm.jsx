import {useContext, useState} from "react";
import {useNavigate} from "react-router";
import axios from "axios";
import AppContext from "../context/AppContext";
import {FormField} from ".";

const CombForm = ({comb, setComb, setIsEditing}) => {
  const {serverUrl, isoLanguageCodes} = useContext(AppContext);
  const navigate = useNavigate();
  
  const initialInputs = {
    title: comb?.title || "",
    description: comb?.description || "",
    language: comb?.language || "en",
    imageUrl: comb?.imageUrl || "",
    category: comb?.category || "",
    author: comb?.author || "",
    link: comb?.link || "",
    isExplicit: comb?.isExplicit || false,
    isPublic: comb?.isPublic || false
  };
  const initialErrors = {
    title: "",
    language: ""
  };

  const [inputs, setInputs] = useState(initialInputs);
  const [errors, setErrors] = useState(initialErrors);

  const languageOptions = (isoLanguageCodes ?
    Object.values(isoLanguageCodes)
      .map(lang => ({
        value: lang.code,
        text: `${lang.code} – ${lang.name}`
      }))
    :
    [{value: "loading", text: "Loading..."}]
  );
  
  const frontEndValidator = () => {
    let hasErrors = false;
    const inputErrors = {};

    if(!inputs.title){
      hasErrors = true;
      inputErrors.title = "Must include a title";
    }
    if(!(inputs.language in isoLanguageCodes)){
      hasErrors = true;
      inputErrors.language = "Language code not valid";
    }
    return {inputErrors, hasErrors};
  };
  
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
    if(e.target.name in errors){
      setErrors({...errors,
        [e.target.name]: ""
      });
    }
  };
  
  const createComb = e => {
    e.preventDefault();
    const {inputErrors, hasErrors} = frontEndValidator();
    if(hasErrors){
      return setErrors(inputErrors);
    }
    axios.post(
      `${serverUrl}/api/combs/`,
      {comb: inputs},
      {withCredentials: true}
    )
      .then(({data}) => {
        if(!data.success){
          return setErrors(data.errors);
        }
        navigate(`/combs/${data.comb.id}`);
      })
      .catch(e => console.error(e));
  };

  const updateComb = e => {
    e.preventDefault();
    const {inputErrors, hasErrors} = frontEndValidator();
    if(hasErrors){
      return setErrors(inputErrors);
    }
    axios.put(
      `${serverUrl}/api/combs/${comb.id}`,
      {comb: inputs},
      {withCredentials: true}
    )
      .then(({data}) => {
        if(!data.success){
          return setErrors(data.errors);
        }
        setComb(data.comb);
        setIsEditing(false);
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
            src = {comb.imageUrl || null}
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
        error = {errors.title}
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
        inputType = "select"
        value = {inputs.language}
        handleChange = {handleChange}
        error = {errors.language}
        options = {languageOptions}
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
        label = "Link (optional)"
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
          classes = "column is-half switch"
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
            type = "button"
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