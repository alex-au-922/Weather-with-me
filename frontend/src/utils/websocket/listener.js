const registerMessageListener = (webSocket, handleFunction) => {
  if (webSocket !== null && webSocket !== undefined) {
    webSocket.addEventListener("message", handleFunction);
    return () => webSocket.removeEventListener("message", handleFunction);
  }
};

exports.registerMessageListener = registerMessageListener;
