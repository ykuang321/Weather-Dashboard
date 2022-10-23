var APIKey = "696848c9db1258d1705e81c72e126567";
var redirectUrl = './404.html';
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
var cityName ="";
var weatherIndex = 0;

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


searchHistory();

//get user input for city name
function getCityInput (event){
  event.preventDefault();

  city = userCityInput.value.trim();  
  
  //clearData();
  firstQuery();

  //clear data
  userCityInput.value = "";
}

//first query function
function firstQuery(){

  //build first query URL with imperial unit
  var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey + "&units=imperial";

  //clear string before receiving new data
  tempArray = [];
  finalArray = [];
  cityName = "";

  fetch(queryURL)
    //
    .then(function (response){
      if (response.status !== 200) {
        document.location.replace (redirectUrl)
      }
      return response.json();
    })

    .then(function(data){

      //get latitude and longitude for second query
      latitude = data.coord.lat;
      longitude = data.coord.lon;
 
      //get data from server
      cityName = data.name; //To have consistent format between lower and upper case, get the city name from server
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
    for (var i = 0; i<5; i++){  
    weatherIndex = i*8 + 4;  
    weatherForecast.date = moment.unix(data.list[weatherIndex].dt).format('L');
    weatherForecast.icon = data.list[weatherIndex].weather[0].icon;
    weatherForecast.temperature = data.list[weatherIndex].main.temp;
    weatherForecast.wind = data.list[weatherIndex].wind.speed;
    weatherForecast.humidity = data.list[weatherIndex].main.humidity;

    tempArray = Object.values(weatherForecast);
    finalArray = finalArray.concat(tempArray);
    }
    
    //Convert a javaScript object into a string with JSON.stringify() and save to local storage
    localStorage.setItem(cityName, JSON.stringify(finalArray));
  })


  //short delay to endure data is ready to process
  setTimeout(displayWeather, 500)
}


function displayWeather(){

  currentWeatherContainerEl.innerHTML ="";
  weatherForecastContainerEl.innerHTML ="";
  
  //get data from local storage
  displayArray = JSON.parse(localStorage.getItem(cityName));
  console.log(displayArray.length);

  for (var i = 0; i < displayArray.length; i= i+5){

    displayWeatherForecast.date = displayArray[i]
    displayWeatherForecast.icon = displayArray[i+1]
    displayWeatherForecast.temperature = displayArray[i+2]
    displayWeatherForecast.wind = displayArray[i+3]
    displayWeatherForecast.humidity = displayArray[i+4]
      
    //build current weather
    if (i<5){

      var headerEl = document.createElement("h2");
      headerEl.innerText = cityName + " " + displayWeatherForecast.date;

      var iconEl = document.createElement("img");
      iconEl.src = "http://openweathermap.org/img/wn/" + displayWeatherForecast.icon +"@2x.png";
      headerEl.appendChild(iconEl);    

      var listEl = document.createElement('div');
      listEl.classList = 'flex-row justify-space-between align-center';
  
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
      headerEl.innerText = displayWeatherForecast.date;

      var iconEl = document.createElement("img");
      iconEl.src = "http://openweathermap.org/img/wn/" + displayWeatherForecast.icon +"@2x.png";
      headerEl.appendChild(iconEl);    

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

  searchHistory();

}

function searchHistory(){

  searchHistoryEl.innerHTML ="";

  if (localStorage.length>0){
    for (var i=0; i<localStorage.length; i++){
      searchEl = document.createElement("button");
      searchEl.textContent = localStorage.key(i);
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



function getHistoryInput(event){
  cityName = event.target.getAttribute('data-city');
  displayWeather();
}

function clearHistory(){
  var historyCount = localStorage.length
  for (var i=0;i<=historyCount;i++){
    var keyName = localStorage.key(0);
    localStorage.removeItem(keyName);  
  }
  searchHistory();
  displayWeather();
  }


//event listener for search button
document.getElementById("search-btn").addEventListener("click",getCityInput);
document.getElementById("clear-btn").addEventListener("click",clearHistory);
searchHistoryEl.addEventListener("click",getHistoryInput);




