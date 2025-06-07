import {CombForm} from ".";

const EditCombCard = () => {
  return (
    <div className = "card">
      <div className = "card-header has-background-info-light">
        <p className = "card-header-title is-centered">
          Create New Comb
        </p>
      </div>

      <div className = "card-content">
        <CombForm />
      </div>
    </div>
  );
};

export default EditCombCard;