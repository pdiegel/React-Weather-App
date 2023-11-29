const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;
const WeatherFinder = require('./src/helpers/WeatherFinder');
const logger = require('heroku-logger');

const num_retries = 5;
let num_tries = 0;

app.use(cors());

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', (req, res) => {
    res.send('Hello World!');
}
);

app.get('/weather', async (req, res) => {
    num_tries = 0;

    if (!req.query.lat || !req.query.long) {
        console.log("No latitude or longitude provided!");
        return;
    }
    else if (req.query.lat < 1 && req.query.long < 1) {
        console.log("Invalid latitude or longitude provided!");
        return;
    }
    WeatherFinder.GetWeatherData(req.query.lat, req.query.long)
        .then(data => {
            res.status(200).send(data);
        })
        .catch(_ => {
            if (num_tries < num_retries) {
                num_tries++;
                WeatherFinder.GetWeatherData(req.query.lat, req.query.long)
                    .then(data => {
                        res.status(200).send(data);
                    })
            }
            else {
                res.status(500).send("Error retrieving weather data!");
            };
        });

});

app.get('/location', async (req, res) => {
    const response = await WeatherFinder.GetLatLon(req.query.q);
    res.status(200).send(response);
});

app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
});