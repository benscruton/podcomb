import {useState, useContext} from "react";
import {Link, useNavigate} from "react-router";
import AppContext from "../context/AppContext";

const NavBar = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const {userData, logOut} = useContext(AppContext);

  const logOutAndNavigateHome = () => {
    logOut({
      title: "You have been logged out!",
      color: "success"
    });
    setIsActive(false);
    navigate("/");
  };

  return (
    <nav
      className = "navbar has-background-danger-dark mb-2"
      role = "navigation"
      aria-label = "main navigation"
    >
      <div className = "navbar-brand">
        <Link
          className = "p-3 has-text-white"
          to = "/"
          onClick = {() => setIsActive(false)}
        >
          PodComb Logo
        </Link>
        <a
          role = "button"
          className = {`navbar-burger has-text-white ${isActive ? "is-active" : ""}`}
          aria-label = "menu"
          aria-expanded = "false"
          onClick = {() => setIsActive(!isActive)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </a>
      </div>

      <div className = {`navbar-menu ${isActive ? "is-active has-background-danger-dark" : ""}`}>
        <div className = "navbar-end">
          {userData ?
            <>
              <Link
                className = "navbar-item has-text-white px-3"
                to = "/combs"
                onClick = {() => setIsActive(false)}
              >
                New Comb
              </Link>
              <Link
                className = "navbar-item has-text-white pl-3"
                to = "/users"
                onClick = {() => setIsActive(false)}
              >
                {userData.username}
              </Link>
            </>
            :
            <></>
          }
          <div className = "buttons">
            {userData ?
              <a
                className = "button is-danger"
                onClick = {logOutAndNavigateHome}
              >
                Log Out
              </a>
              :
              <Link
                className = "button is-info"
                to = "/login"
                onClick = {() => setIsActive(false)}
              >
                Log In
              </Link>
            }
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;