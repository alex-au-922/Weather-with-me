//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

import { useState, createContext, useEffect } from "react";

const CommentBufferContext = createContext({});

const CommentBufferProvider = (props) => {
  const [buffers, setBuffers] = useState({});

  return (
    <CommentBufferContext.Provider value={{ buffers, setBuffers }}>
      {props.children}
    </CommentBufferContext.Provider>
  );
};

export { CommentBufferProvider, CommentBufferContext };
