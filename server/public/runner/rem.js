(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? (module.exports = factory())
    : typeof define === 'function' && define.amd
    ? define(factory)
    : (global.rem = factory());
})(this, function() {
  //'use strict';

  //@todo  璁捐鍥惧昂瀵镐笉鍚屾満鍨嬬瓑姣斾緥缂╂斁妯″紡锛屽熀纭€html灏哄涓嶅悓鏈哄瀷閫傞厤妯″紡

  var rem = {
    designWidth: 750, //璁捐绋垮px鍊�
    px2rem: 100, //px to rem涓�100鍊嶆瘮渚嬭浆鎹紝瀹藉害寤鸿鐢ㄧ櫨鍒嗘瘮
    defaultFontSize: 20, //榛樿1rem瀛椾綋澶у皬
    maxWidth: 0, //rem閫傞厤鏈€澶у昂瀵�(灞忓箷鍐嶅ぇ涔熷氨閭ｄ釜灏哄浜�)
    dpr: 1
  };

  //璁剧疆鎵嬫妱鐗规畩澶�
  rem.sjcg_android = navigator.userAgent.indexOf('Hexin_Gphone/') > -1;
  rem.sjcg_ios = navigator.userAgent.indexOf('IHexin/') > -1;
  rem.sjcg = rem.sjcg_android || rem.sjcg_ios;
  rem.android = navigator.userAgent.indexOf('Android') > -1;

  try {
    if (rem.sjcg_android) {
      //鎵嬬倰android璁剧疆dpr涓嶇敓鏁�
      rem.dpr = 1;

      //鐩存帴绂佺敤瀛椾綋澶у皬璁剧疆
      callNativeHandler('webViewFontController', '{"fontsize":"1", "switch":"0"}', function(data) {});
    } else if (rem.android) {
      //android璁剧疆dpr涓嶇敓鏁�
      rem.dpr = 1;
    }

    // 璁剧疆榛樿鏈€澶у昂瀵�
    var clientWidth = window.screen.width;
    if (clientWidth >= 480) {
      rem.maxWidth = 360;
    }
  } catch (e) {}

  var remEl = document.querySelector('meta[name="rem"]');

  if (remEl) {
    var remCon = remEl.getAttribute('content');
    if (remCon) {
      var initialDprMatch = remCon.match(/initial\-dpr=([\d\.]+)/);
      if (initialDprMatch) {
        rem.dpr = parseFloat(initialDprMatch[1]);
      }
      var designWidthMatch = remCon.match(/design\-width=([\d\.]+)/);
      if (designWidthMatch) {
        rem.designWidth = parseFloat(designWidthMatch[1]);
      }

      var maxWidthMatch = remCon.match(/max\-width=([\d\.]+)/);
      if (maxWidthMatch) {
        rem.maxWidth = parseFloat(maxWidthMatch[1]);
      }
    }
  }

  document.documentElement.setAttribute('data-dpr', rem.dpr);
  document.documentElement.setAttribute('max-width', rem.maxWidth);

  var viewportEl = document.querySelector('meta[name="viewport"]');
  var scale = 1 / rem.dpr;
  var content =
    'width=device-width, initial-scale=' +
    scale +
    ', minimum-scale=' +
    scale +
    ', maximum-scale=' +
    scale +
    ', user-scalable=no';

  if (viewportEl) {
    viewportEl.setAttribute('content', content);
  } else {
    viewportEl = document.createElement('meta');
    viewportEl.setAttribute('name', 'viewport');
    viewportEl.setAttribute('content', content);
    document.head.appendChild(viewportEl);
  }

  var d = document.createElement('div');
  d.style.width = '1rem';
  d.style.display = 'none';
  document.head.appendChild(d);
  try {
    rem.defaultFontSize = parseFloat(window.getComputedStyle(d, null).getPropertyValue('width'));
  } catch (e) {}

  rem.get_px = function(px_num) {
    var px = parseInt(px_num);
    if (!px) {
      return false;
    }
    return rem.dpr * px + 'px';
  };

  rem.resize = function() {
    var measureWidth = 0;
    try {
      measureWidth = document.documentElement.getBoundingClientRect().width;
    } catch (e) {}

    if (!measureWidth) {
      measureWidth = window.innerWidth;
    }

    if (!measureWidth) {
      return false;
    }

    if (rem.maxWidth) {
      var tp = rem.maxWidth * rem.dpr;
      if (measureWidth > tp) {
        measureWidth = tp;
      }
    }

    var fontSize = (measureWidth * 0.9 / (rem.designWidth / rem.px2rem) / rem.defaultFontSize) * 100;
    
    var elName = 'rem';
    var remStyle = document.getElementById(elName);
    if (remStyle) {
      remStyle.innerHTML = 'html{font-size:' + fontSize + '% !important;}';
    } else {
      remStyle = document.createElement('style');
      remStyle.setAttribute('id', elName);
      remStyle.innerHTML = 'html{font-size:' + fontSize + '% !important;}';
      document.head.appendChild(remStyle);
    }

    rem.callback && rem.callback();
  };

  rem.resize();

  window.addEventListener(
    'resize',
    function() {
      clearTimeout(rem.tid);
      rem.tid = setTimeout(rem.resize, 33);
    },
    false
  );

  window.addEventListener('load', rem.resize, false);

  setTimeout(function() {
    rem.resize();
  }, 333);

  return rem;
});
