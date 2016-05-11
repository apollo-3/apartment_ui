$(document).ready(function() {      
  hideMap = function() {
    $("#draw_area").css('position','absolute');         
    $("#draw_area").css('opacity','0');          
  };
  showMap = function() {
    $("#draw_area").css('position','relative'); 
    $("#draw_area").css('opacity','1'); 
  };
  hideMap();
  
  fakeLoadOn = function() {
    $("#loading").css('display','block');
  };
  fakeLoadOff = function() {
    $("#loading").css('display','none');
  };  
  
});