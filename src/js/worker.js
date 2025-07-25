function readOOXMLFile(fileName) {
  importFiles();
  var _ooxmlReader = new OOXMLReader(fileName, _readingDone, onFileReadError);
}

onmessage = function (oEvent) {
  switch (oEvent.data.cmd) {
    case 'unpack':
      readOOXMLFile(oEvent.data.file);
      break;
    case 'diff':
      createDiffStructure(oEvent.data.baseText, oEvent.data.newText);
      break;
  }

}

function createDiffStructure(baseText, newText) {
  var baseTextStr = new vkbeautify().xml(baseText);
  var newTextStr = new vkbeautify().xml(newText);
  var basetxt = difflib.stringAsLines(baseTextStr);
  var newtxt = difflib.stringAsLines(newTextStr);
  var sm = new difflib.SequenceMatcher(basetxt, newtxt);
  var opcodes = sm.get_opcodes();

  var rowsData = (diffview.buildView({ baseTextLines:basetxt,
    newTextLines:newtxt,
    opcodes:opcodes,
    baseTextName:"",//diffConfig.baseFile,
    newTextName:"",//diffConfig.newFile,
    contextSize:null,
    viewType: 0}));
  self.postMessage({rowsData: rowsData});
}
var _ooxmlStructure;
function _readingDone(ooxmlStructure) {
  _ooxmlStructure = ooxmlStructure;
  _ooxmlStructure.convertBlobsToStrings(_postMessage);
}

function onFileReadError() {
  self.postMessage({error: "Error opening file"});
}

function _postMessage() {
   self.postMessage({structure: _ooxmlStructure.getRoot()});
}

function importFiles() {
  importScripts(
    'OOXMLReader.js',
    'models/ooxmlStructure.js',
    'thirdparty/zip/zip.js',
    'thirdparty/diff/diffview.js',
    'util.js',
    'thirdparty/zip/deflate.js',
    'thirdparty/zip/inflate.js',
    'thirdparty/zip/mime-types.js',
    'thirdparty/diff/vkbeautify.js',
    'thirdparty/diff/difflib.js'
  );
}