// Generated by LiveScript 1.5.0
(function(){
  "use strict";
  var host, apiURL, method, encodingType, charset, winName, requestTemplate, $id, $q, getLocalLink, getLastSegment, getStreamURL, createForm, timeIt, getStep, getCargo, getHTML, collectData, sendData, every, timer;
  host = 'https://gv.erinome.net/reporter';
  apiURL = host + "/send";
  method = 'POST';
  encodingType = 'multipart/form-data';
  charset = 'utf-8';
  winName = 'gv-reporter-win';
  requestTemplate = {
    protocolVersion: 1,
    agent: "GVReporter/1.1.0",
    link: null,
    stepDuration: location.hostname === 'godvillegame.com' ? 23 : 20,
    scale: 11,
    step: null,
    playerIndex: 0,
    cargo: null,
    data: null
  };
  $id = function(it){
    return document.getElementById(it);
  };
  $q = function(it){
    return document.querySelector(it);
  };
  getLocalLink = function(){
    return "" + location.protocol + "//" + location.host + "" + $id('fbclink').href.replace(/^(?:\w*:\/\/)?[^\/]*/, "") + "";
  };
  getLastSegment = function(url){
    return /\/([^\/]*?)(?:\#.*)?$/.exec(url)[1];
  };
  getStreamURL = function(localLink){
    return host + "/duels/log/" + getLastSegment(localLink);
  };
  createForm = function(){
    var x$, form, key, ref$, value, y$;
    x$ = form = document.createElement('form');
    x$.method = method;
    x$.action = apiURL;
    x$.enctype = encodingType;
    x$.acceptCharset = charset;
    x$.target = winName;
    x$.style.display = 'none';
    for (key in ref$ = requestTemplate) {
      value = ref$[key];
      y$ = document.createElement('input');
      y$.type = 'hidden';
      y$.name = key;
      if (value != null) {
        y$.value = value;
      }
      form.appendChild(y$);
    }
    return form;
  };
  timeIt = function(title, action){
    console.time(title);
    try {
      return action();
    } finally {
      console.timeEnd(title);
    }
  };
  getStep = function(){
    var e;
    try {
      return +/\d+/.exec($q('#m_fight_log .block_h .block_title').textContent)[0];
    } catch (e$) {
      e = e$;
      return 0;
    }
  };
  getCargo = function(){
    var e;
    try {
      return $q('#hk_cargo .l_val').textContent;
    } catch (e$) {
      e = e$;
      return "";
    }
  };
  getHTML = function(id){
    var e;
    try {
      return $id(id).outerHTML;
    } catch (e$) {
      e = e$;
      return "";
    }
  };
  collectData = function(){
    return timeIt("Collected", function(){
      return {
        step: getStep(),
        cargo: getCargo(),
        data: base64js.fromByteArray(pako.deflate(['alls', 's_map', 'm_fight_log'].map(getHTML).join("<&>")))
      };
    });
  };
  sendData = function(form, data){
    var i$, x$, ref$, len$, that;
    for (i$ = 0, len$ = (ref$ = form.children).length; i$ < len$; ++i$) {
      x$ = ref$[i$];
      if ((that = data[x$.name]) != null) {
        x$.value = that;
      }
    }
    open("about:blank", winName, "toolbar=no,scrollbars=no,location=no,status=no,menubar=no,resizable=no,height=150,width=243");
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  };
  every = function(ms, action){
    return setInterval(action, ms);
  };
  timer = every(300, function(){
    var localLink, form, heroBlock, streamingLink;
    if (!($id('hero_columns') != null && window.pako != null && window.base64js != null)) {
      return;
    }
    clearInterval(timer);
    if ($id('s_map') == null) {
      return;
    }
    requestTemplate.link = localLink = getLocalLink();
    form = createForm();
    heroBlock = $id('hero_block');
    heroBlock.insertAdjacentHTML('afterbegin', "<div style='text-align: center;'><a href='#' target='_blank'>Транслировать</a></div>");
    streamingLink = heroBlock.firstChild.firstChild;
    streamingLink.onclick = function(){
      var x$, data, lastStep;
      x$ = streamingLink;
      x$.textContent = "Идёт трансляция";
      x$.href = getStreamURL(localLink);
      x$.onclick = null;
      data = collectData();
      lastStep = data.step;
      sendData(form, data);
      every(500, function(){
        var step;
        if ((step = getStep()) > lastStep) {
          lastStep = step;
          sendData(form, collectData());
        }
      });
      return false;
    };
  });
}).call(this);
