import {FormField} from "..";

// blacklistText: {
//   subtype: "Text",
//   applyToComb: false,
//   sourceFeedIds: [],
//   exactText: "",
//   episodeField: "title",
//   isCaseSensitive: false
// }

const BlacklistTextFilter = ({BlacklistSubtype, ApplyFilterTo, filter, handleChange, errors}) => {
  const episodeFieldOptions = [
    {value: "title", text: "Title"},
    {value: "description", text: "Description"},
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
          label = "Episode field to match"
          name = "episodeField"
          inputType = "select"
          value = {filter.data.episodeField}
          handleChange = {handleChange}
          options = {episodeFieldOptions}
          classes = "column is-half"
          error = {errors.episodeField}
        />

        <div className = "column is-half">
          <FormField
            label = "Exact text to match"
            name = "exactText"
            inputType = "text"
            value = {filter.data.exactText}
            handleChange = {handleChange}
            error = {errors.exactText}
          />

          <FormField
            label = "Only filter case-sensitive matches?"
            name = "isCaseSensitive"
            inputType = "checkbox"
            value = {filter.data.isCaseSensitive}
            handleChange = {handleChange}
          />
        </div>
      </div>
    </>
  );
};

export default BlacklistTextFilter;