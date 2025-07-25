function XMLViewer() {
  var _loaded = false;
  var _contentHolderParent, _contentHolder;
  var _api  = {};

  _api.show = function(xmlData) {
    _contentHolderParent.style.display = 'block';
  };

  _api.hide = function() {
    _contentHolderParent.style.display = 'none';
  };

  _api.load = function(xmlData) {
    _loaded = true;
    _api.show();
    LoadXMLString('contentholder', xmlData);
  };

  _api.getElement = function() {
    return _contentHolderParent;
  };

  _api.reset = function() {
    _loaded = false;
    _contentHolderParent.scrollTop = 0;
    DOMUtils.removeAllChildren(_contentHolder);
  };

  _api.isLoaded = function() {
    return _loaded;
  };

  _api.setLoaded = function(loaded) {
    _loaded = loaded;
  };

  _api.contentNotDisplayable = function(filename) {
    _contentHolder.innerHTML = '<span style = "font-size: 15pt; font-weight: bold;"> Cannot display content of ' +
        filename + '</span>';
  };

  function _constructHTML() {
    _contentHolderParent = document.createElement('div');
    _contentHolderParent.id = 'contentholderparent';
    _contentHolder = document.createElement('div');
    _contentHolder.id = 'contentholder';
    _contentHolderParent.appendChild(_contentHolder);
  }
  _constructHTML();

  return _api;
}