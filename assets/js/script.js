var cityEl = $('#search-city');
var searchBtn = $('#search-btn');
var todayWeatherEl = $('#today-weather');
var todayDateEl = $('#today-date');
var weatherIconEl = $('#icon');
var cardsEl = $('.card-body');
var upcomingForeCastEl = $('.card-text');
var searchHistorytEl = $('#history-btn-container');
var latitude;
var longitude;
var requestUrl;
var temp;
var humidity;
var wind;
var weather;
var dayDateArr = [];
var upcomingWeather;
var citySearched = [];
var city;

createHistoryBtn();

// EVENT LISTENER

// Add event listener to the search button
searchBtn.on('click', submitLocationSearch);

//FUNCTIONS

// Function to store history search into the loacal storage
function storeCity() {
    localStorage.setItem("City Searched", JSON.stringify(citySearched));
}

var submitLocationSearch = function (event) {
    event.preventDefault();
    console.log("event triggered");
    city = cityEl.val().trim();
    citySearched = JSON.parse(localStorage.getItem("City Searched"));

    if (city) {
        getLocation(city);
        city = city.toLowerCase();
        if (citySearched == null) {
            citySearched = [city];
            console.log("01")
            storeCity();
        }
        else if (citySearched.includes(city)) {
            console.log(citySearched);
            return citySearched;

        } else {
            citySearched.push(city);
            storeCity();
        }
    }
    // createHistoryBtn();
};

// Function to get the latitude and longitude of the search city through the GeoAPI
function getLocation(city) {

    requestUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=a0290a3291b38896066eaae36dc53ecf";
    todayDateEl.text(city.toUpperCase() + " " + dayjs().format('DD/MM/YYYY'));
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            latitude = data[0].lat;
            longitude = data[0].lon;
            getCurrentWeather();
            getUpcomingWeather();
        });
};

// Function to get data stored into the local storage and create history search button
function createHistoryBtn() {

    citySearched = JSON.parse(localStorage.getItem("City Searched"));
    console.log(citySearched);
    if (citySearched == null) {
        return;
    } else {
        for (var i = 0; i < citySearched.length; i++) {
            console.log(i);
            var historyBtn = document.createElement('button');
            historyBtn.innerText = citySearched[i].toUpperCase();
            searchHistorytEl.append(historyBtn);
            historyBtn.classList.add("btn", "btn-primary", "col-lg-12");
            
            historyBtn.addEventListener('click', function (event) {
                event.stopPropagation();
                console.log(this);
                city = this.innerText;
                console.log(city);
                getLocation(city);
            })
        }
    }
};

// Function to get the current weather of the searched city through the OpenWeather API
function getCurrentWeather() {

    weather = [];
    console.log(city);

    if (todayWeatherEl !== null) {
        todayWeatherEl.empty();
    }

    requestUrl = "https://api.openweathermap.org/data/2.5/weather?" + "lat=" + latitude + "&lon=" + longitude + "&appid=a0290a3291b38896066eaae36dc53ecf";

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            todayDateEl.text(city.toUpperCase() + " " + dayjs().format('DD/MM/YYYY'));

            temp = "Temp: " + Math.round(1.8 * (data.main.temp - 273) + 32) + " °F";
            wind = "Wind: " + Math.round(data.wind.speed * 2.236936) + " MPH";
            humidity = "Humidity: " + data.main.humidity + " %";

            weather = [temp, wind, humidity];

            if (data.weather[0].main == "Thunderstorm") {
                weatherIconEl.attr("class", "fa-solid fa-bolt");

            }

            else if (data.weather[0].main == "Clouds") {
                weatherIconEl.attr("class", "fa-solid fa-cloud");

            }

            else if (data.weather[0].main == "Rain" || data.weather[0].main == "Drizzle") {
                weatherIconEl.attr("class", "fa-solid fa-cloud-rain");

            } else if (data.weather[0].main == "Snow") {
                weatherIconEl.attr("class", "fa-solid fa-snowflake");
            } else if (data.weather[0].main == "Clear") {
                weatherIconEl.attr("class", "fa-solid fa-sun");
            } else {
                weatherIconEl.attr("class", "");
            }

            for (var i = 0; i < weather.length; i++) {

                var liElemt = document.createElement('li');
                liElemt.textContent = weather[i];
                todayWeatherEl.append(liElemt);
            }
        });
};

// Function to get the 5-Day forecast of the searched city through the OpenWeather API
function getUpcomingWeather() {
    weather = [];
    upcomingWeather = [];
    requestUrl = "https://api.openweathermap.org/data/2.5/forecast?" + "lat=" + latitude + "&lon=" + longitude + "&appid=a0290a3291b38896066eaae36dc53ecf";

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            for (var i = 0; i < data.list.length; i++) {
                var upcomingDate = data.list[i].dt_txt;
                var upcomingDateArr = upcomingDate.split(" ");
                var currentDate = dayjs().format('YYYY-MM-DD');


                if (upcomingDateArr[0] !== currentDate && upcomingDateArr[1] == '12:00:00') {
                    dayDateArr.push(upcomingDateArr[0]);

                    temp = "Temp: " + Math.round(1.8 * (data.list[i].main.temp - 273) + 32) + " °F";
                    wind = "Wind: " + Math.round(data.list[i].wind.speed * 2.236936) + " MPH";
                    humidity = "Humidity: " + data.list[i].main.humidity + " %";

                    weather = [temp, wind, humidity];

                    upcomingWeather.push(weather);
                }
            }

            upcomingForeCastEl.empty();

            for (var j = 0; j < upcomingWeather.length; j++) {
                var weatherData = upcomingWeather[j];

                for (var l = 0; l < weatherData.length; l++) {
                    var liElemt = document.createElement('li');
                    liElemt.textContent = weatherData[l];
                    upcomingForeCastEl[j].append(liElemt);
                }

            }

            for (var k = 0; k < cardsEl.length; k++) {
                var upcomingForeCastTitle = cardsEl.children('h5');
                upcomingForeCastTitle[k].textContent = dayDateArr[k];
            }
        })
}