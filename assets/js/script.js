var cityEl = $('#search-city');
var searchBtn = $('#search-btn');
var todayWeatherEl = $('#today-weather');
var todayDateEl = $('#today-date');
var latitude;
var longitude;
var requestUrl;
var temp;
var humidity;
var wind;
var todayWeather;



// var city = cityEl.value.trim();



var submitLocationSearch = function (event) {
    event.preventDefault();
  console.log("event triggered");
    var city = cityEl.val().trim();
  
    if (city) {
        getLocation(city);
        todayDateEl.text(city.toUpperCase() +" " + dayjs().format('DD/MM/YYYY')); 
    //   it is not woking
    } else if (getLocation(city)==null){
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
      console.log(data)

    latitude = data[0].lat;
   longitude = data[0].lon;
   console.log(latitude);
   console.log(longitude);
   getCurrentWeather();
//    getUpcomingWeather();
    });
};




function getCurrentWeather() {
  // fetch request gets a list of all the repos for the node.js organization
//   var weatherApi = "lat=" + latitute + "&lon=" + longitude + "&appid={a0290a3291b38896066eaae36dc53ecf";
// getLocation();
todayWeather = [];

requestUrl = "https://api.openweathermap.org/data/2.5/weather?" + "lat=" + latitude + "&lon=" + longitude + "&appid=a0290a3291b38896066eaae36dc53ecf";

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data)
      console.log(typeof data.main.temp);
      console.log(data.main.humidity);
      console.log(data.wind.speed);
      temp = "Temp: " + Math.round(1.8*(data.main.temp - 273) + 32) + " °F";
      console.log(temp);
      wind = "Wind: " + Math.round(data.wind.speed * 2.236936) + " MPH";
      humidity = "Humidity: " + data.main.humidity + " %";
      console.log(wind);
      todayWeather = [temp, wind, humidity];

      //Loop over the data to generate a table, each table row will have a link to the repo url
      for (var i = 0; i < todayWeather.length; i++) {
        // Creating elements, tablerow, tabledata, and anchor
        var liElemt = document.createElement('li');

        // Setting the text of link and the href of the link
        liElemt.textContent = todayWeather[i];

        // Appending the link to the tabledata and then appending the tabledata to the tablerow
        todayWeatherEl.append(liElemt);
      }
    });
};



function getUpcomingWeather() {
    // fetch request gets a list of all the repos for the node.js organization
  //   var weatherApi = "lat=" + latitute + "&lon=" + longitude + "&appid={a0290a3291b38896066eaae36dc53ecf";
  // getLocation();
  todayWeather = [];
  
  requestUrl = "https://api.openweathermap.org/data/2.5/forecast?" + "lat=" + latitude + "&lon=" + longitude + "&appid=a0290a3291b38896066eaae36dc53ecf";

    fetch(requestUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data)
    //     console.log(typeof data.main.temp);
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
      }
)}
//   )};


