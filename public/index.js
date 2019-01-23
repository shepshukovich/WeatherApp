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
  const listOfMatchedCities = $('.matching-options');

  const checkPrevValue = () => {
    if (searchField[0].value != '') {
      $('.form')[0].style.width = '200px';
      $('.fa')[0].style = 'background: #07051a; color: white';
      searchField[0].style.display = 'block';
    }
  };

  searchField[0].value = cache;
  cache != '' ? getLatLng(cache).then(response => {
    getWeather(response.results[0].locations[0].latLng).then(w => console.log(w));
  }) : f => f;
  checkPrevValue();
  searchField.on('keyup change', function (event) {
    checkPrevValue();

    const matchingOptions = amount => {
      listOfMatchedCities.empty();

      for (let i = 0; i < amount.length; i++) {
        listOfMatchedCities.append(`<li class="options-item"><a href='#' class='option_${i}'>${amount[i].adminArea1} ${amount[i].adminArea3} ${amount[i].adminArea4} ${amount[i].adminArea5} ${amount[i].adminArea5Type} ${amount[i].adminArea6}</a></li>`);
        $(`.option_${i}`).on('click', function () {
          searchField[0].value = `${amount[i].adminArea5 || amount[i].adminArea4 || amount[i].adminArea3},${amount[i].adminArea1}`;
          localStorage['lastSearch'] = `${amount[i].adminArea5 || amount[i].adminArea4 || amount[i].adminArea3},${amount[i].adminArea1}`;
          listOfMatchedCities.empty();
          getWeather(amount[i].latLng).then(w => console.log(w));
        });
      }
    };

    if (event.keyCode) {
      getLatLng(this.value).then(response => {
        if (response.results[0].locations.length > 1) {
          matchingOptions(response.results[0].locations);
        } else if (response.results[0].locations.length == 1) {
          listOfMatchedCities.empty();
          getWeather(response.results[0].locations[0].latLng).then(w => console.log(w));
        }

        console.log(response);
      });
    }

    localStorage['lastSearch'] = this.value;
  });
});