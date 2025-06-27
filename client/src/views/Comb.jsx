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
  const [isCaching, setIsCaching] = useState(false);
  const [cacheButtonText, setCacheButtonText] = useState("Cache feed now");

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

  const cacheFeed = () => {
    setIsCaching(true);
    setCacheButtonText("Cache in progress...");
    console.log("hello");
    axios.put(
      `${serverUrl}/api/combs/${comb.id}/cache`,
      {},
      {withCredentials: true}
    )
      .then(({data}) => {
        console.log(data);
        if(data.success){
          setCacheButtonText("Success! (cache again)");
          setIsCaching(false);
        }
        else{
          throw new Error("Error caching feed");
        }
      })
      .catch(e => {
        console.error(e);
        setCacheButtonText("Error. Try again?");
        setIsCaching(false);
      });
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
          cacheFeed = {cacheFeed}
          deleteComb = {deleteComb}
          isCaching = {isCaching}
          cacheButtonText = {cacheButtonText}
        />
        : <></>
      }
    </div>
  );
};

export default Comb;