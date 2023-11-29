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

    // Ensure the forecast timeframe is a weekday (not "Today" or "Tonight", etc.)
    const day = WEEKDAYS.includes(forecastTimeframe) ? forecastTimeframe : WEEKDAYS[today]



    return (
        <div className="weather-forecast-card">
            <p className='forecast-day'>{day}</p>
            <img src={`${earlyForecast.icon}`} alt={`${earlyForecast.shortForecast}-icon`} />
            <p>
                {earlyForecast.shortForecast}
                <br />
                <span className='forecast-temperature-high'>H: {earlyForecast.temperature}°</span>
                <br />
                <span className='forecast-temperature-low'>L: {nightForecast.temperature}°</span>
                <br />
                Rain Chance: {chanceToRain ? chanceToRain : '0'}%
            </p>
        </div>
    );



};