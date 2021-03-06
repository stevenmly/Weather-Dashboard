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
var foreCastInfo = document.querySelector("#foreCast");
var searchSection = document.querySelector("#search-section")

var cities= [];

searchBtn.addEventListener("click", formSubmitHandler);

function formSubmitHandler(event) {
    event.preventDefault();

    var city = input.value.trim().toUpperCase(); 
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
    saveSearch(city);
}

function collectWeatherData(data) {
    var date = new Date();
    date = date.getMonth()+1 + '/' + date.getDate() + '/' + date.getFullYear();

    var temp = data.current.temp;
    var humidity = data.current.humidity;
    var windSpeed = data.current.wind_speed;
    var uvIndex = data.current.uvi;
    var icon = data.current.weather[0].icon;
    var daily = data.daily;

    getForecast(daily);
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
    } else if (uvIndex < 6 && uvIndex >= 2) {
        cityUV.setAttribute('class', 'bg-warning text-light p-2');
    } else if (uvIndex >= 6) {
        cityUV.setAttribute('class', 'bg-danger text-light p-2');
    }

    var iconSrc = 'http://openweathermap.org/img/wn/'+icon+'@2x.png'
    weatherIcon.setAttribute('src', iconSrc);
}

function getForecast(daily) {
    foreCastInfo.innerHTML="";

    for (i=1; i < 6; i++) {
        var dailyTemp = daily[i].temp.day;
        var dailyHumidity = daily[i].humidity;
        var date = new Date();
        date = date.getMonth()+1 + '/' + (date.getDate()+i) + '/' + date.getFullYear();
        var icon = daily[i].weather[0].icon;
        displayForecast(dailyHumidity, dailyTemp, date, icon);
    }
}

function displayForecast(hum, temp, date, icon) {
        
    
    var cardDiv = document.createElement('div');
    cardDiv.setAttribute('class', 'card bg-primary text-white p-2 m-2');
    var cardTitle = document.createElement('h5');
    cardTitle.setAttribute('class', 'card-title text-center');
    cardTitle.textContent = date;
    var iconCon = document.createElement('img');
    var iconSrc = 'http://openweathermap.org/img/wn/'+icon+'@2x.png'
    iconCon.setAttribute('src', iconSrc);

    var cardText1 = document.createElement('p');
    cardText1.setAttribute('class', 'card-text');
    cardText1.textContent = "Temperature: " + temp + ' F';
    var cardText2 = document.createElement('p');
    cardText2.setAttribute('class', 'card-text');
    cardText2.textContent = 'Humidity: ' + hum + '%';
    cardDiv.appendChild(cardTitle);
    cardDiv.appendChild(iconCon);
    cardDiv.appendChild(cardText1);
    cardDiv.appendChild(cardText2);
    foreCastInfo.appendChild(cardDiv);
};

function saveSearch(city) {
    var cities = JSON.parse(localStorage.getItem('cities'));
    
    if (cities === null) {
        cities = [];
    } 
    for (i = 0; i < cities.length; i++) {
        if (city.toUpperCase() === cities[i].toUpperCase()) {
            return;
        }
    }
    cities.push(city);
    localStorage.setItem('cities', JSON.stringify(cities));

    var btn = document.createElement('button');
    btn.setAttribute('class', 'btn w-100 p-2 m-1');
    btn.setAttribute('onclick', 'loadPreviousSearch(this.value)');
    btn.setAttribute('value', city);
    btn.textContent = city;
    searchSection.appendChild(btn);
};

function loadPage() {
    var cities = JSON.parse(localStorage.getItem('cities'));
    if (cities === null) {
        return;
    }

    for (i = 0; i < cities.length; i++) {
        var btn = document.createElement('button');
        btn.setAttribute('class', 'btn w-100 p-2 m-1');
        btn.setAttribute('onclick', 'loadPreviousSearch(this.value)');
        btn.setAttribute('value', cities[i]);
        btn.textContent = cities[i];
        searchSection.appendChild(btn);
    }
}

loadPage();

function loadPreviousSearch(city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + apiKey + "&units=imperial";
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                getOneCallAPI(data, city);
            })
        } else {
            alert('Error: ' + response.status);
        }
    });
};








