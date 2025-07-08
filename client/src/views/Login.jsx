import {LogRegCard} from "../components";

const Login = ({clearLogOutMsg}) => {
  return (
    <div className = "container">
      <LogRegCard
        clearLogOutMsg = {clearLogOutMsg}
      />
    </div>
  );
};

export default Login;