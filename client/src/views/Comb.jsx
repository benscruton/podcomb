import {useContext} from "react";
import {useParams} from "react-router";
import {
  EditCombCard,
  CombDetail
} from "../components";
import AppContext from "../context/AppContext";

const Comb = () => {
  const {serverUrl, userData} = useContext(AppContext);

  const {combId} = useParams();

  return (
    <div className = "container">

      {combId ?
        <CombDetail combId = {combId}/>
        :
        <EditCombCard />
      }
    </div>
  );
};

export default Comb;