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
