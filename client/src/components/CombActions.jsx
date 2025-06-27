const CombActions = ({setIsEditing, cacheFeed, isCaching, cacheButtonText, deleteComb}) => {
  return (
    <p className = "mb-2 has-text-centered">
      <button
        className = "button has-background-warning mx-2"
        onClick = {() => setIsEditing(true)}
      >
        Edit Comb
      </button>

      <button
        className = "button has-background-info mx-2"
        onClick = {cacheFeed}
        disabled = {isCaching}
      >
        {cacheButtonText}
      </button>

      <button
        className = "button has-background-danger mx-2"
        onClick = {deleteComb}
      >
        Delete This Comb
      </button>
    </p>
  );
};

export default CombActions;