const FormField = ({
  label,
  name,
  inputType,
  value,
  handleChange,
  error = "",
  placeholder = "",
  classes = "",
  options = [],
  disabled = false
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
              disabled = {disabled}
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
            disabled = {disabled}
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
              disabled = {disabled}
            >
              {options.map(option =>
                <option
                  key = {option.value}
                  value = {option.value}
                  disabled = {option.value === ""}
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
    
    case "radio":
      return (
        <div className = {classes}>
          <p className = "label">
            {label}
          </p>
          <div className = "radios">
            {options.map(option =>
              <label
                key = {option.value}
                className = "radio mr-2"
              >
                <input
                  type = "radio"
                  name = {name}
                  value = {option.value}
                  onChange = {handleChange}
                  defaultChecked = {value === option.value}
                  className = "mr-2"
                />
                {option.text}
              </label>
            )}
          </div>
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
              disabled = {disabled}
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