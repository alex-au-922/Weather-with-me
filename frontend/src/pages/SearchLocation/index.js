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
}

export default Search;