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
    //--Checks if there is Internet Connection-------------------------------------------------------------------------------------------------------------------//
    function isOnline() {
        document.getElementById('status').innerHTML = "Online";
        document.getElementById('status').classList.add("green");
        document.getElementById('status').classList.remove("red");

    }
    function isOffline() {
        document.getElementById('status').innerHTML = "Offline";
        document.getElementById('status').classList.add("red");
        document.getElementById('status').classList.remove("green");


    }

    window.addEventListener('online', isOnline);
    window.addEventListener('offline', isOffline);

    //-----------------------------------------------------------------------------------------------------------------------------------------------------------//
    //--Stores Longitude and Latitude----------------------------------------------------------------------------------------------------------------------------//
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
    //--Recalculate Location Button------------------------------------------------------------------------------------------------------------------------------//
    document.getElementById('resetLocation').addEventListener('click', () => {
        navigator.geolocation.getCurrentPosition(position => {  // Asks for location permissions
            navLat = position.coords.latitude;
            navLong = position.coords.longitude;

            if ((navLat = localStorage.getItem('latitude')) && (navLong = localStorage.getItem('longitude'))) {
                console.log('They are the same.')
            } else {
                console.log('They are not the same.')
                localStorage.setItem('latitude', navLat); // Set longitude and latitude into localStorage
                localStorage.setItem('longitude', navLong);
            }
            coordinates = `${navLat},${navLong}`;
            change(coordinates, units);
            spinnerDisplay();
        });
    });

    //-----------------------------------------------------------------------------------------------------------------------------------------------------------//
    //--Switch between Celsius and Fahrenheit--------------------------------------------------------------------------------------------------------------------//
    document.getElementById('celsius').addEventListener('click', () => {
        units = 'si';
        temperatureUnit = '°C'
        windSpeedUnit = ' km/h'
        document.getElementById('item1').classList.add("active");
        document.getElementById('item2').classList.remove("active");
        change(coordinates, units);
        spinnerDisplay();

    });

    document.getElementById('fahrenheit').addEventListener('click', () => {
        units = 'us';
        temperatureUnit = '°F'
        windSpeedUnit = ' mph'
        document.getElementById('item2').classList.add("active");
        document.getElementById('item1').classList.remove("active");
        change(coordinates, units);
        spinnerDisplay();
    });

    //-----------------------------------------------------------------------------------------------------------------------------------------------------------//
    //--Location Dropdown Buttons--------------------------------------------------------------------------------------------------------------------------------//
    /*
    document.getElementById('current').addEventListener('click', () => { // Change Coordinates for Current Location
        lat = localStorage.getItem('latitude');
        long = localStorage.getItem('longitude');
        coordinates = `${lat},${long}`;
        change(coordinates, units);
        spinnerDisplay();
    });
    */

    document.getElementById('toronto').addEventListener('click', () => { // Change Coordinates for Toronto
        coordinates = latlongtoronto;
        change(coordinates, units);
        spinnerDisplay();
    });

    document.getElementById('paris').addEventListener('click', () => { // Change Coordinates for Paris
        coordinates = latlongparis;
        change(coordinates, units);
        spinnerDisplay();
    });

    document.getElementById('seoul').addEventListener('click', () => { // Change Coordinates for Seoul
        coordinates = latlongseoul;
        change(coordinates, units);
        spinnerDisplay();
    });

    document.getElementById('melbourne').addEventListener('click', () => { // Change Coordinates for Melbourne
        coordinates = latlongmelbourne;
        change(coordinates, units);
        spinnerDisplay();
    });
    //------------------------------------------------------------------------------------------------------------------------------------------------------------//
    //--Function that displays Spinner when loading---------------------------------------------------------------------------------------------------------------//
    function spinnerDisplay() {
        for (let i = 0; i < 7; i++) {
            document.getElementById(`topLoading`).classList.remove("noDisplay"); // Show card information
            document.getElementById(`topLoaded`).classList.add("noDisplay"); // Show card information
            document.getElementById(`loading${i}`).classList.remove("noDisplay"); // Show card information
            document.getElementById(`loaded${i}`).classList.add("noDisplay"); // Show card information
        }
    }
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------//
    //--DarkSky API Function that sets location/timezone, weekly summary, daily high/low, summary, precipitation, humidity, windspeed----------------------------//
    function change(coordinates, units) {

        const proxy = 'https://cors-anywhere.herokuapp.com/';
        const api = `${proxy}https://api.darksky.net/forecast/7b2b4ae8198ceb6e5a537d17120750b3/${coordinates}?units=${units}`;

        fetch(api) // Fetches .json file from the DarkSky API
            .then(response => {
                return response.json(); // Parses the response as JSON
            })
            .then(data => {

                const dailyData = data.daily.data;

                document.getElementById(`location-timezone`).textContent = data.timezone // Sets the location timezone
                document.getElementById(`weekly-summary`).textContent = data.daily.summary // Sets the weekly summary

                document.getElementById(`topLoading`).classList.add("noDisplay"); // Hide topCard placeholder blocks
                document.getElementById(`topLoaded`).classList.remove("noDisplay"); // Show topCard information

                // Sets the high/low and summary
                for (let i = 0; i < 7; i++) {
                    document.getElementById(`high${i}`).textContent = `${Math.round(dailyData[i].temperatureMax)} ${temperatureUnit}`; // Sets day high °C or °F
                    document.getElementById(`low${i}`).textContent = `${Math.round(dailyData[i].temperatureMin)} ${temperatureUnit}`; // Sets day low in °C or °F
                    document.getElementById(`desc${i}`).textContent = dailyData[i].summary; // Sets day summary
                    document.getElementById(`precip${i}`).textContent = Math.round(dailyData[i].precipProbability * 100) + '%'; // Sets day precipitation
                    document.getElementById(`humid${i}`).textContent = Math.round(dailyData[i].humidity * 100) + '%'; // Sets day humidity
                    document.getElementById(`speed${i}`).textContent = dailyData[i].windSpeed + windSpeedUnit; // Sets day speed in km/h or mph

                    document.getElementById(`loading${i}`).classList.add("noDisplay"); // Hide card placeholder blocks
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

    //-----------------------------------------------------------------------------------------------------------------------------------------------------------//

});