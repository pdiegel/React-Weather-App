import logo from './logo.svg';
import './App.css';
import WeatherCard from './components/WeatherCard';

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <WeatherCard lat={38.9072} long={-77.0369} time={new Date()} />
            </header>
        </div>
    );
}

export default App;
