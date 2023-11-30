import './WeatherCard.css';
import { FindClosestData, ConvertTemperature } from '../helpers/WeatherFinder';
import { useState, useEffect } from 'react';

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

const CONVERSION_FUNC_MAP = {
    // Celsius to Fahrenheit
    "degC": (temp) => { return ((temp) * 9 / 5 + 32) + "°" },
    // Meters to feet
    "m": (meters) => { return (meters * 3.28084).toFixed(1) + " ft." },
    // Kilometers per hour to miles per hour
    "km_h-1": (kmh) => { return (kmh * 0.621371).toFixed(1) + " mph" },
    "percent": (percent) => { return percent + "%" },

}

const DISPLAYABLE_WEATHER_PROPERTIES = ["dewpoint", "elevation"];

export default function WeatherCard({ weather }) {
    const [userWeatherProperties, setUserWeatherProperties] = useState('');
    const [weatherSettingsAreVisible, setWeatherSettingsAreVisible] = useState(false);

    useEffect(() => {
        // Initialize or validate state from localStorage
        const storedWeatherProperties = window.localStorage.getItem('userWeatherProperties');
        let weatherProperties;

        if (storedWeatherProperties) {
            // Validate stored properties
            weatherProperties = validateAndCorrectStoredProperties(JSON.parse(storedWeatherProperties));
        } else {
            // Use default properties if nothing is stored
            weatherProperties = getDefaultWeatherProperties();
        }

        setUserWeatherProperties(weatherProperties);
    }, []);

    if (!weather || !weather.weather || !weather.forecasts) {
        return (<div></div>);
    };

    const getDefaultWeatherProperties = () => {
        // Prepare default weather properties
        const defaultProperties = {};
        for (const property of DISPLAYABLE_WEATHER_PROPERTIES) {
            defaultProperties[property] = { weatherProperty: property, display: true };
        }
        return defaultProperties;
    };

    const validateAndCorrectStoredProperties = (storedProperties) => {
        let propertiesUpdated = false;
        const validatedProperties = { ...storedProperties };

        // Ensure all displayable properties are present
        for (const property of DISPLAYABLE_WEATHER_PROPERTIES) {
            if (!(property in validatedProperties)) {
                validatedProperties[property] = { weatherProperty: property, display: true };
                propertiesUpdated = true;
            }
        }

        // Remove properties that are no longer displayable
        for (const property in validatedProperties) {
            if (!DISPLAYABLE_WEATHER_PROPERTIES.includes(property)) {
                delete validatedProperties[property];
                propertiesUpdated = true;
            }
        }

        // Update localStorage if necessary
        if (propertiesUpdated) {
            window.localStorage.setItem('userWeatherProperties', JSON.stringify(validatedProperties));
        }

        return validatedProperties;
    };

    const displayWeatherSettings = () => {
        // Displays the weather settings checkboxes

        // Return early if userWeatherProperties is not set
        if (!userWeatherProperties) {
            return <p>Loading..</p>;
        }
        const settings = [];
        for (const property of DISPLAYABLE_WEATHER_PROPERTIES) {
            settings.push(<p key={property}>{toSentenceCase(property)} <input type='Checkbox' onChange={updateWeatherPropertySetting} value={property} checked={userWeatherProperties[property].display} /></p>);
        }
        return settings;
    };

    const updateWeatherPropertySetting = (e) => {
        const property = e.target.value;
        const newWeatherProperties = { ...userWeatherProperties };
        newWeatherProperties[property].display = !newWeatherProperties[property].display;
        setUserWeatherProperties(newWeatherProperties);
        window.localStorage.setItem('userWeatherProperties', JSON.stringify(newWeatherProperties));
    };

    const getWeatherPropertyData = (property) => {
        const isSingleValue = weather.weather[property].value ? true : false;

        if (property in weather.weather) {
            let conversionUnit = weather.weather[property].uom;
            if (!conversionUnit) {
                conversionUnit = weather.weather[property].unitCode;
            }
            conversionUnit = conversionUnit.split(":")[1];

            const conversionFunc = CONVERSION_FUNC_MAP[conversionUnit];

            if (isSingleValue) {
                return conversionFunc(weather.weather[property].value);
            }
            return conversionFunc(FindClosestData(weather.weather[property].values).value);
        }
        return null;
    };

    const displayWeatherPropertyData = () => {
        if (!userWeatherProperties) {
            return null;
        }


        return Object.keys(userWeatherProperties).map((property, index) => {
            const displayProperty = userWeatherProperties[property].display;
            if (displayProperty) {
                return <p key={index}>{toSentenceCase(property)}: {getWeatherPropertyData(userWeatherProperties[property].weatherProperty)}</p>;
            }
            return null;
        });
    };

    const toSentenceCase = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    const weatherData = weather.weather;
    const weatherForecast = FindClosestData(weather.forecasts, "startTime");
    const minTemperature = ConvertTemperature(FindClosestData(weatherData?.minTemperature?.values).value, "F");
    const maxTemperature = ConvertTemperature(FindClosestData(weatherData?.maxTemperature?.values).value, "F");
    const currentTemperature = ConvertTemperature(FindClosestData(weatherData?.apparentTemperature?.values).value, "F");

    return (
        <div className="weather-card">
            <h2 >{weather.location}</h2>
            <h3>{weatherForecast.name}</h3>
            <h3 className="temperature" id={`${weatherForecast.temperatureTrend}`}>{currentTemperature}° F</h3>
            <p>High: {maxTemperature}° <br /> Low: {minTemperature}°</p>

            <p>Wind: {weatherForecast.windSpeed} <span className='wind'>{WEATHER_DIRECTIONS[weatherForecast.windDirection]}</span></p>
            <p>{weatherForecast.detailedForecast}</p>
            {displayWeatherPropertyData()}
            <button className='settings-button' onClick={_ => setWeatherSettingsAreVisible(!weatherSettingsAreVisible)}>Configure</button>
            <div className={weatherSettingsAreVisible ? 'weather-settings' : 'weather-settings hidden'}>
                {displayWeatherSettings()}
            </div>
        </div>
    );



};