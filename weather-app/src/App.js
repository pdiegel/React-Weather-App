import './App.css';
import WeatherCard from './components/WeatherCard';
import { useState, useEffect } from 'react';



function App() {
    const [userPosition, setUserPosition] = useState({ latitude: 0, longitude: 0 });

    useEffect(() => {

        if (navigator.geolocation) {
            console.log(`Geolocation is supported!`);
            navigator.geolocation.getCurrentPosition((position) => {
                console.log(position.coords);
                setUserPosition(position.coords);
                fetch(`http://localhost:3001/weather?lat=${position.coords.latitude}&long=${position.coords.longitude}`)
                    .then(res => res.json())
                    .then(data => {
                        console.log(data);
                    });
            }
            );
        };
    }, []);

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
                <h2>{userPosition.latitude}, {userPosition.longitude}</h2>
                <WeatherCard lat={userPosition.latitude} long={userPosition.longitude} />
            </header>
        </div>
    );
}

export default App;
