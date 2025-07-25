/**
 *
 */

function FileDragArea(filesDropped) {

  var _api = {}
  _api.close = function() {
    document.body.innerHTML = "";
  }
  function _prepareDOM() {
    document.body.innerHTML = "";
    var dropBox = document.createElement('div');
    dropBox.id = 'dropbox';
    dropBox.className = 'dragsection';

    var messageWrapper = document.createElement('div');
    messageWrapper.className = 'wrapper';
    dropBox.appendChild(messageWrapper);

    var ooxmlEditorMessage = document.createElement('span');
    ooxmlEditorMessage.className = 'message';
    ooxmlEditorMessage.textContent = "Drag 1 file to open OOXML Editor ";
    messageWrapper.appendChild(ooxmlEditorMessage);
    messageWrapper.appendChild(document.createElement('br'));
    var ooxmlDiffMessage = document.createElement('span');
    ooxmlDiffMessage.className = 'message';
    ooxmlDiffMessage.textContent = "Drag 2 files to open OOXML Diff Tool";
    messageWrapper.appendChild(ooxmlDiffMessage);
    document.body.appendChild(dropBox);
  }
  function _attachEvents() {
    var dropBox = document.getElementById("dropbox");
    dropBox.addEventListener("dragenter", noopHandler, false);
    dropBox.addEventListener("dragexit", noopHandler, false);
    dropBox.addEventListener("dragover", noopHandler, false);
    dropBox.addEventListener("drop", drop, false);
  }

  /**
   * No operation handler. This prevents the event propagation and prevents the
   * default browser action.
   * @param event
   */
  function noopHandler(event) {
    if (event.stopPropagation) {
      event.stopPropagation();
    }
    if (event.preventDefault) {
      event.preventDefault();
    }
  }

  function drop(event) {
    event.stopPropagation();
    event.preventDefault();

    var files = event.dataTransfer.files;
    filesDropped(files);
  }
  function _init() {
    _prepareDOM();
    _attachEvents();
  }
  _init();
  return _api;
}