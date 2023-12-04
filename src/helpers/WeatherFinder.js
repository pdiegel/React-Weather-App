const axios = require('axios').default;

async function GetLatLon(location) {
    //`https://geocode.maps.co/search?q=${location}`
    return axios.get(`https://geocode.maps.co/search?q=${location}`)
        .then(res => {
            return res.data[0];
        })
        .then(data => {
            console.log(`New Location: ${data.lat}, ${data.lon}`);
            return { latitude: data.lat, longitude: data.lon };
        })
        .catch(err => {
            console.log(err);
        });
};



async function GetWeatherData(lat, long) {
    // `https://api.weather.gov/points/${lat},${long}`
    if (!lat || !long) {
        console.log("No latitude or longitude provided!");
        return;
    };

    try {
        const res = await axios.get(`https://api.weather.gov/points/${lat},${long}`);
        if (res.status !== 200) {
            throw new Error(`Error retrieving weather data!`);
        }
        const data = res.data;
        const location = data?.properties?.relativeLocation?.properties;
        console.log(`Location: ${location?.city}, ${location?.state}`);

        // Fetch forecast data
        const weatherForecast = await axios.get(data?.properties?.forecast, { headers: { "User-Agent": "weather-app" } });
        const rawWeatherData = await axios.get(data?.properties?.forecastGridData, { headers: { "User-Agent": "weather-app" } });
        const weatherData = rawWeatherData?.data?.properties;

        return {
            location: `${location?.city}, ${location?.state}`,
            weather: weatherData,
            forecasts: weatherForecast?.data?.properties?.periods,
        };
    } catch (err) {
        console.error(err.message);
    }

};

function FindClosestData(dataPoints, timeProperty = "validTime") {
    if (!dataPoints) {
        // Simple error handling
        console.log("No data points provided!");
        return;
    }

    let closestData = dataPoints[0];
    const dateNow = new Date();

    for (let data of dataPoints) {
        const dataDate = new Date(data[timeProperty].split("/")[0]);
        const closestDataDate = new Date(closestData[timeProperty].split("/")[0]);
        if (Math.abs(dataDate - dateNow) < Math.abs(closestDataDate - dateNow)) {
            closestData = data;
        }
    }

    return closestData;
};

module.exports = { GetLatLon, GetWeatherData, FindClosestData };

