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
    "mm": (mm) => { return mm + " mm" },

}

const DISPLAYABLE_WEATHER_PROPERTIES = {
    "dewpoint": "Dewpoint",
    "elevation": "Elevation",
    "relativeHumidity": "Humidity",
    "probabilityOfPrecipitation": "Chance of Rain",
    "visibility": "Visibility Distance",
    "snowfallAmount": "Snowfall Amount",
    "iceAccumulation": "Amount of Ice",
    "probabilityOfThunder": "Chance of Thunder",
    "probabilityOfHurricaneWinds": "Chance of Hurricane Winds",
};

export default function WeatherCard({ weather }) {
    const [userWeatherProperties, setUserWeatherProperties] = useState('');
    const [weatherSettingsAreVisible, setWeatherSettingsAreVisible] = useState(false);
    const defaultProperties = { weatherProperty: '', display: true, identifier: '' };

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

        for (const property of Object.keys(DISPLAYABLE_WEATHER_PROPERTIES)) {
            defaultProperties[property] = { weatherProperty: property, display: true, identifier: DISPLAYABLE_WEATHER_PROPERTIES[property] };
        }
        return defaultProperties;
    };

    const validateAndCorrectStoredProperties = (storedProperties) => {
        let propertiesUpdated = false;
        const validatedProperties = { ...storedProperties };

        // Ensure all displayable properties are present
        for (const property of Object.keys(DISPLAYABLE_WEATHER_PROPERTIES)) {
            if (!(property in validatedProperties) || Object.keys(validatedProperties) !== Object.keys(DISPLAYABLE_WEATHER_PROPERTIES)) {
                validatedProperties[property] = { weatherProperty: property, display: true, identifier: DISPLAYABLE_WEATHER_PROPERTIES[property] };
                propertiesUpdated = true;
            }

        }

        // Remove properties that are no longer displayable
        for (const property in validatedProperties) {
            if (!Object.keys(DISPLAYABLE_WEATHER_PROPERTIES).includes(property)) {
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
        for (const property of Object.keys(userWeatherProperties)) {
            const propertyIdentifier = userWeatherProperties[property].identifier;
            settings.push(<p key={property}>{propertyIdentifier} <input type='Checkbox' onChange={updateWeatherPropertySetting} value={property} checked={userWeatherProperties[property].display} /></p>);
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
            if (!conversionUnit) {
                return 0;
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
                const propertyIdentifier = userWeatherProperties[property].identifier;
                return <p key={index}>{propertyIdentifier}: {getWeatherPropertyData(userWeatherProperties[property].weatherProperty)}</p>;
            }
            return null;
        });
    };

    // Not currently used
    // const toSentenceCase = (str) => {
    //     return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    // };

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