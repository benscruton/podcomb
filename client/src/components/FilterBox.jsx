const FilterBox = ({filter, isOwner, removeFilter}) => {
  return (
    <div className = "box">
      <p>
        {filter.name}
      </p>
      <p>
        A {filter.type} filter
      </p>

      <p className = "has-text-centered">
        <button
          className = "button is-danger"
          value = {filter.id}
          onClick = {removeFilter}
        >
          Remove filter
        </button>
      </p>
    </div>

  );
};

export default FilterBox;