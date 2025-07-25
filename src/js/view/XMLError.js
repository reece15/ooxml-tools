function XMLError(message, closeCB, saveCB) {
    var _api = {};
    var _alertContainer;
    _api.getElement = function() {

    }
    function _constructHTML() {
      _alertContainer = document.createElement('div');
      _alertContainer.className =  "alertcontainer";

      var title = document.createElement('div');
      title.className = 'unsavedChangesTitle';
      _alertContainer.appendChild(title);

      var titleMessage = document.createElement('div');
      titleMessage.style.float = 'left';
      titleMessage.innerHTML = "XML not well-formed";
      title.appendChild(titleMessage);

      var closeButtonContainer = document.createElement('div');
      closeButtonContainer.style.float = 'right';
      var closeButton = document.createElement('button');
      closeButton.innerHTML = 'X';
      closeButton.addEventListener('click', _close);
      closeButtonContainer.appendChild(closeButton);

      title.appendChild(closeButtonContainer);

      var alertMessage = document.createElement('div');
      alertMessage.className = 'messagearea';
      alertMessage.style.height = '75px';
      alertMessage.style.clear = 'both';
      alertMessage.innerText = message;
      _alertContainer.appendChild(alertMessage);


      var buttonArea = document.createElement('div');
      buttonArea.style.textAlign = 'center';
      var okButton = document.createElement('input');
      okButton.type = 'button';
      okButton.value = 'Goto Error';
      okButton.style.width = '80px';
      okButton.style.marginRight = '10px';
      okButton.addEventListener('click', _close, false);
      buttonArea.appendChild(okButton);
      if (saveCB) {
        var saveButton = document.createElement('input');
        saveButton.type = 'button';
        saveButton.value = 'Save Anyway';
        saveButton.style.width = '80px';
        saveButton.addEventListener('click', _saveCB, false);
        saveButton.style.marginLeft = '10px';
        buttonArea.appendChild(saveButton);
      }
      _alertContainer.appendChild(buttonArea);

      _alertContainer.appendChild(buttonArea);
      document.body.appendChild(_alertContainer);
    }
    function _close() {
      document.body.removeChild(_alertContainer);
      if (closeCB) {
        closeCB();
      }
    }
    function _saveCB() {
      document.body.removeChild(_alertContainer);
      if (saveCB) {
        saveCB();
      }
    }
    _constructHTML();
    return _api;
  }