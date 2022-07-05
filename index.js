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
