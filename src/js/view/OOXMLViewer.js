function OOXMLViewer(_ooxmlStructure, fileName, _newFileRequestCB) {

  var _xmlViewer, _xmlEditor, _currentOpenFile, isViewerMode = false;
  var nextOperationData = {}, _directoriesFrames = [], downloadDialog, buymeCoffeeDialog;
  var _api = {};

  _api.render = function() {
    createOOXMLViewer();
    updateUI();
  };

  function createOOXMLViewer() {
    document.body.innerHTML =
      '<div id="topbar">' +
        '<button id= "newfile" class = "topbar_button" title= "New File">' +
        '<img src="res/new.png" style="width: 66px; height: 30px"/></button>' +
        '<button id= "savefile" disabled = "true" class = "topbar_button" title= "Save File">' +
        '<img src="res/save.png" style="width: 66px; height: 30px"/></button>' +
        '<button id= "downloadfile" class = "topbar_button" title= "Download File">' +
        '<img src="res/download.png" style="width: 66px; height: 30px"/></button>' +
        '<button id= "buymecoffee" class = "topbar_button" title= "Buy Me A Coffee Using Paypal">' +
        '<img src="res/buymecoffee.png" style="width: 66px; height: 30px"/></button>' +
        '<span id="openfilename"></span>' +
        '<div style="display:inline-block; font-size:10px">' +
          '<span id="size"></span><br/>'+
        '</div>' +
      '</div>' +
      '<div class="oocontainer">' +
        '<div style="height: 100%">' +
          '<div class="leftpanelcell">' +
            '<div style="padding: 25px 0px 20px 15px;">' +
              '<div id = "leftpanel"></div>' +
          '</div></div>' +
          '<div class="rightpanelcell">' +
            '<div id = "rightpanel">' +
              '<div id="container">' +
                '<div id="changes" class="changes">' +
                '</div>' +
                '<div id="filename">' +
                  'Select file to view content' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';

    document.getElementById("openfilename").innerText = fileName;

    document.getElementById("newfile").addEventListener("click", newFileRequest, false);
    document.getElementById("savefile").addEventListener("click", saveButtonClickHandler, false);
    document.getElementById("downloadfile").addEventListener("click", downloadFile, false);
    document.getElementById("buymecoffee").addEventListener("click", buyMeCoffee, false);
    document.title = fileName;
    var rightPanel = document.getElementById('rightpanel');

    _xmlViewer = new XMLViewer();
    rightPanel.appendChild(_xmlViewer.getElement());

    _xmlEditor = new XMLEditor(documentChanged);
    rightPanel.appendChild(_xmlEditor.getElement());
    _xmlEditor.hide();
  }

  function documentChanged() {
    var unsavedChanges = document.getElementById('changes');
    unsavedChanges.innerHTML = "Unsaved changes*";
  }

  function clearLeftPanel() {
    var leftPanel = document.getElementById('leftpanel');
    DOMUtils.removeAllChildren(leftPanel);
  }

  function updateUI() {
    clearLeftPanel();
    var directory = _ooxmlStructure.getCurrentDirectoryContent(_directoriesFrames);
    var leftPanel = document.getElementById('leftpanel');
    var textElement;
    var keys = [];
    for (var props in directory) {
      if (directory.hasOwnProperty(props)) {
        keys.push(props);
      }
    }
    keys.sort();
    if (_directoriesFrames.length > 0) {
      var parentLink = document.createElement('a');
      parentLink.appendChild(createIcon("res/folder.jpg"));
      parentLink.addEventListener("click", parentLinkClicked, true);
      parentLink.href = "";
      textElement = document.createElement('span');
      textElement.innerHTML = '. .';
      parentLink.appendChild(textElement);
      leftPanel.appendChild(parentLink);
      leftPanel.appendChild(document.createElement('br'));
      leftPanel.appendChild(document.createElement('br'));
    }
    for (var i = 0; i < keys.length; i++) {
      var file = directory[keys[i]];
      var link = document.createElement('a');
      link.id = file.name;
      attachIconAndClickListener(file, link);
      textElement = document.createElement('span');
      textElement.innerHTML = file.name;
      link.appendChild(textElement);
      link.href = FileNameUtils.isImageFile(file.name) ?
        window.URL.createObjectURL(file.data) : "";
      leftPanel.appendChild(link);
      leftPanel.appendChild(document.createElement('br'));
      leftPanel.appendChild(document.createElement('br'));
    }
  }
  function attachIconAndClickListener(file, link) {
    if (file.type === "folder") {
      link.appendChild(createIcon("res/folder.jpg"));
      link.addEventListener("click", folderClicked, true);
    } else {
      if (FileNameUtils.isXMLFile(file.name)) {
        link.appendChild(createIcon("res/xml.jpg"));
      } else if (FileNameUtils.isImageFile(file.name)) {
        link.appendChild(createIcon(window.URL.createObjectURL(file.data)));
      } else {
        link.appendChild(createIcon("res/file.jpg"));
      }
      link.addEventListener("click", linkClicked, true);
    }
  }
  function parentLinkClicked(event) {
    var el = event.target;
    while (el && el.tagName.toLowerCase() !== 'a') {
      el = el.parentNode
    }
    _directoriesFrames.pop();
    updateUI();
    event.preventDefault();
  }


  function linkClicked(event) {
    event.preventDefault();
    var el = event.target;
    while (el && el.tagName.toLowerCase() !== 'a') {
      el = el.parentNode;
    }
    if (_currentOpenFile !== getFileName(el) && _currentOpenFile !== el.href) {
      if (_xmlEditor.hasChanges()) {
        showUnsavedChangesDialog();
        nextOperationData = {};
        nextOperationData.op = 'newfile';
        nextOperationData.el = el;
      } else {
        handleLeftLinkClicked(el);
      }
    }
  }

  function handleLeftLinkClicked(el) {
    var saveFileButton = document.getElementById("savefile");
    if (el.id && FileNameUtils.displayable(el.id)) {
      clearRightPanel();
      if (FileNameUtils.isXMLFile(el.id)) {
        _currentOpenFile = getFileName(el);
        showXMLContent();
      } else  {
        saveFileButton.disabled = true;
        _currentOpenFile = el.href;
        showImage(el.href);
      }
    } else {
      _xmlEditor.hide();
      saveFileButton.disabled = true;
      _currentOpenFile = getFileName(el);
      resetChangeNotification();
      _xmlViewer.show();
      _xmlViewer.contentNotDisplayable(el.id);
    }
    document.getElementById('filename').innerText = el.id;
  }

  function getFileName(el) {
    var fileName = "";
    if (_directoriesFrames.length > 0) {
      fileName = _directoriesFrames.join("/") + "/";
    }
    fileName += el.id;
    return fileName;
  }
  function clearRightPanel() {
    _xmlViewer.reset();
    _xmlEditor.reset();
    resetChangeNotification();
  }
  function resetChangeNotification() {
    var changesElm = document.getElementById("changes");
    if (changesElm) {
      changesElm.innerHTML = "";
    }
  }
  function showImage(src) {
    _xmlEditor.hide();
    _xmlViewer.show();
    resetChangeNotification();
    var contentHolder = document.getElementById('contentholder');
    var img = document.createElement('img');
    img.src = src;
    contentHolder.appendChild(img);
  }

  function folderClicked(event) {
    var el = event.target;
    while (el && el.tagName.toLowerCase() !== 'a') {
      el = el.parentNode
    }
    _directoriesFrames.push(el.id);
    updateUI();
    event.preventDefault();
  }

  function createIcon(iconName) {
    var img = document.createElement('img');
    img.src = iconName;
    img.className = "icon";
    return img;
  }

  function newFileRequest() {
    _newFileRequestCB();
  }
  function discardChanges() {
    _xmlEditor.setHasChanges(false);
    _handleNextOperation();
  }

  function _handleNextOperation() {
    if (nextOperationData.op === 'newfile') {
      handleLeftLinkClicked(nextOperationData.el);
    } else if (nextOperationData.op === 'samefile') {
      if (FileNameUtils.isXMLFile(_currentOpenFile)) {
        _xmlEditor.setLoaded(false);
        showXMLContent();
      }
    }
  }
  function saveFileAndHandleNextOp() {
    saveFileRequest(true);
  }

  function saveButtonClickHandler(event) {
    saveFileRequest(false);
  }
  function saveFileRequest(nextOperation) {
    var content = _xmlEditor.getContent();
    var xmlValidator = new XMLValidator();
    var result = xmlValidator.parse(content);
    if (!result.valid) {
      if (result.errors) {
        if (result.errors.length > 0) {
          var lineNumber = result.errors[0].ln;
          var columnNumber = result.errors[0].cn;
          _xmlEditor.setReadOnly(true);
          var errorMessage = 'Error on line ' + lineNumber + ' at column ' +
              columnNumber + ': ' + result.errors[0].message.trim();
          var alert = new XMLError(errorMessage, function() {
            _xmlEditor.gotoLine(lineNumber, columnNumber);
          }, function() {
            _xmlEditor.setReadOnly(false);
            saveXMLFile();
            if (nextOperation) {
              _handleNextOperation();
            }
          });
        }
      }
    } else {
      saveXMLFile();
      if (nextOperation) {
        _handleNextOperation();
      }
    }
  }

  function saveXMLFile() {
    var content = _xmlEditor.getContent(true);
    _ooxmlStructure.setData(_currentOpenFile, content);
    _xmlEditor.setHasChanges(false);
    var unsavedChanges = document.getElementById('changes');
    unsavedChanges.innerHTML = "All changes saved";
  }
  function downloadFile() {
    downloadDialog = new DownloadDialog(fileName);

    var zipWriter = new OOMXMLWriter(_ooxmlStructure, archiveAvailable);
    zipWriter.write();
  }

  function buyMeCoffee() {
    buymeCoffeeDialog = new BuyMeCoffeeDialog();
  }
  function archiveAvailable(blobUrl) {
    downloadDialog.archieveAvailable(blobUrl);
  }

  function showXMLContent() {
    var saveFileButton = document.getElementById("savefile");
    if (isViewerMode) {
      _xmlEditor.hide();
      saveFileButton.disabled = true;
      resetChangeNotification();
      if (_xmlViewer.isLoaded()) {
        _xmlViewer.show();
      } else {
        var xmlData = _ooxmlStructure.getData(_currentOpenFile);
        _xmlViewer.load(xmlData);
      }
    } else {
      _xmlViewer.hide();
      saveFileButton.disabled = false;
      if (_xmlEditor.isLoaded()) {
        _xmlEditor.show();
      } else {
        var xmlData = _ooxmlStructure.getData(_currentOpenFile);
        _xmlEditor.load(xmlData);
      }
    }
  }

  function showUnsavedChangesDialog() {
    var fileName = _currentOpenFile.substring(_currentOpenFile.lastIndexOf("/") + 1);
    var unsavedChangesDlg = new UnsavedChangesDialog(saveFileAndHandleNextOp, discardChanges, unsavedDialogClosed, fileName);
  };

  function unsavedDialogClosed() {
    _xmlEditor.focus();
  }

  return _api;
}