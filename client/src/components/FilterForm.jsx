import FilterDataByType from "./FilterDataByType";
import FormField from "./FormField";

const filterTypeOptions = [
  {value: "", text: "Select one..."},
  {value: "blacklist", text: "Blacklist"}
]

const FilterForm = ({comb, filter, setFilter, errors, setErrors, handleChange, handleSubmit, classes}) => {
 return (
    <form
      className = {classes}
      onSubmit = {handleSubmit}
    >
      <div className = "columns">
        <FormField
          label = "Filter name"
          name = "name"
          inputType = "text"
          value = {filter.name}
          handleChange = {handleChange}
          error = {errors.name}
          classes = "column is-two-thirds"
        />

        <FormField
          label = "Filter Type"
          name = "type"
          inputType = "select"
          value = {filter.type}
          handleChange = {handleChange}
          options = {filterTypeOptions}
          error = {errors.type}
          classes = "column is-one-third"
        />
      </div>

      {filter.type ? <hr /> : <></>}

      <FilterDataByType
        comb = {comb}
        filter = {filter}
        setFilter = {setFilter}
        errors = {errors}
        setErrors = {setErrors}
      />

      {/* SUBMIT BUTTON */}
      <div className = "has-text-centered">
        <button
          className = "button is-success"
          type = "submit"
        >
          Add
        </button>
      </div>
    </form>
 );
};

export default FilterForm;