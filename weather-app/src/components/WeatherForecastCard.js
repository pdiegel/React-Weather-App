import './WeatherForecastCard.css';

export default function WeatherForecastCard({ weatherForecast }) {
    if (!weatherForecast) {
        return (<div></div>);
    }

    const chanceToRain = weatherForecast.probabilityOfPrecipitation.value;
    const timeFrame = weatherForecast.name;

    return (
        <div className="weather-forecast-card">
            <p className='forecast-timeframe'>{timeFrame}</p>
            <img src={`${weatherForecast.icon}`} alt={`${weatherForecast.shortForecast}-icon`} />
            <p>
                {weatherForecast.shortForecast}
                <br />
                <span className='forecast-temperature'>{weatherForecast.temperature}° F</span>
                <br />
                Rain Chance: {chanceToRain ? chanceToRain : '0'}%
            </p>
        </div>
    );



};