var apiKey = "65da9ed0c529916b820f587d6cd489b7";
var today = moment().format('L');
var searchHistoryList = [];

function currentCondition(city) {

    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(cityWeatherResponse) {
        
        $("#weatherContent").css("display", "block");
        $("#cityDetail").empty();
        
        var iconCode = cityWeatherResponse.weather[0].icon;

        console.log(iconCode)
        var iconURL = `https://openweathermap.org/img/w/${iconCode}.png`;
        var currentCity = $(`
            <h2 id="currentCity">
                ${cityWeatherResponse.name} ${today} <img src="${iconURL}" alt="${cityWeatherResponse.weather[0].description}" />
            </h2>
        `);

        $("#cityDetail").append(currentCity);

        var lat = cityWeatherResponse.coord.lat;
        var lon = cityWeatherResponse.coord.lon;
        var uviQueryURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`;

        console.log(uviQueryURL)
    });
}


$("#searchBtn").on("click", function(event) {
    event.preventDefault();

    var city = $("#enterCity").val().trim();
    currentCondition(city);
});
