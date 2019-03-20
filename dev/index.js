async function getWeather(coordinates) {
    const url = `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/363929461c32fc7192449bdfe241bf78/${coordinates.lat},${coordinates.lng}?units=si&lang=ru`;
    const response = await axios.get(url);
    return response.data;
};

$(window).on('load', () => {
    const searchInput           = $('.mapboxgl-ctrl-geocoder input[type="text"]');
    const weatherData           = $('.weatherData');
    const mapboxglCtrlTopRight  = $('.mapboxgl-ctrl-top-right');
    const landingWrapper        = $('.landing-wrapper');
    const intro                 = $('.intro');
    const loadingLines          = $('.loading-lines');
    const location              = $('.location');
    const temperatureOutside    = $('.temperature-outside');
    const weatherSummaryOutside = $('.weather-summary-currently');
    const weatherSummaryDaily   = $('.weather-summary-daily');
    let res                     = '';

    searchInput.on('change', () => {
        loadingLines.addClass('loading-lines__display-block');
        setTimeout( () => {
            if(res == searchInput.val()) { f => f; }
            else {
                res = searchInput.val();
                getWeather(map._easeOptions.center).then((data) => {
                    location             .html(`${res}`);
                    temperatureOutside   .html(`${data.currently.temperature < 0 ? data.currently.temperature : '+' + data.currently.temperature} °C`);
                    weatherSummaryOutside.html(`Сегодня ${data.currently.summary}`);
                    weatherSummaryDaily  .html(`${data.daily.summary}`);
                    weatherData          .addClass('weatherData__hide');
                    mapboxglCtrlTopRight .addClass('mapboxgl-ctrl-top-right__very-top');
                    landingWrapper       .addClass('landing-wrapper__height-0');
                    intro                .addClass('intro__hide-at-top');
                    loadingLines         .removeClass('loading-lines__display-block');
                });
            }
        }, 500);
    });

    searchInput.on('keyup', () => {
        weatherData          .removeClass('weatherData__hide');
        mapboxglCtrlTopRight .removeClass('mapboxgl-ctrl-top-right__very-top');
        landingWrapper       .removeClass('landing-wrapper__height-0');
        intro                .removeClass('intro__hide-at-top');
    });
});