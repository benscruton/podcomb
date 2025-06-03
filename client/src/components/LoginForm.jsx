import {useContext, useState} from "react";
import {useNavigate} from "react-router";
import axios from "axios";
import AppContext from "../context/AppContext";

const LoginForm = () => {
  const {serverUrl, setUserData} = useContext(AppContext);
  const navigate = useNavigate();

  const emptyInputs = {
    username: "",
    password: ""
  };

  const [inputs, setInputs] = useState(emptyInputs);
  
  const handleChange = e => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = e => {
    e.preventDefault();
    if(inputs.username.includes("@")){
      inputs.email = inputs.username;
      delete inputs.username;
    }
    axios.post(
      `${serverUrl}/api/auth/login`,
      inputs,
      {withCredentials: true}
    )
      .then(rsp => {
        if(rsp.data.success){
          setUserData(rsp.data.user);
          localStorage.setItem(
            "userData",
            JSON.stringify(rsp.data.user)
          );
          setInputs(emptyInputs);
          navigate("/");
        }
      })
      .catch(e => console.error(e.message))
  };

  return (
    <form
      className = "card-content"
      onSubmit = {handleSubmit}
    >
      <div className = "field">
        <label
          className = "label"
          htmlFor = "username"
        >
          Username or Email Address
        </label>
        <div className = "control">
          <input
            className = "input"
            type = "text"
            name = "username"
            id = "username"
            onChange = {handleChange}
            value = {inputs.username}
          />
        </div>
      </div>

      <div className = "field">
        <label
          className = "label"
          htmlFor = "password"
        >
          Password
        </label>
        <div className = "control">
          <input
            className = "input"
            type = "password"
            name = "password"
            id = "password"
            onChange = {handleChange}
            value = {inputs.password}
          />
        </div>
      </div>

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