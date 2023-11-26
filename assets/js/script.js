var cityEl = $('#search-city');
var searchBtn = $('#search-btn');
var todayWeatherEl = $('#today-weather');
var todayDateEl = $('#today-date');
var weatherIconEl = $('#icon');
var cardsEl = $('.card-body');
var latitude;
var longitude;
var requestUrl;
var temp;
var humidity;
var wind;
var weather;
var dayDateArr = [];
var upcomingWeather = [];


// var city = cityEl.value.trim();



var submitLocationSearch = function (event) {
    event.preventDefault();
    console.log("event triggered");
    var city = cityEl.val().trim();

    if (city) {
        getLocation(city);
        todayDateEl.text(city.toUpperCase() + " " + dayjs().format('DD/MM/YYYY'));
        //   it is not woking
    } else if (getLocation(city) == null) {
        alert('Please enter a city');
    }
};

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
            // console.log(data)

            latitude = data[0].lat;
            longitude = data[0].lon;
            // console.log(latitude);
            // console.log(longitude);
            // getCurrentWeather();
            getUpcomingWeather();
        });
};




function getCurrentWeather() {
    weather = [];

    requestUrl = "https://api.openweathermap.org/data/2.5/weather?" + "lat=" + latitude + "&lon=" + longitude + "&appid=a0290a3291b38896066eaae36dc53ecf";

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // console.log(data)
            // console.log(typeof data.main.temp);
            // console.log(data.main.humidity);
            // console.log(data.wind.speed);
            temp = "Temp: " + Math.round(1.8 * (data.main.temp - 273) + 32) + " °F";
            // console.log(temp);
            wind = "Wind: " + Math.round(data.wind.speed * 2.236936) + " MPH";
            humidity = "Humidity: " + data.main.humidity + " %";
            // console.log(wind);
            weather = [temp, wind, humidity];
            // console.log(data.weather[0].main)

            if (data.weather[0].main == "Thunderstorm") {
                weatherIconEl.attr("class", "fa-solid fa-bolt");

            }

            else if (data.weather[0].main == "Clouds") {
                weatherIconEl.attr("class", "fa-solid fa-cloud");

            }

            else if (data.weather[0].main == "Rain") {
                weatherIconEl.attr("class", "fa-solid fa-cloud-shower-heavy");

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
                weatherEl.append(liElemt);
            }
        });
};



function getUpcomingWeather() {
    weather = [];

    requestUrl = "https://api.openweathermap.org/data/2.5/forecast?" + "lat=" + latitude + "&lon=" + longitude + "&appid=a0290a3291b38896066eaae36dc53ecf";

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // console.log(data)
            // console.log(typeof data.list[2].dt_txt);
            // console.log(data.list[2].dt_txt);
            // var upcomingDate = data.list[2].dt_txt;
            // var upcomingDateArr = upcomingDate.split(" ");
            // // console.log(upcomingDateArr);
            // // console.log(upcomingDateArr[0]);
            console.log(dayjs().format('YYYY-MM-DD'));

            for (var i = 0; i < data.list.length; i++) {
                var upcomingDate = data.list[i].dt_txt;
                var upcomingDateArr = upcomingDate.split(" ");
                // console.log(upcomingDate);
                // console.log(upcomingDateArr);
                // console.log(upcomingDateArr[0]);
                // console.log(upcomingDateArr[1]);
                // console.log(typeof upcomingDateArr[1]);
                var currentDate = dayjs().format('YYYY-MM-DD');


                if (upcomingDateArr[0] !== currentDate && upcomingDateArr[1] == '12:00:00') {
dayDateArr.push(upcomingDateArr[0]);
console.log(dayDateArr);


                    temp = "Temp: " + Math.round(1.8 * (data.list[i].main.temp - 273) + 32) + " °F";
                    wind = "Wind: " + Math.round(data.list[i].wind.speed * 2.236936) + " MPH";
                    humidity = "Humidity: " + data.list[i].main.humidity + " %";

                    // console.log(temp);
                    // console.log(wind);
                    // console.log(humidity);

                    weather = [temp, wind, humidity];

                    // var liElemt02 = document.createElement('li');
                    // liElemt02.textContent = weather[i];
                    // console.log(cardsEl.children('ul'));
                    // console.log(typeof cardsEl.children('ul'));
                    // console.log(cardsEl.children('h5'));
                    // console.log(typeof cardsEl.children('h5'));
                    // console.log(cardsEl.length);
upcomingWeather.push(weather);

            

                }}

                console.log(upcomingWeather);
                console.log(typeof upcomingWeather);
                var upcomingForeCastEl = cardsEl.children('ul');

                for (var j=0; j < upcomingWeather.length; j++) {
                    console.log(j);
                    var weatherData = upcomingWeather[j];
                    console.log(weatherData);

                    for (var l=0; l < weatherData.length; l++) {
                    var liElemt = document.createElement('li');
                    liElemt.textContent = weatherData[l];
                    console.log(liElemt);
                    upcomingForeCastEl[j].append(liElemt);
                }

                }

                    for (var k = 0; k < cardsEl.length; k++) {
                        var upcomingForeCastTitle = cardsEl.children('h5');
                        upcomingForeCastTitle[k].textContent = dayDateArr[k];
                    }
                        
                
            
        })
}


// function changeFormat (dayDateArr) {

//     for (var i = 0; i < dayDateArr.length; i++){
//         var date = dayDateArr[i];
//         date.split("-")
//     }

//     var new dayDateArr = dayDateArr.split("");

// }


// // ICONS CODE

// SoleiL: <i class="fa-solid fa-sun"></i>
// Nuage: <i class="fa-solid fa-sun"></i>
// Snow: <i class="fa-solid fa-sun"></i>
// Orage: <i class="fa-solid fa-sun"></i>
// Rain: <i class="fa-solid fa-sun"></i>

// for ()

//     console.log(data.main.humidity);
//     console.log(data.wind.speed);
//     temp = "Temp: " + Math.round(1.8*(data.main.temp - 273) + 32) + " °F";
//     console.log(temp);
//     wind = "Wind: " + Math.round(data.wind.speed * 2.236936) + " MPH";
//     humidity = "Humidity: " + data.main.humidity + " %";
//     console.log(wind);
//     todayWeather = [temp, wind, humidity];


//         //Loop over the data to generate a table, each table row will have a link to the repo url
//         // for (var i = 1; i < data.list.length; i++) {


//         //     console.log(data.list[i].main.temp)
//           // Creating elements, tablerow, tabledata, and anchor
//           var liElemt = document.createElement('li');

//     //       // Setting the text of link and the href of the link
//     //       liElemt.textContent = todayWeather[i];

//     //       // Appending the link to the tabledata and then appending the tabledata to the tablerow
//     //       todayWeatherEl.appendChild(liElemt);