const logger = require("../../generalUtils/getLogger").getLogger();
const connectWeatherDB =
  require("../../generalUtils/database").connectWeatherDB;
const mongoose = require("mongoose");
const { collectionExists } = require("../../generalUtils/database");
const weather = require("../../backendConfig.js").databaseConfig.weatherSchema;
const geolocationSchema = require("../../backendConfig.js").databaseConfig
  .geolocationSchema;
const { csvToObject } = require("../../generalUtils/parseCSVObject.js");
const fetch = require("node-fetch");
const fetchAPIConfig = require("../../backendConfig.js").fetchAPIConfig;
const { parseGovtTimeString } = require("../../generalUtils/parseGovtTimeString.js");


exports.updateWeather = async function() {
  const db = await connectWeatherDB();
  try {

    const Weather = mongoose.model("Weather", weather);
    if (!(await collectionExists(db, "weathers"))) {
      await Weather.createCollection();
    }
  
    // Parsing weather data
    airTempData = await processCSVData(fetchAPIConfig['meanAirTemp']['url'], 'temp');
    humidityData = await processCSVData(fetchAPIConfig['meanRelHumid']['url'], 'humidity');
    windData = await processCSVData(fetchAPIConfig['meanWindData']['url'], 'wind');
    

    const cursor = await db.db.collection("geolocations").find({"tempStation" : {$ne: null}});
    while (await cursor.hasNext()) {
      let geolocationDoc = await cursor.next();

      let haveAirTemp = airTempData.hasOwnProperty(geolocationDoc['tempStation']);
      let haveHumidity = humidityData.hasOwnProperty(geolocationDoc['relHumStation']);
      let haveWind = windData.hasOwnProperty(geolocationDoc['windStation']);
      
      if (haveAirTemp && haveHumidity && haveWind){
        await insertOrUpdateVariables(Weather, geolocationDoc, airTempData, humidityData, windData);
      }
    };
  } catch (error) { 
    logger.error(error);
  } finally {
    db.close();
  }
}

async function insertOrUpdateVariables(Weather, geolocationDoc, airTempData, humidityData, windData){
  try {
    const temperature = airTempData[geolocationDoc['tempStation']]['Air Temperature(degree Celsius)'];
    const relativeHumidity = humidityData[geolocationDoc['relHumStation']]['Relative Humidity(percent)'];
    const windObject = windData[geolocationDoc['windStation']];
    const time = parseGovtTimeString(windObject['Date time']);
    const windDir = windObject['10-Minute Mean Wind Direction(Compass points)'];
    const windSpeed = windObject['10-Minute Mean Speed(km/hour)'];
    const windGust = windObject['10-Minute Maximum Gust(km/hour)'];
    const locationId = geolocationDoc['_id'];

    const newObject = {
      time: time,
      locationId: locationId,
      temperature: temperature,
      relativeHumidity: relativeHumidity,
      tenMinMeanWindDir: windDir,
      tenMinMeanWindSpeed: windSpeed,
      tenMinMaxGust: windGust
    };

    await Weather.updateOne({'locationId': locationId}, newObject, {upsert: true});

  } catch (error){
    console.log(error);
    logger.error(error);
  }
}

async function processCSVData(url, dataType){
  const response = await fetch(url);
  const responseText = await response.text();
  const data = csvToObject(responseText);
  const reformattedData = {};
  for (row of data){
    reformattedData[row['Automatic Weather Station']] = {
    };
    for (i in row){
      if (!(i === 'Automatic Weather Station')){
        reformattedData[row['Automatic Weather Station']][i] = row[i];
      }
    }
  }
  return reformattedData;
}

async function insertOrUpdateTemp(airTempData) {
  //TODO: to update the insert or update of air temperature data
}


async function insertOrUpdateHumid(humidityData) {
  //TODO: to update the insert or update of humidity data
}


async function insertOrUpdateWindData(windData) {
  //TODO: to update the insert or update of wind data
}
