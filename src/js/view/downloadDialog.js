function DownloadDialog(suggestedName) {
  var _downloadContainer;
  var _api = {};
  _api.getElement = function() {
    return _downloadContainer;
  };

  _api.archieveAvailable = function(downloadUrl) {
    var progressDiv = document.getElementById("progress");
    progressDiv.innerHTML = "Packaging...Done.";
    var downloadAnchor = document.getElementById("downloadanchor");
    downloadAnchor.href = downloadUrl;
    downloadAnchor.style.color = "blue";
  }
  function _constructHTML() {
    _downloadContainer = document.createElement('div');
    _downloadContainer.className =  "alertcontainer";

    var closeButtonArea = document.createElement('div');
    closeButtonArea.className = 'closeButtonArea'
    var closeButton = document.createElement('button');
    closeButton.innerHTML = 'X';
    closeButton.addEventListener('click', _close);
    closeButtonArea.appendChild(closeButton);
    _downloadContainer.appendChild(closeButtonArea);

    var progressDiv = document.createElement('div');
    progressDiv.id = "progress";
    progressDiv.className = "downloadprogress";
    progressDiv.innerHTML = "Packaging...";
    _downloadContainer.appendChild(progressDiv);

    var downloadMessage = document.createElement('div');
    downloadMessage.className = 'downloadMessageArea';
    var downloadAsLabel = document.createElement('span');
    downloadAsLabel.innerHTML = "Download As: ";
    downloadMessage.appendChild(downloadAsLabel);
    var downloadAsInput = document.createElement('input');
    downloadAsInput.id = "downloadas";
    downloadAsInput.className = 'downloadFileName';
    downloadAsInput.value = suggestedName;
    downloadMessage.appendChild(downloadAsInput);
    _downloadContainer.appendChild(downloadMessage);

    var downloadLinkArea = document.createElement('div');
    downloadLinkArea.className = 'downloadLink';
    var downloadUrlAnchor = document.createElement('a');
    downloadUrlAnchor.id = "downloadanchor";
    downloadUrlAnchor.style.color = "gray";
    downloadUrlAnchor.innerHTML = "download";
    downloadUrlAnchor.download = "";
    downloadUrlAnchor.addEventListener('click', _handleClick, false);
    downloadLinkArea.appendChild(downloadUrlAnchor);
    _downloadContainer.appendChild(downloadLinkArea);
    document.body.appendChild(_downloadContainer);
    downloadAsInput.focus();
  }

  function _handleClick(event) {
    var filename = document.getElementById('downloadas');
    event.target.download = filename.value;
    setTimeout(_close, 100);
  }

  function _close() {
    document.body.removeChild(_downloadContainer);
  }
  _constructHTML();
  return _api;
}