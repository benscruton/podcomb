const FormField = ({
  label,
  name,
  inputType,
  value,
  handleChange,
  error = "",
  placeholder = ""
}) => {
  return (
    <div className = "field">
      <label
        className = "label"
        htmlFor = {name}
      >
        {label}
      </label>

      <div className = "control">
        <input
          className = {`input ${error ? "is-danger" : ""}`}
          type = {inputType}
          name = {name}
          id = {name}
          value = {value}
          onChange = {handleChange}
          placeholder = {placeholder}
        />
      </div>
      <p className = "help is-danger">
        {error}
      </p>
    </div>
  );
};

export default FormField;