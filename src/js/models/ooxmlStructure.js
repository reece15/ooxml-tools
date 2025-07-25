/**
 * This Module represents the OOXML structure in the memory in JSON format. It
 * keeps tracks of the current directory by providing api such as
 * changeDirectory, gotoParentDirectory. It also provides api to return the
 * current directory content, blob for the file.
 *
 * @returns {{}}
 * @constructor
 */

function OOXMLStructure() {
  var _root, _currentDirectory;
  var _pending = 0, toBeConvertedToStrings = [];

  var _api = {};

  _api.update = function(fileName, blob) {
    var tokens = fileName.split("/");
    var currentLevel = _root;
    for (var i = 0; i < tokens.length - 1; i++) {
      if (!currentLevel.children[tokens[i]]) {
        currentLevel.children[tokens[i]] = createFolderJSONObject("folder",
          tokens[i], currentLevel);
      }
      currentLevel = currentLevel.children[tokens[i]];
    }
    var fn = tokens[tokens.length - 1];
    //When the entry is something like _rels/, spilt methods array of 2 elements
    //[_rels, ""]. We don't want create a JSON entry for the empty string hence
    //the check.
    if (fn.length > 0) {
      currentLevel.children[fn] = createFileJSONObject("file", fn, fileName, blob);
    }
  };

  _api.getBlob = function(directoryFrames, id) {
    var curDir = _root;
    for (var i = 0; i < directoryFrames.length; i++) {
      curDir = curDir.children[directoryFrames[i]];
    }
    return curDir.children[id].blob;
  };
  _api.getData = function(fullPath, id) {
    var curDir = _root;
    var pathTokens = fullPath.split("/");
    for (var i = 0; i < pathTokens.length - 1; i++) {
      curDir = curDir.children[pathTokens[i]];
    }
    return curDir.children[pathTokens[i]].data;
  };
  _api.setData = function(fullPath, data) {
    var curDir = _root;
    var pathTokens = fullPath.split("/");
    for (var i = 0; i < pathTokens.length - 1; i++) {
      curDir = curDir.children[pathTokens[i]];
    }
    curDir.children[pathTokens[i]].data = data;
  };

  _api.getCurrentDirectoryContent = function(_directoriesFrames) {
    var curDir = _root;
    for (var i = 0; i < _directoriesFrames.length; i++) {
      curDir = curDir.children[_directoriesFrames[i]];
    }
    return curDir.children;
  }

  _api.getFlatStructure = function(removeFolders) {
    var list = [], parents = [];
    _visit(_root, parents, list, removeFolders);
    return list;
  }

  _api.getRoot = function() {
    return _root;
  }

  _api.setRoot = function(root) {
     _root = root;
  }

  _api.blobToStringComplete = function() {
    return _pending === 0;
  }

  _api.convertBlobsToStrings = function(convertionDoneCB) {
    _pending = toBeConvertedToStrings.length;
    for (var i = 0; i < toBeConvertedToStrings.length; i++) {
      convertBlobToString(toBeConvertedToStrings[i], convertionDoneCB);
    }
  }

  function _visit(currentDirectory, parents, list, removeFolders) {
    var children = currentDirectory.children;
    var keys = Object.keys(children).sort();
    for(var i = 0; i < keys.length; i++) {
      var obj = children[keys[i]];
      if ((obj.type === 'folder' && !removeFolders) || obj.type === 'file') {
        list.push({path: getPath(parents) + obj.name,
          type: obj.type, data: currentDirectory.children[obj.name].data});
      }

      if (obj.type === 'folder') {
        parents.push(obj.name);
        _visit(currentDirectory.children[obj.name], parents, list, removeFolders);
      }
    }
    parents.pop();
  }

  function getPath(parents) {
    var path = "";
    for(var i = 0; i < parents.length; i++) {
      path += parents[i] + '/';
    }
    return path;
  }

  function createFolderJSONObject(type, name, parent) {
    var jsonFolderObj = new Object();
    jsonFolderObj.type = type;
    jsonFolderObj.name = name;
    jsonFolderObj.parent = parent;
    jsonFolderObj.children = {};
    return jsonFolderObj;
  }

  function createFileJSONObject(type, name, path, blob) {
    var jsonFileObj = new Object();
    jsonFileObj.type = type;
    jsonFileObj.name = name;
    jsonFileObj.path = path;
    jsonFileObj.data = blob;
    if (FileNameUtils.isXMLFile(jsonFileObj.name)) {
      toBeConvertedToStrings.push(jsonFileObj);
    }
    return jsonFileObj;
  }

  function convertBlobToString(jsonFileObj, convertionDoneCB) {
    var blobReader = new FileReader();
    blobReader.onload = function (event) {
      jsonFileObj.data = event.target.result;
      _pending--;
      if (!_pending) {
        convertionDoneCB();
      }
    };
    blobReader.onerror = function(event) {
      console.log(event);
    };
    blobReader.readAsText(jsonFileObj.data);
  }

  function _init() {
    _root = createFolderJSONObject("folder", "root", "/");
  }
  _init();
  return _api;
}