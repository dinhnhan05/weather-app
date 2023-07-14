let previousSearch = "";
const apiKey = 'Api_key_here';
//type your api key openweather👆
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const resultContainer = document.getElementById('result-container');
const errorPopup = document.getElementById('error-popup');
const errorMessage = document.getElementById('error-message');

searchButton.addEventListener('click', () => {
    const cityName = searchInput.value;
    if (cityName) {
        searchWeather(cityName);
    }
});

errorPopup.addEventListener('click', () => {
    hideErrorPopup();
});

function searchWeather(cityName) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error!!! Couldnt find the place you were looking for, please enter the correct address in English');
            }
            return response.json();
        })
        .then(data => {
            const countryCode = data.sys.country;
            getCountryName(countryCode)
                .then(countryName => {
                    data.sys.country = countryName;
                    displayWeather(data);
                })
                .catch(error => {
                    console.log('Error:', error);
                    displayWeather(data);
                });
        })
        .catch(error => {
            console.log('Error:', error);
            showErrorPopup(error.message);
        });
}

function getCountryName(countryCode) {
    return fetch('https://restcountries.com/v2/alpha/' + countryCode)
        .then(response => response.json())
        .then(data => {
            return data.name;
        });
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function displayWeather(data) {
    const country = data.sys.country;
    const weatherDescription = capitalizeFirstLetter(data.weather[0].description);
    const temperature = data.main.temp;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const weatherIcon = data.weather[0].icon;

    const resultHtml = `
        <p class="temperature"><strong></strong> ${temperature}°C</p>
        <p class="description"><strong></strong> ${weatherDescription}</p>
        <img src="http://openweathermap.org/img/w/${weatherIcon}.png" alt="Weather Icon" width="47" height="47">
          <div class="additional-info">
            <p class="humidity"><strong>Humidity</strong><br><i class="fas fa-tint"></i> ${humidity}%</p>
            <p class="wind-speed"><strong>Wind Speed</strong><br><i class="fas fa-wind"></i> ${windSpeed} m/s</p>
        </div>
    `;

    resultContainer.innerHTML = resultHtml;
}

function showErrorPopup(message) {
    errorMessage.textContent = message;
    errorPopup.style.display = 'block';
}

function hideErrorPopup() {
    errorPopup.style.display = 'none';
}
//
