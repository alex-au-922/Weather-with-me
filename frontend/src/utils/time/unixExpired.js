const unixTimeExpired = (time) => {
  return Date.now() >= time * 1000;
};

export default unixTimeExpired;
