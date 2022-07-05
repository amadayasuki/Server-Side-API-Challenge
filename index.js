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

// 5 Day API Call
fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + weatherData.name + "&appid=ce39e7239416ad754359ca762d28521a&units=imperial")
.then(function(response) {
    response.json().then(function(data) {

        // Delete Previous Entries
        $("#five-day").empty();

        // get every 8th value (24hours) in the returned array from the api call
        for(i = 7; i <= data.list.length; i += 8){

            // Puts data into Forecast Card
            let fiveDayCard =`
            <div class="col-md-2 m-2 py-3 card text-white bg-primary">
                <div class="card-body p-1">
                    <h5 class="card-title">` + dayjs(data.list[i].dt * 1000).format("MM/DD/YYYY") + `</h5>
                    <img src="https://openweathermap.org/img/wn/` + data.list[i].weather[0].icon + `.png" alt="rain">
                    <p class="card-text">Temp: ` + data.list[i].main.temp + `</p>
                    <p class="card-text">Humidity: ` + data.list[i].main.humidity + `</p>
                </div>
            </div>
            `;

           
            $("#five-day").append(fiveDayCard);
       }
    })
});
 // Remembers Last City History
    lastCitySearched = weatherData.name;


    saveSearchHistory(weatherData.name);

    
};

// City Search History Into Local Storage
let saveSearchHistory = function (city) {
    if(!searchHistory.includes(city)){
        searchHistory.push(city);
        $("#search-history").append("<a href='#' class='list-group-item list-group-item-action' id='" + city + "'>" + city + "</a>")
    } 

    // Save Array to Local Storage
    localStorage.setItem("weatherSearchHistory", JSON.stringify(searchHistory));

    // Save Last City To Local Storage
    localStorage.setItem("lastCitySearched", JSON.stringify(lastCitySearched));

    // Display Serach History Array
    loadSearchHistory();
};

// Function to Loads Searched History from Local Storage
let loadSearchHistory = function() {
    searchHistory = JSON.parse(localStorage.getItem("weatherSearchHistory"));
    lastCitySearched = JSON.parse(localStorage.getItem("lastCitySearched"));
  
    //  Creates Empty Search History Array + Empty Searched City IF Nothing in Array
    if (!searchHistory) {
        searchHistory = []
    }

    if (!lastCitySearched) {
        lastCitySearched = ""
    }

    // Deletes Previous Values From Search History
    $("#search-history").empty();

    //  Loops through All Cities In Array
    for(i = 0 ; i < searchHistory.length ;i++) {

        //  Append To the Search History + Link
        $("#search-history").append("<a href='#' class='list-group-item list-group-item-action' id='" + searchHistory[i] + "'>" + searchHistory[i] + "</a>");
    }
  };


loadSearchHistory();

// Shows Last City Searched
if (lastCitySearched != ""){
    getCityWeather(lastCitySearched);
}


$("#search-form").submit(searchSubmitHandler);
$("#search-history").on("click", function(event){
  
    let prevCity = $(event.target).closest("a").attr("id");
    
    getCityWeather(prevCity);
});