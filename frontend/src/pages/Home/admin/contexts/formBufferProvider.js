import { createContext, useState } from "react";

const FormBufferContext = createContext({});

const FormBufferProvider = (props) => {
  const [formBuffer, setFormBuffer] = useState({});
  const resetBuffer = () => {
    setFormBuffer({});
  };
  return (
    <FormBufferContext.Provider
      value={{ formBuffer, setFormBuffer, resetBuffer }}
    >
      {props.children}
    </FormBufferContext.Provider>
  );
};

export { FormBufferProvider, FormBufferContext };
