$(document).ready(function(){

var lat
var lon

  // get geolocation from browser
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {

      lat = position.coords.latitude;
      lon = position.coords.longitude;

      // if successful move to getWeather and getPlacename functions
      getWeather(lat, lon);
      getPlaceName(lat, lon);
    });
    }

    else {
        alert("Geolocation is not supported by this browser.");
      }

    // if user submits search, use geocoding to new lat & lon
    document.getElementById('searchForm').onsubmit = function() {

        // prevents refreshing page, which would end search
        event.preventDefault();
      
        // clears current weather data in hourly & daily forecast
        $("#hourlyC").html("");
        $("#hourlyF").html("");
        $("#dailyC").html("");
        $("#dailyF").html("");

        // take search value and geocode using google API
        var newSearch = document.getElementById("searchInput").value;

        var geocode = "https://maps.googleapis.com/maps/api/geocode/json?address="
        + newSearch + "&key=AIzaSyDKXRyAAjVhJQ6xP9C2AVpKjeQk9CYNHlw";

        $.getJSON(geocode, function(geodata) {

          // get new lat & lon for weather API call using geocode data
          newLat = geodata.results[0].geometry.location.lat;
          newLon = geodata.results[0].geometry.location.lng;
          document.getElementById("name").innerHTML = geodata.results[0].address_components[1].long_name;
          document.getElementById("nameF").innerHTML = geodata.results[0].address_components[1].long_name;
          getWeather(newLat, newLon);
          });
        }

  // API weather call using lat & lon
  function getWeather(lat, lon) {
  var api_call = "https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/71c3cf1a1b7f6003b89a311cd64c8c9d/"
                  + lat + "," + lon + "?units=si";

  // parse JSON from API call
  $.getJSON(api_call, function(data) {

    // current temperature in celsius
    $('#tempC').html(Math.round(data.currently.temperature));

    // current temperature in fahrenheit
    $('#tempF').html(Math.round(1.8*(data.currently.temperature)) + 32);

    // weather icon for current weather
    var image = "<img src = images/" + data.currently.icon + ".svg>"
    $("#icon").html(image);

    // weather summary
    $('#summary').html(data.hourly.summary);

    // loop for hourly updates
    for(var i = 0; i < 24; i++) {

      // hour of each update
      var unix_timestamp = data.hourly.data[i].time;
      var hour_date = new Date(unix_timestamp * 1000);
      var time_hourly = hour_date.getHours();

      // icon for each hourly update
      var icon_hourly = '<img src = images/' + data.hourly.data[i].icon + '.svg>';

      // temp in celsius for each hourly update
      var temp_hourly = Math.round(data.hourly.data[i].temperature);

      // temp in fahrenheit for each hourly update
      var tempf_hourly = Math.round(1.8*(data.hourly.data[i].temperature)) + 32;

      // append hourly weather to scrollmenu (Celsius)
      $('#hourlyC').append(
      '<ul style="list-style-type:none;">' +
        '<li>' + time_hourly + ':00</li>' +
        '<li>' + icon_hourly + '</li>' +
        '<li>' + temp_hourly + '</li>' +
        '</ul>'

        );

      // append hourly weather to scrollmenu (Fahrenheit)
      $('#hourlyF').append(
        '<ul style="list-style-type:none;">' +
          '<li>' + time_hourly + ':00</li>' +
          '<li>' + icon_hourly + '</li>' +
          '<li>' + tempf_hourly + '</li>' +
          '</ul>'

        );

      }

      // loop for daily updates
      for(var j=1; j<8; j++) {

      // get day of week
      var timestamp = data.daily.data[j].time;
      var a = new Date(timestamp*1000);
      var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
      var dayOfWeek = days[a.getDay()]

      // icon for each daily update
      var icon_daily = '<img src = images/' + data.daily.data[j].icon + '.svg>';

      // temp in celsius for each daily update
      var temp_daily = Math.round(data.daily.data[j].temperatureHigh );

      // temp in fahrenheit for each hourly update
      var tempf_daily = Math.round(1.8*(data.daily.data[j].temperatureHigh)) + 32

      // append daily celsius forecast to hidden scrollmenu
      $('#dailyC').append(
      '<ul style="list-style-type:none">' +
        '<li>' + dayOfWeek + '</li>' +
        '<li>' + icon_daily + '</li>' +
        '<li>' + temp_daily + '</li>' +
        '</ul>'
        );

        // append daily fahrenheit forecast to hidden scrollmenu
        $('#dailyF').append(
        '<ul style="list-style-type:none">' +
          '<li>' + dayOfWeek + '</li>' +
          '<li>' + icon_daily + '</li>' +
          '<li>' + tempf_daily + '</li>' +
          '</ul>'
          );
      }
    });
  }

  // second API call for place name
  function getPlaceName(lat, lon) {

  var api_call2 = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lon +
                "&key=AIzaSyDKXRyAAjVhJQ6xP9C2AVpKjeQk9CYNHlw";

                $.getJSON(api_call2, function(data2) {
                  // append name to html
                  document.getElementById("name").innerHTML = data2.results[0].address_components[1].long_name;
                  document.getElementById("nameF").innerHTML = data2.results[0].address_components[1].long_name;
                });

  // current date
  var date = new Date();
  var d = date.toDateString();

  // append date to html
  document.getElementById("date").innerHTML = d;

  // toggle between celsius temp and hidden fahrenheit weather
  $('.tempIcon').click(function() {
    $('.temp').toggleClass('hidden');
    });

  // toggle between search icon and search bar
  $('#searchIcon').click(function() {
    $('.search').toggleClass('hidden');
    });

  // toggle between hourly update or daily update
  $('button').click(function() {
    $('.hourlyDaily').toggleClass('hidden');
    });

  }
});
