/**
 * After successful execution of this module a structure will be created which
 * will hold the information about the differences of the 2 ooxml structures.
 * Following types of differences will be maintained.
 * 1. If the 2 files are identical or not
 * 2. If the new file/folder is added
 * 3. If the file/folder is missing
 * The exact differences are not stored just the flags are stored.
 *
 * @param ooxmlFlatStructure1 - OOXML structure for file1
 * @param ooxmlFlatStructure2 - OOXML structure for file2
 * @constructor
 */

function OOXMLDiff(ooxmlFlatStructure1, ooxmlFlatStructure2) {
  var _union;
  var _findDifferences = function () {
    _union = _createUnion();
  }

  var _api = {};
  _api.getUnion = function() {
    return _union;
  };

  /**
   * {
   *  path - path_of_file,
   *  type - file or folder,
   *  existsInFile1: true/false,
   *  existsInFile2: true/false,
   *  difference: true/false
   * }
   * @private
   */
  var _createUnion = function () {
    var union = ooxmlFlatStructure1.concat(ooxmlFlatStructure2);

    for (var i = 0; i < ooxmlFlatStructure1.length; i++) {
      var existsInBoth = false;
      for (var j = ooxmlFlatStructure1.length; j < union.length && !existsInBoth; j++) {
        var existsInBoth = partExistsInBoth(union[i], union[j]);
        if (existsInBoth) {
          union[i].existsInFile1 = true;
          union[i].existsInFile2 = true;
          union[i].difference = !isSameFileItems(union[i], union[j]);
          union[i].file1Data = union[i].data;
          union[i].file2Data = union[j].data;
          union.splice(j, 1);
        }
      }
      if (!existsInBoth) {
        union[i].existsInFile1 = true;
        union[i].existsInFile2 = false;
        union[i].difference = true;
        union[i].file1Data = union[i].data;
      }
    }
    for (i = ooxmlFlatStructure1.length; i < union.length; i++) {
      if(!union[i].existsInFile1) {
        union[i].existsInFile1 = false;
        union[i].existsInFile2 = true;
        union[i].difference = true;
        union[i].file2Data = union[i].data;
      }
    }
    return union;
  }

  var partExistsInBoth = function (item1, item2) {
    return item1 && item2 && item1.path === item2.path &&
      item1.type === item2.type;
  }

  var isSameFileItems = function (item1, item2) {
    if (item1 && item2) {
      if (item1.path === item2.path && item1.type == item2.type) {
        if (item1.type === 'folder') {
          return true;
        } else if (item1.type === 'file') {
          if (FileNameUtils.isXMLFile(item1.path)) {
            return item1.data === item2.data;
          }
        }
      }
    }
  }
  _findDifferences();
  return _api;
}