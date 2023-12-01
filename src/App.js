import './App.css';
import WeatherCard from './components/WeatherCard';
import WeatherForecastCard from './components/WeatherForecastCard';
import { useState, useEffect, useCallback } from 'react';
import { FindClosestData } from './helpers/WeatherFinder';
import PartlyCloudyImg from './weather-backgrounds/partly-cloudy.jpg';
import MostlyCloudyImg from './weather-backgrounds/mostly-cloudy.jpg';
import HeavyRainImg from './weather-backgrounds/heavy-rain.jpg';
import SunnyImg from './weather-backgrounds/sunny.jpg';
import MostlySunnyImg from './weather-backgrounds/mostly-sunny.jpg';
import PartlySunnyImg from './weather-backgrounds/partly-sunny.jpg';
import ScatteredSnowShowersImg from './weather-backgrounds/scattered-snow-showers.jpg';

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001/';

const WEATHER_BACKGROUNDS = {
    "Partly Cloudy": PartlyCloudyImg,
    "Mostly Cloudy": MostlyCloudyImg,
    "Heavy Rain": HeavyRainImg,
    "Sunny": SunnyImg,
    "Mostly Sunny": MostlySunnyImg,
    "Partly Sunny": PartlySunnyImg,
    "Mostly Cloudy then Scattered Snow Showers": ScatteredSnowShowersImg,
    "Scattered Snow Showers": ScatteredSnowShowersImg,
    "Rain then Drizzle Likely": HeavyRainImg,
}

function App() {
    const [weather, setWeather] = useState({});
    const [userPosition, setUserPosition] = useState({ latitude: 0, longitude: 0 });
    const [location, setLocation] = useState("");

    useEffect(() => {
        if (navigator.geolocation) {
            console.log(`Geolocation is supported!`);
            navigator.geolocation.getCurrentPosition((position) => {
                setUserPosition({ latitude: position.coords.latitude, longitude: position.coords.longitude });
            });
        } else {
            console.log(`Geolocation is not supported!`);
        };
    }, []);

    useEffect(() => {
        if (!userPosition.latitude || !userPosition.longitude) {
            return;
        }

        fetch(`${apiUrl}weather?lat=${userPosition.latitude}&long=${userPosition.longitude}`)
            .then(res => res.json())
            .then(data => {
                console.log(`Fetching weather for: ${userPosition.latitude}, ${userPosition.longitude}`);
                console.log(data);
                setWeather(data);
            })
            .catch(err => {
                console.log("Error retrieving weather data!");
                console.log(err);
            });
    }, [userPosition]);


    const UpdateWeather = useCallback((e) => {
        e.preventDefault();
        console.log("Updating weather!");

        if (!location.trim()) {
            console.log("No location provided!");
            return;
        }

        fetch(`${apiUrl}location?q=${location}`)
            .then(res => res.json())
            .then(data => {
                console.log(`Fetching location: ${location}`);
                if (data.latitude === userPosition.latitude && data.longitude === userPosition.longitude) {
                    console.log("Same location as current location!");
                    return;
                }
                setUserPosition({ latitude: data.latitude, longitude: data.longitude });
            })
            .catch(err => {
                console.log("Error retrieving location data!");
                console.log(err);
            });
    }, [location, userPosition]);

    const handleUpdateWatherOnEnter = (e) => {
        if (e.key === 'Enter') {
            UpdateWeather(e);
        }
    };

    const weatherForecast = FindClosestData(weather.forecasts, "startTime");

    if (!weather || !weather.weather || !weather.forecasts) {
        return (<div></div>);
    }

    let dailyForecast = [];

    return (
        <div className="App" style={{ backgroundImage: weather && weatherForecast && weatherForecast.shortForecast ? `url(${WEATHER_BACKGROUNDS[weatherForecast.shortForecast]})` : '' }}>
            <main>
                <div className="weather-search">
                    <label htmlFor="location-input">Enter a location:<br /></label>
                    <input
                        type="text"
                        id="location-input"
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                        onKeyUp={handleUpdateWatherOnEnter}
                    />
                    <button onClick={UpdateWeather}>Get Weather</button>
                </div>
                <WeatherCard weather={weather} />
                <div className='weather-forecasts-12h'>
                    <h2>Daily Forecasts</h2>
                    {weather.forecasts.map((forecast, index) => {
                        dailyForecast.push(forecast);
                        if (index % 2 !== 0) {
                            const completeForecast = dailyForecast;
                            dailyForecast = [];
                            return <WeatherForecastCard key={index} weatherForecast={completeForecast} />;
                        }
                        return null;
                    }
                    )}
                </div>

            </main>
            <footer>
                <p>Created by Philip Diegel, 2023</p>
            </footer>
        </div>
    );
}

export default App;
