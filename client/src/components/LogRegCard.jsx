import {LoginForm} from ".";

const LogRegCard = ({clearLogOutMsg}) => {
  return (
    <div className = "card">
      <div className = "card-header has-background-info-light">
        <p className = "card-header-title is-centered">
          Log In
        </p>
      </div>

      <div className = "card-content">
        <LoginForm
          clearLogOutMsg = {clearLogOutMsg}
        />
      </div>
    </div>
  );
};

export default LogRegCard;