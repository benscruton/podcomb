import FormField from "./FormField";
import {BlacklistDateFilter, BlacklistTextFilter} from "./FilterTypes";

const FilterDataByType = ({comb, filter, setFilter, errors, setErrors}) => {
  const blacklistOptions = [
    {value: "", text: "Select one..."},
    {value: "Text", text: "Text"},
    {value: "Date", text: "Date"},
  ];

  const data = {
    blacklist: {
      subtype: "",
      applyToComb: filter?.data?.applyToComb || false,
      sourceFeedIds: filter?.data?.sourceFeedIds || [],
    },
    blacklistText: {
      subtype: "Text",
      applyToComb: filter?.data?.applyToComb || false,
      sourceFeedIds: filter?.data?.sourceFeedIds || [],
      episodeField: "title",
      exactText: "",
      isCaseSensitive: true
    },
    blacklistDate: {
      subtype: "Date",
      applyToComb: filter?.data?.applyToComb || false,
      sourceFeedIds: filter?.data?.sourceFeedIds || [],
      timeframe: "before",
      date: ""
    }
  };

  const handleChange = e => {
    if(e.target.name in errors){
      setErrors({...errors,
        [e.target.name]: ""
      });
    }
    if(e.target.name === "blacklistType"){
      return setFilter({...filter,
        data: data[filter.type + e.target.value]
      });
    }

    const val = e.target.type === "checkbox" ?
      e.target.checked : e.target.value;
      
    if(e.target.type === "checkbox" && !(e.target.name === "applyToComb" || e.target.name === "isCaseSensitive")){
      // Add or remove sfId from array in filter data
      const sfIds = (filter.data.sourceFeedIds.includes(e.target.name) ?
        filter.data.sourceFeedIds.filter (id => id !== e.target.name)
        :
        [...filter.data.sourceFeedIds, e.target.name]
      );
      return setFilter({...filter,
        data: {...filter.data,
          sourceFeedIds: sfIds
        }
      });
    }
    setFilter({...filter,
      data: {...filter.data,
        [e.target.name]: val
      }
    });
  };

  const BlacklistSubtype = ({classes}) => (
    <FormField
      label = "Blacklist episodes by..."
      name = "blacklistType"
      inputType="select"
      options = {blacklistOptions}
      value = {filter.data?.subtype || ""}
      handleChange = {handleChange}
      classes = {classes}
      error = {errors.blacklistType}
    />
  );

  const ApplyFilterTo = ({classes}) => (
    <div className = {classes}>
      <h2 className = "title is-6">
        Apply filter to...
      </h2>

      <FormField
        label = "Entire comb"
        name = "applyToComb"
        inputType = "checkbox"
        value = {filter.data.applyToComb}
        handleChange = {handleChange}
        classes = "mx-3 mb-3"
      />

      <p className = "ml-5">
        Individual source feeds:
      </p>

      {comb.sourceFeeds.map(sf =>
        <FormField
          key = {sf.id}
          label = {sf.title}
          name = {sf.id}
          inputType = "checkbox"
          value = {filter.data.applyToComb || filter.data.sourceFeedIds.includes(sf.id)}
          handleChange = {handleChange}
          disabled = {filter.data.applyToComb}
          classes = "ml-5 my-2"
        />
      )}
    </div>
  );

  switch(filter.type + (filter?.data?.subtype || "")){
    case "blacklist":
      return (
        <div className = "columns">
          <BlacklistSubtype classes = "column is-half" />
          <ApplyFilterTo classes = "column is-half" />
        </div>
      );

    case "blacklistText":
      return (
        <BlacklistTextFilter
          BlacklistSubtype = {BlacklistSubtype}
          ApplyFilterTo = {ApplyFilterTo}
          filter = {filter}
          handleChange = {handleChange}
          errors = {errors}
        />
      );

    case "blacklistDate":
      return (
        <>
          <BlacklistDateFilter
            BlacklistSubtype = {BlacklistSubtype}
            ApplyFilterTo = {ApplyFilterTo}
            filter = {filter}
            handleChange = {handleChange}
            errors = {errors}
          />
        </>
      );

    case "":
      return <></>;

    default:
      return (<p>Unknown filter type</p>);
  }
};

export default FilterDataByType;