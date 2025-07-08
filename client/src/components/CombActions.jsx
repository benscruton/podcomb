const CombActions = ({setIsEditing, showDeleteModal}) => {
  return (
    <p className = "mb-2 has-text-centered">
      <button
        className = "button has-background-warning mx-2"
        onClick = {() => setIsEditing(true)}
      >
        Edit Comb
      </button>

      <button
        className = "button has-background-danger mx-2"
        onClick = {showDeleteModal}
      >
        Delete This Comb
      </button>
    </p>
  );
};

export default CombActions;