function XMLEditor(documentChangedCB) {
  var _editor,_editorDiv, _loaded = false, _hasChanges;
  var xmlValidator_;
  var _api = {};

  _api.show = function() {
    _editorDiv.style.display = 'block';
    _editor.focus();
  };

  _api.focus = function() {
    _editor.focus();
  };

  _api.hide = function() {
    _editorDiv.style.display = 'none';
  };

  _api.setReadOnly = function(readOnly) {
    _editor.setReadOnly(readOnly);
  };

  _api.gotoLine = function(lineNumber, columnNumber) {
    _editor.gotoLine(lineNumber, columnNumber);
    _editor.setReadOnly(false);
    _editor.focus();
  };

  _api.load = function(xmlData) {
    _loaded = true;
    _hasChanges = false;
    if (!_editor) {
      _editor = ace.edit("editor");
      _editor.setShowPrintMargin(false);
      _editor.getSession().setMode("ace/mode/xml");
      _editor.on("change", documentChanged);
      xmlValidator_ = new XMLValidator();
    }
    var beautifiedXML = new vkbeautify().xml(xmlData);
    var result = xmlValidator_.parse(beautifiedXML);
    var editSession = ace.createEditSession(beautifiedXML, "ace/mode/xml");
    _editor.setSession(editSession);
    _api.show();
    if (!result.valid) {
      if (result.errors) {
        if (result.errors.length > 0) {
          var lineNumber = result.errors[0].ln;
          var columnNumber = result.errors[0].cn;
          _editor.setReadOnly(true);
          var errorMessage = 'Error on line ' + lineNumber + ' at column ' +
              columnNumber + ': ' + result.errors[0].message.trim();
          var alert = new XMLError(errorMessage, function() {
            _api.gotoLine(lineNumber, columnNumber);
          });

        }
      }
    }
  };

  _api.reset = function() {
    _loaded = false;
  }

  _api.getElement = function() {
    return _editorDiv;
  };

  _api.isLoaded = function() {
    return _loaded;
  };

  _api.setLoaded = function(loaded) {
    _loaded = loaded;
  };
  _api.getContent = function(compact) {
    var content = _editor.getSession().getValue();
    if (compact) {
      var lines = content.split('\n');
      content = lines[0] + "\n";
      for (var i = 1; i < lines.length; i++) {
        var line = lines[i].trim();
        if (content.indexOf('>') === content.length - 1) {
          content += line;
        } else {
          content += " " + line;
        }
      }
    }
    return content;
  }

  _api.hasChanges = function() {
    return _hasChanges;
  }

  _api.setHasChanges = function(hasChanges) {
    _hasChanges = hasChanges;
  }

  function documentChanged() {
    _hasChanges = true;
    if (documentChangedCB) {
      documentChangedCB();
    }
  }
  function _constructuHTML() {
    _editorDiv = document.createElement('div');
    _editorDiv.id = 'editor';
  }

  function gotoError_() {

  }
  _constructuHTML();
  return _api;
}