/**
 * Sequence Interface:
 * toHead()
 * onEnd()
 * next()
 * val()
 */

function log(seq, n) {
  if (seq.onEnd()) {
    return;
  }
  if (n == 0) {
    return;
  }
  console.log(seq.val());
  seq.next();
  log(seq, --n);
}

function ArraySeq(arr) {
  this.elements = arr;
  this.index = (this.elements[0] != undefined) ? 0 : -1;
}

ArraySeq.prototype.toHead = function() {
  this.index = (this.elements[0] != undefined) ? 0 : -1;
}

ArraySeq.prototype.onEnd = function() {
  return (this.index == this.elements.length) || this.index == -1;
}

ArraySeq.prototype.next = function() {
  this.index++;
}

ArraySeq.prototype.val = function() {
  return this.elements[this.index];
}

function RangeSeq(to, from) {
  from = from || 0;
  to = to || 0;
  var arr = [];
  for (var i = from; i <= to; i++) {
    arr.push(i);
  }
  // this.inner = new ArraySeq(arr);
  ArraySeq.call(this, arr);
}
RangeSeq.prototype = Object.create(ArraySeq.prototype);









// test

var arrSeq1 = new ArraySeq([7, 8, 2, 1, 38, 8, 29, 23]);
var arrSeq2 = new ArraySeq([1, 2, 3]);
var arrSeq3 = new ArraySeq([]);

var rangeSeq1 = new RangeSeq(9);
// log(arrSeq1, 5);
// log(arrSeq2, 5);
// log(arrSeq3);
log(rangeSeq1, 5);
