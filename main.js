// Feature 1
// Display the current date and time using JavaScript: Tuesday 16:00
function showTime() {
  // Get the current date and time
  let currentDate = new Date();

  // Get the day of the week
  let daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let dayOfWeek = daysOfWeek[currentDate.getDay()];

  // Get the hours and minutes
  let hours = currentDate.getHours();
  let minutes = currentDate.getMinutes();

  // Display the formatted time
  let time = document.querySelector("#current-time");
  time.textContent = `${dayOfWeek} ${hours}:${
    minutes < 10 ? "0" + minutes : minutes
  }`;
}

function showTemperature(response) {
  let temperature = Math.round(response.data.main.temp);
  let city = response.data.name;
  let cityTemp = document.querySelector("p#temperature");
  cityTemp.innerHTML = `${temperature}°C`;
}

function requestTemperature(city) {
  let apiKey = "a969311cfcbb4a83dfad2cf7478397f9";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric`;
  axios.get(`${apiUrl}&appid=${apiKey}`).then(showTemperature);
}

// Feature 2
// When searching for a city (i.e. Paris), display the city name on the page after the user submits the form and requesting temp
function searchCity(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#search-bar");
  let city = document.querySelector("#city");
  let cityName = cityInput.value;
  city.innerHTML = cityName;
  event.target.reset();
  // Requesting temperature from external API
  requestTemperature(cityName);
}

// Loading functions along with html page
function onLoad() {
  let searchForm = document.querySelector("#search-form");
  searchForm.addEventListener("submit", searchCity);
  showTime();
}

window.addEventListener("load", onLoad);
