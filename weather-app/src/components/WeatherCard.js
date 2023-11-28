import './WeatherCard.css';
import { FindClosestData, ConvertTemperature } from '../helpers/WeatherFinder';

const WEATHER_DIRECTIONS = {
    "N": "⬆",
    "NNE": "⬈",
    "NE": "⬈",
    "ENE": "⬈",
    "E": "➡",
    "ESE": "⬊",
    "SE": "⬊",
    "SSE": "⬊",
    "S": "⬇",
    "SSW": "⬋",
    "SW": "⬋",
    "WSW": "⬋",
    "W": "⬅",
    "WNW": "⬉",
    "NW": "⬉",
    "NNW": "⬉",
}

export default function WeatherCard({ weather }) {
    if (!weather || !weather.weather) {
        return (<div></div>);
    }

    const weatherData = weather.weather;
    const weatherForecast = weather.forecast;
    console.log("Weather Forecast:");
    console.log(weatherForecast);
    const minTemperature = ConvertTemperature(FindClosestData(weatherData?.minTemperature?.values).value, "F");
    const maxTemperature = ConvertTemperature(FindClosestData(weatherData?.maxTemperature?.values).value, "F");

    return (
        <div className="weather-card">
            <h2 >{weather.location}</h2>
            <h3 className="temperature" id={`${weatherForecast.temperatureTrend}`}>{weatherForecast.temperature}° F</h3>
            <p>Min: {minTemperature}°<br />Max: {maxTemperature}°</p>
            <h3>{weatherForecast.name}</h3>
            <p>Wind: {weatherForecast.windSpeed} {WEATHER_DIRECTIONS[weatherForecast.windDirection]}</p>
            <p>{weatherForecast.detailedForecast}</p>
        </div>
    );



};