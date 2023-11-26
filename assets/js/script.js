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


// var city = cityEl.value.trim();

console.log(todayWeatherEl);

var submitLocationSearch = function (event) {
    event.preventDefault();
    console.log("event triggered");
    var city = cityEl.val().trim();
    citySearched = JSON.parse(localStorage.getItem("City Searched"));

    if (city) {
        getLocation(city);
        todayDateEl.text(city.toUpperCase() + " " + dayjs().format('DD/MM/YYYY'));

        if (citySearched == null) {
            city = city.toLowerCase();
            citySearched = [city];
        }
        else {
            city = city.toLowerCase();
            for (var i = 0; i < citySearched.length; i++) {
                if (city !== citySearched[i]) {
                    citySearched.push(city);

                } else {
                    return citySearched;
                }
            }

            console.log(citySearched);
            console.log(typeof citySearched);
        }
        storeCity();
    } else if (getLocation(city) == null) {
        alert('Please enter a valid city');
        return;
    }
};

function storeCity() {
    // Stringify and set key in localStorage to userScore array
    localStorage.setItem("City Searched", JSON.stringify(citySearched));
}


searchBtn.on('click', submitLocationSearch);

// Function to get the latitude and longitude of the search city through the GeoAPI
function getLocation(city) {
    // fetch request gets a list of all the repos for the node.js organization
    requestUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=a0290a3291b38896066eaae36dc53ecf";

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




function getCurrentWeather() {

    weather = [];

    if (todayWeatherEl !== null) {
        todayWeatherEl.empty();
    }

    requestUrl = "https://api.openweathermap.org/data/2.5/weather?" + "lat=" + latitude + "&lon=" + longitude + "&appid=a0290a3291b38896066eaae36dc53ecf";

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // console.log(data);

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
                weatherIconEl.text("");
            }

            //Loop over the data to generate a table, each table row will have a link to the repo url
            for (var i = 0; i < weather.length; i++) {
                // Creating elements, tablerow, tabledata, and anchor
                var liElemt = document.createElement('li');

                // Setting the text of link and the href of the link
                liElemt.textContent = weather[i];

                // Appending the link to the tabledata and then appending the tabledata to the tablerow
                todayWeatherEl.append(liElemt);
            }
        });
};



function getUpcomingWeather() {
    weather = [];
    upcomingWeather = [];
    requestUrl = "https://api.openweathermap.org/data/2.5/forecast?" + "lat=" + latitude + "&lon=" + longitude + "&appid=a0290a3291b38896066eaae36dc53ecf";

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {

            // console.log(dayjs().format('YYYY-MM-DD'));

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


function createHistoryBtn() {
    citySearched = JSON.parse(localStorage.getItem("City Searched"));
    for (var i = 0; i < citySearched.length; i++) {
        var historyBtn = document.createElement('button');
        historyBtn.innerText = citySearched[i].toUpperCase();
        searchHistorytEl.append(historyBtn);
        historyBtn.classList.add("btn", "btn-primary", "col-lg-12");
    }
};

createHistoryBtn();


// // Function that displays each score into a list
// function displayScore() {

//     clearInterval(timeInterval);
//     listContainer.textContent = "";

//     gameEl.setAttribute("class", "hidden");
//     homepageEl.setAttribute("class", "hidden");
//     highScoreEl.setAttribute("class", "shown");

//     userScore = JSON.parse(localStorage.getItem("userScore"));
//     if (userScore == null) {
//         return;
//     }
//     // Display a new li for each user score
//     else {
//         for (var i = 0; i < userScore.length; i++) {
//             var highScore = userScore[i];

//             var li = document.createElement("li");
//             li.textContent = highScore;
//             console.log(li);
//             listContainer.appendChild(li);
//             // console.log(listContainer);
//         }
//     }
// };