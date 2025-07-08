const FormField = ({
  label,
  name,
  inputType,
  value,
  handleChange,
  error = "",
  placeholder = "",
  classes = "",
  options = []
}) => {
  switch(inputType){
    case "checkbox":
      return (
        <div className = {classes}>
          <label className = "checkbox">
            <input
              type = "checkbox"
              name = {name}
              id = {name}
              onChange = {handleChange}
              checked = {value}
            />
            <strong className = "pl-2">
              {label}
            </strong>
          </label>
        </div>
      );
    
    case "textarea":
      return (
        <div className = {`field ${classes}`}>
          <label
            className = "label"
            htmlFor = {name}
          >
            {label}
          </label>
          <textarea
            className = {`textarea ${error ? "is-danger" : ""}`}
            name = {name}
            id = {name}
            onChange = {handleChange}
            value = {value}
            placeholder = {placeholder}
          />
          <p className = "help is-danger">
            {error}
          </p>
        </div>
      );
    
    case "select":
      return (
        <div className = {classes}>
          <label
            className = "label"
            htmlFor = {name}
          >
            {label}
          </label>
          <p className = {`select ${error ? "is-danger" : ""}`}>
            <select
              name = {name}
              id = {name}
              value = {value}
              onChange = {handleChange}
            >
              {options.map(option =>
                <option
                  key = {option.value}
                  value = {option.value}
                >
                  {option.text}
                </option>
              )}
            </select>
          </p>
          <p className = "help is-danger">
            {error}
          </p>
        </div>
      );
    
    default:
      return (
        <div className = {`field ${classes}`}>
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
  }
};

export default FormField;