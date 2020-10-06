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
    // generate button of city containing text name of the city

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (city) {
        // create clickable button of city inside of
        // console.log(city);

        // 5Day AND UV Index (seperate call)
        // api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}
        queryURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${city.coord.lat}&lon=${city.coord.lon}&units=imperial&exclude=current,minutely,hourly,alerts&appid=${weatherAPIKey}`;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (cityFore) {
            console.log(cityFore);
            //#region Current Weather
            var iconCode = city.weather[0].icon;
            var altIcon = city.weather[0].description;
            var iconURL = `http://openweathermap.org/img/w/${iconCode}.png`
            // Creates element with auto formating to be displayed inside the jumbotron
            var element = $(`
                    <h1>${city.name + moment().format(" (DD/MM/YY)")}
                    <img src="${iconURL}" alt="${altIcon}"></h1>
                    <p>Temperature: ${city.main.temp}</p>
                    <p>Humidity: ${city.main.humidity} F</p>            
                    <p>Wind Speed: ${city.wind.speed} MPH</p>

                `);
            //#endregion
            // if/else chain dictating span class for coloring based off of index number
            // <span class="badge badge-secondary">
            //#region Current UV
            var uVI = cityFore.daily[0].uvi
            if (uVI < 2) {
                // color green
                // console.log("Color: green");
                var uvScale = $("<span class='badge uv-Low'>");
                // $(".badge").addClass("uv-Low");
            }
            else if (uVI < 5) {
                // color yellow
                // console.log("Color: yellow");
                var uvScale = $("<span class='badge uv-Mod'>");
                // $(".badge").addClass("uv-Mod");
            }
            else if (uVI < 7) {
                // color orange
                // console.log("Color: orange");
                var uvScale = $("<span class='badge badge-warning'>");
                // $(".badge").addClass("badge-warning");
            }
            else if (uVI < 10) {
                // color red
                // console.log("Color: red");
                var uvScale = $("<span class='badge badge-danger'>");
                // $(".badge").addClass("badge-danger");
            }
            else {
                // color purple
                // console.log("Color: purple");
                var uvScale = $("<span class='badge uv-Ext'>");
                // $(".badge").addClass("uv-Ext");
            }
            //#endregion
            // Clears the jumbotron of default elements/text, appends element to it
            $("#mainDisplay").empty();
            $("#mainDisplay").append(element);
            $("#mainDisplay").append($("<p id='uvDisplay'>").text("UV Index: "));
            $("#uvDisplay").append(uvScale.text(uVI));

            // For(?) loop looping through object array of forecast data
            // parse out date/time(?) to only display noon temperatures?
            //#region FiveDay Forecast
            forecastDisplay.empty();
            var curDay = moment().format("YYYY-MM-DD") + " 12:00:00";
            for (var i = 1; i < 6; i++) {
                // Array day/time displayed: YYYY-MM-DD HH:MM:SS (military)
                var targetDay = moment(curDay).add((i), 'd')// + " 12:00:00";
                targetDay = moment(targetDay).format("YYYY-MM-DD");
                // targetDayTime = targetDay + " 12:00:00";
                // // console.log(i + ": " + targetDayTime);
                targetDay = moment(targetDay).format("DD/MM/YYYY")
                iconCode = cityFore.daily[i].weather[0].icon;
                altIcon = cityFore.daily[i].weather[0].description;
                // // console.log(iconCode);
                // var iconURL = `https://openweathermap.org/img/w/${iconCode}.png`;
                iconURL = `http://openweathermap.org/img/w/${iconCode}.png`
                // <img src="${iconURL}">
                var element = $(`
                        <div class="col">
                            <div class="card bg-primary text-white">
                                <div class="card-body">
                                    <h5>${targetDay}</h5>
                                    <img src="${iconURL}" alt="${altIcon}">
                                    <p>Temp: ${cityFore.daily[i].temp.day} F</p>
                                    <p>Humidity: ${cityFore.daily[i].humidity} %</p>
                                </div>
                            </div>
                        </div>                            
                        `);
                // appends element to forecastDisplay
                forecastDisplay.append(element);
            }
            //#endregion
        });
        // });
    });
}

// make button with text of user input
// prepend to cityList div
function cityButton(userCity) {
    var cityBtn = `<button class="btn-block btn btn-primary">${userCity}</button>`;
    cityList.prepend(cityBtn);
}
//#endregion

//#region Event Listeners
$(document).on("click", "button", function () {
    // Grabs user input
    if ($(this).attr("id") == "searchButton") {
        // console.log($(this));
        userCity = $("#searchInput").val();
        cityButton(userCity);
    }
    else {
        // console.log($(this));
        userCity = $(this).text();
    }
    // sets search field to be empty
    $("#searchInput").val("");
    // sets searched city into local storage
    localStorage.setItem("searchedCity", userCity);
    findCity(userCity);
});
$(document).ready(function () {
    // checks to see if there was a previously searched city, if found makes a button and pulls up the info
    // if not found, creates an empty local storage for use later
    userCity = localStorage.getItem("searchedCity", userCity) || "";
    if (userCity != "") {
        cityButton(userCity);
        findCity(userCity);
    }
})
//#endregion