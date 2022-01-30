var apiKey = "65da9ed0c529916b820f587d6cd489b7";
// var today = moment().format('L');
var searchHistoryList = [];

function currentCondition(city) {

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
        // futureCondition(lat, lon);
    });
}

$("#searchBtn").on("click", function(event) {
    event.preventDefault();

    var city = $("#enterCity").val().trim();
    currentCondition(city);
});