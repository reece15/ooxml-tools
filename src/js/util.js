var Util = {

  getSizeString: function (size) {
    if (typeof size === 'string') {
      size = parseInt(size.trim());
    }

    var units = ["Bytes", "KB", "MB", "GB"];
    var reminder = 0;
    var unitIndex = 0;

    while (size > 1024) {
      size = size / 1024;
      unitIndex++;
    }
    return ((Math.round(size * 100)) / 100) + units[unitIndex];
  },
  getFormattedDateTime: function (strDate) {
    var d = new Date(strDate);
    return d.getDate() + '-' + (d.getMonthName()) + '-' + d.getFullYear()
      + ' ' + formatAMPM(d);

    function formatAMPM(date) {
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? '0' + minutes : minutes;
      var strTime = hours + ':' + minutes + ampm;
      return strTime;
    }
  },

  endsWith: function (str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  },

  getContentType: function (fileName) {
    var contentType;
    if (Util.endsWith(fileName.toLowerCase(), "xml")) {
      contentType = "text/xml";
    } else if (Util.endsWith(fileName.toLowerCase(), "rels")) {
      contentType = "text/xml";
    } else if (Util.endsWith(fileName.toLowerCase(), "jpeg")) {
      contentType = "image/jpeg";
    } else if (Util.endsWith(fileName.toLowerCase(), "jpg")) {
      contentType = "image/jpeg";
    } else if (Util.endsWith(fileName.toLowerCase(), "png")) {
      contentType = "image/png";
    } else if (Util.endsWith(fileName.toLowerCase(), "wmf")) {
      contentType = "image/wmf";
    } else if (Util.endsWith(fileName.toLowerCase(), "emf")) {
      contentType = "image/gif";
    } else if (Util.endsWith(fileName.toLowerCase(), "gif")) {
      contentType = "image/gif";
    }
    return contentType;
  },
  cutStringLeft: function(str, maxLen) {
    if (str && maxLen && str.length > maxLen) {
      return ". . ." + str.substring(str.length - maxLen);
    }
    return str;
  }
};

var DOMUtils = {
  removeAllChildren: function(element) {
    if (element) {
      while (element.hasChildNodes()) {
        element.removeChild(element.lastChild);
      }
    }
  },
  createElementAndAppend: function (tagName, parent, className) {
    var element = document.createElement(tagName);
    if (className) {
      element.className = className;
    }
    if (parent) {
      parent.appendChild(element);
    }
    return element;
  }
};

var FileNameUtils = {
  isXMLFile: function (filename) {
    return  filename && (Util.endsWith(filename, 'xml') || Util.endsWith(filename, 'rels') ||
      Util.endsWith(filename, 'vml'));
  },

  isImageFile: function (fileName) {
    return Util.endsWith(fileName, 'png') || Util.endsWith(fileName, 'jpg') ||
      Util.endsWith(fileName, 'jpeg');
  },

  displayable: function (file) {
    return Util.endsWith(file, 'jpg') || Util.endsWith(file, 'jpeg') ||
      Util.endsWith(file, 'png') || Util.endsWith(file, 'gif') ||
      FileNameUtils.isXMLFile(file);
  },
  removeExtension: function(fileName) {
    if (fileName) {
      return fileName.substring(0, fileName.lastIndexOf('.'));
    }
  }
};

Date.prototype.getMonthName = function() {
  var monthNamesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
    'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return monthNamesShort[this.getMonth()];
}