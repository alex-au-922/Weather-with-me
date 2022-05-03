import React, { useState } from "react";
import { Form, Card, Button } from "react-bootstrap";
import FormInputWithError from "../../utils/gui/formInputError";
import checkString from "../../utils/input/checkString";
import { BACKEND_WEBSERVER_HOST } from "../../frontendConfig";
import { AuthContext } from "../../middleware/auth";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import objectSetAll from "../../utils/setAll";

const Search = () => {
    window.onload = function(){
        const searchButton = document.getElementById('search-button');
        const searchInput = document.getElementById('search-input');
        searchButton.addEventListener('click', () => {
        const inputValue = searchInput.value;
        alert(inputValue);
        });
    }
    return (
    <>
    <div class="input-group">
        <div class="form-outline">
            <input id="search-input" type="search" class="form-control" />
            <label class="form-label" for="form1">test</label>
        </div>
            <button id="search-button" type="button" class="btn btn-primary">
            <i class="fas fa-search"></i>
        </button>
    </div>
  </>
    )
}

export default Search;