// Global variable that has true value if the temp is shown in Celcius
let isCelcius = true;

// Global constant for forecast and current day
const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Display the current date and time using JavaScript: Tuesday 16:00
function showTime() {
  // Get the current date and time
  let currentDate = new Date();
  // Get the day of the week
  let dayOfWeek = DAYS_OF_WEEK[currentDate.getDay()];
  // Get the hours and minutes
  let hours = currentDate.getHours();
  let minutes = currentDate.getMinutes();

  // Display the formatted time
  let time = document.querySelector("#current-time");
  time.textContent = `${dayOfWeek} ${hours}:${
    minutes < 10 ? "0" + minutes : minutes
  }`;
}

// Convert Unix UTC to hh:mm:ss (12h format)
function convertUnixUTCToRealTime(unixUTC) {
  let date = new Date(unixUTC * 1000);
  let hours = date.getHours();
  let minutes = date.getMinutes().toString();
  let seconds = date.getSeconds().toString();
  if (hours === 0) {
    hours === 12;
  } else if (hours > 12) {
    hours -= 12;
  }

  return `${hours < 10 ? "0" + hours : hours}:${
    minutes < 10 ? "0" + minutes : minutes
  }:${seconds < 10 ? "0" + seconds : seconds}`;
}

function displayForecast(response) {
  console.log(response.data.daily);
  // clear all HTML
  let forecast = document.querySelector(".forecast");
  forecast.innerHTML = "";

  // create an appropriate data forecast for each day
  const AMOUNT_OF_DAYS = 6;
  for (let i = 1; i < AMOUNT_OF_DAYS + 1; i++) {
    const currentDay = response.data.daily[i];

    // get day of week from currentDay
    let weekDay = DAYS_OF_WEEK[new Date(currentDay.dt * 1000).getDay()];
    weekDay = weekDay.substring(0, 3);
    let maxTemp = `H: ${Math.round(currentDay.temp.max)}`;
    let minTemp = `L: ${Math.round(currentDay.temp.min)}`;
    let dayIconSrc = `http://openweathermap.org/img/wn/${currentDay.weather[0].icon}@2x.png`;
    let dayIconAlt = currentDay.weather[0].description;

    // create an empty div for a forecast for a day
    let forecastDay = document.createElement("div");
    forecastDay.className = "row";

    // fill in forecast for a day
    let weekDayElement = document.createElement("div");
    weekDayElement.className = "col";
    weekDayElement.textContent = weekDay;
    let dayIconElement = document.createElement("div");
    dayIconElement.className = "col";
    let dayImage = document.createElement("img");
    dayImage.setAttribute("src", dayIconSrc);
    dayImage.setAttribute("alt", dayIconAlt);
    let maxTempElement = document.createElement("div");
    maxTempElement.className = "col";
    maxTempElement.textContent = maxTemp;
    let minTempElement = document.createElement("div");
    minTempElement.className = "col";
    minTempElement.textContent = minTemp;

    // append created elements to the page
    forecastDay.appendChild(weekDayElement);
    dayIconElement.appendChild(dayImage);
    forecastDay.appendChild(dayIconElement);
    forecastDay.appendChild(maxTempElement);
    forecastDay.appendChild(minTempElement);
    forecast.appendChild(forecastDay);
  }
}

function getForecast(coordinates) {
  let apiKey = "a969311cfcbb4a83dfad2cf7478397f9";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function requestTemperature(city) {
  let apiKey = "a969311cfcbb4a83dfad2cf7478397f9";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric`;
  axios.get(`${apiUrl}&appid=${apiKey}`).then(showTemperature);
}

function showTemperature(response) {
  console.log(response.data);
  let temperature = Math.round(response.data.main.temp);
  // let city = response.data.name;
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let cityTemp = document.querySelector("#tempElement");
  let sunriseElement = document.querySelector("#sunrise");
  let sunsetElement = document.querySelector("#sunset");
  let imageElement = document.querySelector("#image");
  cityTemp.innerHTML = `${temperature}`;

  descriptionElement.innerHTML = response.data.weather[0].description;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  sunriseElement.textContent = convertUnixUTCToRealTime(
    response.data.sys.sunrise
  );
  sunsetElement.textContent = convertUnixUTCToRealTime(
    response.data.sys.sunset
  );

  // Getting lat and long from api
  getForecast(response.data.coord);

  imageElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  imageElement.setAttribute("alt", response.data.weather[0].description);
}

// When searching for a city (i.e. Paris), display the city name on the page after the user submits the form and requesting temp
function searchCity(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#search-bar");
  let city = document.querySelector("#city");
  let cityName = cityInput.value;
  if (!cityName.trim()) return;
  city.innerHTML = cityName;
  event.target.reset();
  // Requesting temperature from external API
  requestTemperature(cityName);
}

function convertToFahrenheit(event) {
  event.preventDefault();
  if (!isCelcius) {
    return;
  }
  let temperatureElement = document.querySelector("#tempElement");
  let currentValue = +temperatureElement.textContent;
  temperatureElement.textContent = (currentValue * 9) / 5 + 32;
  isCelcius = false;
}

function convertToCelsius(event) {
  event.preventDefault();
  if (isCelcius) {
    return;
  }
  let temperatureElement = document.querySelector("#tempElement");
  let currentValue = +temperatureElement.textContent;
  temperatureElement.textContent = (5 / 9) * (currentValue - 32);
  isCelcius = true;
}

// Loading functions along with html page
function onLoad() {
  showTime();
  requestTemperature("Dnipro");

  let searchForm = document.querySelector("#search-form");
  searchForm.addEventListener("submit", searchCity);

  // Convert temperature into Farenheit
  let fahrenheitLink = document.querySelector("#fahrenheit-link");
  fahrenheitLink.addEventListener("click", convertToFahrenheit);
  let celsiusLink = document.querySelector("#celsius-link");
  celsiusLink.addEventListener("click", convertToCelsius);
}

window.addEventListener("load", onLoad);
