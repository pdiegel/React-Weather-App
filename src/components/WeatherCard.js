import './WeatherCard.css';
import { FindClosestData, ConvertTemperature } from '../helpers/WeatherFinder';

const WEATHER_DIRECTIONS = {
    "N": "↑",
    "NNE": "↗",
    "NE": "↗",
    "ENE": "↗",
    "E": "→",
    "ESE": "↘",
    "SE": "↘",
    "SSE": "↘",
    "S": "↓",
    "SSW": "↙",
    "SW": "↙",
    "WSW": "↙",
    "W": "←",
    "WNW": "↖",
    "NW": "↖",
    "NNW": "↖",
}

export default function WeatherCard({ weather }) {
    if (!weather || !weather.weather || !weather.forecasts) {
        return (<div></div>);
    }

    const weatherData = weather.weather;
    const weatherForecast = FindClosestData(weather.forecasts, "startTime");
    const minTemperature = ConvertTemperature(FindClosestData(weatherData?.minTemperature?.values).value, "F");
    const maxTemperature = ConvertTemperature(FindClosestData(weatherData?.maxTemperature?.values).value, "F");
    const currentTemperature = ConvertTemperature(FindClosestData(weatherData?.apparentTemperature?.values).value, "F");

    return (
        <div className="weather-card">
            <h2 >{weather.location}</h2>
            <h3 className="temperature" id={`${weatherForecast.temperatureTrend}`}>{currentTemperature}° F</h3>
            <p>High: {maxTemperature}° <br /> Low: {minTemperature}°</p>
            <h3>{weatherForecast.name}</h3>
            <p>Wind: {weatherForecast.windSpeed} <span className='wind'>{WEATHER_DIRECTIONS[weatherForecast.windDirection]}</span></p>
            <p>{weatherForecast.detailedForecast}</p>
        </div>
    );



};