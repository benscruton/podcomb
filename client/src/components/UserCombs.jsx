import {
  useContext,
  useState,
  useEffect
} from "react";
import {Link, useNavigate} from "react-router"
import axios from "axios";
import AppContext from "../context/AppContext";

const UserCombs = () => {
  const {serverUrl, logOut} = useContext(AppContext);
  const navigate = useNavigate();

  const [combs, setCombs] = useState(null);

  useEffect(() => {
    axios.get(
      `${serverUrl}/api/combs/users`,
      {withCredentials: true}
    )
      .then(({data}) => {
        if(!data.success){
          return console.error("Something went wrong.");
        }
        setCombs(data.combs);
      })
      .catch(e => {
        if(e.status === 401){
          logOut({
            title: "Session timed out; please log in again.",
            color: "warning"
          });
          return navigate("/login");
        }
        console.error(e);
      });
  }, []);

  return (
    <>
      <h1 onClick = {() => console.log(combs)} className = "title has-text-centered">
        My Combs
      </h1>
      <div className = "columns is-centered is-multiline">
        {combs ?
          combs.map(comb =>
            <div
              key = {comb.id}
              className = "column is-half-tablet is-one-third-desktop"
            >
              <div className = "card">
                <header className = "card-header has-background-light">
                  <div className = "card-header-title is-centered">
                    {comb.title}
                  </div>
                </header>

                <div className = "card-content">
                  <p className = "is-italic is-size-7">
                    {comb.author}
                  </p>

                  <img
                    src = {comb.imageUrl}
                    alt = "Main podcast image"
                  />

                  <p>
                    {comb.description}
                  </p>
                </div>

                <footer className = "card-footer">
                  <Link
                    className = "card-footer-item"
                    to = {`/combs/${comb.id}`}
                  >
                    View
                  </Link>
                </footer>
              </div>
            </div>
          )
          :
          <p>Loading...</p>
        }
      </div>

    </>
  );
};

export default UserCombs;