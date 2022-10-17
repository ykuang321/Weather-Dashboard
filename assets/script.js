var APIKey = "696848c9db1258d1705e81c72e126567";
var city = "";
var latitude;
var longitude;
var j = 0;
const userCityInput = document.querySelector("#city-input");


const currentWeather = 
  { 
    city: "",
    date: "",
    icon: "",
    temperature: "",
    wind: "",
    humidity: "",
  };

const weatherForecast = [
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


//API call by city name
//https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
//https://api.openweathermap.org/data/2.5/weather?q={city name},{country code}&appid={API key}
//https://api.openweathermap.org/data/2.5/weather?q={city name},{state code},{country code}&appid={API key}

//https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}


//create query URL for the city's latitude and longitude



function getCityInput (event){
  event.preventDefault();
  city = userCityInput.value.trim();

  console.log(city);

  firstQuery();

  //clear data
  userCityInput.value = "";
}


//event listener for search button
document.getElementById("search-btn").addEventListener("click",getCityInput);


//first query function
function firstQuery(){

  //build first query URL
  var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey + "&units=imperial";

  fetch(queryURL)
    .then(function (response){
      return response.json();
    })
    .then(function(data){
      latitude = data.coord.lat;
      longitude = data.coord.lon;
 
      //get data from server    
      currentWeather.city = data.name;
      currentWeather.date = moment.unix(data.dt).format('L');
      currentWeather.icon = data.weather[0].icon;
      currentWeather.temperature = data.main.temp;
      currentWeather.wind = data.wind.speed;
      currentWeather.humidity = data.main.humidity;
    
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
  currentHeader.innerText = currentWeather.city + " " + currentWeather.date + " " + currentWeather.icon;
  document.getElementById("currentHeader").appendChild(currentHeader);

  //build temperature
  const currentTemp = document.createElement("li");
  currentTemp.innerText = currentWeather.temperature + " \xBAF"
  document.getElementById("currentBody").appendChild(currentTemp);

  //build wind
  const currentWind = document.createElement("li");
  currentWind.innerText = currentWeather.wind + " MPH"
  document.getElementById("currentBody").appendChild(currentWind);

  //build humidity
  const currentHumidity = document.createElement("li");
  currentHumidity.innerText = currentWeather.wind + " %"
  document.getElementById("currentBody").appendChild(currentHumidity);
}



//second query function
function secondQueURL(){

  //build second query URL
  var secondQueURL = "https://api.openweathermap.org/data/2.5/forecast?lat="+ latitude + "&lon=" + longitude + "&list=5&appid=" + APIKey + "&units=imperial";

  fetch(secondQueURL)
  .then(function (response){
    return response.json();
  })
  .then(function(data){
    console.log(data);
    
    for (var i = 0; i < weatherForecast.length;i++){
      j = i * 8;
      weatherForecast[i].city = data.city.name;
      weatherForecast[i].date = moment.unix(data.list[j].dt).format('L');
      weatherForecast[i].icon = data.list[j].weather[0].icon;
      weatherForecast[i].temperature = data.list[j].main.temp;
      weatherForecast[i].wind = data.list[j].wind.speed;
      weatherForecast[i].humidity = data.list[j].main.humidity;
      /*
      console.log(weatherForecast[i].city);
      console.log(weatherForecast[i].date);
      console.log(weatherForecast[i].icon);
      console.log(weatherForecast[i].temperature);
      console.log(weatherForecast[i].wind);
      console.log(weatherForecast[i].humidity);
      */
    }
    //build five days weather forecast
    buildWeatherForecast();
  })
    
    
}





function buildWeatherForecast(){

  for (var i = 0; i<weatherForecast.length;i++){

    var idString ="";
    idString = 0;

    //build date
    var futureHeader = document.createElement("h3");
    futureHeader.innerText = weatherForecast[i].date;
    document.getElementById(idString).appendChild(futureHeader);

    //build temperature
    var futureTemp = document.createElement("li");
    futureTemp.innerText = weatherForecast[i].temperature + " \xBAF"
    document.getElementById(idString).appendChild(futureTemp);

    //build wind
    var futureWind = document.createElement("li");
    futureWind.innerText = weatherForecast[i].wind + " MPH"
    document.getElementById(idString).appendChild(futureWind);

    //build humidity
    var futureHumidity = document.createElement("li");
    futureHumidity.innerText = weatherForecast[i].wind + " %"
    document.getElementById("currentBody").appendChild(futureHumidity);
    
  }


/*


  //build temperature
  const currentTemp = document.createElement("li");
  currentTemp.innerText = currentWeather.temperature + " \xBAF"
  document.getElementById("currentBody").appendChild(currentTemp);

  //build wind
  const currentWind = document.createElement("li");
  currentWind.innerText = currentWeather.wind + " MPH"
  document.getElementById("currentBody").appendChild(currentWind);

  //build humidity
  const currentHumidity = document.createElement("li");
  currentHumidity.innerText = currentWeather.wind + " %"
  document.getElementById("currentBody").appendChild(currentHumidity);

*/


}





/*
    function getData(){

      for (var j = 0; j < 40; j = j+7){
        
      
      weatherForecast[i].city = data.city.name;
      weatherForecast[i].date = data.list[j].dt_txt;
      weatherForecast[i].icon = data.list[j].weather[0].icon;
      weatherForecast[i].temperature = data.list[j].main.temp;
      weatherForecast[i].wind = data.list[j].wind.speed;
      weatherForecast[i].humidity = data.list[j].main.humidity

      console.log(weatherForecast[i].city);
      console.log(weatherForecast[i].date);
      console.log(weatherForecast[i].icon);
      console.log(weatherForecast[i].temperature);
      console.log(weatherForecast[i].wind);
      console.log(weatherForecast[i].humidity);
      return

      }
    }
*/