chrome.action.onClicked.addListener(function(tab) {
  chrome.tabs.create({url:chrome.runtime.getURL("viewer.html")});
});
