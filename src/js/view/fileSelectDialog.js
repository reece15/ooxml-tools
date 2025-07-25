/**
 *
 * @param fileInfo {
 *  file1: {
 *    name: file1_name,
 *    size: file1_size,
 *    modified: file1_lastModified
 *  };
 *  file2: {
 *    name: file2_name,
 *    size: file2_size,
 *    modified: file2_lastModified
 *  }
 * }
 * @param rightFile
 * @returns {{}}
 * @constructor
 */
function FileSelectDialog(fileInfo, selectionCompleteCB, dialogCancelled) {
  var fileSwapped = false, _outerDiv;
  var _api = {
    isFileSwapped: function() {
      return fileSwapped;
    }
  }


  var _createDialog = function () {
     _outerDiv = DOMUtils.createElementAndAppend('div', document.body,
      'files_to_compare');
    _centerAlignDialog(_outerDiv);
    var headerDiv = DOMUtils.createElementAndAppend('div', _outerDiv,
      'files_to_compare_header');
    headerDiv.textContent = 'Files to compare';
    var _filesToCompareContainer = DOMUtils.createElementAndAppend('div', _outerDiv,
      'files_to_compare_container');
    _createContent(_filesToCompareContainer);

  }

  function _createContent(parent) {
    _createLeftPanel(parent);
    _createRightPanel(parent);
  }
  function _createLeftPanel(parent) {
    var leftPanelContainer = DOMUtils.createElementAndAppend('div', parent,
      "files_to_compare_left_container");
    _createFileTypeHeader(leftPanelContainer, 'Left File ', '(Original)');
    var tableDiv = DOMUtils.createElementAndAppend('div', leftPanelContainer);
    var table = DOMUtils.createElementAndAppend('table', tableDiv);
    _createContentRow(table, 'Name', fileInfo.file1.name);
    _createEmptyRow(table);
    _createContentRow(table, 'Size', Util.getSizeString(fileInfo.file1.size));
    _createEmptyRow(table);
    _createContentRow(table, 'Modified', Util.getFormattedDateTime(fileInfo.file1.modified));
  }
  function _createRightPanel(parent) {
    var rightContainer = DOMUtils.createElementAndAppend('div', parent, 'right_container');
    _createButtons(rightContainer);
    var rightPanelContainer = DOMUtils.createElementAndAppend('div', rightContainer,
      "files_to_compare_right_container");
    _createFileTypeHeader(rightPanelContainer, 'Right File ', '(Modified)');
    var tableDiv = DOMUtils.createElementAndAppend('div', rightPanelContainer);
    var table = DOMUtils.createElementAndAppend('table', tableDiv);
    _createContentRow(table, 'Name', fileInfo.file2.name);
    _createEmptyRow(table);
    _createContentRow(table, 'Size', Util.getSizeString(fileInfo.file2.size));
    _createEmptyRow(table);
    _createContentRow(table, 'Modified', Util.getFormattedDateTime(fileInfo.file2.modified));
  }

  function _createFileTypeHeader(parent, sideText, typeText) {
    var fileTypeHeader = DOMUtils.createElementAndAppend('div', parent,
      'file_type_header');
    var sideElem = DOMUtils.createElementAndAppend('span', fileTypeHeader, 'side');
    sideElem.textContent = sideText;
    var typeElem = DOMUtils.createElementAndAppend('span', fileTypeHeader, 'type');
    typeElem.textContent = typeText;
  }
  function _createContentRow(table, property, value) {
    var row = DOMUtils.createElementAndAppend('tr', table);
    var firstCol = DOMUtils.createElementAndAppend('td', row, 'property');
    firstCol.textContent = property;
    var secondCol = DOMUtils.createElementAndAppend('td', row, 'value');
    var valueText = DOMUtils.createElementAndAppend('div', secondCol, 'value_text');
    valueText.textContent = value;
  }
  function _createEmptyRow(table) {
    var row = DOMUtils.createElementAndAppend('tr', table, 'spacer');
    DOMUtils.createElementAndAppend('td', row);
  }


  function _createButtons(rightContainer) {
    var buttonContainer = DOMUtils.createElementAndAppend('div', rightContainer, 'button_container');
    var buttonLabels = ['Swap', 'Cancel', 'OK'];
    var callBacks = [_handleSwap, _handleCancel, _handleOK];
    for(var i = 0; i < buttonLabels.length; i++) {
      var input = DOMUtils.createElementAndAppend('button', buttonContainer, 'file_selector_buttons');
      input.textContent = buttonLabels[i];
      input.onclick = callBacks[i];
    }
  }
  function _centerAlignDialog(outerDiv) {
    outerDiv.style.position = 'absolute';
    outerDiv.style.left = ((screen.width - 800) / 2) + 'px';
    outerDiv.style.top = ((screen.height - 320) / 4) + 'px';
  }
  function _handleOK() {
    closeDialog();
    if (selectionCompleteCB) {
      selectionCompleteCB();
    }
  }
  function _handleCancel() {
    closeDialog();
    dialogCancelled();
  }
  function _handleSwap() {
    fileSwapped = !fileSwapped;
    var leftContainer = document.getElementsByClassName('files_to_compare_left_container')[0];
    var lcValues = leftContainer.querySelectorAll('div.value_text');
    var rightContainer = document.getElementsByClassName('files_to_compare_right_container')[0];
    var rcValues = rightContainer.querySelectorAll('div.value_text');
    for(var i = 0; i < lcValues.length; i++) {
      var temp = lcValues[i].textContent;
      lcValues[i].textContent = rcValues[i].textContent;
      rcValues[i].textContent = temp;
    }
  }
  function closeDialog() {
    document.body.removeChild(_outerDiv);
  }
  _createDialog();
  return _api;
}