function ProgressBar() {
  var _api = {};
  var _progressContainer;

  _api.getElement = function() {
    return _progressContainer;
  };

  _api.close = function() {
    if (_progressContainer) {
      document.body.removeChild(_progressContainer);
    }
    _progressContainer = undefined;
  }
  function _init() {
    if (!_progressContainer) {
      _progressContainer = document.createElement('div');
      _progressContainer.id = 'progressbar';
      _progressContainer.style.backgroundImage =  "url('res/loading.gif')";
      _progressContainer.style.backgroundRepeat = "no-repeat";
      _progressContainer.style.backgroundPosition = "center center";
      _progressContainer.style.backgroundColor = 'white';
    }
  }

  _init();
  return _api;
}

function Slider() {
  var _api = {};
  var _slider;
  _api.update = function(total, current) {
    var percent = Math.round((current*100)/total);
    document.getElementById("sliderbar").style.width = percent+'%';
    document.getElementById("sliderprogress").innerHTML = percent+'%';
  }
  _api.getElement = function () {
    return _slider;
  }

  function _init() {
    _slider = document.createElement("div");
    _slider.id = "slider";
    _slider.style.left = ((screen.width - 350) / 2) + "px";
    _slider.style.top = ((screen.height - 15) / 4) + "px";
    var sliderBar = document.createElement("div");
    sliderBar.id="sliderbar";
    _slider.appendChild(sliderBar);
    var sliderProgress = document.createElement("div");
    sliderProgress.id = "sliderprogress";
    _slider.appendChild(sliderProgress);
  }
  _init();
  return _api;
}