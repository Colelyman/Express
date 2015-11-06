$( "#cityfield" ).keyup(function() {
  var url = "/getcity/?q=" + $("#cityfield").val();
  $.getJSON(url, function(data) {
    var cities;
    cities = "<ul>";
    $.each(data, function(i, item) {
      cities += "<li> " + data[i].city;
    });
    cities += "</ul>";
    $("#txtHint").html(cities);
  })
  .done(function() {
    console.log("getJSON request successful.");
  })
  .fail(function(jqXHR, textStatus, errorThrown) {
    console.log("getJSON request failed. " + textStatus);
    console.log("incoming " + jqXHR.responseText);
  })
  .always(function() {
    console.log("getJSON request ended!");
  })
  .complete(function() {
    console.log("complete");
  });
});

$( "#button" ).click(function(e) {
   var value = $("#cityfield").val();
   console.log(value);
   var wundergroundURL = "https://api.wunderground.com/api/cc10d6268069eadc/geolookup/conditions/q/UT/";
    wundergroundURL += value;
    wundergroundURL += ".json";

    console.log(wundergroundURL);

    $.ajax({
       url : wundergroundURL,
       dataType : "jsonp",
       success : function(data) {
           var location = data['location']['city'];
           var temp_string = data['current_observation']['temperature_string'];
           var current_weather = data['current_observation']['weather'];
           var stuff = "<ul>";
           stuff += "<li>Location: " + location;
           stuff += "<li>Temperature: " + temp_string;
           stuff += "<li>Weather: " + current_weather;
           stuff += "</ul>";
           $("#weather").html(stuff);
       }
    });
   e.preventDefault();
   $( "#dispcity" ).text(value);
});

// codecademy code

var main = function() {
    $(".article").click(function() {
        $('.article').removeClass('current');
        $('.description').hide();
        $(this).children('.description').show();
        $(this).addClass('current');
    });
    $(document).keypress(function(event) {
        if(event.which === 111 && !$("#cityfield").is(":focus")) { // pressed o
            $('.current').children('.description').toggle();
        }
        else if(event.which === 110) { // pressed n
            var currentArticle = $('.current');
            var nextArticle = currentArticle.next();
            currentArticle.removeClass('current');
            nextArticle.addClass('current');
        }
    });
};

$(document).ready(main);
