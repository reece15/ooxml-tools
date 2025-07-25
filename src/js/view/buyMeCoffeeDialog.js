function BuyMeCoffeeDialog(suggestedName) {
  var _container;
  var _api = {};
  _api.getElement = function() {
    return _container;
  };
  
  function _constructHTML() {
    _container = document.createElement('div');
    _container.classList.add('buyMeCoffeeContainer');
    _container.appendChild(addCloseButton());
    var dialogBody = document.createElement('div');
    dialogBody.style.padding = "1%";
    _container.appendChild(dialogBody);
    dialogBody.innerHTML = '<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">' +
    '<input type="hidden" name="cmd" value="_s-xclick">' +
    '<input type="hidden" name="hosted_button_id" value="4F2EVKMLUY32C">' +
    '<table>' +
    '<tr>' +
      '<td style="font-size: 14px; line-height: 22px; text-align: center">' +
        '<input type="hidden" name="on0" value="Buy Developer a Coffee">' +
        'If you think this app has made your OOXML development work easier, consider buying a cup of coffee to the Developer.' +
      '</td>' +
    '</tr>' + 
    '<tr><td><br/></td></tr><tr></tr>' +
    '<tr>' +
      '<td style="text-align: center">' +
        '<select name="os0">' +
          '<option value="Small Size">Small Size $3.99 USD</option>' +
          '<option value="Medium Size" selected>Medium Size $5.99 USD</option>' +
          '<option value="Large Size">Large Size $7.99 USD</option>' +
        '</select>' + 
      '</td>' + 
    '</tr>' +
    '<tr></tr><tr></tr>' +
    '</table>' +
    '<div class="buyNowContainer">' +
      '<input type="hidden" name="currency_code" value="USD">' +
      '<input type="image" style="outline:none" src="res/btn_buynowCC_LG.gif" border="0" name="submit" alt="PayPal – The safer, easier way to pay online!">' +
      '<img alt="" border="0" src="https://www.paypalobjects.com/en_GB/i/scr/pixel.gif" width="1" height="1">' +
    '</div>'
  '</form>';
    

  document.body.appendChild(_container);
  }

  function addCloseButton() {
    var closeButtonArea = document.createElement('div');
    closeButtonArea.className = 'closeButtonArea'
    var closeButton = document.createElement('button');
    closeButton.innerHTML = 'X';
    closeButton.addEventListener('click', _close);
    closeButtonArea.appendChild(closeButton);
    return closeButtonArea;
  }

  function _close() {
    document.body.removeChild(_container);
  }
  _constructHTML();
  return _api;
}