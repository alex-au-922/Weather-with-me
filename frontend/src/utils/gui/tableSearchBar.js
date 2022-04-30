import React, { useState, useEffect } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import escapeRegExp from "../../utils/input/escapeRegExp";
import DropDownButton from "./dropDown";
import "react-bootstrap-typeahead/css/Typeahead.css";

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
    const addFocusHandler = (event) => {
      if (event.key === "Enter") {
        reference.focus();
      }
    };
    if (focused) {
      window.removeEventListener("keyup", addFocusHandler);
      if (reference !== null) {
        window.addEventListener("keyup", loseFocusHandler);
      }
    } else {
      window.removeEventListener("keyup", loseFocusHandler);
      if (reference !== null) {
        window.addEventListener("keyup", addFocusHandler);
      }
    }
  }, [focused, reference]);
  useEffect(() => {
    setReference(ref.current);
  }, [ref.current]);
  return { ref, setFocused };
};

const TableSearchBar = (props) => {
  const [searchField, setSearchField] = useState({
    name: props.options[0],
    options: [],
    input: "",
  });
  const searchBarRef = useInputFocusRef();

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

  const handleSearchFieldOptionChange = (event) =>
    setSearchField({
      ...searchField,
      name: event,
      input: "",
    });

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
    <div style={{ display: "flex", flexDirection: "row" }}>
      <Typeahead
        id="searchbar"
        options={searchField.options ?? []}
        paginate={true}
        placeholder={searchField.name}
        onInputChange={handleSearchInputValueChange}
        onChange={handleSearchSelectedValueChange}
        ref={searchBarRef.ref}
        onFocus={() => searchBarRef.setFocused(true)}
        onBlur={() => searchBarRef.setFocused(false)}
      />
      <DropDownButton
        options={props.options}
        buttonName={searchField.name}
        handleSelect={handleSearchFieldOptionChange}
      />
    </div>
  );
};

export default TableSearchBar;
