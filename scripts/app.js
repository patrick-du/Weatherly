window.addEventListener('load', () => {

    // Vars, Lets, Consts
    const latlongtoronto = "43.6529,-79.3849";
    const latlongparis = "48.8566,2.3515";
    const latlongseoul = "37.5667,126.9783";
    const latlongmelbourne = "-37.8142,144.9632";
    let long, lat, coordinates;
    var units = 'si';
    var display = '°C';


    // Checks if location is already stored in local storage
    if (localStorage.longitude && localStorage.latitude) {
        lat = localStorage.getItem('latitude');
        long = localStorage.getItem('longitude');
        coordinates = `${lat},${long}`;
        change(coordinates, display);
        console.log('hi', coordinates);
    } else {
        // If not, ask for location permissions
        navigator.geolocation.getCurrentPosition(position => {
            lat = position.coords.latitude;
            long = position.coords.longitude;
            localStorage.setItem('longitude', long);
            localStorage.setItem('latitude', lat);
            coordinates = `${lat},${long}`;
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
        lat = localStorage.getItem('latitude');
        long = localStorage.getItem('longitude');
        coordinates = `${lat},${long}`;
        change(coordinates, display);
        console.log("i", coordinates);

    });

    document.getElementById('toronto').addEventListener('click', () => {
        coordinates = latlongtoronto;
        change(coordinates, display);
        console.log("hiasdf", coordinates);

    });

    document.getElementById('paris').addEventListener('click', () => {
        coordinates = latlongparis;
        change(coordinates, display);
    });

    document.getElementById('seoul').addEventListener('click', () => {
        coordinates = latlongseoul;
        change(coordinates, display);
    });

    document.getElementById('melbourne').addEventListener('click', () => {
        coordinates = latlongmelbourne;
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


window.addEventListener('beforeinstallprompt', (e) => {
    console.log('brown');
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Update UI notify the user they can add to home screen
    btnAdd.style.display = 'block';
  });
  
  btnAdd.addEventListener('click', (e) => {
    // hide our user interface that shows our A2HS button
    btnAdd.style.display = 'none';
    // Show the prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice
        .then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the A2HS prompt');
            } else {
                console.log('User dismissed the A2HS prompt');
            }
            deferredPrompt = null;
        });
  });