const registerWindowListener = (event, handleFunction) => {
  window.addEventListener(event, handleFunction);
  return () => window.removeEventListener(event, handleFunction);
};
exports.registerWindowListener = registerWindowListener;
