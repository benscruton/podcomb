import {CombForm} from ".";

const EditCombCard = ({comb, setComb, setIsEditing}) => {
  return (
    <div className = "card">
      <div className = "card-header has-background-info-light">
        <p className = "card-header-title is-centered">
          {comb ?
            `Edit "${comb.title}"`
            :
            "Create New Comb"
          }
        </p>
      </div>

      <div className = "card-content">
        <CombForm
          comb = {comb}
          setComb = {setComb}
          setIsEditing = {setIsEditing}
        />
      </div>
    </div>
  );
};

export default EditCombCard;