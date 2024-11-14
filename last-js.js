
/*
// hiding cs preview animation if page is currently scrolling
let current_scroll = setInterval(if_scrolling, 10);
function if_scrolling() {
  if ($('html').hasClass("has-scroll-scrolling")) {

    if ($('#cs1').is(":hover") || $('#cs2').is(":hover") || $('#cs3').is(":hover") || $('#cs4').is(":hover") || $('#cs5').is(":hover") || $('#cs6').is(":hover") || $('#cs7').is(":hover") || $('#cs8').is(":hover") || $('#cs9').is(":hover") || $('#cs10').is(":hover") || $('#cs11').is(":hover") || $('#cs12').is(":hover") || $('#cs13').is(":hover")) {
      $('#work').css('cursor', 'none');
      $('#work').trigger('mouseleave');

      $('#cs1').css('cursor', 'none');
      $('#cs2').css('cursor', 'none');
      $('#cs3').css('cursor', 'none');
      $('#cs4').css('cursor', 'none');
      $('#cs5').css('cursor', 'none');
      $('#cs6').css('cursor', 'none');
      $('#cs7').css('cursor', 'none');
      $('#cs8').css('cursor', 'none');
      $('#cs9').css('cursor', 'none');
      $('#cs10').css('cursor', 'none');
      $('#cs11').css('cursor', 'none');
      $('#cs12').css('cursor', 'none');
      $('#cs13').css('cursor', 'none');


      $('#cs1').trigger('mouseleave');
      $('#cs2').trigger('mouseleave');
      $('#cs3').trigger('mouseleave');
      $('#cs4').trigger('mouseleave');
      $('#cs5').trigger('mouseleave');
      $('#cs6').trigger('mouseleave');
      $('#cs7').trigger('mouseleave');
      $('#cs8').trigger('mouseleave');
      $('#cs9').trigger('mouseleave');
      $('#cs10').trigger('mouseleave');
      $('#cs11').trigger('mouseleave');
      $('#cs12').trigger('mouseleave');
      $('#cs13').trigger('mouseleave');

      console.log("scrolling while hovering");
    }

    else {
      $('#work').css('cursor', 'auto');

      $('#cs1').css('cursor', 'pointer');
      $('#cs2').css('cursor', 'pointer');
      $('#cs3').css('cursor', 'pointer');
      $('#cs4').css('cursor', 'pointer');
      $('#cs5').css('cursor', 'pointer');
      $('#cs6').css('cursor', 'pointer');
      $('#cs7').css('cursor', 'pointer');
      $('#cs8').css('cursor', 'pointer');
      $('#cs9').css('cursor', 'pointer');
      $('#cs10').css('cursor', 'pointer');
      $('#cs11').css('cursor', 'pointer');
      $('#cs12').css('cursor', 'pointer');
      $('#cs13').css('cursor', 'pointer');

      console.log("scrolling without hovering");
    }
  }
}

*/



// cs preview ; only when hovered over for atleast 2 secs


$('#cs1').mouseenter(function () { //if user is hovering over the case study

  //hiding the other cs previews
  //$(".cs1-close-trigger").click();
  $(".cs2-close-trigger").click();
  $(".cs3-close-trigger").click();
  $(".cs4-close-trigger").click();
  $(".cs5-close-trigger").click();
  $(".cs6-close-trigger").click();
  $(".cs7-close-trigger").click();
  $(".cs8-close-trigger").click();
  $(".cs9-close-trigger").click();
  $(".cs10-close-trigger").click();
  $(".cs11-close-trigger").click();
  $(".cs12-close-trigger").click();
  $(".cs13-close-trigger").click();

  let t1 = setTimeout(show_preview1, 300); //then we are starting a timer for 1 second - to run the preview 
  //once the timer is done, this function is called
  function show_preview1() {
    $(".cs1-trigger").click();
  }
  $('#cs1').mouseleave(function () {
    clearTimeout(t1);
    $(".cs1-close-trigger").click();
  });
});


$('#cs2').mouseenter(function () { //if user is hovering over the case study

  //hiding the other cs previews
  $(".cs1-close-trigger").click();
  //$(".cs2-close-trigger").click();
  $(".cs3-close-trigger").click();
  $(".cs4-close-trigger").click();
  $(".cs5-close-trigger").click();
  $(".cs6-close-trigger").click();
  $(".cs7-close-trigger").click();
  $(".cs8-close-trigger").click();
  $(".cs9-close-trigger").click();
  $(".cs10-close-trigger").click();
  $(".cs11-close-trigger").click();
  $(".cs12-close-trigger").click();
  $(".cs13-close-trigger").click();

  let t2 = setTimeout(show_preview2, 300); //then we are starting a timer for 1 second - to run the preview 
  //once the timer is done, this function is called
  function show_preview2() {
    $(".cs2-trigger").click();
  }
  $('#cs2').mouseleave(function () {
    clearTimeout(t2);
    $(".cs2-close-trigger").click();
  });
});


$('#cs3').mouseenter(function () { //if user is hovering over the case study

  //hiding the other cs previews
  $(".cs1-close-trigger").click();
  $(".cs2-close-trigger").click();
  //$(".cs3-close-trigger").click();
  $(".cs4-close-trigger").click();
  $(".cs5-close-trigger").click();
  $(".cs6-close-trigger").click();
  $(".cs7-close-trigger").click();
  $(".cs8-close-trigger").click();
  $(".cs9-close-trigger").click();
  $(".cs10-close-trigger").click();
  $(".cs11-close-trigger").click();
  $(".cs12-close-trigger").click();
  $(".cs13-close-trigger").click();

  let t3 = setTimeout(show_preview3, 300); //then we are starting a timer for 1 second - to run the preview 
  //once the timer is done, this function is called
  function show_preview3() {
    $(".cs3-trigger").click();
  }
  $('#cs3').mouseleave(function () {
    clearTimeout(t3);
    $(".cs3-close-trigger").click();
  });
});


$('#cs4').mouseenter(function () { //if user is hovering over the case study

  //hiding the other cs previews
  $(".cs1-close-trigger").click();
  $(".cs2-close-trigger").click();
  $(".cs3-close-trigger").click();
  //$(".cs4-close-trigger").click();
  $(".cs5-close-trigger").click();
  $(".cs6-close-trigger").click();
  $(".cs7-close-trigger").click();
  $(".cs8-close-trigger").click();
  $(".cs9-close-trigger").click();
  $(".cs10-close-trigger").click();
  $(".cs11-close-trigger").click();
  $(".cs12-close-trigger").click();
  $(".cs13-close-trigger").click();

  let t4 = setTimeout(show_preview4, 300); //then we are starting a timer for 1 second - to run the preview 
  //once the timer is done, this function is called
  function show_preview4() {
    $(".cs4-trigger").click();
  }
  $('#cs4').mouseleave(function () {
    clearTimeout(t4);
    $(".cs4-close-trigger").click();
  });
});


$('#cs5').mouseenter(function () { //if user is hovering over the case study

  //hiding the other cs previews
  $(".cs1-close-trigger").click();
  $(".cs2-close-trigger").click();
  $(".cs3-close-trigger").click();
  $(".cs4-close-trigger").click();
  //$(".cs5-close-trigger").click();
  $(".cs6-close-trigger").click();
  $(".cs7-close-trigger").click();
  $(".cs8-close-trigger").click();
  $(".cs9-close-trigger").click();
  $(".cs10-close-trigger").click();
  $(".cs11-close-trigger").click();
  $(".cs12-close-trigger").click();
  $(".cs13-close-trigger").click();

  let t5 = setTimeout(show_preview5, 300); //then we are starting a timer for 1 second - to run the preview 
  //once the timer is done, this function is called
  function show_preview5() {
    $(".cs5-trigger").click();
  }
  $('#cs5').mouseleave(function () {
    clearTimeout(t5);
    $(".cs5-close-trigger").click();
  });
});


$('#cs6').mouseenter(function () { //if user is hovering over the case study

  //hiding the other cs previews
  $(".cs1-close-trigger").click();
  $(".cs2-close-trigger").click();
  $(".cs3-close-trigger").click();
  $(".cs4-close-trigger").click();
  $(".cs5-close-trigger").click();
  //$(".cs6-close-trigger").click();
  $(".cs7-close-trigger").click();
  $(".cs8-close-trigger").click();
  $(".cs9-close-trigger").click();
  $(".cs10-close-trigger").click();
  $(".cs11-close-trigger").click();
  $(".cs12-close-trigger").click();
  $(".cs13-close-trigger").click();

  let t6 = setTimeout(show_preview6, 300); //then we are starting a timer for 1 second - to run the preview 
  //once the timer is done, this function is called
  function show_preview6() {
    $(".cs6-trigger").click();
  }
  $('#cs6').mouseleave(function () {
    clearTimeout(t6);
    $(".cs6-close-trigger").click();
  });
});


$('#cs7').mouseenter(function () { //if user is hovering over the case study

  //hiding the other cs previews
  $(".cs1-close-trigger").click();
  $(".cs2-close-trigger").click();
  $(".cs3-close-trigger").click();
  $(".cs4-close-trigger").click();
  $(".cs5-close-trigger").click();
  $(".cs6-close-trigger").click();
  //$(".cs7-close-trigger").click();
  $(".cs8-close-trigger").click();
  $(".cs9-close-trigger").click();
  $(".cs10-close-trigger").click();
  $(".cs11-close-trigger").click();
  $(".cs12-close-trigger").click();
  $(".cs13-close-trigger").click();

  let t7 = setTimeout(show_preview7, 300); //then we are starting a timer for 1 second - to run the preview 
  //once the timer is done, this function is called
  function show_preview7() {
    $(".cs7-trigger").click();
  }
  $('#cs7').mouseleave(function () {
    clearTimeout(t7);
    $(".cs7-close-trigger").click();
  });
});


$('#cs8').mouseenter(function () { //if user is hovering over the case study

  //hiding the other cs previews
  $(".cs1-close-trigger").click();
  $(".cs2-close-trigger").click();
  $(".cs3-close-trigger").click();
  $(".cs4-close-trigger").click();
  $(".cs5-close-trigger").click();
  $(".cs6-close-trigger").click();
  $(".cs7-close-trigger").click();
  //$(".cs8-close-trigger").click();
  $(".cs9-close-trigger").click();
  $(".cs10-close-trigger").click();
  $(".cs11-close-trigger").click();
  $(".cs12-close-trigger").click();
  $(".cs13-close-trigger").click();

  let t8 = setTimeout(show_preview8, 300); //then we are starting a timer for 1 second - to run the preview 
  //once the timer is done, this function is called
  function show_preview8() {
    $(".cs8-trigger").click();
  }
  $('#cs8').mouseleave(function () {
    clearTimeout(t8);
    $(".cs8-close-trigger").click();
  });
});


$('#cs9').mouseenter(function () { //if user is hovering over the case study

  //hiding the other cs previews
  $(".cs1-close-trigger").click();
  $(".cs2-close-trigger").click();
  $(".cs3-close-trigger").click();
  $(".cs4-close-trigger").click();
  $(".cs5-close-trigger").click();
  $(".cs6-close-trigger").click();
  $(".cs7-close-trigger").click();
  $(".cs8-close-trigger").click();
  //$(".cs9-close-trigger").click();
  $(".cs10-close-trigger").click();
  $(".cs11-close-trigger").click();
  $(".cs12-close-trigger").click();
  $(".cs13-close-trigger").click();

  let t9 = setTimeout(show_preview9, 300); //then we are starting a timer for 1 second - to run the preview 
  //once the timer is done, this function is called
  function show_preview9() {
    $(".cs9-trigger").click();
  }
  $('#cs9').mouseleave(function () {
    clearTimeout(t9);
    $(".cs9-close-trigger").click();
  });
});


$('#cs10').mouseenter(function () { //if user is hovering over the case study

  //hiding the other cs previews
  $(".cs1-close-trigger").click();
  $(".cs2-close-trigger").click();
  $(".cs3-close-trigger").click();
  $(".cs4-close-trigger").click();
  $(".cs5-close-trigger").click();
  $(".cs6-close-trigger").click();
  $(".cs7-close-trigger").click();
  $(".cs8-close-trigger").click();
  $(".cs9-close-trigger").click();
  //$(".cs10-close-trigger").click();
  $(".cs11-close-trigger").click();
  $(".cs12-close-trigger").click();
  $(".cs13-close-trigger").click();

  let t10 = setTimeout(show_preview10, 300); //then we are starting a timer for 1 second - to run the preview 
  //once the timer is done, this function is called
  function show_preview10() {
    $(".cs10-trigger").click();
  }
  $('#cs10').mouseleave(function () {
    clearTimeout(t10);
    $(".cs10-close-trigger").click();
  });
});


$('#cs11').mouseenter(function () { //if user is hovering over the case study

  //hiding the other cs previews
  $(".cs1-close-trigger").click();
  $(".cs2-close-trigger").click();
  $(".cs3-close-trigger").click();
  $(".cs4-close-trigger").click();
  $(".cs5-close-trigger").click();
  $(".cs6-close-trigger").click();
  $(".cs7-close-trigger").click();
  $(".cs8-close-trigger").click();
  $(".cs9-close-trigger").click();
  $(".cs10-close-trigger").click();
  //$(".cs11-close-trigger").click();
  $(".cs12-close-trigger").click();
  $(".cs13-close-trigger").click();

  let t11 = setTimeout(show_preview11, 300); //then we are starting a timer for 1 second - to run the preview 
  //once the timer is done, this function is called
  function show_preview11() {
    $(".cs11-trigger").click();
  }
  $('#cs11').mouseleave(function () {
    clearTimeout(t11);
    $(".cs11-close-trigger").click();
  });
});


$('#cs12').mouseenter(function () { //if user is hovering over the case study

  //hiding the other cs previews
  $(".cs1-close-trigger").click();
  $(".cs2-close-trigger").click();
  $(".cs3-close-trigger").click();
  $(".cs4-close-trigger").click();
  $(".cs5-close-trigger").click();
  $(".cs6-close-trigger").click();
  $(".cs7-close-trigger").click();
  $(".cs8-close-trigger").click();
  $(".cs9-close-trigger").click();
  $(".cs10-close-trigger").click();
  $(".cs11-close-trigger").click();
  //$(".cs12-close-trigger").click();
  $(".cs13-close-trigger").click();

  let t12 = setTimeout(show_preview12, 300); //then we are starting a timer for 1 second - to run the preview 
  //once the timer is done, this function is called
  function show_preview12() {
    $(".cs12-trigger").click();
  }
  $('#cs12').mouseleave(function () {
    clearTimeout(t12);
    $(".cs12-close-trigger").click();
  });
});


$('#cs13').mouseenter(function () { //if user is hovering over the case study

  //hiding the other cs previews
  $(".cs1-close-trigger").click();
  $(".cs2-close-trigger").click();
  $(".cs3-close-trigger").click();
  $(".cs4-close-trigger").click();
  $(".cs5-close-trigger").click();
  $(".cs6-close-trigger").click();
  $(".cs7-close-trigger").click();
  $(".cs8-close-trigger").click();
  $(".cs9-close-trigger").click();
  $(".cs10-close-trigger").click();
  $(".cs11-close-trigger").click();
  $(".cs12-close-trigger").click();
  //$(".cs13-close-trigger").click();

  let t13 = setTimeout(show_preview13, 300); //then we are starting a timer for 1 second - to run the preview 
  //once the timer is done, this function is called
  function show_preview13() {
    $(".cs13-trigger").click();
  }
  $('#cs13').mouseleave(function () {
    clearTimeout(t13);
    $(".cs13-close-trigger").click();
  });
});


$('#end-blank-case-study').mouseenter(function () { //if user is hovering over the case study

  //hiding the other cs previews
  $(".cs1-close-trigger").click();
  $(".cs2-close-trigger").click();
  $(".cs3-close-trigger").click();
  $(".cs4-close-trigger").click();
  $(".cs5-close-trigger").click();
  $(".cs6-close-trigger").click();
  $(".cs7-close-trigger").click();
  $(".cs8-close-trigger").click();
  $(".cs9-close-trigger").click();
  $(".cs10-close-trigger").click();
  $(".cs11-close-trigger").click();
  $(".cs12-close-trigger").click();
  $(".cs13-close-trigger").click();

});