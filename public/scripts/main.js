$(document).ready(function() {      
  $("#map").draggable({handle:"div#dragger"});
  hideMap = function() {
    // $("#map").css('opacity','0');     
    // $("#map").css('z-index','-1');  

    $("#draw_area").css('position','absolute');         
    $("#draw_area").css('opacity','0');     
    // $("#draw_area").css('height','0');     
  };
  showMap = function() {
    // $("#map").css('opacity','1');
    // $("#map").css('z-index','2');   

    $("#draw_area").css('position','relative'); 
    $("#draw_area").css('opacity','1'); 
    // $("#draw_area").css('height','400'); 
  };
  hideMap();
  
  fakeLoadOn = function() {
    $("#loading").css('display','block');
  };
  fakeLoadOff = function() {
    $("#loading").css('display','none');
  };  
  
});