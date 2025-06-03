import {useContext} from "react";
import axios from "axios";
import AppContext from "../context/AppContext";

const TestButtons = () => {
  const {
    serverUrl,
    userData
  } = useContext(AppContext);

  return (
    <div className = "mt-2">
      <button 
        className = "button is-warning"
        onClick = {e => {
          axios.get(
            `${serverUrl}/api/auth/test`,
            {withCredentials: true}
          )
            .then(rsp => console.log(rsp.data))
            .catch(e => console.error(e));
        }}
      >
        Test login status
      </button>

      <button
        className = "button is-info"
        onClick = {() => console.log(userData)}
      >
        Log User
      </button>
    </div>
  )
};

export default TestButtons;