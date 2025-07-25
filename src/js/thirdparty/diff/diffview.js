/*
This is part of jsdifflib v1.0. <http://github.com/cemerick/jsdifflib>

Copyright 2007 - 2011 Chas Emerick <cemerick@snowtide.com>. All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are
permitted provided that the following conditions are met:

   1. Redistributions of source code must retain the above copyright notice, this list of
      conditions and the following disclaimer.

   2. Redistributions in binary form must reproduce the above copyright notice, this list
      of conditions and the following disclaimer in the documentation and/or other materials
      provided with the distribution.

THIS SOFTWARE IS PROVIDED BY Chas Emerick ``AS IS'' AND ANY EXPRESS OR IMPLIED
WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL Chas Emerick OR
CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

The views and conclusions contained in the software and documentation are those of the
authors and should not be interpreted as representing official policies, either expressed
or implied, of Chas Emerick.
*/
diffview = {
	/**
	 * Builds and returns a visual diff view.  The single parameter, `params', should contain
	 * the following values:
	 *
	 * - baseTextLines: the array of strings that was used as the base text input to SequenceMatcher
	 * - newTextLines: the array of strings that was used as the new text input to SequenceMatcher
	 * - opcodes: the array of arrays returned by SequenceMatcher.get_opcodes()
	 * - baseTextName: the title to be displayed above the base text listing in the diff view; defaults
	 *	   to "Base Text"
	 * - newTextName: the title to be displayed above the new text listing in the diff view; defaults
	 *	   to "New Text"
	 * - contextSize: the number of lines of context to show around differences; by default, all lines
	 *	   are shown
	 * - viewType: if 0, a side-by-side diff view is generated (default); if 1, an inline diff view is
	 *	   generated
	 */
	buildView: function (params) {
		var baseTextLines = params.baseTextLines;
		var newTextLines = params.newTextLines;
		var opcodes = params.opcodes;
		var baseTextName = params.baseTextName ? params.baseTextName : "Base Text";
		var newTextName = params.newTextName ? params.newTextName : "New Text";
		var contextSize = params.contextSize;
		var inline = (params.viewType == 0 || params.viewType == 1) ? params.viewType : 0;

		if (baseTextLines == null)
			throw "Cannot build diff view; baseTextLines is not defined.";
		if (newTextLines == null)
			throw "Cannot build diff view; newTextLines is not defined.";
		if (!opcodes)
			throw "Canno build diff view; opcodes is not defined.";
		
		function celt (name, clazz) {
			var e = createElement(name, clazz);
      endElement(name);
			return e;
		}
		
		function telt (name, text) {
			var e = createElement(name);
			e += (text.replace(/</g, '&lt;')).replace(/>/g, '&gt;');
      e += endElement(name);
      return e;
		}
		
		function ctelt (name, clazz, text) {
			var e = createElement(name, clazz);
      e += (text.replace(/</g, '&lt;')).replace(/>/g, '&gt;');
      e += endElement(name);
			return e;
		}
	

		
		var rows = [];
		var node;
		
		/**
		 * Adds two cells to the given row; if the given row corresponds to a real
		 * line number (based on the line index tidx and the endpoint of the 
		 * range in question tend), then the cells will contain the line number
		 * and the line of text from textLines at position tidx (with the class of
		 * the second cell set to the name of the change represented), and tidx + 1 will
		 * be returned.	 Otherwise, tidx is returned, and two empty cells are added
		 * to the given row.
		 */
    var retVal = {};
		function addCells (row, tidx, tend, textLines, change) {

			if (tidx < tend) {
				row += (telt("th", (tidx + 1).toString()));
				row +=(ctelt("td", change, textLines[tidx].replace(/\t/g, "\u00a0\u00a0\u00a0\u00a0")));
        retVal.tidx = tidx + 1;
			} else {
				row += (createElement("th"));
        row += endElement("th");
        row += (celt("td", "empty"));
        retVal.tidx = tidx;
			}
      retVal.str = row;
      return retVal;
		}
		

		
		for (var idx = 0; idx < opcodes.length; idx++) {
			code = opcodes[idx];
			change = code[0];
			var b = code[1];
			var be = code[2];
			var n = code[3];
			var ne = code[4];
			var rowcnt = Math.max(be - b, ne - n);


			for (var i = 0; i < rowcnt; i++) {
				// jump ahead if we've alredy provided leading context or if this is the first range
				if (contextSize && opcodes.length > 1 && ((idx > 0 && i == contextSize) || (idx == 0 && i == 0)) && change=="equal") {
					var jump = rowcnt - ((idx == 0 ? 1 : 2) * contextSize);
					if (jump > 1) {
//						toprows.push(node = document.createElement("tr"));
//            node = createElement("tr");
            node = ""
            node = "";
						b += jump;
						n += jump;
						i += jump - 1;
						node += appendChild(telt("th", "..."));
						if (!inline) node += (ctelt("td", "skip", ""));
						node += (telt("th", "..."));
						node += (ctelt("td", "skip", ""));
            rows.push(node);
						// skip last lines if they're all equal
						if (idx + 1 == opcodes.length) {
							break;
						} else {
							continue;
						}
					}
				}

//        node = createElement("tr");
        node = ""
        addCells(node, b, be, baseTextLines, change);
        b = retVal.tidx;
        node = retVal.str;
        addCells(node, n, ne, newTextLines, change);
        n = retVal.tidx;
        node = retVal.str;
//        node += endElement('tr');
        rows.push(node);
			}
		}

//    node = createElement("tbody");
//		for (var idx in rows) node += (rows[idx]);
//    endElement("tbody");
//		var table = celt("table", "diff");
//    table += node;
//    table += endElement("table");

    return rows;
	}
}

function createElement(name, className) {
  var elemStr = '<' + name;
  if (className) {
    elemStr +=  ' class = "' + className + '"';
  }
  elemStr += '>'
  return elemStr;
}

function endElement(element) {
  return '</' + element + '>';
}
