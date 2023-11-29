const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;
const WeatherFinder = require('./src/helpers/WeatherFinder');
const logger = require('heroku-logger');

const maxRetries = 5;

app.use(cors());

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', (req, res) => {
    res.send('Hello World!');
}
);

app.get('/weather', async (req, res) => {
    let numTries = 0;


    const fetchData = async () => {
        try {
            if (!req.query.lat || !req.query.long) {
                console.log("No latitude or longitude provided!");
                return null;
            } else if (req.query.lat < 1 && req.query.long < 1) {
                console.log("Invalid latitude or longitude provided!");
                return null;
            }

            const data = await WeatherFinder.GetWeatherData(req.query.lat, req.query.long);
            if (!data) {
                throw new Error(`Error retrieving weather data!`);
            }
            console.log(`Attempt number ${numTries + 1} succeeded!`)
            return data;
        } catch (error) {
            if (numTries < maxRetries) {
                numTries++;
                console.log(`Attempt number ${numTries} failed!`)
                return fetchData(); // Retry the request
            } else {
                throw error; // Maximum retries reached, throw the error
            }
        }
    };

    fetchData()
        .then(data => {
            if (data !== null) {
                res.status(200).send(data);
            } else {
                res.status(400).send("Invalid request parameters.");
            }
        })
        .catch(error => {
            console.error("Error retrieving weather data:", error);
            res.status(500).send("Error retrieving weather data!");
        });

});

app.get('/location', async (req, res) => {
    const response = await WeatherFinder.GetLatLon(req.query.q);
    res.status(200).send(response);
});

app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
});