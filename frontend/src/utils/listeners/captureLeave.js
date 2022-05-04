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
