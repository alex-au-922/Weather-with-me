const registerMarkerListener = (google, marker, event, handleFunction) => {
  const markerListener = marker.addListener(event, handleFunction);
  return () => google.maps.event.removeListener(markerListener);
};

exports.registerMarkerListener = registerMarkerListener;
