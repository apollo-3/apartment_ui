$(document).ready(function() {      
  $("#map").draggable({handle:"div#dragger"});
  hideMap = function() {
    $("#map").css('opacity','0');       
  };
  showMap = function() {
    $("#map").css('opacity','1');
  };
  hideMap();
});