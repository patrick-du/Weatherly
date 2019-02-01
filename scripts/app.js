window.addEventListener('load', () => {

    // Vars, Lets, Consts
    const longlattoronto = "43.6529,-79.3849";
    const longlatparis = "48.8566,2.3515";
    const longlatseoul = "37.5667,126.9783";
    const longlatmelbourne = "-37.8142,144.9632";
    let long, lat, coordinates;
    var units = 'si';
    var display = '°C';


    // Checks if location is already stored in local storage
    if (localStorage.longitude && localStorage.latitude) {
        long = localStorage.getItem('longitude');
        lat = localStorage.getItem('latitude');
        coordinates = `${long},${lat}`;
        change(coordinates, display);

    } else {
        // If not, ask for location permissions
        navigator.geolocation.getCurrentPosition(position => {
            long = position.coords.longitude;
            lat = position.coords.latitude;
            localStorage.setItem('longitude', long);
            localStorage.setItem('latitude', lat);
            coordinates = `${long},${lat}`;
            change(coordinates, display);
        });
    };

    // Switch between Celsius and Fahrenheit
    document.getElementById('celsius').addEventListener('click', () => {
        units = 'si';
        display = '°C'
        change(coordinates, display);
    });

    document.getElementById('fahrenheit').addEventListener('click', () => {
        units = 'us';
        display = '°F';
        change(coordinates, display);
    });


    // Sets city coordinates and calls change function
    document.getElementById('current').addEventListener('click', () => {
        long = localStorage.getItem('longitude');
        lat = localStorage.getItem('latitude');
        coordinates = `${long},${lat}`;
        change(coordinates, display);
    });

    document.getElementById('toronto').addEventListener('click', () => {
        coordinates = longlattoronto;
        change(coordinates, display);
    });

    document.getElementById('paris').addEventListener('click', () => {
        coordinates = longlatparis;
        change(coordinates, display);
    });

    document.getElementById('seoul').addEventListener('click', () => {
        coordinates = longlatseoul;
        change(coordinates, display);
    });

    document.getElementById('melbourne').addEventListener('click', () => {
        coordinates = longlatmelbourne;
        change(coordinates, display);
    });



    // Calls API to change location timezone, high/low, summary and set the date
    function change(coordinates, celfah) {

        const proxy = 'https://cors-anywhere.herokuapp.com/';
        const api = `${proxy}https://api.darksky.net/forecast/7b2b4ae8198ceb6e5a537d17120750b3/${coordinates}?units=${units}`;
        fetch(api)
            .then(response => {
                return response.json();
            })
            .then(data => {
                const bs = data.daily.data;

                // Sets the location timezone
                document.querySelector(`.location-timezone`).textContent = data.timezone

                // Sets the weekly summary
                document.querySelector(`.weekly-summary`).textContent = data.daily.summary

                // Sets the high/low and summary
                for (let i = 0; i < 7; i++) {
                    document.querySelector(`#high${i}`).textContent = `${Math.round(bs[i].temperatureMax)} ${celfah}`;
                    document.querySelector(`#low${i}`).textContent = `${Math.round(bs[i].temperatureMin)} ${celfah}`;
                    document.querySelector(`#desc${i}`).textContent = bs[i].summary;
                    document.querySelector(`#precip${i}`).textContent = Math.round(bs[i].precipProbability * 100) + '%';
                    document.querySelector(`#humid${i}`).textContent = Math.round(bs[i].humidity * 100) + '%';
                    document.querySelector(`#speed${i}`).textContent = bs[i].windSpeed;
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
