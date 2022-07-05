// Array for Search History
let searchHistory = []
let lastCitySearched = ""

// API call to OpenWeather
let getCityWeather = function(city) {
    // format the OpenWeather api url
    let apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=ce39e7239416ad754359ca762d28521a&units=imperial";

    // Fetch Request to URL
    fetch(apiUrl)
        
        .then(function(response) {
        // Request Success
            if (response.ok) {
                response.json().then(function(data) {
                    displayWeather(data);
                });
            // Request Falure
            } else {
                alert("Error: " + response.statusText);
            }
        })  

        // No response 
        .catch(function(error) {
            alert("There was an error connecting to OpenWeather");
        })
};

// Function for City Serach and Form Submission
let searchSubmitHandler = function(event) {
   
    event.preventDefault();

    // Value from Input 
    let cityName = $("#cityname").val().trim();

    // Sees if Search Value is Present
    if(cityName) {
        // Pushes Value to getCityWeather Function
        getCityWeather(cityName);

        // Delete Serach Input
        $("#cityname").val("");
    } else {
        
        alert("Please enter a city name");
    }
};

// Function to display info
let displayWeather = function(weatherData) {

    // Format
    $("#main-city-name").text(weatherData.name + " (" + dayjs(weatherData.dt * 1000).format("MM/DD/YYYY") + ") ").append(`<img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png"></img>`);
    $("#main-city-temp").text("Temperature: " + weatherData.main.temp.toFixed(1) + "°F");
    $("#main-city-humid").text("Humidity: " + weatherData.main.humidity + "%");
    $("#main-city-wind").text("Wind Speed: " + weatherData.wind.speed.toFixed(1) + " mph");
    // LAT + LONG UV API CALL
    fetch("https://api.openweathermap.org/data/2.5/uvi?lat=" + weatherData.coord.lat + "&lon="+ weatherData.coord.lon + "&appid=ce39e7239416ad754359ca762d28521a")
        .then(function(response) {
            response.json().then(function(data) {

                // UV Index Value
                $("#uv-box").text(data.value);

                // highlight the value using the EPA's UV Index Scale colors
                if(data.value >= 11) {
                    $("#uv-box").css("background-color", "#6c49cb")
                } else if (data.value < 11 && data.value >= 8) {
                    $("#uv-box").css("background-color", "#d90011")
                } else if (data.value < 8 && data.value >= 6) {
                    $("#uv-box").css("background-color", "#f95901")
                } else if (data.value < 6 && data.value >= 3) {
                    $("#uv-box").css("background-color", "#f7e401")
                } else {
                    $("#uv-box").css("background-color", "#299501")
                }      
            })
        });

