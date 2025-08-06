import {useContext, useState} from "react";
import {useNavigate} from "react-router";
import axios from "axios";
import AppContext from "../context/AppContext";
import {FormField} from ".";

const LoginForm = ({clearLogOutMsg}) => {
  const {serverUrl, setUserData} = useContext(AppContext);
  const navigate = useNavigate();

  const emptyInputs = {
    username: "",
    password: ""
  };

  const [inputs, setInputs] = useState(emptyInputs);
  const [errors, setErrors] = useState(emptyInputs);
  
  const handleChange = e => {
    setInputs({...inputs,
      [e.target.name]: e.target.value
    });
    setErrors({...errors,
      [e.target.name]: ""
    });
  };
  
  const handleSubmit = e => {
    e.preventDefault();
    clearLogOutMsg();
    if(!inputs.username || !inputs.password){
      return setErrors({...errors,
        username: inputs.username ? "" : "Must include username or email",
        password: inputs.password ? "" : "Must include a password"
      });
    }
    if(inputs.username.includes("@")){
      inputs.email = inputs.username;
      delete inputs.username;
    }
    axios.post(
      `${serverUrl}/api/auth/login`,
      inputs,
      {withCredentials: true}
    )
      .then(({data}) => {
        if(data.success){
          setUserData(data.user);
          localStorage.setItem(
            "userData",
            JSON.stringify(data.user)
          );
          setInputs(emptyInputs);
          return navigate("/");
        }
        if(data.errors){
          setErrors(data.errors);
        }
      })
      .catch(e => console.error(e.message))
  };

  return (
    <form
      className = "card-content"
      onSubmit = {handleSubmit}
    >
      {/* USERNAME */}
      <FormField
        label = "Username or email address"
        name = "username"
        inputType = "text"
        value = {inputs.username}
        handleChange = {handleChange}
        error = {errors.username}
      />

      {/* PASSWORD */}
      <FormField
        label = "Password"
        name = "password"
        inputType = "password"
        value = {inputs.password}
        handleChange = {handleChange}
        error = {errors.password}
      />

      <div className = "has-text-centered">
      <button
        className = "button is-success has-text-white"
        type = "submit"
      >
        Log in
      </button>
      </div>
    </form>
  );
};

export default LoginForm;