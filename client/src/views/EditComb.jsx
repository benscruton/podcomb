import {useContext} from "react";
import {EditCombCard} from "../components";
import AppContext from "../context/AppContext";

const EditComb = () => {
  const {serverUrl, userData} = useContext(AppContext);

  return (
    <div className = "container">
      <EditCombCard />
    </div>
  );
};

export default EditComb;