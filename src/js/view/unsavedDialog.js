function UnsavedChangesDialog(saveCB, discardCB, closeCB, filename) {
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
    titleMessage.innerHTML = "Unsaved Changes";
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
    alertMessage.innerText = "Do you want to save changes you made to " + filename;
    _alertContainer.appendChild(alertMessage);

    var buttonArea = document.createElement('div');
    buttonArea.className = 'saveDiscardButtonArea';
    var saveButton = document.createElement('input');
    saveButton.type = 'button';
    saveButton.value = 'Save';
    saveButton.style.width = '80px';
    saveButton.style.marginRight = '20px';
    saveButton.addEventListener('click', _saveChanges, false);
    buttonArea.appendChild(saveButton);

    var discardButton = document.createElement('input');
    discardButton.type = 'button';
    discardButton.value = 'Discard';
    discardButton.style.width = '80px';
    discardButton.addEventListener('click', _discardChanges, false);
    buttonArea.appendChild(discardButton);

    _alertContainer.appendChild(buttonArea);
    document.body.appendChild(_alertContainer);
  }
  function _close() {
    document.body.removeChild(_alertContainer);
    if(closeCB) {
      closeCB();
    }
  }
  function _saveChanges() {
    _close();
    if (saveCB) {
      saveCB();
    }
  }

  function _discardChanges() {
    _close();
    if (discardCB) {
      discardCB();
    }
  }
  _constructHTML();
  return _api;
}