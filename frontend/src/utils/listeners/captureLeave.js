//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

const captureLeaveListener = (handleFunction) => {
  window.addEventListener("beforeunload", handleFunction);
  window.addEventListener("hashchange", handleFunction);
  window.addEventListener("unload", handleFunction);
  window.addEventListener("popstate", handleFunction);
  return () => {
    window.removeEventListener("beforeunload", handleFunction);
    window.removeEventListener("hashchange", handleFunction);
    window.removeEventListener("unload", handleFunction);
    window.removeEventListener("popstate", handleFunction);
  };
};

export default captureLeaveListener;
