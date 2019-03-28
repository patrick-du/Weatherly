window.addEventListener('load', () => {
    updateOnlineStatus();



    // Vars, Lets, Consts
    const latlongtoronto = "43.6529,-79.3849";
    const latlongparis = "48.8566,2.3515";
    const latlongseoul = "37.5667,126.9783";
    const latlongmelbourne = "-37.8142,144.9632";
    let lat, long;
    let units = 'si';
    let temperatureUnit = '°C';
    let windSpeedUnit = ' km/h';

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

    function updateOnlineStatus() {
        let condition = navigator.onLine ? "online" : "offline";
        document.getElementById('status').innerHTML = condition

        if (navigator.onLine) {
            document.getElementById('status').classList.add("green");
            document.getElementById('status').classList.remove("red");
        } else {
            document.getElementById('status').classList.add("red");
            document.getElementById('status').classList.remove("green");
        }
    }

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    //-----------------------------------------------------------------------------------------------------------------------------------------------------------//
    //--Stores Longitude and Latitude----------------------------------------------------------------------------------------------------------------------------//

    function changeCity(latlong) { // Change Location Function
        coordinates = latlong
        change(coordinates, units);
    }

    function getUserLocation() { // Gets User Location Function
        navigator.geolocation.getCurrentPosition(position => {
            lat = position.coords.latitude
            long = position.coords.longitude
            localStorage.setItem('latitude', lat);
            localStorage.setItem('longitude', long);
            changeCity(`${lat},${long}`)
        })
    }

    if (localStorage.latitude && localStorage.longitude) { // Checks if latitude and longitude are already stored
        lat = localStorage.getItem('latitude');
        long = localStorage.getItem('longitude');
        changeCity(`${lat},${long}`);
    } else {
        getUserLocation();
    };

    document.getElementById('toronto').addEventListener('click', () => { changeCity(latlongtoronto) }); // Toronto Button
    document.getElementById('paris').addEventListener('click', () => { changeCity(latlongparis) }); // Paris Button
    document.getElementById('seoul').addEventListener('click', () => { changeCity(latlongseoul) }); // Seoul Button
    document.getElementById('melbourne').addEventListener('click', () => { changeCity(latlongmelbourne) }); // Melbourne Button
    document.getElementById('resetLocation').addEventListener('click', () => { getUserLocation() }); // Current Location Button

    //------------------------------------------------------------------------------------------------------------------------------------------------------------//
    //--Switch between Celsius and Fahrenheit--------------------------------------------------------------------------------------------------------------------//

    document.getElementById('celsius').addEventListener('click', () => {
        units = 'si';
        temperatureUnit = '°C'
        windSpeedUnit = ' km/h'
        document.getElementById('item1').classList.add("active");
        document.getElementById('item2').classList.remove("active");
        change(coordinates, units);
    });

    document.getElementById('fahrenheit').addEventListener('click', () => {
        units = 'us';
        temperatureUnit = '°F'
        windSpeedUnit = ' mph'
        document.getElementById('item2').classList.add("active");
        document.getElementById('item1').classList.remove("active");
        change(coordinates, units);
    });

    //-----------------------------------------------------------------------------------------------------------------------------------------------------------//
    //--Function that displays/hides data-------------------------------------------------------------------------------------------------------------------------//

    function hideData() {
        document.getElementById(`topLoading`).classList.remove("noDisplay"); // Show card information
        document.getElementById(`topLoaded`).classList.add("noDisplay"); // Show card information
        for (let i = 0; i < 7; i++) {
            document.getElementById(`loading${i}`).classList.remove("noDisplay"); // Show card information
            document.getElementById(`loaded${i}`).classList.add("noDisplay"); // Show card information
        }
    }

    function displayData() {
        document.getElementById(`topLoading`).classList.add("noDisplay"); // Hide topCard placeholder blocks
        document.getElementById(`topLoaded`).classList.remove("noDisplay"); // Show topCard information
        for (let i = 0; i < 7; i++) {
            document.getElementById(`loading${i}`).classList.add("noDisplay"); // Hide card placeholder blocks
            document.getElementById(`loaded${i}`).classList.remove("noDisplay"); // Show card information
        }
    }

    //-----------------------------------------------------------------------------------------------------------------------------------------------------------//
    //--Offline Sync---------------------------------------------------------------------------------------------------------------------------------------------//

    function storeText() {
        let stored = document.getElementById(`offlineText`).value;
        console.log(stored)
        localStorage.setItem('offlineMsg', stored);
    }

    document.getElementById(`offlineButton`).addEventListener('click', () => {
        storeText();



    });






    //-----------------------------------------------------------------------------------------------------------------------------------------------------------//
    //--DarkSky API Function that sets location/timezone, weekly summary, daily high/low, summary, precipitation, humidity, windspeed----------------------------//

    function change(coordinates, units) {
        hideData();
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

                // Sets the high/low and summary
                for (let i = 0; i < 7; i++) {
                    document.getElementById(`high${i}`).textContent = `${Math.round(dailyData[i].temperatureMax)} ${temperatureUnit}`; // Sets day high °C or °F
                    document.getElementById(`low${i}`).textContent = `${Math.round(dailyData[i].temperatureMin)} ${temperatureUnit}`; // Sets day low in °C or °F
                    document.getElementById(`desc${i}`).textContent = dailyData[i].summary; // Sets day summary
                    document.getElementById(`precip${i}`).textContent = Math.round(dailyData[i].precipProbability * 100) + '%'; // Sets day precipitation
                    document.getElementById(`humid${i}`).textContent = Math.round(dailyData[i].humidity * 100) + '%'; // Sets day humidity
                    document.getElementById(`speed${i}`).textContent = dailyData[i].windSpeed + windSpeedUnit; // Sets day speed in km/h or mph
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
                displayData();
            });
    }

    //-----------------------------------------------------------------------------------------------------------------------------------------------------------//

});