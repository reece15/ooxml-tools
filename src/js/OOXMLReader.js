function OOXMLReader(file, readingDoneCB, onFileReadError) {

  var totalEntries;
  var currentNoOfEntries = 0;
  var oFSize;
  var oFLastModified;
  var _ooxmlStructure;

  var _api = {}

  _api.getOOXMLStructure = function() {
    return _ooxmlStructure;
  }

  function onSuccess(zipReader) {
    try {
      zipReader.getEntries(getZipEntries);
    } catch (err) {
      onFileReadError();
    }

  }

  function onError() {
    onFileReadError();
  }

  function getZipEntries(entries) {
    totalEntries = entries.length;
    for (var i = 0; i < entries.length; i++) {
      writeBlobEntry(entries[i]);
    }
  }


  function writeBlobEntry(entry) {
    var writer;
    function getData() {
      try {
        entry.getData(writer, function (blob) {
          currentNoOfEntries++;
          _ooxmlStructure.update(entry.filename, blob);
          if (currentNoOfEntries == totalEntries) {
            //TODO - inform appController that all entries are read.
            //ooxmlViewer.renderOOXMLViewer();
            readingDoneCB(_ooxmlStructure);
          }
        }, onprogress);
      } catch (err) {
        onFileReadError();
      }
    }

    var contentType = Util.getContentType(entry.filename);
    writer = new zip.BlobWriter(contentType);
    getData();

  }
  function onprogress() {

  }
  function _init() {
    _ooxmlStructure = new OOXMLStructure();
    currentNoOfEntries = 0;
    zip.createReader(new zip.BlobReader(file), onSuccess, onError);
  }
  _init();
}