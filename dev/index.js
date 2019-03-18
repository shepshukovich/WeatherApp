async function getWeather(coordinates) {
    const url = `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/363929461c32fc7192449bdfe241bf78/${coordinates.lat},${coordinates.lng}?units=si&lang=ru`;
    const response = await axios.get(url);
    console.log("respone weather", response);
    
    return response.data;
};

`https://api.darksky.net/forecast/363929461c32fc7192449bdfe241bf78/53.902253,27.561863?units=si&lang=ru`

async function getLatLng(location) {
    // const url = `http://www.mapquestapi.com/geocoding/v1/address?key=3AUyiQEW6Jf0o0Q3voZHdjkwiLavPUoc&location=${location}`; //vgoilik@gmail.com key
    const url = `http://www.mapquestapi.com/geocoding/v1/address?key=cxvpn9HcGzk6ltzBBAgPInW12A3kPFuM&location=${location}`; //vshepshuk@gmail.com key
    const response = await axios.get(url);

    return response.data;
};



$(window).on('load', function() {
    const searchField = $('#location-picker');
    const searchButton = $('.search-button');

    async function showWeather(resp) {
        let response;
        resp.result === undefined ? response = resp.results.locations.displayLatLng : f => f;
        resp.results === undefined ? response = resp.result.latlng : f => f;
    
        getWeather(response).then((w) => {
            temperatureOutside[0].innerHTML = `${w.currently.temperature} °C`;
            weatherSummaryCurrently[0].innerHTML = `Сегодня ${w.currently.summary}`;
            weatherSummaryDaily[0].innerHTML = `${w.daily.summary}`;

            weatherData.css({
                'opacity': '1',
                'top': '55%',
                'transform': 'translate(-50%, -50%)'
            });

            $('.landing').css({
                'top': '15%',
            });
        });
    };

    const searchAPI = placeSearch({
        key: 'cxvpn9HcGzk6ltzBBAgPInW12A3kPFuM',
        container: $('#location-picker')[0],
        collection : ['adminArea', 'address', 'airport', 'category', 'franchise', 'poi'],
        limit: 6, //default: 5, max: 15
        style: true,
        useDeviceLocation: true
      });

      searchAPI.on('change', function(e) {
        showWeather(e).then(w => {localStorage['lastSearch'] = searchAPI.getVal()});
      });

    //   getLatLng(localStorage['lastSearch']).then((w) => {
    //       console.log(w);
    //       showWeather(w); //w.results[0].locations[0].latLng
    //   });
      
      searchAPI.setVal(localStorage['lastSearch']);
      
        searchField.on('focusout', function() {
          $('.form').css({
              'width': '97%',
              'box-shadow':'none'
            });
        });
        
        searchField.on('focus', function() {
            $('.form').css({
                'width': '100%',
                'box-shadow':'0 0 10px #000000'
            });
        });

        searchButton.on('click', function() {
            getLatLng(localStorage['lastSearch']).then(w => {
                showWeather(w);
            });
        });
    //   searchAPI.open();
    //   searchAPI.on('results', function(e) {
    //     console.log('success!');
    // });
    //   console.log(searchAPI.getVal());
    //   getWeather(localStorage['lastSearch']).then(w => console.log(w))



    // let cache = localStorage['lastSearch'];
    
    const search = $('.mapboxgl-ctrl-geocoder input[type="text"]');
    const searchLiActive = $('ul[class="suggestions"] li a');
    const listOfMatchedCities = $('.matching-options');
    const weatherForm = $('form');
    const ul = $('.matching-options');
    const weatherData = $('.weatherData');
    const temperatureOutside = $('.temperature-outside');
    const weatherSummaryCurrently = $('.weather-summary-currently');
    const weatherSummaryDaily = $('.weather-summary-daily');
    const location = $('.location');
    // let windowSize = $(window).height();
    // let newWindowSize = windowSize / 20;
    // let newWindowSizeHalf = windowSize / 50;
    // let newWindowSizeBottom = windowSize - newWindowSize;

    var res = '';
    search.on('change', function() {
        setTimeout(function() {
            if(res == $('.mapboxgl-ctrl-geocoder input[type="text"]').val()) {
                f => f;

            } else {
                res = $('.mapboxgl-ctrl-geocoder input[type="text"]').val();
                getLatLng(res).then((w) => {
                    getWeather(map._easeOptions.center).then((w) => {
                        $('.location')[0].innerHTML = `${res}`;
                        temperatureOutside[0].innerHTML = `${w.currently.temperature} °C`;
                        weatherSummaryCurrently[0].innerHTML = `Сегодня ${w.currently.summary}`;
                        weatherSummaryDaily[0].innerHTML = `${w.daily.summary}`;

                        weatherData.css({
                            'opacity': '1',
                            'top': '69%',
                            'transform': 'translate(-50%, -50%)',
                            // 'box-shadow': 'grey 0px 45px 40px',
                            // 'background-color': 'rgb(128,128,128, .004)'
                        });
                        $('.temperature-outside').css({
                            'text-shadow': '#000000 1px 0 10px;'
                        });
            
                        $('.mapboxgl-ctrl-top-right').css({
                            'top': '1%',
                        });
                        $('.landing-wrapper').css({
                            'height': '0'
                        });
                        $('.intro').css({
                            'opacity': '0',
                            'top': '0'
                        });
                        // weatherData.toggleClass('weatherData__hide');
                        // $('.mapboxgl-ctrl-top-right').toggleClass('mapboxgl-ctrl-top-right__very-top');
                        // $('.landing-wrapper').toggleClass('landing-wrapper__height-0');
                        // $('.intro').toggleClass('intro__hide');
                    });
                });
            }
        }, 500);
        
    });

    search.on('keyup', function() {
        weatherData.css({
            'opacity': '1',
            'top': '170%',
            'transform': 'translate(-50%, -50%)',
        });
        $('.landing-wrapper').css({
            'height': '100%',
        });
        $('.mapboxgl-ctrl-top-right').css({
            'top': '35%',
        });
        $('.suggestions').css({
            'box-shadow': '0 0 10px #000000 !important',
        });
        $('.intro').css({
            'opacity': '1',
            'top': '33%'
        });
    });
    



    const matchingOptions = (amount) => {
        listOfMatchedCities.empty();
        console.log($('.mq-result'));

        let minimumListLength = 0;
        amount.length >= 9 ? minimumListLength = 9 : minimumListLength = amount.length;
        
        for(let i = 0; i < minimumListLength; i++) {
            listOfMatchedCities.append(`<li class="options-item"><a href='#' class='option_${i}'>${amount[i].adminArea1} ${amount[i].adminArea3} ${amount[i].adminArea4} ${amount[i].adminArea5} ${amount[i].adminArea5Type} ${amount[i].adminArea6}</a></li>`);
            
            $(`.option_${i}`).on('click', function() {
                searchField[0].value = `${amount[i].adminArea5 || amount[i].adminArea4},${amount[i].adminArea3 != '' ? amount[i].adminArea3 : ''} ${amount[i].adminArea1}`;
                localStorage['lastSearch'] = `${amount[i].adminArea5 || amount[i].adminArea4 || amount[i].adminArea3},${amount[i].adminArea3 != '' ? amount[i].adminArea3 : ''} ${amount[i].adminArea1}`;
                listOfMatchedCities.empty();
                getWeather(amount[i].latLng).then(w => {
                    console.log(w);
                    location[0].innerHTML = `${searchField[0].value}`;
                    temperatureOutside[0].innerHTML = `${w.currently.temperature} ℃`;
                    weatherSummaryCurrently[0].innerHTML = `Сегодня ${w.currently.summary}`;
                    weatherSummaryDaily[0].innerHTML = `${w.daily.summary}`;

                    weatherData.css({
                        'opacity': '1',
                        'top': '55%',
                        'left': '50%',
                        'transform': 'translate(-50%, -50%)'
                    });
                });

                $('.landing').css({
                    'box-shadow':'none',
                    'top': '15%',
                    'left': '50%',
                    // 'transform': `translate(-50%, ${newWindowSize}px)`
                });

                setTimeout(() => { ul.css({ 'min-height': '0' }) }, 1000);
            });
        }
    };

    const showListOrSingleValue = (response) => {
        if(response.results[0].locations.length > 1) {
            $('.landing').css({
                'box-shadow':'inset 0 0 10px #000000',
                // 'top': '50%',
                // 'left': '50%',
                // 'transform': 'translate(-50%, -50%)'
                // 'box-shadow':'none',
                'top': '5%',
                'left': '50%',
                'transform': `translate(-50%, ${newWindowSize}px)`
            });
            matchingOptions(response.results[0].locations);
            weatherForm.css({
                'transform': 'translate(-50%, -50%)'    
            });
            
        }

        else if(response.results[0].locations.length == 1) {
            listOfMatchedCities.empty();
            getWeather(response.results[0].locations[0].latLng).then(w => {
                console.log(w);
                location[0].innerHTML = `${searchField[0].value}`;
                temperatureOutside[0].innerHTML = `${w.currently.temperature} ℃`;
                weatherSummaryCurrently[0].innerHTML = `Сегодня ${w.currently.summary}`;
                weatherSummaryDaily[0].innerHTML = `${w.daily.summary}`;
            });

            
            // weatherForm.css({
            //     'transform': `translate(-50%, -50%)`
            // });
            setTimeout(function() {
                weatherData.css({
                    'top': '55%',
                    'left': '50%',
                    'transform': 'translate(-50%, -50%)'
                });
            }, 300);
        }
    };
    
    const checkPrevValue = (bool) => {
        if($('.mq-input').value != '' || bool) {
            $('.form').css({
                'width': '100%',
                'box-shadow':'0 0 10px #000000'
            });

            $('.fa')[0].style = 'background: #07051a; color: white';
            searchField[0].style.display = 'block';
        }
    };
    
    // $('.mq-input')[0].value = cache;
    
    // cache != '' ? getLatLng(cache).then(response => { showListOrSingleValue(response) }) : f => f;
    checkPrevValue();

    



    weatherForm.on('submit', (event) => { event.preventDefault() });

    

    searchField.on('keyup', function() {
        // checkPrevValue();

        // $('.mq-with-results').length ? console.log($('.mq-with-results')) : console.log('no results');


        // placeSearch.on('results', (e) => {
        //     console.log(e);
        //   });

        //   placeSearch.getVal();
        // weatherData.css({
        //     'opacity': '0',
        //     'top': '150%'
        // });

        weatherData.css({
            'opacity': '0',
            'top': '150%',
            'left': '50%',
            'transform': 'translate(-50%, -50%)'
        });
        // Promise.resolve(getLatLng(this.value).then(response => {
        //     showListOrSingleValue(response);
        // })).then(() => {
        //     getLatLng(this.value).then(response => {
        //         showListOrSingleValue(response);
        //     })
        // });
        
        localStorage['lastSearch'] = this.value;
    });

    // weatherForm.on('mouseover', function() {
    //     setTimeout(function() { searchField[0].focus() }, 300);
    // });

    
});