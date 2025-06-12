import {useContext, useState, useEffect} from "react";
import {useParams, useNavigate} from "react-router";
import axios from "axios";
import {
  EditCombCard,
  CombDetail
} from "../components";
import AppContext from "../context/AppContext";

const Comb = () => {
  const {serverUrl} = useContext(AppContext);
  const {combId} = useParams();
  const navigate = useNavigate();
  
  const [comb, setComb] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    axios.get(
      `${serverUrl}/api/combs/${combId}`,
      {withCredentials: true}
    )
      .then(({data}) => {
        setComb(data.comb);
      })
      .catch(e => console.error(e))
      .finally(() => setIsLoaded(true));
  }, [combId]);

  const deleteComb = () => {
    axios.delete(
      `${serverUrl}/api/combs/${combId}`,
      {withCredentials: true}
    )
      .then(({data}) => {
        if(data.success){
          navigate("/users");
        }
      })
      .catch(e => console.error(e));
  };

  return (
    <div className = "container">

      {isEditing ?
        <EditCombCard
          comb = {comb}
          setComb = {setComb}
          setIsEditing = {setIsEditing}
        />
        :
        <CombDetail
          comb = {comb}
          isLoaded = {isLoaded}
          setComb = {setComb}
        />
      }

      {comb && !isEditing ?
        <p className = "mb-2 has-text-centered">
          <button
            className = "button has-background-warning"
            onClick = {() => setIsEditing(true)}
          >
            Edit Comb
          </button>

          <button
            className = "button has-background-danger mx-2"
            onClick = {deleteComb}
          >
            Delete This Comb
          </button>
        </p>
        : <></>
      }
    </div>
  );
};

export default Comb;