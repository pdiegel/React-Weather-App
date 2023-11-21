const axios = require('axios').default;

async function GetLatLon(location) {
    //`https://geocode.maps.co/search?q=${location}`
    return axios.get(`https://geocode.maps.co/search?q=${location}`)
        .then(res => {
            return res.data[0];
        })
        .then(data => {
            return [data.lat, data.lon];
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
        const forecastRes = await axios.get(data?.properties?.forecast, { headers: { "User-Agent": "weather-app" } });
        const weather = forecastRes?.data?.properties?.periods[0];
        console.log(`Current Weather: ${weather}`);
        //console.log(`Weather Forecast Data: ${forecastRes}`);
        return {
            location: `${location?.city}, ${location?.state}`,
            weather: weather
        };
    } catch (err) {
        console.error(err.message);
    }

};

module.exports = { GetLatLon, GetWeatherData };

