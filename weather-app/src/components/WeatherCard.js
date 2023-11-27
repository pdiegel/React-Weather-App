import { useState, useEffect } from 'react';
import { GetWeatherData } from '../helpers/WeatherFinder';

export default function WeatherCard({ weather }) {
    // This component will display the weather for a given location and time
    // It will take in the latitude and longitude of the location
    // It will also take in the time of the weather

    // The weather will be fetched from the National Weather Service API
    return (
        <div className="weather-card">
            <h2>{weather.location}</h2>
            <h2>{weather.weather.name}</h2>
            <h3>{weather.weather.temperature} {weather.temperatureUnit}</h3>
            <h3>{weather.weather.shortForecast}</h3>
            <h3>{weather.weather.windSpeed}</h3>
            <h3>{weather.weather.windDirection}</h3>
            <h3>{weather.weather.detailedForecast}</h3>
        </div>
    );



};