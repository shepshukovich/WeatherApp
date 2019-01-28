"use strict";

async function getWeather(c) {
  const url = `https://api.darksky.net/forecast/363929461c32fc7192449bdfe241bf78/${c.lat},${c.lng}?units=si&lang=ru`;
  const response = await axios.get(url);
  return response.data;
}

;

async function getLatLng(location) {
  const url = `http://www.mapquestapi.com/geocoding/v1/address?key=3AUyiQEW6Jf0o0Q3voZHdjkwiLavPUoc&location=${location}`;
  const response = await axios.get(url);
  return response.data;
}

;
$(window).on('load', function () {
  let cache = localStorage['lastSearch'];
  const searchField = $('.location-picker');
  const searchButton = $('.search-button');
  const listOfMatchedCities = $('.matching-options');
  const weatherForm = $('form');
  const ul = $('.matching-options');
  let windowSize = $(window).height();
  let newWindowSize = windowSize / 20;

  const matchingOptions = amount => {
    listOfMatchedCities.empty();
    let minimumListLength = 0;
    amount.length >= 9 ? minimumListLength = 9 : minimumListLength = amount.length;

    for (let i = 0; i < minimumListLength; i++) {
      listOfMatchedCities.append(`<li class="options-item"><a href='#' class='option_${i}'>${amount[i].adminArea1} ${amount[i].adminArea3} ${amount[i].adminArea4} ${amount[i].adminArea5} ${amount[i].adminArea5Type} ${amount[i].adminArea6}</a></li>`);
      $(`.option_${i}`).on('click', function () {
        searchField[0].value = `${amount[i].adminArea5 || amount[i].adminArea4},${amount[i].adminArea3 != '' ? amount[i].adminArea3 : ''} ${amount[i].adminArea1}`;
        localStorage['lastSearch'] = `${amount[i].adminArea5 || amount[i].adminArea4 || amount[i].adminArea3},${amount[i].adminArea3 != '' ? amount[i].adminArea3 : ''} ${amount[i].adminArea1}`;
        listOfMatchedCities.empty();
        getWeather(amount[i].latLng).then(w => console.log(w));
        $('.landing').css({
          'box-shadow': 'none',
          'top': '5%',
          'left': '50%',
          'transform': `translate(-50%, ${newWindowSize}px)`
        });
        setTimeout(() => {
          ul.css({
            'min-height': '0'
          });
        }, 1000);
      });
    }
  };

  const showListOrSingleValue = response => {
    if (response.results[0].locations.length > 1) {
      $('.landing').css({
        'box-shadow': 'inset 0 0 10px #000000',
        'top': '50%',
        'left': '50%',
        'transform': 'translate(-50%, -50%)'
      });
      matchingOptions(response.results[0].locations);
      weatherForm.css({
        'transform': 'translate(-50%, -50%)'
      });
    } else if (response.results[0].locations.length == 1) {
      listOfMatchedCities.empty();
      getWeather(response.results[0].locations[0].latLng).then(w => console.log(w));
      $('.landing').css({
        'box-shadow': 'none',
        'top': '5%',
        'left': '50%',
        'transform': `translate(-50%, ${newWindowSize}px)`
      });
      weatherForm.css({
        'transform': `translate(-50%, -50%)`
      });
    }
  };

  const checkPrevValue = bool => {
    if (searchField[0].value != '' || bool) {
      $('.form').css({
        'width': '100%',
        'box-shadow': '0 0 10px #000000'
      });
      $('.fa')[0].style = 'background: #07051a; color: white';
      searchField[0].style.display = 'block';
    }
  };

  searchField[0].value = cache;
  cache != '' ? getLatLng(cache).then(response => {
    showListOrSingleValue(response);
  }) : f => f;
  checkPrevValue();
  searchField.on('focus', function () {
    checkPrevValue(true);
  });
  searchField.on('focusout', function () {
    $('.form').css({
      'width': '97%',
      'box-shadow': 'none'
    });
  });
  weatherForm.on('submit', event => {
    event.preventDefault();
  });
  searchField.on('keyup', function () {
    checkPrevValue();
    Promise.resolve(getLatLng(this.value).then(response => {
      showListOrSingleValue(response);
    })).then(() => {
      getLatLng(this.value).then(response => {
        showListOrSingleValue(response);
      });
    });
    localStorage['lastSearch'] = this.value;
  });
  weatherForm.on('mouseover', function () {
    setTimeout(function () {
      searchField[0].focus();
    }, 300);
  });
  searchButton.on('click', function () {
    getLatLng(searchField[0].value).then(response => {
      showListOrSingleValue(response);
    });
    localStorage['lastSearch'] = searchField[0].value;
  });
});