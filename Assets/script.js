var cities = [];

var city;

var queryURL;

// localStorage.clear();

init();

$(".btn").click(function (event) {
    event.preventDefault();
    clearContent();
    city = $("input").val().toLowerCase();
    renderWeather();
    if (city !== "" && !cities.includes(city)) {
        cities.push(city);
        localStorage.setItem("cities", JSON.stringify(cities));
        $("input").val("");
        console.log(localStorage);
        renderCites();
    }else {
        $("input").val("");
    }
})

function init() {
    var storedCities = JSON.parse(localStorage.getItem("cities"));
    if (storedCities !== null) {
        cities = storedCities;
    }
    console.log("cities list: " + cities);
    renderCites();
}

function renderCites() {
    $(".cities").html("");
    $(cities).each(function (index, value) {
        var li = $("<li>");
        li.text(value);
        li.addClass("list-group-item");
        $(".cities").append(li);
    })
}

function buildQueryURL(city) {
    city = city.replace(/\s/g, "%20");
    queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=6a5c7d0e65c631220c8aac241678f555";
}

function renderWeather() {

    buildQueryURL(city);

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        var cityName = response.city.name;
        var date = moment(response.list[0].dt_txt).format("l");
        var iconCode = response.list[0].weather[0].icon;
        console.log(iconCode);
        var iconURL = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png";
        var iconImage = $("<img>");
        iconImage.attr({ src: iconURL, alt: iconCode });
        $("#city").text(cityName + " " + "("+ date + ")");
        $("#icon").append(iconImage);
        tempKelvin = response.list[0].main.temp;
        tempFah = (tempKelvin - 273.15) * 9 / 5 + 32
        $("#temprature").text("Temprature: " + tempFah.toFixed(2) + "°F");
        var humidity = response.list[0].main.humidity;
        $("#humidity").text("Humidity: " + humidity + "%");
        var windMS = response.list[0].wind.speed;
        var windMPH = windMS * 2.236937;
        $("#wind").text("Wind Speed: " + windMPH.toFixed(1) + " MPH");
        var lat = response.city.coord.lat;
        var lon = response.city.coord.lon;
        var uvURL = "http://api.openweathermap.org/data/2.5/uvi?appid=6a5c7d0e65c631220c8aac241678f555&lat=" + lat + "&lon=" + lon;
        $.ajax({
            url: uvURL,
            method: "GET"
        }).then(function (response) {
            var uvValue = response.value;
            $("#uv").text("UV Index: ");
            var newP = $("<p>");
            newP.append(uvValue);
            if (uvValue < 3) {
                newP.attr("id", "low");
            } else if (uvValue >= 3 && uvValue < 8) {
                newP.attr("id", "moderate");
            } else {
                newP.attr("id", "high");
            }
            $("#uv").append(newP)
        })

        for (var i = 0; i < response.list.length; i += 8) {
            var forecastDate = moment(response.list[i].dt_txt).format("l");
            var forecastIconCode = response.list[i].weather[0].icon;
            var forcastTemp = response.list[i].main.temp;
            forcastTemp = (forcastTemp - 273.15) * 9 / 5 + 32
            var forecastHumidity = response.list[i].main.humidity;
            var forecastIconURL = "http://openweathermap.org/img/wn/" + forecastIconCode + "@2x.png";
            var ForecastIconImage = $("<img>");
            ForecastIconImage.attr({ src: forecastIconURL, alt: iconCode });
            var forecastDiv = $('<div class = "col">');
            $(".forecast").append(forecastDiv);
            var forecastContDiv = $('<div class ="container forecastDiv">');
            forecastDiv.append(forecastContDiv);
            var forecastDateDiv = $('<div class ="row">');
            forecastDateDiv.append(forecastDate);
            var forecastIconDiv = $('<div class ="row">');
            forecastIconDiv.append(ForecastIconImage);
            var forecastTempDiv = $('<div class ="row">');
            forecastTempDiv.append("Temp: "+forcastTemp.toFixed(2)+"°F");
            var forecastHumidityDiv = $('<div class ="row">');
            forecastHumidityDiv.append("Humidity: "+ forecastHumidity+"%");
            forecastContDiv.append(forecastDateDiv, forecastIconDiv, forecastTempDiv, forecastHumidityDiv)

        }
    })
}

$("li").each(function(){
    $(this).click(function(){
        clearContent();
        city = $(this).text();
        renderWeather();

    })
})

function clearContent(){
    $("#city").html("");
    $("#icon").html("");
    $("#temprature").html("");
    $("#humidity").html("");
    $("#wind").html("");
    $("#uv").html("");
    $(".forecast").html("");
}