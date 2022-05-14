import React, { useState, useEffect, useLayoutEffect } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import escapeRegExp from "../../input/escapeRegExp";
import DropDownButton from "../dropDown";
import camelToCapitalize from "../../input/camelToCapitalize";
import "react-bootstrap-typeahead/css/Typeahead.css";
import getTitleHeader from "../../input/getTableLongHeader";

const useInputFocusRef = () => {
  const [focused, setFocused] = useState(false);
  const [reference, setReference] = useState(null);
  const ref = React.createRef();
  useEffect(() => {
    const loseFocusHandler = (event) => {
      if (event.key === "Enter") {
        reference.blur();
        window.removeEventListener("keyup", loseFocusHandler);
      }
    };
    if (focused && reference !== null) {
      window.addEventListener("keyup", loseFocusHandler);
    } else {
      window.removeEventListener("keyup", loseFocusHandler);
    }
  }, [focused, reference]);
  useEffect(() => {
    setReference(ref.current);
  }, [ref.current]);
  return { ref, setFocused };
};

const TableTitleBar = (props) => {
  const firstValidStringOption = () => {
    if (props.options) {
      if (props.optionsType) {
        for (const key of Object.keys(props.optionsType)) {
          if (
            props.optionsAllowedTypes.indexOf(props.optionsType[key]) !== -1
          ) {
            return key;
          }
        }
        return null;
      }
      return props.options[0];
    }
    return null;
  };
  const [searchField, setSearchField] = useState({
    name: firstValidStringOption(),
    options: [],
    input: "",
  });
  const searchBarRef = useInputFocusRef();

  useEffect(() => {
    if (firstValidStringOption() !== searchField.name) {
      setSearchField({
        ...searchField,
        name: firstValidStringOption(),
        input: "",
      });
    }
  }, [props.options]);

  useEffect(() => {
    searchBarRef.ref.current.clear();
  }, [searchField.name]);

  useEffect(() => {
    /*
        When the data source changes, or the searchbar input changes,
        then the filtered user list also changes
        */
    const newFilteredDataList = props.dataList?.filter((obj) => {
      if (!searchField.input) return true;
      const pattern = new RegExp(escapeRegExp(searchField.input));
      return pattern.test(obj[searchField.name]);
    });
    props.setFilteredDataList(newFilteredDataList);
  }, [props.dataList, searchField.input, searchField.name]);

  useEffect(() => {
    const newOptions = props.filteredDataList
      ?.map((obj) => obj[searchField.name]) //filter the data to that search field
      .filter((option) => option) //remove all invalid values (like empty string)
      .reduce((prevOptions, currOption) => {
        //remove duplicated options
        if (prevOptions.indexOf(currOption) === -1)
          return [...prevOptions, currOption];
        return prevOptions;
      }, []);

    setSearchField({
      ...searchField,
      options: newOptions,
    });
  }, [props.filteredDataList]);

  const handleSearchFieldOptionChange = (event) => {
    if (searchField.name !== event) {
      setSearchField({
        ...searchField,
        name: event,
        input: "",
      });
    }
  };

  const handleSearchInputValueChange = (input) =>
    setSearchField({
      ...searchField,
      input,
    });

  const handleSearchSelectedValueChange = (selectedOption) => {
    if (selectedOption.length) {
      setSearchField({
        // it returns an array with the 0-th index the option
        ...searchField,
        input: selectedOption[0],
      });
    }
  };

  return (
    <div
      className="md-12"
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      {props.renderSwitchView(props.switchViewOptions)}
      <div style={{ display: "flex", flexDirection: "row" }}>
        <Typeahead
          id="searchbar"
          options={searchField.options ?? []}
          paginate={true}
          disabled={searchField.name === null}
          placeholder={getTitleHeader(searchField.name)}
          onInputChange={handleSearchInputValueChange}
          onChange={handleSearchSelectedValueChange}
          ref={searchBarRef.ref}
          onFocus={() => searchBarRef.setFocused(true)}
          onBlur={() => searchBarRef.setFocused(false)}
        />
        <div style={{ width: "3%" }} />
        <DropDownButton
          renderSplitButton={props.renderSplitButton}
          splitButtonChild={props.splitButtonChild}
          splitButtonOptions={props.splitButtonOptions}
          options={props.options}
          optionsType={props.optionsType}
          optionsAllowedTypes={props.optionsAllowedTypes}
          buttonName={getTitleHeader(searchField.name)}
          handleSelect={handleSearchFieldOptionChange}
        />
      </div>
      {props.renderAddButton ? (
        props.renderAddButton(props.addButtonOptions)
      ) : (
        <div style={{ visibility: "hidden" }} />
      )}
    </div>
  );
};

export default TableTitleBar;
