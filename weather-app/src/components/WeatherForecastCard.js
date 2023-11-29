import './WeatherForecastCard.css';

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function WeatherForecastCard({ weatherForecast }) {
    if (!weatherForecast) {
        return (<div></div>);
    }

    console.log("new weather forecast card:");
    console.log(weatherForecast);

    const earlyForecast = weatherForecast[0];
    const nightForecast = weatherForecast[1];

    const today = new Date().getDay();
    const chanceToRain = earlyForecast.probabilityOfPrecipitation.value;
    const forecastTimeframe = earlyForecast.name;
    const day = forecastTimeframe === "Today" ? WEEKDAYS[today] : forecastTimeframe



    return (
        <div className="weather-forecast-card">
            <p className='forecast-day'>{day}</p>
            <img src={`${earlyForecast.icon}`} alt={`${earlyForecast.shortForecast}-icon`} />
            <p>
                {earlyForecast.shortForecast}
                <br />
                <span className='forecast-temperature-high'>{earlyForecast.temperature}°</span>
                <br />
                <span className='forecast-temperature-low'>{nightForecast.temperature}°</span>
                <br />
                Rain Chance: {chanceToRain ? chanceToRain : '0'}%
            </p>
        </div>
    );



};