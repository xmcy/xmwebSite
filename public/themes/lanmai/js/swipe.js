!function(t,n){"use strict";function e(t,n,e){n.css({"-webkit-transition":"all "+e+"s "+t.opts.transitionType,transition:"all "+e+"s "+t.opts.transitionType})}function i(t,n,e){var i=t.opts.axisX?e+"px,0,0":"0,"+e+"px,0";n.css({"-webkit-transform":"translate3d("+i+")",transform:"translate3d("+i+")"})}function o(t,e){var i=t.opts.ul.children().eq(e).find("[data-src]");i&&i.each(function(){var t=n(this);t.is("img")?(t.attr("src",t.data("src")),t.removeAttr("data-src")):(t.css({"background-image":"url("+t.data("src")+")"}),t.removeAttr("data-src"))})}function s(t){f.touch&&!t.touches&&(t.touches=t.originalEvent.touches)}function c(t,n){n.isScrolling=void 0,n._moveDistance=n._moveDistanceIE=0,n._startX=f.touch?t.touches[0].pageX:t.pageX||t.clientX,n._startY=f.touch?t.touches[0].pageY:t.pageY||t.clientY}function a(t,n){n.opts.autoSwipe&&r(n),n.allowSlideClick=!1,n._curX=f.touch?t.touches[0].pageX:t.pageX||t.clientX,n._curY=f.touch?t.touches[0].pageY:t.pageY||t.clientY,n._moveX=n._curX-n._startX,n._moveY=n._curY-n._startY,void 0===n.isScrolling&&(n.isScrolling=n.opts.axisX?!!(Math.abs(n._moveX)>=Math.abs(n._moveY)):!!(Math.abs(n._moveY)>=Math.abs(n._moveX))),n.isScrolling&&(t.preventDefault?t.preventDefault():t.returnValue=!1,e(n,n.opts.ul,0),n._moveDistance=n._moveDistanceIE=n.opts.axisX?n._moveX:n._moveY),n.opts.continuousScroll||(0==n._index&&n._moveDistance>0||n._index+1>=n._liLength&&n._moveDistance<0)&&(n._moveDistance=0),i(n,n.opts.ul,-(n._slideDistance*n._index-n._moveDistance))}function l(t){t.isScrolling||u(t),(x.ie10||x.ie11)&&(Math.abs(t._moveDistanceIE)<5&&(t.allowSlideClick=!0),setTimeout(function(){t.allowSlideClick=!0},100)),Math.abs(t._moveDistance)<=t._distance?d(t,"",".3"):t._moveDistance>t._distance?d(t,"prev",".3"):Math.abs(t._moveDistance)>t._distance&&d(t,"next",".3"),t._moveDistance=t._moveDistanceIE=0}function u(t){t.opts.autoSwipe&&(r(t),t.autoSlide=setInterval(function(){d(t,"next",".3")},t.opts.speed))}function r(t){clearInterval(t.autoSlide)}function d(t,n,e){"number"==typeof n?(t._index=n,t.opts.lazyLoad&&(t.opts.continuousScroll?(o(t,t._index),o(t,t._index+1),o(t,t._index+2)):(o(t,t._index-1),o(t,t._index),o(t,t._index+1)))):"next"==n?(t._index++,t.opts.lazyLoad&&(t.opts.continuousScroll?(o(t,t._index+2),t._index+1==t._liLength?o(t,1):t._index==t._liLength&&o(t,0)):o(t,t._index+1))):"prev"==n&&(t._index--,t.opts.lazyLoad&&(t.opts.continuousScroll?(o(t,t._index),0==t._index?o(t,t._liLength):t._index<0&&o(t,t._liLength-1)):o(t,t._index-1))),t.opts.continuousScroll?t._index>=t._liLength?(_(t,e),t._index=0,setTimeout(function(){_(t,0)},300)):t._index<0?(_(t,e),t._index=t._liLength-1,setTimeout(function(){_(t,0)},300)):_(t,e):(t._index>=t._liLength?t._index=0:t._index<0&&(t._index=t._liLength-1),_(t,e)),""!==arguments[1]&&t.opts.callback(t._index,t._liLength,t.$el)}function _(t,n){e(t,t.opts.ul,n),i(t,t.opts.ul,-t._index*t._slideDistance)}var p,h,x={ie10:t.navigator.msPointerEnabled,ie11:t.navigator.pointerEnabled},v=["touchstart","touchmove","touchend"],f={touch:t.Modernizr&&!0===Modernizr.touch||!!("ontouchstart"in t||t.DocumentTouch&&document instanceof DocumentTouch)};x.ie10&&(v=["MSPointerDown","MSPointerMove","MSPointerUp"]),x.ie11&&(v=["pointerdown","pointermove","pointerup"]),p={touchStart:v[0],touchMove:v[1],touchEnd:v[2]},n.fn.swipeSlide=function(t){var n=[];return this.each(function(e,i){n.push(new h(i,t))}),n},(h=function(t,e){var i=this;i.$el=n(t),i._distance=50,i.allowSlideClick=!0,i.init(e)}).prototype.init=function(r){function d(){var t,o=h.opts.ul.children();h._slideDistance=h.opts.axisX?h.opts.ul.width():h.opts.ul.height(),e(h,h.opts.ul,0),i(h,h.opts.ul,-h._slideDistance*h._index),e(h,o,0),t=h.opts.continuousScroll?-1:0,o.each(function(e){i(h,n(this),h._slideDistance*(e+t))})}var _,h=this;return h.opts=n.extend({},{ul:h.$el.children("ul"),li:h.$el.children().children("li"),index:0,continuousScroll:!1,autoSwipe:!0,speed:4e3,axisX:!0,transitionType:"ease",lazyLoad:!1,firstCallback:function(){},callback:function(){}},r),h._index=h.opts.index,h._liLength=h.opts.li.length,h.isScrolling,h.opts.firstCallback(h._index,h._liLength,h.$el),h._liLength<=1?(h.opts.lazyLoad&&o(h,0),!1):(h.opts.continuousScroll&&h.opts.ul.prepend(h.opts.li.last().clone()).append(h.opts.li.first().clone()),h.opts.lazyLoad&&(o(h,h._index),h.opts.continuousScroll?(o(h,h._index+1),o(h,h._index+2),0==h._index?o(h,h._liLength):h._index+1==h._liLength&&o(h,1)):0==h._index?o(h,h._index+1):h._index+1==h._liLength?o(h,h._index-1):(o(h,h._index+1),o(h,h._index-1))),d(),(x.ie10||x.ie11)&&(_="",_=h.opts.axisX?"pan-y":"none",h.$el.css({"-ms-touch-action":_,"touch-action":_}),h.$el.on("click",function(){return h.allowSlideClick})),u(h),h.$el.on(p.touchStart,function(t){s(t),c(t,h)}),h.$el.on(p.touchMove,function(t){s(t),a(t,h)}),h.$el.on(p.touchEnd,function(){l(h)}),h.opts.ul.on("webkitTransitionEnd MSTransitionEnd transitionend",function(){u(h)}),void n(t).on("onorientationchange"in t?"orientationchange":"resize",function(){clearTimeout(h.timer),h.timer=setTimeout(d,150)}))},h.prototype.goTo=function(t){d(this,t,".3")}}(window,window.Zepto||window.jQuery);