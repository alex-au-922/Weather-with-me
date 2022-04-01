const fetchAirTemp = require("./fetcher/csv/meanAirTemp.js");
const fetchRelHumid = require("./fetcher/csv/meanRelHumid.js");
const fetchWindDirection = require("./fetcher/csv/meanWindDirection.js");

const result = async function () {
  const result = await fetchWindDirection.parsedFetch();
  console.log(result);
};

result();
