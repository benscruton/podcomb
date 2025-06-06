import {useState, useContext} from "react";
import {Link} from "react-router";
import axios from "axios";
import AppContext from "../context/AppContext";

const NavBar = () => {
  const [isActive, setIsActive] = useState(false);
  const {serverUrl, userData, setUserData} = useContext(AppContext);

  const logOut = () => {
    axios.get(
      `${serverUrl}/api/auth/logout`,
      {withCredentials: true}
    ).then(rsp => {
        if(rsp.data.success){
          setUserData(null);
          localStorage.removeItem("userData");
        }
      })
      .catch(e => console.error(e));
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
                to = "/comb"
              >
                New Comb
              </Link>
              <div className = "navbar-item has-text-white pl-3">
                {userData.username}
              </div>
            </>
            :
            <></>
          }
          <div className = "buttons">
            {userData ?
              <a
                className = "button is-danger"
                onClick = {logOut}
              >
                Log Out
              </a>
              :
              <Link
                className = "button is-info"
                to = "/login"
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