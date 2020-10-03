//#region Variable Declaration
var weatherAPIKey = "4761287cde43332409ca6af258893d4f";
var cityList = $("#cityList");
var forecastDisplay = $("#forecast");
var userCity = "";

//#endregion

//#region Function Definitions
function findCity(city) {
    // api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${weatherAPIKey}`;
    var searchedCity = city;
    // console.log(searchedCity);
    // generate button of city containing text name of the city


    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (city) {
        // create clickable button of city inside of
        // console.log(city);

        // UV Index (seperate call)
        // http://api.openweathermap.org/data/2.5/uvi?lat={lat}&lon={lon}&appid={API key}
        queryURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${city.coord.lat}&lon=${city.coord.lon}&appid=${weatherAPIKey}`;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (cityUV) {
            // console.log("UV Function Ran");
            // console.log(cityUV);

            // 5Day (seperate call)
            // api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}
            queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${searchedCity}&units=imperial&appid=${weatherAPIKey}`;
            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function (cityFore) {
                console.log(cityFore);

                // Creates element with auto formating to be displayed inside the jumbotron
                var element = $(`
                    <h1>${city.name + moment().format(" (DD/MM/YY)")}</h2>
                    <p>Temperature: ${city.main.temp}</p>
                    <p>Humidity: ${city.main.humidity} F</p>            
                    <p>Wind Speed: ${city.wind.speed} MPH</p>
                    <p>UV Index: ${cityUV.value}</p>
                `);
                // Clears the jumbotron of default elements/text, appends element to it
                $("#mainDisplay").empty();
                $("#mainDisplay").append(element);


                // For(?) loop looping through object array of forecast data
                // parse out date/time(?) to only display noon temperatures?
                var curDay = moment().format("YYYY-MM-DD") + " 12:00:00";
                // console.log(curDay);
                forecastDisplay.empty();
                for (var i = 0; i < cityFore.list.length; i++) {
                    // Array day/time displayed: YYYY-MM-DD HH:MM:SS (military)
                    var targetDay = moment(curDay).add((i + 1), 'd')// + " 12:00:00";
                    targetDay = moment(targetDay).format("YYYY-MM-DD");
                    targetDayTime = targetDay + " 12:00:00";
                    // console.log(i + ": " + targetDayTime);

                    // Loops through and finds if the dt_text has NOON
                    if (cityFore.list[i].dt_txt.includes("12:00:00")) {
                        targetDay=moment(targetDay).format("DD/MM/YYYY")
                        var iconCode = cityFore.list[i].weather[0].icon;
                        // // console.log(iconCode);
                        // var iconURL = `https://openweathermap.org/img/w/${iconCode}.png`;
                        var iconURL = `http://openweathermap.org/img/w/${iconCode}@2x.png`
                        // <img src="${iconURL}">
                        var element = $(`
                        <div class="col">
                            <div class="card bg-primary text-white">
                                <div class="card-body">
                                    <h5>${targetDay}</h5>

                                    <p>Temp: ${cityFore.list[i].main.temp} F</p>
                                    <p>Humidity: ${cityFore.list[i].main.humidity} %</p>
                                </div>
                            </div>
                        </div>                            
                        `);
                        // Clears forecast display and appends element to it
                        forecastDisplay.append(element);
                    }
                }
            });
        });
    });
}
//#endregion

//#region Event Listeners
$(document).on("click", "button", function () {
    // Grabs user input
    if ($(this).attr("id") == "searchButton") {
        // console.log($(this));
        userCity = $("#searchInput").val();
        var cityBtn = `<button class="btn-block btn btn-primary">${userCity}</button>`;
        cityList.prepend(cityBtn);
    }
    else {
        // console.log($(this));
        userCity = $(this).text();
    }
    // make button with text of user input
    // prepend to cityList div
    findCity(userCity);
});
//#endregion