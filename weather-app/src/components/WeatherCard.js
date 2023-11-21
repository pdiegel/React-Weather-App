import { useState, useEffect } from 'react';
import { GetWeatherData } from '../helpers/WeatherFinder';

export default function WeatherCard({ lat, long }) {
    // This component will display the weather for a given location and time
    // It will take in the latitude and longitude of the location
    // It will also take in the time of the weather

    // The weather will be fetched from the National Weather Service API
    const [weather, setWeather] = useState(null);
    const [location, setLocation] = useState(null);



    useEffect(() => {
        GetWeatherData(lat, long)
            .then(weatherData => {
                console.log(weatherData);
                setWeather(weatherData);
            })
            .catch(err => console.log(`Error getting weather data ${err}`));

    }, [lat, long]);



};