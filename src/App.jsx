import { useState, useEffect } from "react";
import axios from "axios";
import { WiDaySunny, WiHumidity, WiStrongWind, WiRain } from "react-icons/wi";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);

  // Default city weather on page load
  useEffect(() => {
    fetchWeather("Delhi");
  }, []);

  // Fetch weather by city name
  const fetchWeather = async (cityName) => {
    try {
      console.log("Fetching weather for:", cityName);
      const res = await axios.get(`http://localhost:5000/weather?city=${cityName}`); // Direct backend URL
      console.log("Response:", res.data);
      setWeather(res.data);
    } catch (err) {
      console.error("Error fetching city weather:", err);
    }
  };

  // Fetch weather by coordinates
  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      const res = await axios.get(`http://localhost:5000/weather?lat=${lat}&lon=${lon}`);
      setWeather(res.data);
    } catch (err) {
      console.error("Error fetching coordinates weather:", err);
    }
  };

  // Handle search submit
  const handleSearch = (e) => {
    e.preventDefault();
    if (city.trim()) fetchWeather(city.trim());
  };

  // Handle current location button
  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
        },
        () => {
          alert("Geolocation denied or unavailable");
        }
      );
    } else {
      alert("Geolocation not supported by your browser");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Weather App</h1>

      {/* Search Bar */}
      <form onSubmit={handleSearch} style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {/* Current Location Button */}
      <button onClick={handleCurrentLocation}>Use Current Location</button>

      {/* Weather Display */}
      {weather && (
        <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
          <div>
            <WiDaySunny size={50} />
            <p>Temperature: {weather.temp} °C</p>
            <p>{weather.description}</p>
          </div>
          <div>
            <WiStrongWind size={50} />
            <p>Wind: {weather.wind} m/s</p>
          </div>
          <div>
            <WiHumidity size={50} />
            <p>Humidity: {weather.humidity}%</p>
          </div>
          <div>
            <WiRain size={50} />
            <p>Rain: {weather.rain} mm</p>
            <p>Last Updated: {weather.timestamp}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
