function Alert(message, alertCloseCB) {

  var _api = {};
  var _alertContainer;

  _api.show = function () {
    _alertContainer.style.display = 'block';
  };

  _api.close = function() {
    close();
  }

  function _init() {
    _alertContainer = document.createElement('div');
    _alertContainer.className =  "alertcontainer";

    _alertContainer.style.display = 'none';

    var alertMessage = document.createElement('div');
    alertMessage.className = 'messagearea';
    alertMessage.innerText = message;
    _alertContainer.appendChild(alertMessage);

    var buttonArea = document.createElement('div');
    buttonArea.className = 'okbuttonarea';
    var okButton = document.createElement('input');
    okButton.type = 'button';
    okButton.value = 'OK';
    okButton.style.width = '80px';
    okButton.addEventListener('click', close, false);
    buttonArea.appendChild(okButton);
    _alertContainer.appendChild(buttonArea);
    document.body.appendChild(_alertContainer);
  };


  function close() {
    _alertContainer.style.display = 'none';
    document.body.removeChild(_alertContainer);
    if (alertCloseCB) {
      alertCloseCB();
    }
  }


  _init();

  return _api;
}