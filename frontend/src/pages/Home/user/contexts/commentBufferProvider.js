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
