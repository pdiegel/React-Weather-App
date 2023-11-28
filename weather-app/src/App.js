import './App.css';
import WeatherCard from './components/WeatherCard';
import { useState, useEffect } from 'react';
import PartlyCloudyImg from './weather-backgrounds/partly-cloudy.gif';
import MostlyCloudyImg from './weather-backgrounds/mostly-cloudy.gif';
import HeavyRainImg from './weather-backgrounds/heavy-rain.gif';
import SunnyImg from './weather-backgrounds/sunny.gif';

const WEATHER_BACKGROUNDS = {
    "Partly Cloudy": PartlyCloudyImg,
    "Mostly Cloudy": MostlyCloudyImg,
    "Heavy Rain": HeavyRainImg,
    "Sunny": SunnyImg,
}

function App() {
    const [weather, setWeather] = useState({}); // [state, setState
    const [userPosition, setUserPosition] = useState({ latitude: 0, longitude: 0 });

    useEffect(() => {

        if (navigator.geolocation) {
            console.log(`Geolocation is supported!`);
            navigator.geolocation.getCurrentPosition((position) => {
                console.log(position.coords);
                setUserPosition(position.coords);
            }
            );
        };
    }, []);

    useEffect(() => {
        fetch(`http://localhost:3001/weather?lat=${userPosition.latitude}&long=${userPosition.longitude}`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setWeather(data);
            })
            .catch(err => {
                console.log("Error retrieving weather data!");
                console.log(err);
            });
    }, [userPosition]);


    const UpdateWeather = () => {
        const location = document.getElementById("location").value;
        if (!location.trim()) {
            console.log("No location provided!");
            return;
        }
        fetch(`http://localhost:3001/location?q=${location}`)
            .then(res => res.json())
            .then(data => {
                console.log(location);
                setUserPosition({ latitude: data.latitude, longitude: data.longitude });
            });

    }

    // GetLatLon("Washington, DC")
    //     .then(data => {
    //         console.log(data);
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     });

    return (
        <div className="App">
            <header className="App-header">

            </header>
            <main style={{ backgroundImage: weather && weather.forecast && weather.forecast.shortForecast ? `url(${WEATHER_BACKGROUNDS[weather.forecast.shortForecast]})` : '' }}>
                <div className="weather-search">
                    <label htmlFor="location">Enter a location:<br /></label>
                    <input type="text" id="location" />
                    <button onClick={() => UpdateWeather()}>Get Weather</button>
                </div>
                {/* <h2>{userPosition.latitude}, {userPosition.longitude}</h2> */}
                <WeatherCard weather={weather} />
            </main>
        </div >
    );
}

export default App;
