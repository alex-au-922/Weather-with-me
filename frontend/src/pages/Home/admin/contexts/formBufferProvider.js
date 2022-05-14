//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

import { createContext, useRef } from "react";

const FormBufferContext = createContext({});

const FormBufferProvider = (props) => {
  const formBuffer = useRef({});
  const resetBuffer = () => {
    formBuffer.current = {};
  };
  return (
    <FormBufferContext.Provider
      value={{ formBuffer, resetBuffer }}
    >
      {props.children}
    </FormBufferContext.Provider>
  );
};

export { FormBufferProvider, FormBufferContext };
