
// Weather Codes
const weatherCodes = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "partly cloudy",
    3: "overcast",
    45: "Fog",
    48: "depositing rime fog",
    51: "Light Drizzle",
    53: "moderate Drizzle",
    55: "dense Drizzle",
    56: "Light Freezing Drizzle",
    57: "dense Freezing Drizzle",
    61: "Slight Rain",
    63: "moderate Rain",
    65: "dense Rain",
    66: "Light Freezing Rain",
    67: "heavy Freezing Rain",
    71: "Slight Snow fall",
    73: "moderate Snow fall",
    75: "heavy Snow fall",
    77: "Snow grains",
    80: "Slight Rain showers",
    81: "violent Rain showers",
    82: "Slight Rain showers",
    85: "heavy slight Snow showers",
    86: "Snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
  };
  
const cityInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchBtn");
const weatherInfo = document.getElementById("weatherInfo");
const errorDisplay = document.getElementById("error");
const cityName = document.getElementById("cityName");
const weather = document.getElementById("weather");
const temperature = document.getElementById("temperature");
const windspeed = document.getElementById("windspeed");

searchButton.addEventListener("click", function () {
  if (cityInput.value === "") {
    errorDisplay.innerText = `Invalid Input`;
    return;
  }
  errorDisplay.innerText = "";
  getCoordinates();
});

//For Fetch City Coordinates from UserInput
function getCoordinates() {
  fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      cityInput.value
    )}`
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (!data.results || data.results.length === 0) {
        weatherInfo.classList.add("hidden");
        errorDisplay.innerText = `City Not Found`;
        return;
      }
      let _latitude = data.results[0].latitude;
      let _longitude = data.results[0].longitude;

      fetchWeather([_latitude, _longitude]);

      _latitude = null;
      _longitude = null;
    }).catch( (err) =>{
      errorDisplay.innerText = `Unexpected Error Occure`;
    });
}

//For Fetching Weather Data from Open Meteo API
function fetchWeather(coords) {
  let [latitude, longitude] = coords;

  fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(
      latitude
    )}&longitude=${encodeURIComponent(longitude)}&current_weather=true`
  )
    .then((reponse) => {
      if (!reponse.ok) {
        errorDisplay.innerText = `Unexpected Error Occure`;
        return;
      }
      return reponse.json();
    })
    .then((data) => {
      let weatherData = data.current_weather;
      let temperatue = weatherData.temperature;
      let weathercode = weatherData.weathercode;
      let windspeed = weatherData.windspeed;

      updateUi([temperatue, weathercode, windspeed]);

      weatherData = null;
      temperatue = null;
      weathercode = null;
      windspeed = null;
    })
    .catch((err) => {
      errorDisplay.innerText = `Unexpected Error Occure`;
    });
}

//Updates UI on Weather Data Fetch is completed
function updateUi(uiDatas) {
  const [_temperature, _weather, _windspeed] = uiDatas;
  cityName.innerText = `${cityInput.value.toUpperCase()}`;
  weather.innerText = `${weatherCodes[_weather].toUpperCase()}`;
  temperature.innerText = `${_temperature} C`;
  windspeed.innerText = `${_windspeed} Km/h`;
  weatherInfo.classList.remove("hidden");
}
