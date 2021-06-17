var apiKey = "&appid=168248a932543f98292aa3c93ce44419"

var input = document.querySelector("#input");
var searchBtn = document.querySelector("#search-btn");
var cityName = document.querySelector("#city-name");
var weatherIcon = document.querySelector("#weather-icon");
var currentDate = document.querySelector("#date");
var cityTemp = document.querySelector("#city-temp");
var cityHumidity = document.querySelector("#city-humidity");
var cityWindSpeed = document.querySelector("#city-wind-speed");
var cityUV = document.querySelector("#city-uv-index");

searchBtn.addEventListener("click", formSubmitHandler);

function formSubmitHandler(event) {
    event.preventDefault();

    var city = input.value.trim().toUpperCase(); 
    console.log(city);

    if(city) {
        getCurrentWeather(city);
        getForecast(city);
        input.value = "";
    } else {
        alert("Please enter a city");
    }
};


function getCurrentWeather(city) {
    //format the api url
    var apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + apiKey + "&units=imperial";

    fetch(apiURL)
    .then(function(response) {
        // request was successful
      if (response.ok) {
        response.json().then(function(data) {
          getOneCallAPI(data, city);
          console.log(data);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
}

function getOneCallAPI(data, city) {
    var lat = data.coord.lat;
    var lon = data.coord.lon;

    cityName.textContent = city;

    var apiURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial" + apiKey;

    fetch(apiURL)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                  collectWeatherData(data);
                  console.log(data)
                });
            } else {
                alert("Error: " + response.statusText);
                return;
            }
        })
}

function collectWeatherData(data) {
    var date = new Date();
    date = date.getMonth()+1 + '/' + date.getDate() + '/' + date.getFullYear();

    var temp = data.current.temp;
    var humidity = data.current.humidity;
    var windSpeed = data.current.wind_speed;
    var uvIndex = data.current.uvi;
    var icon = data.current.weather[0].icon;

    displayWeatherData(date, temp, humidity, windSpeed, uvIndex, icon);
}

function displayWeatherData(date, temp, humidity, windSpeed, uvIndex, icon) {
    currentDate.textContent = "(" + date + ")";
    cityTemp.textContent = "Temperature: " + temp + "°F";
    cityHumidity.textContent = "Humidity: " + humidity + "%";
    cityWindSpeed.textContent = "Wind Speed: " + windSpeed + "MPH";
    cityUV.textContent = "UV Index: " + uvIndex;

    if (uvIndex < 2) {
        cityUV.setAttribute('class', 'bg-success text-light p-2');
    } else if (uvIndex < 6 && UVindex >= 2) {
        cityUV.setAttribute('class', 'bg-warning text-light p-2');
    } else if (uvIndex >= 6) {
        cityUV.setAttribute('class', 'bg-danger text-light p-2');
    }

    var iconSrc = 'http://openweathermap.org/img/wn/'+icon+'@2x.png'
    weatherIcon.setAttribute('src', iconSrc);
}


function getForecast(city) {
    fetch("https://api.openweathermap.org/data/2.5/forecast?id="
    + city + apiKey + "&units=imperial")
    .then(function(response){
        return response.json();
    })
}