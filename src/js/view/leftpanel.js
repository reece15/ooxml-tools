function LeftPanel() {
  var _api = {}

  _api.clear = function() {
    var leftPanel = document.getElementById('leftpanel');
    DOMUtils.removeAllChildren(leftPanel);
  }


}