/**
 * AppController takes various decision based on the user inputs and various
 * events that occurs within the application. For ex, if 1 file is dropped,
 * it create OOXMLViews and if 2 or more files are dropped it created
 * OOXMLDiff.
 * AppController creates and maintains a web worker for unzipping task and
 * creating appropriate structure.
 * Author - Atul Moglewar
 */

(function AppController() {
  /**
   * Drag Area where the files will be dropped.
   */
  var _dragArea;

  /**
   * OOXML structure used for OOXML Viewer and OOXMLDiff. In case of OOXMLDiff
   * this is the structure that gets populated first. This can be the strcture
   * for the left panel or right panel.
   */
  var ooxmlStructure1;

  /**
   * OOXML structure used only in case of OOXMLDiff. This structure is populated
   * after the first structure is populated.
   */
  var ooxmlStructure2;
  /**
   * Name of the first file.
   */
  var _firstFile;
  /**
   * Name of the second file when 2 or multiple files are dropped on the drag
   * area.
   */
  var _secondFile;

  /** Web worker */
  var _worker

  /** File select dialog box. */
  var _fileSelectDialog;

  /** Folder diff view. */
  var _folderDiff;

  /** Flag which tells what app to start, viewer or diff. */
  var _isOOXMLViewer;

  /**
   * Progress bar.
   */
  var _progressBar;
  var _timerId;


  function _init() {
    document.addEventListener('DOMContentLoaded', _startApp);
  }

  /**
   * Start the application when all the DOM content is loaded.
   */
  function _startApp() {
    _reset();
    _createWebWorker();
    _dragArea = new FileDragArea(_filesDropped);
  }

  /**
   * Reset the variables.
   */
  function _reset() {
    ooxmlStructure1 = undefined;
    ooxmlStructure2 = undefined;
    _secondFile = undefined;
    document.title = "OOXML Tools";
    clearTimeout(_timerId);
    _progressBar = undefined;
    _fileSelectDialog = undefined;
    _folderDiff = undefined;
  }

  /**
   * Create web worker if its not already created.
   */
  function _createWebWorker() {
    if (!_worker) {
      _worker = new Worker('src/js/worker.js');
      _worker.addEventListener("message", function (oEvent) {
        if (oEvent.data.error) {
          closeProgressBar();
          clearTimeout(_timerId);
          var alert = new Alert('Error opening file', _newFileRequestCB);
          alert.show();
        } else if (oEvent.data.structure) {
          var ooxmlStructure = new OOXMLStructure();
          ooxmlStructure.setRoot(oEvent.data.structure);
          if (_isOOXMLViewer) {
            _readingDoneForViewer(ooxmlStructure);
          } else {
            _readingDoneForDiff(ooxmlStructure);
          }
        } else if (oEvent.data.rowsData) {
          diffLinesReady(oEvent.data.rowsData);
        }
      }, false);
    }
  }

  /**
   * Callback for files dropped event.
   * @param files  - array of files dropped.
   */
  function _filesDropped(files) {
    //when exactly 1 file is dropped it is ooxml viewer.
    _isOOXMLViewer = files.length === 1;

    if (files.length === 1) {//OOXMLViewer
      _firstFile = files[0];
      var oFSize = Util.getSizeString(files[0].size);
      var oFLastModified = Util.getFormattedDateTime(files[0].lastModifiedDate);
      createProgressBar();
      _worker.postMessage({'cmd': 'unpack', 'file': files[0]});
    } else if (files.length > 1) {//OOXMLDiff
      var fileInfoObject = getFileInfoObject(files[0], files[1]);
      _fileSelectDialog = new FileSelectDialog(fileInfoObject, _filesSelected, _newFileRequestCB);
      _worker.postMessage({'cmd': 'unpack', 'file': files[0]});
      _firstFile = files[0];
      _secondFile = files[1];
    }
  }

  /**
   * Callback for user finalization of the left and right panel files.
   */
  function _filesSelected() {
    if (ooxmlStructure1 && ooxmlStructure2) {
      var swapped = _fileSelectDialog.isFileSwapped();
      var structure1 = swapped ? ooxmlStructure2.getFlatStructure(true) :
        ooxmlStructure1.getFlatStructure(true);
      var structure2 = swapped ? ooxmlStructure1.getFlatStructure(true) :
        ooxmlStructure2.getFlatStructure(true);
      var firstFileName = swapped ? _secondFile.name : _firstFile.name;
      var secondFileName = swapped ? _firstFile.name : _secondFile.name;
      closeProgressBar();
      _dragArea.close();
      var ooxmlDiff = new OOXMLDiff(structure1, structure2);
      _folderDiff = new FolderDiff(ooxmlDiff,firstFileName, secondFileName,
        _showFileDiff, _newFileRequestCB);
    } else {
      if (!_progressBar) {
        createProgressBar();
      }
      //The structures are not populated that means the webworker is still
      //working on the files. Lets wait for 500ms and check again.
      _timerId = setTimeout(_filesSelected, 500);
    }
  }
  function getFileInfoObject(file1, file2) {
    var fileInfo = {
      file1: {
        name: file1.name,
        size: file1.size,
        modified: file1.lastModifiedDate
      },
      file2: {
        name: file2.name,
        size: file2.size,
        modified: file2.lastModifiedDate
      }
    };
    return fileInfo;
  }
  var lfPart, rfPart, slider;
  function _showFileDiff(baseText, newText, leftFilePart, rightFilePart) {
    _folderDiff.hide();
    lfPart = leftFilePart;
    rfPart = rightFilePart;
    slider = new Slider();
    document.body.appendChild(slider.getElement());
    createDiffLinesInBackground(baseText, newText);
  }
  function createDiffLinesInBackground(baseText, newText) {
    _worker.postMessage({'cmd': 'diff', 'baseText': baseText, 'newText': newText});
  }
  function diffLinesReady(rowsData) {
    var fileDiff = new FileDiff(
      {rowsData: rowsData,
        baseFile: lfPart,
        newFile: rfPart
      }, _closeFileDiff, _newFileRequestCB, _diffRenderUpdate);
  }

  function _diffRenderUpdate(total, current) {
    if (slider) {
      slider.update(total, current);
      if (total === current) {
        removeSlider();
      }
    }

  }
  function removeSlider() {
    if (slider) {
      var sliderElm = slider.getElement();
      if (sliderElm) {
        document.body.removeChild(sliderElm);
      }
      slider = undefined;
    }
  }
  function _closeFileDiff() {
    _folderDiff.show();
    removeSlider();
  }

  /**
   * Callback for OOXML file reading, unzipping and creating structures out of
   * it done and we are ready for rendering.
   * @param ooxmlStructure - the ooxml structure created for OOXML file.
   */
  function _readingDoneForViewer(ooxmlStructure) {
    closeProgressBar();
    ooxmlStructure1 = ooxmlStructure;
    var ooxmlViewer = new OOXMLViewer(ooxmlStructure1, _firstFile.name, _newFileRequestCB);
    ooxmlViewer.render();
  }

  /**
   * Callback for OOXML file reading, unzipping and creating structures out of
   * it done. If the first file is done, post a message to web worker to start
   * working on 2nd file.
   * @param ooxmlStructure
   * @private
   */
  function _readingDoneForDiff(ooxmlStructure) {
    if (!ooxmlStructure1) {
      ooxmlStructure1 = ooxmlStructure;
      _worker.postMessage({'cmd': 'unpack', 'file': _secondFile});
    } else {
      ooxmlStructure2 = ooxmlStructure;
    }
  }

  function _newFileRequestCB() {
    _startApp();
  }
  function createProgressBar() {
    _progressBar = new ProgressBar();
    document.body.appendChild(_progressBar.getElement());
  }

  function closeProgressBar() {
    if (_progressBar) {
      _progressBar.close();
      _progressBar = undefined;
    }
  }
  _init();
}());