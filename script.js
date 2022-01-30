//apikey from the website
var apiKey = "65da9ed0c529916b820f587d6cd489b7";

//function for displaying the current weather of the city
function currentWeather(city) {
  //URL
  var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

  //using ajax to get the data from the website
  $.ajax({ url: queryURL, method: "GET" }).then(function (cityWeatherResponse) {
    $("#weatherContent").css("display", "block");
    $("#cityDetail").empty();

    //icon for the weather condition
    var linkIcon = `https://openweathermap.org/img/w/${cityWeatherResponse.weather[0].icon}.png`;

    //displaying the name, date, icon, temperature, wind and humidity
    var currentCity = $(`
            <h2 id="currentCity">
                ${cityWeatherResponse.name} ${moment().format("L")} 
                <img src="${linkIcon}" />
            </h2>
            <p>Temperature: ${cityWeatherResponse.main.temp} °F</p>
            <p>Wind: ${cityWeatherResponse.wind.speed} MPH</p>
            <p>Humidity: ${cityWeatherResponse.main.humidity} %</p>
            
        `);

    //adding it to the html using append
    $("#cityDetail").append(currentCity);

    //coordinates for latitude and longitude
    var latitude = cityWeatherResponse.coord.lat;
    var longitude = cityWeatherResponse.coord.lon;

    //using the coordinates to get the UV Index
    var uviQueryURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

    //using ajax to get the data from the website
    $.ajax({ url: uviQueryURL, method: "GET" }).then(function (uviResponse) {
      var uv = $(`
                <p>UV Index: 
                    <span id="uvIndexColor" class="px-2 py-2 rounded">${uviResponse.value}</span>
                </p>
            `);

      //adding it to the html
      $("#cityDetail").append(uv);

      //changing the background color based on the weather conditions: favorable(green), moderate(yellow), severe(red)
      if (uviResponse.value >= 0 && uviResponse.value <= 2.99) {
        $("#uvIndexColor")
          .css("background-color", "#3EA72D")
          .css("color", "white");
      } else if (uviResponse.value >= 3 && uviResponse.value <= 5) {
        $("#uvIndexColor").css("background-color", "#8b8b22");
      } else {
        $("#uvIndexColor")
          .css("background-color", "#E53210")
          .css("color", "white");
      }
    });

    //calling the function using latitude and longitude as its parameters
    DayForcast(latitude, longitude);
  });
}

//function for displaying the next 5 days for-cast
function DayForcast(latitude, longitude) {
  //URL for the city details using latitude and longitude
  var latlonURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=imperial&exclude=current,minutely,hourly,alerts&appid=${apiKey}`;

  //using ajax to get the data from the website
  $.ajax({ url: latlonURL, method: "GET" }).then(function (citydetails) {
    $("#fiveDay").empty();

    //loop for the daily data of the city, loop starts from 1 because 0 is current day's weather details
    for (let i = 1; i <= 5; i++) {
      //fetching the date, icon, temperature, wind and humidity
      var city = {
        date: citydetails.daily[i].dt,
        icon: citydetails.daily[i].weather[0].icon,
        temp: citydetails.daily[i].temp.day,
        wind: citydetails.daily[i].wind_speed,
        humidity: citydetails.daily[i].humidity,
      };

      //displaying the date, icon, temperature, wind and humidity
      var predictionBlocks = $(`
                <div class="pl-3">
                    <div class="card pl-3 pt-3 mb-3 text-light" style="width: 12rem;>
                        <div class="card-body">
                            <h5>${moment.unix(city.date).format("L")}</h5>
                            <p><img src="https://openweathermap.org/img/w/${
                              city.icon
                            }.png"</p>
                            <p>Temp: ${city.temp} °F</p>
                            <p>Wind: ${city.wind} MPH</p>
                            <p>Humidity: ${city.humidity} %</p>
                        </div>
                    </div>
                <div>
            `);

      //adding it to the html
      $("#fiveDay").append(predictionBlocks);
    }
  });
}

//list of search history
var searchHistoryList = [];

//on click function to get the searched city's weather
$("#searchBtn").on("click", function () {
  var city = $("#enterCity").val();
  currentWeather(city);

  //if city is already it the list no need to add
  if (!searchHistoryList.includes(city)) {
    //adding to the list if not there
    searchHistoryList.push(city);
    var searchedCity = $(`<li class="list-group-item">${city}</li>`);

    //adding it to the html
    $("#searchHistory").append(searchedCity);
  }

  //storing the city name in the local storage
  localStorage.setItem("city", JSON.stringify(searchHistoryList));
});

//on click function to display the city's weather which are in the search history
$(document).on("click", ".list-group-item", function () {
  var listCity = $(this).text();
  currentWeather(listCity);
});
