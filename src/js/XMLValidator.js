function XMLValidator() {
  var errorTag = 'parsererror';
  var api_ = {}

  /**
   *
   * @param xml
   * @return {} object. The structure when valid xml is
   * {valid: true}
   * The structure when invalid xml
   * {
   *  valid: false,
   *  errors: [
   *    item: {
   *      ln: linenumber,
   *      cn: columnnumber,
   *      message: error message
   *      }
   *  ]
   * }
   */
  api_.parse = function(xml) {
    var xmlDoc;
    try {
      var parser = new DOMParser();
      xmlDoc = parser.parseFromString(xml,"application/xml");
    } catch (error) {
      return {valid: false};
    }
    if (xmlDoc.getElementsByTagName(errorTag).length > 0) {
      var errorInformation = createErrorInformation(xmlDoc);
      return {
        valid: false,
        errors: errorInformation
      };
    } else {
      return {valid: true};
    }
  }

  function createErrorInformation(xmlDoc) {
    var errorInfo = [];
    var lineNoRegex = /error on line\s+(\d+)\s+/g;
    var columnNoRegex = /at column (\d+)\s*:?/g;
    var errorMessageRegex = /error on line\s+\d+\s+at column \d+\s*:\s*([^]+?)<\/div>/gm;
    var errors = xmlDoc.getElementsByTagName(errorTag);
    for (var i = 0; i < errors.length; i++) {
      var innerHtml = errors[i].innerHTML;
      var lineNumber = lineNoRegex.exec(innerHtml);
      var errorInfoItem = {};
      if (lineNumber) {
        errorInfoItem.ln = parseInt(lineNumber[1]);
      }
      var columnNo = columnNoRegex.exec(innerHtml);
      if (columnNo) {
        errorInfoItem.cn = parseInt(columnNo[1]);
      }
      var errorMessage = errorMessageRegex.exec(innerHtml);
      if (errorMessage) {
        errorInfoItem.message = errorMessage[1];
      }
      errorInfo.push(errorInfoItem);
    }
    return errorInfo;
  }
  return api_;


}