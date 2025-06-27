import {useContext, useState, useEffect} from "react";
import {useParams, useNavigate} from "react-router";
import axios from "axios";
import {
  EditCombCard,
  CombDetail,
  CombActions
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
        <CombActions
          setIsEditing = {setIsEditing}
          deleteComb = {deleteComb}
        />
        : <></>
      }
    </div>
  );
};

export default Comb;