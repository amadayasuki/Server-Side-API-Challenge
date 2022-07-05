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