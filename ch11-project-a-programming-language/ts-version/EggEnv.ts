const topEnv = Object.create(null) as any;

topEnv.false = false;
topEnv.true = true;

['+', '-', '*', '/', '%', '==', '<', '>'].forEach((op) => {
  topEnv[op] = new Function('a, b', 'return a ' + op + ' b;');
});

topEnv.print = function (value) {
    console.log(value);
    return value;
};

topEnv.array = function (...args) {
    return [...args];
};

topEnv.length = function (arr) {
    return arr.length;
};

topEnv.element = function (arr, index) {
    return arr[index];
};

export {
    topEnv
}
