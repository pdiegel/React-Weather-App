const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;
const WeatherFinder = require('./src/helpers/WeatherFinder');

app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!');
}
);

app.get('/weather', async (req, res) => {
    const response = await WeatherFinder.GetWeatherData(req.query.lat, req.query.long);
    res.status(200).send(response);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});