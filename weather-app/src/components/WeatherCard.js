import { useState, useEffect } from 'react';

export default function WeatherCard({ lat, long, time }) {
    // This component will display the weather for a given location and time
    // It will take in the latitude and longitude of the location
    // It will also take in the time of the weather

    // The weather will be fetched from the National Weather Service API
    const [weather, setWeather] = useState(null);
    const [location, setLocation] = useState(null);



    useEffect(() => {
        fetch(`https://api.weather.gov/points/${lat},${long}`, {
            headers: {
                'User-Agent': 'pdiegel-weather-app'
            }
        }).then(res => res.json())
            .then(data => {
                const location = data?.properties?.relativeLocation?.properties
                setLocation(location);
                console.log(`Location: ${location?.city}, ${location?.state}`);
                fetch(data?.properties?.forecast)
                    .then(res => res.json())
                    .then(data => {
                        const weatherArray = data?.properties?.periods;
                        console.log(weatherArray);
                        setWeather(weatherArray);

                        console.log(data);
                    })
                    .catch(err => console.log(err));
            })
            .catch(err => console.log(err));

    }, [lat, long]);



};