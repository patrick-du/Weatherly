window.addEventListener('load', () => {

    // Vars, Lets, Consts
    const latlongtoronto = "43.6529,-79.3849";
    const latlongparis = "48.8566,2.3515";
    const latlongseoul = "37.5667,126.9783";
    const latlongmelbourne = "-37.8142,144.9632";
    let long, lat, coordinate;
    var units = 'si';
    var temperatureUnit = '°C';
    var windSpeedUnit = ' km/h';





    //--Switch between Celsius and Fahrenheit--------------------------------------------------------------------------------------------------------------------//

    if (localStorage.longitude && localStorage.latitude) { // Checks if location is already stored in local storage
        lat = localStorage.getItem('latitude'); // Get longitude and latitude from localStorage
        long = localStorage.getItem('longitude');
        coordinates = `${lat},${long}`;
        change(coordinates, units);
    } else {
        navigator.geolocation.getCurrentPosition(position => {  // Asks for location permissions
            lat = position.coords.latitude;
            long = position.coords.longitude;
            localStorage.setItem('longitude', long); // Set longitude and latitude into localStorage
            localStorage.setItem('latitude', lat);
            coordinates = `${lat},${long}`;
            change(coordinates, units);
        });
    };
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------//





    //--Switch between Celsius and Fahrenheit--------------------------------------------------------------------------------------------------------------------//

    document.getElementById('celsius').addEventListener('click', () => {
        units = 'si';
        temperatureUnit = '°C'
        windSpeedUnit = ' km/h'
        change(coordinates, units);
    });

    document.getElementById('fahrenheit').addEventListener('click', () => {
        units = 'us';
        temperatureUnit = '°F'
        windSpeedUnit = ' mph'
        change(coordinates, units);
    });
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------//





    //--Location Dropdown Buttons--------------------------------------------------------------------------------------------------------------------------------//
    document.getElementById('current').addEventListener('click', () => { // Change Coordinates for Toronto
        lat = localStorage.getItem('latitude');
        long = localStorage.getItem('longitude');
        coordinates = `${lat},${long}`;
        change(coordinates, display);
    });

    document.getElementById('toronto').addEventListener('click', () => { // Change Coordinates for Toronto
        coordinates = latlongtoronto;
        change(coordinates, display);
    });

    document.getElementById('paris').addEventListener('click', () => { // Change Coordinates for Toronto
        coordinates = latlongparis;
        change(coordinates, display);
    });

    document.getElementById('seoul').addEventListener('click', () => { // Change Coordinates for Toronto
        coordinates = latlongseoul;
        change(coordinates, display);
    });

    document.getElementById('melbourne').addEventListener('click', () => { // Change Coordinates for Toronto
        coordinates = latlongmelbourne;
        change(coordinates, display);
    });
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------//





    //--DarkSky API Function that sets location/timezone --------------------------------------------------------------------------------------------------------//
    //-------------------------------- weekly summary -----------------------------------------------------------------------------------------------------------//
    //-------------------------------- daily high/low -----------------------------------------------------------------------------------------------------------//
    //-------------------------------- daily summary ------------------------------------------------------------------------------------------------------------//
    //-------------------------------- daily precipitation ------------------------------------------------------------------------------------------------------//
    //-------------------------------- daily humidity -----------------------------------------------------------------------------------------------------------//
    //-------------------------------- daily windspeed ----------------------------------------------------------------------------------------------------------//

    function change(coordinates, units) {

        const proxy = 'https://cors-anywhere.herokuapp.com/';
        const api = `${proxy}https://api.darksky.net/forecast/7b2b4ae8198ceb6e5a537d17120750b3/${coordinates}?units=${units}`;

        fetch(api) // Fetches .json file from the DarkSky API
            .then(response => {
                return response.json(); // Parses the response as JSON
            })
            .then(data => {

                const dailyData = data.daily.data;

                // Sets the location timezone
                document.querySelector(`.location-timezone`).textContent = data.timezone
                document.getElementById(`spinnerLocationTimezone`).classList.add("noDisplay");

                // Sets the weekly summary
                document.querySelector(`.weekly-summary`).textContent = data.daily.summary
                document.getElementById(`spinnerWeeklySummary`).classList.add("noDisplay");




                // Sets the high/low and summary
                for (let i = 0; i < 7; i++) {
                    document.getElementById(`high${i}`).textContent = `${Math.round(dailyData[i].temperatureMax)} ${temperatureUnit}`; // Sets day high °C or °F
                    document.getElementById(`low${i}`).textContent = `${Math.round(dailyData[i].temperatureMin)} ${temperatureUnit}`; // Sets day low in °C or °F
                    document.getElementById(`desc${i}`).textContent = dailyData[i].summary; // Sets day summary
                    document.getElementById(`precip${i}`).textContent = Math.round(dailyData[i].precipProbability * 100) + '%'; // Sets day precipitation
                    document.getElementById(`humid${i}`).textContent = Math.round(dailyData[i].humidity * 100) + '%'; // Sets day humidity
                    document.getElementById(`speed${i}`).textContent = dailyData[i].windSpeed + windSpeedUnit; // Sets day speed in km/h or mph

                    document.getElementById(`spinnerCard${i}`).classList.add("noDisplay"); // Hides spinners
                    document.getElementById(`loaded${i}`).classList.remove("noDisplay"); // Show card information
                }

                // Sets the date
                var dd = new Date().getDay();
                datesArray = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

                for (let i = 0; i < 7; i++) {
                    if (dd <= 6) {
                        document.querySelector(`#date${i}`).textContent = datesArray[dd];
                        dd++;

                    } else if (dd > 6) {
                        dd = 0;
                        document.querySelector(`#date${i}`).textContent = datesArray[dd];
                        dd++;
                    };
                }

            });
    }
});

    //-----------------------------------------------------------------------------------------------------------------------------------------------------------//
