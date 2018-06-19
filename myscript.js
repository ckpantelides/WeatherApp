$(document).ready(function(){

var lat
var lon

  // get geolocation from browser
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {

      lat = position.coords.latitude;
      lon = position.coords.longitude;

      // if successful move to getWeather function
      getWeather(lat, lon);
      getPlaceName(lat, lon);
    });
    }

    else {
        alert("Geolocation is not supported by this browser.");
      }

    // if user submits search, user geocoding to get weather
    document.getElementById('theForm').onsubmit = function() {
      event.preventDefault();
      var newSearch = document.getElementById("search").value;

      var geocode = "https://maps.googleapis.com/maps/api/geocode/json?address="
      + newSearch + "&key=AIzaSyDKXRyAAjVhJQ6xP9C2AVpKjeQk9CYNHlw";

      $.getJSON(geocode, function(geodata) {

        lat = geodata.results[0].geometry.location.lat;
        lon = geodata.results[0].geometry.location.lng;
        document.getElementById("name").innerHTML = geodata.results[0].address_components[1].long_name;
        getWeather(lat, lon);
        });
      }

  // API call using lat & lon
  function getWeather(lat, lon) {
  var api_call = "https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/71c3cf1a1b7f6003b89a311cd64c8c9d/"
                  + lat + "," + lon + "?units=si";

  // parse JSON from API call
  $.getJSON(api_call, function(data) {

    // current temperature in celsius
    $('#temp').html(Math.round(data.currently.temperature));

    // current temperature in fahrenheit
    $('#tempf').html(Math.round(1.8*(data.currently.temperature)) + 32);

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
      var tempf_hourly = Math.round(1.8*(data.hourly.data[i].temperature)) + 32

      // append to scrollmenu
      $('#hourly').append(
      '<ul style="list-style-type:none;">' +
        '<li>' + time_hourly + ':00</li>' +
        '<li>' + icon_hourly + '</li>' +
        '<li>' + temp_hourly + '</li>' +
        '</ul>'
        );

      }

      for(var j=1; j<8; j++) {

      // get day of week
      var timestamp = data.daily.data[j].time;
      var a = new Date(timestamp*1000);
      var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
      var dayOfWeek = days[a.getDay()]

      // icon for each daily update
      var icon_daily = '<img src = images/' + data.daily.data[j].icon + '.svg>';

      // temp for each daily update
      var temp_daily = Math.round(data.daily.data[j].temperatureHigh );

      // append daily forecast to hidden scrollmenu
      $('#daily').append(
      '<ul style="list-style-type:none">' +
        '<li>' + dayOfWeek + '</li>' +
        '<li>' + icon_daily + '</li>' +
        '<li>' + temp_daily + '</li>' +
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
                  document.getElementById("name").innerHTML = data2.results[0].address_components[1].long_name;
                  document.getElementById("namef").innerHTML = data2.results[0].address_components[1].long_name;
                });

  // current date
  var date = new Date();
  var d = date.toDateString();
  var c = date.toGMTString();
  var b = date.toLocaleString();
  var a = c.split('GMT');

  document.getElementById("date").innerHTML = d;

  // swaps hourly and daily forecasts with button click
  $("button").click(function() {
      d1 = document.getElementById("hourly-forecast");
      d2 = document.getElementById("daily-forecast");

      if( d2.style.display == "none" ) {
        d1.style.display = "none";
        d2.style.display = "block";
      }

      else {
      d1.style.display = "block";
      d2.style.display = "none";
     }
  });

  // swaps searchIcon for searchBar
  document.getElementById('searchButton').onclick = function() {

      d1 = document.getElementById("searchButton");
      d2 = document.getElementById("theForm");

      if( d2.style.display == "none" ) {
        d1.style.display = "none";
        d2.style.display = "block";
      }
    }

      // swaps celsius for fahrenheit
      document.getElementsByClassName("tempIcon")[0].onclick = function() {

          d1 = document.getElementById("celsius");
          d2 = document.getElementById("fahrenheit");

          if( d2.style.display == "none") {
            d1.style.display = "none";
            d2.style.display = "block";
          }
      }

      // swaps fahrenheit for celsius
      document.getElementsByClassName("tempIcon")[1].onclick = function() {

          d1 = document.getElementById("celsius");
          d2 = document.getElementById("fahrenheit");

          if(d1.style.display == "none") {
            d2.style.display = "none";
            d1.style.display = "block";
          }
      }
    }
});
