var APIKey = "696848c9db1258d1705e81c72e126567";
var city = "";
var latitude;
var longitude;
var tempArray = [];
var finalArray = [];
var displayArray =[];
var userCityInput = document.querySelector('#city-input');
var currentWeatherContainerEl = document.querySelector('#current-weather-container');
var weatherForecastContainerEl = document.querySelector('#weather-forecast');
var searchHistoryEl = document.querySelector('#search-history');
var historyEl = document.querySelector('.history');


var weatherForecast = 
{ 
  date: "",
  icon: "",
  temperature: "",
  wind: "",
  humidity: "",
}

var displayWeatherForecast = 
{ 
  date: "",
  icon: "",
  temperature: "",
  wind: "",
  humidity: "",
} 

//get user input for city name
function getCityInput (event){
  event.preventDefault();

  city = userCityInput.value.trim();  
  
  //clearData();
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

  tempArray = [];
  finalArray = [];

  fetch(queryURL)
    .then(function (response,){
      return response.json();
    })
    .then(function(data){
      
      //get latitude and longitude for second query
      latitude = data.coord.lat;
      longitude = data.coord.lon;
 
      //get data from server    
      weatherForecast.date = moment.unix(data.dt).format('L');
      weatherForecast.icon = data.weather[0].icon;
      weatherForecast.temperature = data.main.temp;
      weatherForecast.wind = data.wind.speed;
      weatherForecast.humidity = data.main.humidity;

      //Convert a javaScript object into a string with JSON.stringify() and save to local storage
      tempArray = Object.values(weatherForecast);
      finalArray = finalArray.concat(tempArray);

      //second query for weather forecast
      secondQueURL();

    })   
}

function secondQueURL(){
  tempArray = [];
  finalArray = [];
  //build second query URL with imperial unit
  var secondQueURL = "https://api.openweathermap.org/data/2.5/forecast?lat="+ latitude + "&lon=" + longitude + "&appid=" + APIKey + "&units=imperial";

  fetch(secondQueURL)
    .then(function (response){
      return response.json();
  })
  .then(function(data){
    
    console.log(data);
    console.log(data.list.length);
    //for loop to filter the data
    for (var i = 0; i < data.list.length; i= i+8){
    weatherForecast.date = moment.unix(data.list[i].dt).format('L');
    weatherForecast.icon = data.list[i].weather[0].icon;
    weatherForecast.temperature = data.list[i].main.temp;
    weatherForecast.wind = data.list[i].wind.speed;
    weatherForecast.humidity = data.list[i].main.humidity;
    tempArray = Object.values(weatherForecast);
    finalArray = finalArray.concat(tempArray);
    console.log(i);
    }
    
    //Convert a javaScript object into a string with JSON.stringify() and save to local storage
    localStorage.setItem(city, JSON.stringify(finalArray));

  })

  searchHistory();
  //short delay to endure data is ready to process
  setTimeout(displayWeather, 500)
  //displayWeather();


}


function displayWeather(){

  currentWeatherContainerEl.innerHTML ="";
  weatherForecastContainerEl.innerHTML ="";
  
  //get data from local storage
  displayArray = JSON.parse(localStorage.getItem(city));

  for (var i = 0; i < displayArray.length; i= i+5){
    //weatherForecast.city = data.city.name;
    displayWeatherForecast.date = displayArray[i]
    displayWeatherForecast.icon = displayArray[i+1]
    displayWeatherForecast.temperature = displayArray[i+2]
    displayWeatherForecast.wind = displayArray[i+3]
    displayWeatherForecast.humidity = displayArray[i+4]
      
    //build current weather
    if (i<5){
      var headerEl = document.createElement("h2");
      headerEl.innerText = city + " " + displayWeatherForecast.date + " " + displayWeatherForecast.icon;

      var listEl = document.createElement('div');
      listEl.classList = 'list-item flex-row justify-space-between align-center';
  
      //build temperature
      var temperatureEl = document.createElement('li');
      temperatureEl.classList = 'flex-row align-center';
      temperatureEl.innerHTML = displayWeatherForecast.temperature + " \xBAF"
      listEl.appendChild(temperatureEl);
  
      //build wind
      var windEl = document.createElement("li");
      windEl.classList = 'flex-row align-center';
      windEl.innerHTML  = displayWeatherForecast.wind + " MPH"
      listEl.appendChild(windEl);
  
      //build humidity
      var humidityEl= document.createElement("li");
      humidityEl.innerHTML  = displayWeatherForecast.humidity + " %"
      listEl.appendChild(humidityEl);
        
      headerEl.appendChild(listEl);
      currentWeatherContainerEl.appendChild(headerEl);
    }
    
    //build 5 days weather forecast
    else {
      var headerEl = document.createElement("h3");
      headerEl.innerText = displayWeatherForecast.date + displayWeatherForecast.icon;

      var listEl = document.createElement('div');
      listEl.classList = 'list-item flex-row justify-space-between align-center';
  
      //build temperature
      var temperatureEl = document.createElement('li');
      temperatureEl.classList = 'flex-row align-center';
      temperatureEl.innerHTML = displayWeatherForecast.temperature + " \xBAF"
      listEl.appendChild(temperatureEl);
  
      //build wind
      var windEl = document.createElement("li");
      windEl.classList = 'flex-row align-center';
      windEl.innerHTML  = displayWeatherForecast.wind + " MPH"
      listEl.appendChild(windEl);
  
      //build humidity
      var humidityEl= document.createElement("li");
      humidityEl.innerHTML  = displayWeatherForecast.humidity + " %"
      listEl.appendChild(humidityEl);
        
      headerEl.appendChild(listEl);
      weatherForecastContainerEl.appendChild(headerEl);
    }
       
  }



}

function searchHistory(){

  var searchEl ="";

  if (localStorage.length>0){
    for (var i=0; i<localStorage.length; i++){
      searchEl = document.createElement("button");
      searchEl.innerText = localStorage.key(i);
      searchEl.classList = 'history btn btn-secondary flex-row justify-space-between align-center my-2 data-city';
      searchEl.style = 'width:250px';
      searchEl.setAttribute("data-city",localStorage.key(i))
      searchHistoryEl.appendChild(searchEl);
    }
  } 
  else{
    return;
  }

}

searchHistory();

function getHistoryInput(event){
  city = event.target.getAttribute('data-city');
  displayWeather();
}

//event listener for search button
document.getElementById("search-btn").addEventListener("click",getCityInput);
searchHistoryEl.addEventListener("click",getHistoryInput);




