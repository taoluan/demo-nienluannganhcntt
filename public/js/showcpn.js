$(document).ready(function(){
  $(window).scroll(function () {
         if ($(this).scrollTop() > 50) {
             $('#back-to-top').fadeIn();
         } else {
             $('#back-to-top').fadeOut();
         }
     });
     // scroll body to 0px on click
     $('#back-to-top').click(function () {
         $('#back-to-top').tooltip('hide');
         $('body,html').animate({
             scrollTop: 0
         }, 800);
         return false;
     });
     
     $('#back-to-top').tooltip('show');

});
var slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}
function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("demo");
  var captionText = document.getElementById("caption");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
  captionText.innerHTML = dots[slideIndex-1].alt;
}