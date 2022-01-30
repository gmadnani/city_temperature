var apiKey = "65da9ed0c529916b820f587d6cd489b7";
var searchHistoryList = [];

function currentWeather(city) {

    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

    $.ajax({ url: queryURL, method: "GET"})
    .then( function(cityWeatherResponse) {
        
        $("#weatherContent").css("display", "block");
        $("#cityDetail").empty();
        
        var linkIcon = `https://openweathermap.org/img/w/${cityWeatherResponse.weather[0].icon}.png`;
        var currentCity = $(`
            <h2 id="currentCity">
                ${cityWeatherResponse.name} ${moment().format('L')} <img src="${linkIcon}" />
            </h2>
            <p>Temperature: ${cityWeatherResponse.main.temp} °F</p>
            <p>Wind Speed: ${cityWeatherResponse.wind.speed} MPH</p>
            <p>Humidity: ${cityWeatherResponse.main.humidity} %</p>
            
        `);

        $("#cityDetail").append(currentCity);

        var latitude = cityWeatherResponse.coord.lat;
        var longitude = cityWeatherResponse.coord.lon;
        var uviQueryURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

        $.ajax({url: uviQueryURL, method: "GET"})
        .then( function(uviResponse) {

            var uv = $(`
                <p>UV Index: 
                    <span id="uvIndexColor" class="px-2 py-2 rounded">${uviResponse.value}</span>
                </p>
            `);

            $("#cityDetail").append(uv);

            if (uviResponse.value >= 0 && uviResponse.value <= 2.99) {
                $("#uvIndexColor").css("background-color", "#3EA72D").css("color", "white");
            } else if (uviResponse.value >= 3 && uviResponse.value <= 5) {
                $("#uvIndexColor").css("background-color", "#FFF300")
            } else{
                $("#uvIndexColor").css("background-color", "#E53210").css("color", "white");
            }
        });
         futureWeather(latitude, longitude);
    });
}

function futureWeather(latitude, longitude){
    var latlonURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=imperial&exclude=current,minutely,hourly,alerts&appid=${apiKey}`;
    $.ajax({url: latlonURL, method: "GET"})
    .then(function(citydetails){
        $("#fiveDay").empty();
        for (let i = 1; i < 6; i++) {
            var city = {
                date: citydetails.daily[i].dt,
                icon: citydetails.daily[i].weather[0].icon,
                temp: citydetails.daily[i].temp.day,
                wind: citydetails.daily[i].wind_speed,
                humidity: citydetails.daily[i].humidity
            };

            
            var linkIcon = `<img src="https://openweathermap.org/img/w/${city.icon}.png"`;

            var predictionBlocks = $(`
                <div class="pl-3">
                    <div class="card pl-3 pt-3 mb-3 text-light" style="width: 12rem;>
                        <div class="card-body">
                            <h5>${moment.unix(city.date).format("L")}</h5>
                            <p>${linkIcon}</p>
                            <p>Temp: ${city.temp} °F</p>
                            <p>Wind: ${city.wind} MPH</p>
                            <p>Humidity: ${city.humidity} %</p>
                        </div>
                    </div>
                <div>
            `);

            $("#fiveDay").append(predictionBlocks);
        }
    });
}

$("#searchBtn").on("click", function() {
    var city = $("#enterCity").val();
    currentWeather(city);
    if (!searchHistoryList.includes(city)) {
        searchHistoryList.push(city);
        var searchedCity = $(
            `<li class="list-group-item">${city}</li>`
            );
        $("#searchHistory").append(searchedCity);
    };
    localStorage.setItem("city", JSON.stringify(searchHistoryList));
});

$(document).on("click", ".list-group-item", function() {
    var listCity = $(this).text();
    currentWeather(listCity);
});