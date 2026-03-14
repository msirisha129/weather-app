import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [city, setCity] = useState('');
  const [message, setMessage] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);

  const changeCity = (e) => {
    setCity(e.target.value);
    setMessage('');
  };

  const showWeather = (e) => {
    e.preventDefault();

    if (city.trim() === '') {
      setMessage('⚠️ Please enter a city name');
      return;
    }

    setLoading(true);

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city.trim()}&appid=8c272dab143f706e4085bf0e475c35df&units=metric`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.cod === '401') {
          setMessage('❌ Invalid API key. Please check your OpenWeatherMap key.');
          setWeatherData(null);
        } else if (data.cod === '404') {
          if (city.toLowerCase() === 'banglore') {
            setMessage('❌ Did you mean "Bengaluru" (Bangalore)?');
          } else {
            setMessage('❌ City not found. Try another name.');
          }
          setWeatherData(null);
        } else if (data.cod !== 200) {
          setMessage(`⚠️ Error: ${data.message}`);
          setWeatherData(null);
        } else {
          setWeatherData(data);
          setMessage('');
        }
      })
      .catch((error) => {
        console.error(error);
        setMessage('⚠️ Network error. Please try again later.');
        setWeatherData(null);
      })
      .finally(() => {
        setLoading(false);
        setCity('');
      });
  };

  const clearWeather = () => {
    setWeatherData(null);
    setMessage('');
    setCity('');
  };

  return (
    <div
  className="d-flex justify-content-center align-items-center vh-100 w-100"
     style={{
  background: "linear-gradient(135deg,#667eea,#764ba2)",
  width: "100vw",
  boxShadow: "inset 0 0 120px rgba(0,0,0,0.15)"
}}
    >
      <div
        className="card text-center p-4 shadow-lg border-0"
        style={{
          maxWidth: "400px",
          width: "100%",
          borderRadius: "20px",
          backdropFilter: "blur(10px)"
        }}
      >
        <div className="card-body">

          <h1 className="card-title mb-4 fw-bold text-dark">
            🌦 Weather App
          </h1>

          <form className="d-flex flex-column align-items-center" onSubmit={showWeather}>
            <input
              type="text"
              placeholder="Enter city name"
              className="form-control mb-3 text-center"
              value={city}
              onChange={changeCity}
              style={{ borderRadius: "10px" }}
            />

            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary px-4">
                Get Weather
              </button>

              {weatherData && (
                <button
                  type="button"
                  className="btn btn-secondary px-4"
                  onClick={clearWeather}
                >
                  Clear
                </button>
              )}
            </div>
          </form>

          {message && (
            <div className="alert alert-danger mt-3" role="alert">
              {message}
            </div>
          )}

          {loading && (
            <div className="alert alert-info mt-3" role="alert">
              Loading weather data...
            </div>
          )}

          {weatherData && !loading && (
            <div className="mt-4">

              <h4 className="fw-bold">
                {weatherData.name}, {weatherData.sys.country}
              </h4>

              <img
                src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                alt="weather icon"
                style={{ width: "100px" }}
              />

              <h2 className="fw-bold mt-2 text-primary display-4">
                {Math.round(weatherData.main.temp)}°C
              </h2>

              <p className="text-capitalize">
                🌍 {weatherData.weather[0].description}
              </p>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;