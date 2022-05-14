const registerMessageListener = (socket, event, handleFunction) => {
  if (socket !== null && socket !== undefined) {
    socket.on(event, handleFunction);
    return () => socket.off(event, handleFunction);
  }
};

exports.registerMessageListener = registerMessageListener;
