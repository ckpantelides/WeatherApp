$(document).ready(function(){

// get geolocation from browser
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var lat = position.coords.latitude;
      var lon = position.coords.longitude;

      // if successful move to getWeather and getPlaceName functions
      getWeather(lat, lon);
      getPlaceName(lat,lon)
    });
  }

  else {
    console.log("Geolocation is not supported by this browser.");
  }

  // API call using lat & lon
  function getWeather(lat, lon) {
  var api_call = "https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/71c3cf1a1b7f6003b89a311cd64c8c9d/"
                  + lat + "," + lon + "?units=si";

  // parse JSON from API call
  $.getJSON(api_call, function(data) {

    // current temperature
    $('#temp').html(Math.round(data.currently.temperature));

    // weather icon for current weather
    var image = '<img src = /weather/images/' + data.currently.icon + '.svg>';
    $("#icon").html(image);
    
    // weather summary
    $('#summary').html(data.hourly.summary);
      
    // loop for hourly forecast
    for(var i = 1; i < 25; i++) {

      // hour of each update
      var unix_timestamp = data.hourly.data[i].time;
      var hour_date = new Date(unix_timestamp * 1000);
      var time_hourly = hour_date.getHours();

      // icon for each hourly update
      var icon_hourly = '<img src = /weather/images/'  + data.hourly.data[i].icon + '.svg>';

      // temp for each hourly update
      var temp_hourly = Math.round(data.hourly.data[i].temperature) + "&#176";

      // append to scrollmenu
      $('#hourly').append(
      '<ul style="list-style-type:none">' +
        '<li>' + time_hourly + ':00</li>' +
        '<li>' + icon_hourly + '</li>' +
        '<li>' + temp_hourly + '</li>' +
        '</ul>'
        );
      }
      
      // loop for daily forecast
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
  
  // second API call for place name necessary, as not offered by Dark Sky
  function getPlaceName(lat,lon) {
    var api_call2 = "https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?lat=" + 
                     lat + "&lon=" + lon + "&appid=0befa5edd94dc4137482fab569899a79&units=metric";
    
  // parse data and append to name placeholder
    $.getJSON(api_call2, function(data2) {
        
      $('#name').html(data2.name);
      });
  }

  // current date
  var date = new Date();
  var d = date.toDateString();
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
});






