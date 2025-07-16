import FormField from "./FormField";

const filterTypeOptions = [
  {value: "", text: "Select one..."},
  {value: "blacklist", text: "Blacklist"},
  {value: "blecklist", text: "Blecklist"},
]

const FilterForm = ({filter, errors, handleChange, handleSubmit, classes}) => {
 return (
    <form
      className = {classes}
      onSubmit = {handleSubmit}
    >
      <FormField
        label = "Filter name"
        name = "name"
        inputType = "text"
        value = {filter.name}
        handleChange = {handleChange}
        error = {errors.name}
      />

      <FormField
        label = "Filter Type"
        name = "type"
        inputType = "select"
        value = {filter.type}
        handleChange = {handleChange}
        options = {filterTypeOptions}
        error = {errors.type}
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