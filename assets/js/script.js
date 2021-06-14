var apiKey = "&appid=168248a932543f98292aa3c93ce44419"

var input = document.querySelector("#input");
var searchBtn = document.querySelector("#search-btn");
var cityName = document.querySelector("#city-name");
var weatherIcon = document.querySelector("#weather-icon");
var date = document.querySelector("#date");
var cityTemp = document.querySelector("#city-temp");
var cityHumidity = document.querySelector("#city-humidity");
var cityWindSpeed = document.querySelector("#city-wind-speed");
var cityUV = document.querySelector("#city-uv-index");

searchBtn.addEventListener("click", formSubmitHandler);

function formSubmitHandler(event) {
    event.preventDefault();

    var city = input.value.trim(); 
    console.log(city);

    if(city) {
        getCurrentWeather(city);
        input.value = "";
    } else {
        alert("Please enter a city");
    }
};


function getCurrentWeather(city) {
    //format the api url
    var apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + apiKey;

    fetch(apiURL)
    .then(function(response) {
        // request was successful
      if (response.ok) {
        response.json().then(function(data) {
          console.log(data);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
}

function displayCurrentWeather() {

}
