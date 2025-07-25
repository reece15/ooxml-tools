/**
 * config = {
 *  baseText: Base text
 *  newText: New Text
 * }
 * @param diffConfig
 * @constructor
 */
function FileDiff(diffConfig, closeCallback, newFileRequest, diffRenderUpdate) {
  var _root_el;
  function show() {

    _root_el = DOMUtils.createElementAndAppend('div', document.body,
      'diff_view');
    _attacheTopBar();
    var diffContainer = DOMUtils.createElementAndAppend('div', _root_el,
      'diff_container');
    diffContainer.id = "diffoutput";
    _attacheTitleBar(diffContainer);

    var diffTableParent = DOMUtils.createElementAndAppend('div',diffContainer,
      'diff_table_parent');



    diffTableParent.appendChild(createDiffTable(diffConfig.rowsData));
//      (diffview.buildView({ baseTextLines:diffConfig.baseText,
//                             newTextLines:diffConfig.newText,
//                             opcodes:diffConfig.opcodes,
//                             baseTextName:"",//diffConfig.baseFile,
//                             newTextName:"",//diffConfig.newFile,
//                             contextSize:null,
//                             viewType: 0}));

    _addEventListener();

  }
  var tbody;
  function createDiffTable() {
    var table = document.createElement('table');
    table.className = "diff";
    tbody = document.createElement('tbody');
    table.appendChild(tbody);
    setTimeout(appendDiffRows, 10);
    return table;
  }
  var rowIndex = 0, slider;
  function appendDiffRows() {
    var fragment = document.createDocumentFragment();
    for(; rowIndex < diffConfig.rowsData.length; rowIndex++) {
      var row = document.createElement('tr');
      row.innerHTML = diffConfig.rowsData[rowIndex];
      tbody.appendChild(row);
      if (rowIndex % 1000 === 0) {
        diffRenderUpdate(diffConfig.rowsData.length, rowIndex);
        setTimeout(appendDiffRows, 10);
        rowIndex++;
        break;
      }
    }
    if (rowIndex === diffConfig.rowsData.length) {
      diffRenderUpdate(diffConfig.rowsData.length, rowIndex);
    }
  }



  function _attacheTitleBar(diffContainer) {
    var titleBar = DOMUtils.createElementAndAppend('div', diffContainer,
      'title-bar');
    var leftFileHeader = DOMUtils.createElementAndAppend('div', titleBar, 'leftFileHeader');
    leftFileHeader.textContent = Util.cutStringLeft(diffConfig.baseFile, 80);
    var rightFileHeader = DOMUtils.createElementAndAppend('div', titleBar, 'rightFileHeader');
    rightFileHeader.textContent = Util.cutStringLeft(diffConfig.newFile, 80);
  }
  function _attacheTopBar() {
    var topBar = DOMUtils.createElementAndAppend('div', _root_el, 'filediff_topbar');
    topBar.innerHTML = '<button id= "filediff_newfile" class = "topbar_button" title= "New File"><img src="res/new.png" style="width: 66px; height: 30px"/></button>' +
      '<button id= "back" class = "topbar_button" title = "Back"><img src="res/back.png" style="width: 66px; height: 30px"/></button>';
    document.getElementById("filediff_newfile").addEventListener("click", newFileRequest, false);
    document.getElementById("back").addEventListener("click", _handleClose, false);

  }
  function _addEventListener() {
    document.onkeyup = function(evt) {
      evt = evt || window.event;
      if (evt.keyCode == 27) {
        _handleClose();
        document.onkeyup = null;
      }
    };
  }
  function _handleClose() {
    _root_el.innerHTML = "";
    if (_root_el.parentElement && _root_el.parentElement.tagName.toLowerCase() === 'body') {
      document.body.removeChild(_root_el);
      closeCallback();
    }

  }
  show();
}