/**
 * config = {
 *  file1: name of the file1
 *  file2: name of the file2
 *  diffList: diffList object
 * }
 * @param diffConfig
 * @constructor
 */
function FolderDiff(ooxmlDiff, leftFile, rightFile, fileSelectCallback, newFileRequest) {
  var _root_el;
  var diffList;
  var _lastSelectedElement;
  function show() {
    _root_el = DOMUtils.createElementAndAppend('div', document.body, 'folderdiff_root');
    _attacheTopBar();

    var fdContainerParent = DOMUtils.createElementAndAppend('div', _root_el,
      'width_full');
    attachFileNameHeader(fdContainerParent);
    var folderdiffContainer = DOMUtils.createElementAndAppend('div', fdContainerParent,
      'folderdiff_container');
    diffList = ooxmlDiff.getUnion();;
    for(var  i = 0; i < diffList.length; i++) {
      var item = diffList[i];
      var row = DOMUtils.createElementAndAppend('div', folderdiffContainer, 'row');
      row.classList.add(_getClassName(item));
      row.id = "row-" + i;
      row.addEventListener("click", _handleRowClick, false);
      row.addEventListener("dblclick", _handleRowDoubleClick, false);
      var leftPanelCell = DOMUtils.createElementAndAppend('div', row, 'left_panel_cell');
      _attachIcon(leftPanelCell, item);
      if(item.existsInFile1) {
        var leftPanelContent = DOMUtils.createElementAndAppend('span', leftPanelCell);
        leftPanelContent.style.verticalAlign = 'bottom';
        leftPanelContent.textContent = item.path;
      }
      var rightPanelCell = DOMUtils.createElementAndAppend('div', row, 'right_panel_cell');
      if(item.existsInFile2) {
        var rightPanelContent = DOMUtils.createElementAndAppend('span', rightPanelCell, 'right_diff_partnames');
        rightPanelContent.textContent = item.path;
      }
      var clearCell = DOMUtils.createElementAndAppend('div', row);
      clearCell.style.clear = 'both';
      if (i === 0) {
        selectRow(row);
      }
    }
  }
  function _attacheTopBar() {
    var topBar = DOMUtils.createElementAndAppend('div', _root_el, 'filediff_topbar');
    topBar.innerHTML = '<button id= "newfile" class = "topbar_button" title= "New File"><img src="res/new.png" style="width: 66px; height: 30px"/></button>';
    document.getElementById("newfile").addEventListener("click", newFileRequest, false);

  }
  function attachFileNameHeader(fdContainerParent) {
    var fileNameHeader = DOMUtils.createElementAndAppend('div', fdContainerParent);
    var row = DOMUtils.createElementAndAppend('div', fileNameHeader, 'filename_row');
    var leftPanelCell = DOMUtils.createElementAndAppend('div', row, 'left_panel_cell');
    leftPanelCell.innerHTML = '<span>' + leftFile + '</span>';
    var rightPanelCell = DOMUtils.createElementAndAppend('div', row, 'right_panel_cell');
    var rightPanelContent = DOMUtils.createElementAndAppend('span', rightPanelCell, 'right_diff_partnames');
    rightPanelContent.textContent = rightFile;
    var clearCell = DOMUtils.createElementAndAppend('div', row);
    clearCell.style.clear = 'both';
  }

  function _getClassName(item) {
    var className;
    if (item.existsInFile1 && item.existsInFile2) {
      className = item.difference ? 'red' : 'green';
    } else if ((item.existsInFile1 || item.existsInFile2)) {
      className = 'blue';
    }
    return className;
  }
  function _attachIcon(leftPanelCell, item) {
    var icon = DOMUtils.createElementAndAppend('img', leftPanelCell);
    icon.src = _getIconName(item);
    icon.style.width = '20px';
    icon.style.height = '20px';
    icon.style.marginRight = '20px';
  }
  function _getIconName(item) {
    var iconName;
    if (item.existsInFile1 && item.existsInFile2) {
      iconName = item.difference ? 'not-equal.jpg' : 'equal2.png';
    } else if (item.existsInFile1) {
      iconName = 'file_delete.png';
    } else if (item.existsInFile2) {
      iconName = 'file_add.png';
    }
    return 'res/' + iconName;
  }

  function _handleRowClick(event) {
    unSelectRow(_lastSelectedElement);
    var elm = _getRowElement(event.target);
    selectRow(elm);
  }
  function _getRowElement(source) {
    var elm = source;
    while (elm && elm.id !== undefined && elm.id.indexOf('row-') !== 0) {
      elm = elm.parentNode
    }
    return elm;
  }
  function unSelectRow(rowElement) {
    if (rowElement) {
      rowElement.style.backgroundColor = "";
      rowElement.style.color = "";
    }
  }

  function selectRow(rowElement) {
    if (rowElement) {
      rowElement.style.backgroundColor = '#4653C9';
      rowElement.style.color = 'white';
      _lastSelectedElement = rowElement;
    }
  }
  function _handleRowDoubleClick(event) {
    clearSelection();
    var elm = _getRowElement(event.target);
    var id = elm.id;
    var index = id.split("-")[1];
    if (isDiffPossible(index)) {
      showFileDiff(index);
    } else {
      var alert = new Alert('Can show diff only of xml files');
      alert.show();
    }
  }
  function isDiffPossible(index) {
    var item = diffList[index];
    return FileNameUtils.isXMLFile(item.path);
  }
  function showFileDiff(diffListIndex) {
    var item = diffList[diffListIndex];
    var existsInBoth = item.existsInFile1 && item.existsInFile2;
    var leftPartPath = FileNameUtils.removeExtension(leftFile) + '/' + item.path;
    var rightPartPath = FileNameUtils.removeExtension(rightFile) + '/' + item.path;
    if (existsInBoth) {
      fileSelectCallback(item.file1Data, item.file2Data, leftPartPath, rightPartPath);
    } else if (item.existsInFile1) {
      fileSelectCallback(item.file1Data, "", leftPartPath, "");
    } else if (item.existsInFile2) {
      fileSelectCallback("", item.file2Data, "", rightPartPath);
    }
  }

  function clearSelection() {
    if(document.selection && document.selection.empty) {
      document.selection.empty();
    } else if(window.getSelection) {
      var sel = window.getSelection();
      sel.removeAllRanges();
    }
  }
  var _api = {};

  _api.hide = function() {
    _root_el.style.display = "none";
  }
  _api.show = function() {
    _root_el.style.display = "block";
  }
  show();
  return _api;
}