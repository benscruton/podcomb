import {useContext} from "react";
import {LogRegCard} from "../components";
import AppContext from "../context/AppContext";

const Login = () => {
  const {serverUrl, userData} = useContext(AppContext);

  return (
    <div className="container">
      <LogRegCard />
    </div>
  );
};

export default Login;