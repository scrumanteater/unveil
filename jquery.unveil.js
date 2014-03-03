/**
 * jQuery Unveil
 * A very lightweight jQuery plugin to lazy load images
 * http://luis-almeida.github.com/unveil
 *
 * Licensed under the MIT license.
 * Copyright 2013 Luís Almeida
 * https://github.com/luis-almeida
 */
;
(function ($) {
  $.fn.unveil = function (threshold, callback) {
    var $w = $(window),
        th = threshold || 0,
        retina = window.devicePixelRatio > 1,
        attrib = retina ? "data-src-retina" : "data-src",
        images = this,
        loaded;
    this.one("unveil", function () {
      var source = this.getAttribute(attrib),
          bgImg,
          thisElement;
      source = source || this.getAttribute("data-src");
      if (source) {
        thisElement = $(this);
        thisElement.addClass('loading');
        bgImg = new Image();
        bgImg.onload = function () {
          thisElement.css('backgroundImage', 'url("' + source + '")');
          thisElement.removeClass('loading');
        };
        bgImg.src = source;
        bgImg = null;
        if (typeof callback === "function") callback.call(this);
      }
    });
    function unveil() {
      var inview = images.filter(function () {
        var $e = $(this);
        if ($e.is(":hidden")) return;
        var wt = $w.scrollTop(),
            wb = wt + $w.height(),
            et = $e.offset().top,
            eb = et + $e.height();
        return eb >= wt - th && et <= wb + th;
      });
      loaded = inview.trigger("unveil");
      images = images.not(loaded);
    }
    $w.scroll(unveil);
    $w.resize(unveil);
    unveil();
    return this;
  };
})(window.jQuery || window.Zepto);