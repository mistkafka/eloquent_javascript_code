function array2List(array) {
  var head = null;
  var tail = head;

  for (var i = 0; i < array.length; i++) {
    if (tail == null) {
      tail = {
        value: array[i],
        rest: null
      };
      head = tail;
      continue;
    }

    tail.rest = {
      value: array[i],
      rest: null
    };
    tail = tail.rest;
  }

  return head;
}

function list2Array(head) {
  var array = [];
  for (var current = head; current != null; current = current.rest) {
    array.push(current.value);
  }
  return array;
}

function prepend(element, list) {
  var head = {
    value: element,
    rest: array2List(list2Array(list)) // haha~ so lazy!
  };

  return head;
}

function nth(list, index) {
  for (var i = 0, current = list; i < index; i++, current = current.rest) {
    if (current == null) {
      return undefined;
    }
  }

  return current ? current.value : undefined;
}

var array = [1, 3, 4, 5];
console.log(nth(array2List(array), 0));
console.log(nth(array2List(array), 1));
console.log(nth(array2List(array), 2));
console.log(nth(array2List(array), 3));
console.log(nth(array2List(array), 4));
console.log(nth(array2List(array), 7));


/* example code, perfect */

// cool!!!
function ex_array2list(array) {
  var list = null;
  for (var i = array.length - 1; i >= 0; i--) {
    list = {
      value: array[i],
      rest: list
    };
  }

  return list;
}

function ex_list2array(list) {
  var array = [];
  for (var curr = list; curr; curr = curr.rest) {
    array.push(curr.value);
  }
  return array;
}

// the example code is not realy re-create a new list.
function ex_prepend(value, list) {
  return {
    value: value,
    rest: list
  };
}

// cool!!!
function ex_nth(current, n) {
  if (current == null) {
    return undefined;
  }
  if (n == 0) {
    return current.value;
  }

  ex_nth(current.rest, n - 1);
}
