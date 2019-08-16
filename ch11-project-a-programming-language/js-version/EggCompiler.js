'use strict'

function parseExpression(program) {
  program = skipSpace(program);
  let match;
  let expr;

  if (match = /^"([^"]*)"/.exec(program)) {
    expr = {type: 'value', value: match[1]};
  } else if (match = /^\d+\b/.exec(program)) {
    expr = {type: 'value', value: Number(match[0])};
  } else if (match = /^[^\s(),"]+/.exec(program)) {
    expr = {type: 'word', name: match[0]};
  } else {
    throw new SyntaxError('Unexpected syntax:' + program);
  }

  return parseApply(expr, program.slice(match[0].length));
}

function skipSpace(str) {
  let first = str.search(/\S/);
  if (first == -1) return '';

  // 有bug，程序在放入解析前，已经被合并成一行了！如果用
  // 行注释，会直接把后面的非注释代码也给注释了。
  // 好一点的支持注释的方法不应该在skipSpace()里面做
  let noPreSpace = str.slice(first);
  let commentIndex = noPreSpace.search('//');
  if (commentIndex == 0) {
    return '';
  }

  return noPreSpace;
}

function parseApply(expr, originProgram) {
  let program = skipSpace(originProgram);
  if (program[0] != '(' ) {
    return {expr: expr, rest: program};
  }

  program = skipSpace(program.slice(1));
  expr = {type: 'apply', operator: expr, args: []};
  while(program[0] != ')' ) {
    let arg = parseExpression(program);
    expr.args.push(arg.expr);
    program = skipSpace(arg.rest);

    if (program[0] == ',') {
      program = skipSpace(program.slice(1));
    } else if (program[0] != ')') {
      console.log(originProgram);
      throw new SyntaxError('Expected \',\' or \')\'');
    }
  }
  return parseApply(expr, program.slice(1));
}

function parse(program) {
  let result = parseExpression(program);
  if (skipSpace(result.rest).length > 0) {
    throw new SyntaxError('Undepected text after program');
  }
  return result.expr;
}

function evaluate(expr, env) {
  switch(expr.type) {
  case 'value':
    return expr.value;

  case 'word':
    if (expr.name in env) {
      return env[expr.name];
    } else {
      throw new ReferenceError('Undefined variable:' + expr.name);
    }

  case 'apply':
    if (expr.operator.type == 'word' &&
        expr.operator.name in specialForms) {
      return specialForms[expr.operator.name](expr.args, env);
    }

    let op = evaluate(expr.operator, env);
    if (typeof op != 'function') {
      throw new TypeError('Applying a non-function');
    }

    return op.apply(null, expr.args.map((arg) => {
      return evaluate(arg, env);
    }));
  }
}

let specialForms = Object.create(null);
let unreadyAsyncTaskCount = 0;
const MAJOR_TASK_QUEUE = [];
const MICRO_TASK_QUEUE = [];

// the if just like 'condition ? trueToDo : falseToDo'
specialForms['if'] = function(args, env) {
  if (args.length != 3) {
    throw new SyntaxError('Bad number of args to if');
  }

  if (evaluate(args[0], env) !== false){
    return evaluate(args[1], env);
  } else {
    return evaluate(args[2], env);
  }
};

specialForms['while'] = function(args, env) {
  if (args.length != 2) {
    throw new SyntaxError('Bad number of args to while');
  }

  while (evaluate(args[0], env) !== false) {
    evaluate(args[1], env);
  }

  return false;
};

specialForms['do'] = function(args, env) {
  let value = false;
  args.forEach(function(arg) {
    value = evaluate(arg, env);
  });
  return value;
};

specialForms['define'] = function(args, env) {
  if (args.length != 2 || args[0].type != 'word') {
    throw new SyntaxError('Bad use of define');
  }

  let value = evaluate(args[1], env);
  env[args[0].name] = value;

  return value;
};

specialForms['set'] = function(args, env){
  if (args.length != 2 || args[0].type != 'word') {
    throw new SyntaxError('Bad use of define');
  }
  if (!(args[0].name in env)) {
    throw new ReferenceError(args[0].name + ' is undefined!');
  }
  let originEnv = env;
  while (!Object.prototype.hasOwnProperty.call(originEnv, args[0].name)) {
    originEnv = Object.getPrototypeOf(originEnv);
  }
  let value = evaluate(args[1], env);
  originEnv[args[0].name] = value;

  return value;
};

specialForms['fun'] = function(args, env) {
  if (!args.length) {
    throw new SyntaxError('Function need a body');
  }

  let argNames = args.slice(0, args.length - 1).map((expr) => {
    if (expr.type != 'word') {
      throw new SyntaxError('Arg names must be words');
    }
    return expr.name;
  });
  let body = args[args.length - 1];

  return function(...args) {
    if (args.length != argNames.length) {
      throw new TypeError('Wrong number of arguments');
    }
    let localEnv = Object.create(env);
    for (var i = 0; i < args.length; i++) {
      localEnv[argNames[i]] = args[i];
    }

    return evaluate(body, localEnv);
  };
};

const topEnv = Object.create(null);
topEnv['true'] = true;
topEnv['false'] = false;
['+', '-', '*', '/', '%', '==', '<', '>'].forEach((op) => {
  topEnv[op] = new Function('a, b', 'return a ' + op + ' b;');
});
topEnv['print'] = function(value) {
  console.log(value);
  return value;
}
topEnv['array'] = function(...args) {
  return [...args];
};
topEnv['length'] = function(arr) {
  return arr.length;
};
topEnv['element'] = function(arr, nth) {
  return arr[nth];
};
topEnv['setTimeout'] = function (callback, ms) {
  unreadyAsyncTaskCount = unreadyAsyncTaskCount + 1;
  return setTimeout(() => {
    unreadyAsyncTaskCount = unreadyAsyncTaskCount - 1;
    MAJOR_TASK_QUEUE.push(callback);
  }, ms);
};
topEnv['clearTimeout'] = function(timer) {
  unreadyAsyncTaskCount = unreadyAsyncTaskCount - 1;
  clearTimeout(timer)
};
topEnv['setInterval'] = function(callback, interval) {
  unreadyAsyncTaskCount = unreadyAsyncTaskCount + 1;
  return setInterval(() => {
    MAJOR_TASK_QUEUE.push(callback);
  }, interval);
};
topEnv['clearInterval'] = function (timer) {
  unreadyAsyncTaskCount = unreadyAsyncTaskCount - 1;
  clearInterval(timer);
};
topEnv['setImmediate'] = function (callback) {
  const task = () => callback();
  MICRO_TASK_QUEUE.push(task);

  return task;
};
topEnv['clearImmediate'] = function (task) {
  const index = MICRO_TASK_QUEUE.findIndex(item => item === task);
  if (index === -1) {
    return false;
  } else {
    const backElements = MICRO_TASK_QUEUE.splice(index);
    backElements.slice(1).forEach(item => MICRO_TASK_QUEUE.push(item));
    return true;
  }
};

function sleep(second) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, second * 1000);
  });
}

async function run(...args) {
  let env = Object.create(topEnv);
  let program = args.join('\n');

  MAJOR_TASK_QUEUE.push(() => evaluate(parse(program), env));

  while (MICRO_TASK_QUEUE.length > 0 || MAJOR_TASK_QUEUE.length > 0 || unreadyAsyncTaskCount > 0) {
    if (MICRO_TASK_QUEUE.length > 0) {
      const task = MICRO_TASK_QUEUE.shift();
      task();
    } else if (MAJOR_TASK_QUEUE.length) {
      const task = MAJOR_TASK_QUEUE.shift();
      task();
    } else {
      await sleep(0.1);
    }
  }
}

run('do(define(total, 0), ',
  '   define(count, 1), ',
  '   while(<(count, 11),',
  '         do(define(total, +(total, count)),',
  '            define(count, +(count, 1)))),',
  '   print(total))'
);

run(
  'do(define(plusOne, fun(a, +(a, 1))),',
  '   print(plusOne(10)))'
);

run(
  'do(define(pow, fun(base, exp,',
  '        if(==(exp, 0),',
  '                    1,',
  '                    *(base, pow(base, -(exp, 1)))))),',
  '   print(pow(2, 10)))'
);

run(
  'do(define(arr, array(1, 3, 5, 7, 9)), define(p, fun(arr, index, while(<(index, length(arr)), do(print(element(arr, index)), define(index, +(index, 1))) ))), p(arr, 0))'
);

run(
  'do(define(f, fun(a, fun(b, +(a, b)))),',
  'print(f(4)(5))) //this is comment'
);

// scope bug
run(
  'do(define(a, 0), define(f, fun(define(a, 7))), f(), print(a))'
); // 0, it should be 7

// fix scope bugs, use set
run(
  'do(define(a, 0), define(f, fun(set(a, 7))), f(), print(a))'
);


// support async api
run(
  'do(define(cb, fun(print("async print"))), setTimeout(cb, 1000), print("sync print"))'
);

run(
  `
  do(
    define(timer, 0),
    define(count, 0),
    define(cb, fun(
      do(
        print(count),
        set(count, +(count, 1)),
        if(>(count, 11), clearInterval(timer), true)
      )
    )),
    set(timer, setInterval(cb, 1000))
  )
  `
);

// support micro task queue
run(
  `
  do(
    define(majorCb, fun(print("major callback"))),
    define(microCb, fun(print("micro callback"))),
    setTimeout(majorCb, 0),
    setImmediate(microCb, 0),
    print("sync print")
  )
  `
);
