function OOMXMLWriter(ooxmlStructure, archiveAvailableCB) {
  var currentZippedEntries = 0;
  var doneZippedEntries = 0;
  var zippedDone = true;
  var zipWriter;
  var list;
  var totalEntries = 0;
  var _api  = {
    write: function() {
      list = ooxmlStructure.getFlatStructure(true);
      totalEntries = list.length;

      zip.createWriter(new zip.BlobWriter("application/zip"), function(writer) {
        zipWriter = writer;
        writeAsync();
      }, function(error) {
        // onerror callback
      });
    }
  };

  function writeAsync() {
    if (zippedDone) {
      zippedDone = false;
      _writeEntry(zipWriter, list[currentZippedEntries]);
    } else {
        setTimeout(function() {
          writeAsync();
        }, 0);
      }
    }

  function closeArchieve() {
    zipWriter.close(function(blob) {
      var blobURL = URL.createObjectURL(blob);
      archiveAvailableCB(blobURL);
//      var anchor = document.createElement('a');
//      anchor.href = blobURL;
//      anchor.innerHTML = "download";
//      anchor.addEventListener('click', rename, false);
//      var topbar = document.getElementById('topbar');
//      topbar.appendChild(anchor);
      zipWriter = null;
    });
  }

  function rename(event) {
    event.target.download = "archive_123.xlsx";
  }
  function _write(writer, current) {
    var children = current.children;
    for(var key in children) {
      if (children.hasOwnProperty(key)) {
        var ooxmlEntry = children[key];
        if (ooxmlEntry.type === 'folder') {
          _write(writer, ooxmlEntry)
        } else {
          _writeEntry(writer, ooxmlEntry);
          totalEntries++;
        }
      }
    }
  }
  /**
   * This writes the 1 entry in the zip file.
   * @param name - name of the entry
   * @param data - data to be written in zip
   * @param type - type of the data.
   */
  function _writeEntry(writer, ooxmlEntry) {
    var reader;
    if (FileNameUtils.isXMLFile(ooxmlEntry.path)) {
      reader = new zip.TextReader(ooxmlEntry.data);
    } else {
      reader = new zip.BlobReader(ooxmlEntry.data);
    }
    writer.add(ooxmlEntry.path, reader, function() {
      currentZippedEntries++;
      zippedDone = true;
      if (totalEntries !== currentZippedEntries) {
        writeAsync();
      } else {
        setTimeout(function(){
          closeArchieve();
        }, 1000);
      }
    }, function(currentIndex, totalIndex) {
      // onprogress callback
    });
  }
  function _init() {

  }
  _init();

  return _api;
}