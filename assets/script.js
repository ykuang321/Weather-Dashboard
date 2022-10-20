var APIKey = "696848c9db1258d1705e81c72e126567";
var city = "";
var latitude;
var longitude;
var j = 0;
const userCityInput = document.querySelector("#city-input");

const weatherForecast = [
  //current day
  { 
    city: "",
    date: "",
    icon: "",
    temperature: "",
    wind: "",
    humidity: "",
  },
  //day 1
  { 
    city: "",
    date: "",
    icon: "",
    temperature: "",
    wind: "",
    humidity: "",
  },
//day 2
  { 
    city: "",
    date: "",
    icon: "",
    temperature: "",
    wind: "",
    humidity: "",
  },
//day 3
  { 
    city: "",
    date: "",
    icon: "",
    temperature: "",
    wind: "",
    humidity: "",
  },
//day 4
  { 
    city: "",
    date: "",
    icon: "",
    temperature: "",
    wind: "",
    humidity: "",
  },
//day 5
  { 
    city: "",
    date: "",
    icon: "",
    temperature: "",
    wind: "",
    humidity: "",
  },
];

//get user input for city name
function getCityInput (event){
  event.preventDefault();

  city = userCityInput.value.trim();  
  
  clearData();
  firstQuery();

  //clear data
  userCityInput.value = "";
}

//clear data before
function clearData(){


}


//first query function
function firstQuery(){

  //build first query URL with imperial unit
  var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey + "&units=imperial";

  fetch(queryURL,{
    cache: 'reload'
  })
    .then(function (response,){
      return response.json();
    })
    .then(function(data){
      latitude = data.coord.lat;
      longitude = data.coord.lon;
 
      //get data from server    
      weatherForecast[0].city = data.name;
      weatherForecast[0].date = moment.unix(data.dt).format('L');
      weatherForecast[0].icon = data.weather[0].icon;
      weatherForecast[0].temperature = data.main.temp;
      weatherForecast[0].wind = data.wind.speed;
      weatherForecast[0].humidity = data.main.humidity;
    
      //build current weather function
      buildCurrentWeather();

      //second query for weather forecast
      secondQueURL();

    })   
}

//function to build current weather 
function buildCurrentWeather(){

  //build header
  const currentHeader = document.createElement("h2");
  currentHeader.innerText = weatherForecast[0].city + " " + weatherForecast[0].date + " " + weatherForecast[0].icon;
  document.getElementById("currentHeader").appendChild(currentHeader);

  //build temperature
  const currentTemp = document.createElement("li");
  currentTemp.innerText = weatherForecast[0].temperature + " \xBAF"
  document.getElementById("currentBody").appendChild(currentTemp);

  //build wind
  const currentWind = document.createElement("li");
  currentWind.innerText = weatherForecast[0].wind + " MPH"
  document.getElementById("currentBody").appendChild(currentWind);

  //build humidity
  const currentHumidity = document.createElement("li");
  currentHumidity.innerText = weatherForecast[0].wind + " %"
  document.getElementById("currentBody").appendChild(currentHumidity);
}

//second query function
function secondQueURL(){

  //build second query URL with imperial unit
  var secondQueURL = "https://api.openweathermap.org/data/2.5/forecast?lat="+ latitude + "&lon=" + longitude + "&list=5&appid=" + APIKey + "&units=imperial";

  fetch(secondQueURL)
  .then(function (response){
    console.log(response);
    return response.json();
   
  })
  .then(function(data){
    console.log(data);
    
    for (var i = 1; i < weatherForecast.length;i++){
      j = i * 7 + 1;
      weatherForecast[i].city = data.city.name;
      weatherForecast[i].date = moment.unix(data.list[j].dt).format('L');
      weatherForecast[i].icon = data.list[j].weather[0].icon;
      weatherForecast[i].temperature = data.list[j].main.temp;
      weatherForecast[i].wind = data.list[j].wind.speed;
      weatherForecast[i].humidity = data.list[j].main.humidity;
      
    }
    //build five days weather forecast
    buildWeatherForecast();
  })
    
}

function buildWeatherForecast(){

  for (var i = 1; i<weatherForecast.length;i++){
    
    var idString = 1;

    //build date
    var futureHeader = document.createElement("h3");
    futureHeader.innerText = weatherForecast[i].date;
    document.getElementById(idString).append(futureHeader);

    //build temperature
    var futureTemp = document.createElement("li");
    futureTemp.innerText = weatherForecast[i].temperature + " \xBAF"
    document.getElementById(idString).append(futureTemp);

    //build wind
    var futureWind = document.createElement("li");
    futureWind.innerText = weatherForecast[i].wind + " MPH"
    document.getElementById(idString).append(futureWind);

    //build humidity
    var futureHumidity = document.createElement("li");
    futureHumidity.innerText = weatherForecast[i].wind + " %"
    document.getElementById(idString).append(futureHumidity);
    
  }

  //store weather data in local server with city's name
  storeWeatherData();
  createSearchHistory();
}


function storeWeatherData(){

  //convert object to array and save to local storage
  const weatherData = JSON.stringify(weatherForecast);
  localStorage.setItem(city,weatherData)

}

function createSearchHistory(){

  //create button for history

}

//event listener for search button
document.getElementById("search-btn").addEventListener("click",getCityInput);
