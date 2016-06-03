var MOUNTAINS = require('./mountains');


function rowHeights(rows) {
  return rows.map((row) => {
    return row.reduce((max, cell) => {
      return Math.max(max, cell.minHeight());
    }, 0);
  });
};


function colWidths(rows) {
  return rows[0].map((_, i) => {
    return rows.reduce((max, row) => {
      return Math.max(max, row[i].minWidth());
    }, 0);
  });
}

function drawTable(rows) {
  var heights = rowHeights(rows);
  var widths = colWidths(rows);

  return rows.map(drawRows).join('\n');

  //
  // dependency helper function
  //
  function drawRows(rows, rowNum) {
    var blocks = rows.map((cell, colNum) => {
      return cell.draw(widths[colNum], heights[rowNum]);
    });

    // 遍历了每一个height，添加空白，添加\n
    return blocks[0].map((_, colNum) => {
      return drawRightMargin(blocks, colNum);
    }).join('\n');
  }

  function drawRightMargin(blocks, colNum) {
    return blocks.map((block) => {
      return block[colNum];
    }).join(' ');
  }
}

function TextCell(text) {
  this.text = text.split('\n');
}

TextCell.prototype.minHeight = function() {
  return this.text.length;
}

TextCell.prototype.minWidth = function() {
  return this.text.reduce((width, line) => {
    return Math.max(width, line.length);
  }, 0);
}

TextCell.prototype.draw = function(width, height) {
  var result = [];
  for (var i = 0; i < height; i++) {
    var line = this.text[i] || '';
    result.push(line + repeat(' ', width - line.length));
  }
  return result;
}

function repeat(string, times) {
  var result = '';
  for (var i = 0; i < times; i++) {
    result += string;
  }
  return result;
}

function UnderlinedCell(inner) {
  this.inner = inner;
}

UnderlinedCell.prototype.minWidth = function() {
  return this.inner.minWidth();
}

UnderlinedCell.prototype.minHeight = function() {
  return this.inner.minHeight() + 1;
}

UnderlinedCell.prototype.draw = function(width, height) {
  return this.inner.draw(width, height - 1)
    .concat([repeat('-', width)]);
}

function dataingTable(data) {
  var keys = Object.keys(data[0]);

  var header = keys.map((name) => {
    return new UnderlinedCell(new TextCell(name));
  });

  var body = data.map((row) => {
    return keys.map((name) => {
      var value = row[name];
      return (typeof value == 'number') ? new RTextCell(String(value)) : new TextCell(value);
    });
  });

  return [header].concat(body);
}

function RTextCell(text) {
  TextCell.call(this, text);
}
RTextCell.prototype = Object.create(TextCell.prototype);
RTextCell.prototype.draw = function(width, height) {
  var rslt = [];
  for (let i = 0; i < height; i++) {
    let line = this.text[i] || '';
    rslt.push(repeat(' ', width - line.length) + line);
  }

  return rslt;
}

function StretchCell(inner, width, height) {
  this.inner = inner;
  this.addtionWidth = width;
  this.addtionHeight = height;
}
StretchCell.prototype.minWidth = function() {
  return this.inner.minWidth() + this.addtionWidth;
}
StretchCell.prototype.minHeight = function() {
  return this.inner.minHeight() + this.addtionHeight;
}
StretchCell.prototype.draw = function(width, height) {
  return this.inner.draw(width, height);
}


// test
var mountains = dataingTable(MOUNTAINS);
mountains[1][1] = new StretchCell(mountains[1][1], 7, 1);
console.log(drawTable(mountains));
