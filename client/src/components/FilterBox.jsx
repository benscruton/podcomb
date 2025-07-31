import {useContext} from "react";
import axios from "axios";
import {FilterInfo, FormField} from ".";
import AppContext from "../context/AppContext";

const FilterBox = ({filter, idx, comb, setComb, isOwner}) => {
  const {serverUrl} = useContext(AppContext);

  const updateFilter = (e, data) => {
    e.preventDefault();
    axios.put(
      `${serverUrl}/api/combs/${comb.id}/filters/${filter.id}`,
      data,
      {withCredentials: true}
    )
      .then(({data}) => {
        if(data.success){
          setComb({...comb,
            filters: [
              ...comb.filters.slice(0, idx),
              data.filter,
              ...comb.filters.slice(idx + 1)
            ]
          });
        }
      })
      .catch(console.error);
  };

  const removeFilter = e => {
    axios.delete(
      `${serverUrl}/api/combs/${comb.id}/filters/${e.target.value}`,
      {withCredentials: true}
    )
      .then(({data}) => {
        if(data.success){
          setComb({...comb,
            filters: comb.filters.filter(f => f.id !== data.filterId)
          })
        }
      })
      .catch(e => console.error(e));
  };

  return (
    <div className = {`box ${filter.isDisabled ? "has-background-light" : "has-background-success-light"}`}>
      <div className = "columns">
        <div className = "column is-half">
          <p className = "title is-5">
            {filter.name}
          </p>
        </div>

        <FormField
          label = {filter.isDisabled ? "Disabled" : "Enabled"}
          name = {`disable-${filter.id}`}
          inputType = "switch"
          value = {!filter.isDisabled}
          handleChange = {e => updateFilter(
            e, {filter: {isDisabled: !e.target.checked}}
          )}
          classes = "column is-half has-text-right"
          subclasses = "is-link"
        />
      </div>

      <FilterInfo
        comb = {comb}
        filter = {filter}
      />

      {isOwner ?
        <p className = "has-text-centered">
          <button
            className = "button is-danger"
            value = {filter.id}
            onClick = {removeFilter}
          >
            Remove filter
          </button>
        </p>
        : <></>
      }
    </div>

  );
};

export default FilterBox;