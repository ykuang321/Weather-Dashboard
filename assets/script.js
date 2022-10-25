var APIKey = "696848c9db1258d1705e81c72e126567";
var redirectUrl = './404.html';
var city = "";
var latitude;
var longitude;
var tempArray = [];
var finalArray = [];
var displayArray = [];
var userCityInputForm = document.querySelector("#city-input-form")
var userCityInput = document.querySelector("#city-input");
var currentWeatherContainerEl = document.querySelector('#current-weather-container');
var weatherForecastHeaderEl = document.querySelector('#weather-forecast-header');
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

//build search history
function searchHistory(){

  //clear data
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

//get user input for city name
function getCityInput (event){
  event.preventDefault();

  city = userCityInput.value.trim();  
  
  firstQuery();

  userCityInput.value = "";
}

//first query function
function firstQuery(){

  //build first query URL with imperial unit
  var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey + "&units=imperial";

  //clear data before receiving new data
  tempArray = [];
  finalArray = [];
  cityName = "";

  fetch(queryURL)
    //display 404 page if input city not found
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
      cityName = data.name; //To have consistent format between lower and upper case, use the city name from server
      weatherForecast.date = moment.unix(data.dt).format('L');
      weatherForecast.icon = data.weather[0].icon;
      weatherForecast.temperature = data.main.temp;
      weatherForecast.wind = data.wind.speed;
      weatherForecast.humidity = data.main.humidity;

      //create a string to local storage
      tempArray = Object.values(weatherForecast);
      finalArray = finalArray.concat(tempArray);

      //second query for weather forecast
      secondQueURL();
    })   
}

//second query function
function secondQueURL(){

  //build second query URL with imperial unit
  var secondQueURL = "https://api.openweathermap.org/data/2.5/forecast?lat="+ latitude + "&lon=" + longitude + "&appid=" + APIKey + "&units=imperial";

  fetch(secondQueURL)
    .then(function (response){
      return response.json();
  })
    .then(function(data){    
    //for loop to filter the data
    for (var i = 0; i<5; i++){  
    weatherIndex = i*8 + 4;  
    weatherForecast.date = moment.unix(data.list[weatherIndex].dt).format('L');
    weatherForecast.icon = data.list[weatherIndex].weather[0].icon;
    weatherForecast.temperature = data.list[weatherIndex].main.temp;
    weatherForecast.wind = data.list[weatherIndex].wind.speed;
    weatherForecast.humidity = data.list[weatherIndex].main.humidity;

    //create a string to local storage
    tempArray = Object.values(weatherForecast);
    finalArray = finalArray.concat(tempArray);
    }
    console.log(finalArray);
    //Convert a javaScript object into a string with JSON.stringify() and save to local storage
    localStorage.setItem(cityName, JSON.stringify(finalArray));
    displayWeather();
  })
}

//display current weather and 5-days weather forecast
function displayWeather(){

  currentWeatherContainerEl.innerHTML ="";
  weatherForecastContainerEl.innerHTML ="";

  if (localStorage.length>0){
  //get data from local storage
  displayArray =[];
  displayArray = JSON.parse(localStorage.getItem(cityName));

  //for loop to create elements in html
  for (var i = 0; i < displayArray.length; i= i+5){

    displayWeatherForecast.date = displayArray[i]
    displayWeatherForecast.icon = displayArray[i+1]
    displayWeatherForecast.temperature = displayArray[i+2]
    displayWeatherForecast.wind = displayArray[i+3]
    displayWeatherForecast.humidity = displayArray[i+4]
      
    //build current weather
    if (i<5){
      //build header
      headerEl = document.createElement("h2");
      headerEl.innerText = cityName + " " + displayWeatherForecast.date + " ";
      headerEl.classList = "mx-2";
      currentWeatherContainerEl.appendChild(headerEl);  

      //build icon
      var iconEl = document.createElement("img");
      iconEl.src = "http://openweathermap.org/img/wn/" + displayWeatherForecast.icon +"@2x.png";
      iconEl.style = "width:60px";
      currentWeatherContainerEl.appendChild(iconEl);    

      //build temperature
      var temperatureEl = document.createElement('p');
      temperatureEl.innerHTML ="Temp: " + displayWeatherForecast.temperature + " \xBAF"
      temperatureEl.classList = "mx-2";
      currentWeatherContainerEl.appendChild(temperatureEl);
  
      //build wind
      var windEl = document.createElement("p");
      windEl.innerHTML  = "Wind: " + displayWeatherForecast.wind + " MPH"
      windEl.classList = "mx-2";
      currentWeatherContainerEl.appendChild(windEl);
  
      //build humidity
      var humidityEl= document.createElement("p");
      humidityEl.innerHTML ="Humidity: " + displayWeatherForecast.humidity + " %"
      humidityEl.classList = "mx-2";
      currentWeatherContainerEl.appendChild(humidityEl);
      currentWeatherContainerEl.classList = "border border-dark bg-white text-dark";
    }
    
    //build 5 days weather forecast
    else {

      var eachDayEl = document.createElement("div");
      eachDayEl.classList = "border border-dark bg-light text-dark"
      eachDayEl.style ="width:15%";

      headerEl = document.createElement("h3");
      headerEl.innerText = displayWeatherForecast.date;
      headerEl.classList = 'mx-2';
      eachDayEl.appendChild(headerEl)

      var listEl = document.createElement('div');
      listEl.classList = 'mx-2';
  
      //build icon
      var iconEl = document.createElement("img");
      iconEl.src = "http://openweathermap.org/img/wn/" + displayWeatherForecast.icon +"@2x.png";
      iconEl.style = "width:50px";
      listEl.appendChild(iconEl);

      //build temperature
      var temperatureEl = document.createElement('p');
      temperatureEl.classList = 'flex-row align-center';
      temperatureEl.innerHTML = "Temp: " +  displayWeatherForecast.temperature + " \xBAF"
      listEl.appendChild(temperatureEl);
  
      //build wind
      var windEl = document.createElement("p");
      windEl.classList = 'flex-row align-center';
      windEl.innerHTML  = "Wind: " + displayWeatherForecast.wind + " MPH"
      listEl.appendChild(windEl);
  
      //build humidity
      var humidityEl= document.createElement("p");
      humidityEl.innerHTML = "Humidity: " + displayWeatherForecast.humidity + " %"
      listEl.appendChild(humidityEl);
        
      eachDayEl.appendChild(listEl);
      weatherForecastContainerEl.appendChild(eachDayEl);
    }
  }

  var textEl = document.createElement("h2");
  textEl.innerText = "5-Day Forecast:";
  weatherForecastHeaderEl.appendChild(textEl);  
}
  searchHistory();
}

//call search history function when page loads  
searchHistory();

function getHistoryInput(event){
  cityName = event.target.getAttribute('data-city');
  displayWeather();

}

//clear search history
function clearHistory(){

  var historyCount = localStorage.length
  for (var i=0;i<=historyCount;i++){
    var keyName = localStorage.key(0);
    localStorage.removeItem(keyName);  
  }
  currentWeatherContainerEl.remove();
  weatherForecastContainerEl.remove();
  searchHistory();
}

//event listeners
document.getElementById("search-btn").addEventListener("click",getCityInput);
document.getElementById("clear-btn").addEventListener("click",clearHistory);
searchHistoryEl.addEventListener("click",getHistoryInput);
userCityInputForm.addEventListener("submit",getCityInput);