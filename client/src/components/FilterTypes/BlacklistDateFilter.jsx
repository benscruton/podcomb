import FormField from "../FormField";

// blacklistDate: {
//   subtype: "Date",
//   applyToComb: false,
//   sourceFeedIds: [],
//   timeframe: "before",
//   date: null
// }

const BlacklistDateFilter = ({BlacklistSubtype, ApplyFilterTo, filter, handleChange, errors}) => {
  const timeframeOptions = [
    {value: "before", text: "Before"},
    {value: "after", text: "After"},
  ];

  return (
    <>
      <div className = "columns">
        <BlacklistSubtype classes = "column is-half" />
        <ApplyFilterTo classes = "column is-half" />
      </div>

      <hr />

      <div className = "columns">
        <FormField
          label = "Filter out items..."
          name = "timeframe"
          inputType = "radio"
          value = {filter.data.timeframe}
          options = {timeframeOptions}
          handleChange = {handleChange}
          error = {errors.timeframe}
          classes = "column is-half"
        />

        <FormField
          label = "...the following date:"
          name = "date"
          inputType = "date"
          value = {filter.data.date}
          handleChange = {handleChange}
          error = {errors.date}
          classes = "column is-half"
        />
      </div>
    </>
  );
};

export default BlacklistDateFilter;