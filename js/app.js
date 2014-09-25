
// Use natural aspect ratio of map to set height and maintain
// proper marker size
var sizeMap = function() {
  $(window).off('resize.fittext orientationchange.fittext');

  var width = $('#index-map').width(),
      windowWidth = $(window).width(),
      windowHeight = $(window).height(),
      aspect = 0.5625,
      height = width * aspect,
      top = ((windowHeight / 2) - (height / 2));

  if (windowWidth > 699) {
    $('#index-map').css({
      'height': (height > windowHeight) ? windowHeight + 'px' : height + 'px',
      'width': (height > windowHeight) ? (windowHeight / aspect) + 'px' : '100%',
      'top': (top > 0) ? top + 'px' : 0,
      'left': (height > windowHeight) ? ((windowWidth - (windowHeight / aspect)) / 2) + 'px' : 0
    });

    // Fit the headline text
    $("#line1").fitText(0.57);
    $("#line2").fitText(0.38);
  } else {
    $('#index-map').css({
      'width': 'auto',
    });

    $("#line1").style('font-size', 'inherit');
    $("#line2").style('font-size', 'inherit');
    $("#index-nav h1").fitText();
  }
}

var requestFullScreen = function() {
  var element = document.body;

  // Supports most browsers and their versions.
  var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;

  if (requestMethod) { // Native full screen.
    requestMethod.call(element);
  } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
    var wscript = new ActiveXObject("WScript.Shell");
    if (wscript !== null) {
      wscript.SendKeys("{F11}");
    }
  }
}


var showModal = function(e) {
    $(e.currentTarget).css({
      'display': 'block'
    });
    var windowHeight = $(window).height(),
        windowWidth = $(window).width(),
        dialog = $(e.currentTarget).find('.modal-dialog');
        header = $(e.currentTarget).find('.modal-header')
        button = $(e.currentTarget).find('.conoce'),
        victims = $(e.currentTarget).find('.victims'),
        images = $(e.currentTarget).find('img'),
        fuzz = (windowWidth > 968) ? 280 : 160,
        elementHeight = header.outerHeight() + victims.outerHeight() + button.outerHeight() + dialog.offset().top + fuzz;
        maxHeight = windowHeight - elementHeight;

    if (windowWidth > 699 && windowWidth > windowHeight) {
      images.css({
        'height': maxHeight + 'px',
        'width': 'auto',
      });
    } else {
      images.css({
        'width': '100%',
        'height': 'auto',
      });
    }
}

var shownModal = function(e) {
  $(e.currentTarget).find('img.lazy').each(function() {
    var src = $(this).data('original');
    $(this).attr('src', src);
  });
}

var _rotateQuote = function(el) {
  var state = $(el).data('state');
  $('#marker-' + state).find('.marker-inner').tooltip('show');
}

var blockCarousel = false;

var slidQuote = function(e) {
  _rotateQuote($(e.relatedTarget));
}

var slideQuote = function(e) {
  var isHovered = !!$('.marker-inner').filter(function() { return $(this).is(':hover'); }).length;
  if (!blockCarousel && !isHovered) {
      $('.marker-inner').tooltip('hide');
      setTimeout(function() {
        _rotateQuote($(e.relatedTarget));
      }, 200);
    }
}

$(document).ready(function() {
  // Size map on init and resize
  sizeMap();
  $(window).on('resize', sizeMap);

  // Bind tooltips
  $('.marker-inner').tooltip();
  $('.marker-inner').hover(function(e) {
    $('.marker-inner').not($(e.currentTarget)).tooltip('hide');
    blockCarousel = true;
    setTimeout(function() { blockCarousel = false; }, 2000);
  });

  // Bind modal open before it animates into view
  $('.modal').on('show.bs.modal', showModal);

  // Bind modal when it is shown
  $('.modal').on('shown.bs.modal', shownModal);

  setTimeout(function() {
    $('#quotes').animate({'opacity': 1}, 1000);
    _rotateQuote($('#quotes').find('.carousel').find('.active'));
    $('#quotes').find('.carousel')
      .on('slide.bs.carousel', slideQuote)
      .on('slid.bs.carousel', slidQuote);
  }, 1000);

  // Bind fullscreen button behavior
  $('#fullscreen i').on('click', requestFullScreen);
})

