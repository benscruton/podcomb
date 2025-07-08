import {useContext, useState, useEffect} from "react";
import {useParams, useNavigate} from "react-router";
import axios from "axios";
import {
  EditCombCard,
  CombDetail,
  CombActions,
  ConfirmDeleteModal
} from "../components";
import AppContext from "../context/AppContext";

const Comb = () => {
  const {serverUrl, logOut, userData} = useContext(AppContext);
  const {combId} = useParams();
  const navigate = useNavigate();
  
  const [comb, setComb] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    axios.get(
      `${serverUrl}/api/combs/${combId}`,
      {withCredentials: true}
    )
      .then(({data}) => {
        setComb(data.comb);
        setIsOwner(userData.id === data.comb.userId);
      })
      .catch(e => {
        if(e.status === 401){
          logOut({
            title: "Session timed out; please log in again.",
            color: "warning"
          });
          return navigate("/login");
        }
        console.error(e)
      })
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
          isOwner = {isOwner}
        />
      }

      {comb && isOwner && !isEditing ?
        <CombActions
          setIsEditing = {setIsEditing}
          showDeleteModal = {() => setIsDeleting(true)}
        />
        : <></>
      }

      {comb && isDeleting ?
        <ConfirmDeleteModal
          comb = {comb}
          deleteComb = {deleteComb}
          cancelDeletion = {() => setIsDeleting(false)}
        />
        : <></>
      }
    </div>
  );
};

export default Comb;