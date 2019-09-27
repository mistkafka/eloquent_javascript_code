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

  return str.slice(first);
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

    const context = topEnv;
    const args = expr.args.map(arg => evaluate(arg, env));
    return op.apply(null, [context, ...args]);
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

  if (evaluate(args[0], env) !== false) {
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

specialForms['set'] = function(args, env) {
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

  return function(context, ...args) {
    if (args.length != argNames.length) {
      throw new TypeError('Wrong number of arguments');
    }
    let localEnv = Object.create(env);
    localEnv['this'] = context;
    for (var i = 0; i < args.length; i++) {
      localEnv[argNames[i]] = args[i];
    }

    return evaluate(body, localEnv);
  };
};


const GENERATOR_SPLITERS = [
    'yield',
    'while',
    'if'
]
specialForms['gen'] = function (args, env) {
  if (!args.length) {
    throw new SyntaxError('Generator need a body');
  }

  let argNames = args.slice(0, args.length - 1).map((expr) => {
    if (expr.type != 'word') {
      throw new SyntaxError('Arg names must be words');
    }
    return expr.name;
  });
  let body = args[args.length - 1];
  // 拆分代码块，并且进行编号
  const blocks = [];
  let block = {
    step: 0,
    toStep: 1,
    exprs: []
  }

  let step = 0; // TODO: 把转换body的逻辑抽离到一个函数里，免得变量重复
  function archiveBlock() {
    blocks.push(block);
    step = step + 1;
    block = {
      step: step,
      toStep: step + 1,
      exprs: []
    }
  }

  function dealBodyExpr(expr) {
    if (expr.type === 'apply') {
      switch (expr.operator.name) {
        case 'do':
          walkBodyExpr(expr);
          break;

        case 'if':
          archiveBlock(); // if语句前面的代码，自己归为一块

          const ifBlock = block;
          archiveBlock(); // if语句的判断条件自己归为一块，判断代码后面再填充

          // 给条件为真的代码分块、编号
          // 得到最后这段代码里的最后一个block，后面需要将它重定向
          dealBodyExpr(expr.args[1]);
          const lastBlockInTrueBlock = block;
          archiveBlock();

          // 记录条件为假的代码中的第一个代码块编号，等会处理if语句需要用到
          const falseBlockStartAt = step;
          dealBodyExpr(expr.args[2]);
          archiveBlock();

          // 把lastBlockInTrueBlock重定向到整个if语句的下一块代码块
          // 这样，条件为真的代码执行完之后，就不会去执行条件为假的代码
          const ifBlockEndAt = step;
          lastBlockInTrueBlock.toStep = ifBlockEndAt;

          // 处理if语句的判断条件这个block
          // 通过构建一个运行时执行的语句，动态的去确认要链接到
          // 为真的代码块，还是为假的代码块
          ifBlock.toStep = (env) => {
            const cond = evaluate(expr.args[0], env);
            if (cond) {
              return ifBlock.step + 1;
            } else {
              return falseBlockStartAt;
            }
          };

          break;

        case 'while':
          archiveBlock();

          const whileBlock = block;
          archiveBlock();

          dealBodyExpr(expr.args[1]);
          const lastBlockInWhileBody = block;
          archiveBlock();

          lastBlockInWhileBody.toStep = whileBlock.step;
          const whileBlockEndAt = step;
          whileBlock.toStep = (env) => {
            const cond = evaluate(expr.args[0], env);
            if (cond) {
              return whileBlock.step + 1;
            } else {
              return whileBlockEndAt;
            }
          };

          break;

        case 'yield':
          block.exprs.push(expr);
          archiveBlock();
          break;

        default:
          block.exprs.push(expr);
      }
    } else {
      block.exprs.push(expr);
    }
  }

  function walkBodyExpr(bodyExpr) {
    bodyExpr.args.forEach(dealBodyExpr);
  }
  walkBodyExpr(body);

  return function (context, ...args) {
    let localEnv = Object.create(env);
    localEnv['this'] = context;
    for (var i = 0; i < args.length; i++) {
      localEnv[argNames[i]] = args[i];
    }

    let step = 0; // 初始状态
    return {
      next: function () {

        while (true) {
          debugger;
          let currentBlock = blocks[step] || null;
          if (!currentBlock) {
            return {
              value: undefined,
              done: true
            }
          }

          if (currentBlock.toStep instanceof Function) {
            step = currentBlock.toStep(localEnv);
          } else {
            step = currentBlock.toStep;
          }
          let exprs = currentBlock.exprs;
          let value = specialForms['do'](exprs, localEnv);
          let latestExpr = exprs[exprs.length - 1];
          if (latestExpr && latestExpr.type === 'apply' && latestExpr.operator.name === 'yield') {
            return {
              value,
              done: false
            };
          }
        }
      }
    }
  }
}

specialForms['yield'] = function (args, env) {
    return evaluate(args[0], env);
}

const topEnv = Object.create(null);
topEnv['true'] = true;
topEnv['false'] = false;
topEnv['null'] = null;
['+', '-', '*', '/', '%', '==', '<', '>'].forEach((op) => {
  topEnv[op] = new Function('ctx, a, b', 'return a ' + op + ' b;');
});
topEnv['print'] = function(ctx, value = "") {
  console.log(value);
  return value;
};
topEnv['array'] = function(ctx, ...args) {
  return [...args];
};
topEnv['length'] = function(ctx, arr) {
  return arr.length;
};
topEnv['element'] = function(ctx, arr, nth) {
  return arr[nth];
};
topEnv['setTimeout'] = function (ctx, callback, ms) {
  unreadyAsyncTaskCount = unreadyAsyncTaskCount + 1;
  return setTimeout(() => {
    unreadyAsyncTaskCount = unreadyAsyncTaskCount - 1;
    MAJOR_TASK_QUEUE.push(callback);
  }, ms);
};
topEnv['clearTimeout'] = function(ctx, timer) {
  unreadyAsyncTaskCount = unreadyAsyncTaskCount - 1;
  clearTimeout(timer)
};
topEnv['setInterval'] = function(ctx, callback, interval) {
  unreadyAsyncTaskCount = unreadyAsyncTaskCount + 1;
  return setInterval(() => {
    MAJOR_TASK_QUEUE.push(callback);
  }, interval);
};
topEnv['clearInterval'] = function (ctx, timer) {
  unreadyAsyncTaskCount = unreadyAsyncTaskCount - 1;
  clearInterval(timer);
};
topEnv['setImmediate'] = function (ctx, callback) {
  const task = () => callback();
  MICRO_TASK_QUEUE.push(task);

  return task;
};
topEnv['clearImmediate'] = function (ctx, task) {
  const index = MICRO_TASK_QUEUE.findIndex(item => item === task);
  if (index === -1) {
    return false;
  } else {
    const backElements = MICRO_TASK_QUEUE.splice(index);
    backElements.slice(1).forEach(item => MICRO_TASK_QUEUE.push(item));
    return true;
  }
};

const prototypeRef = Symbol('prototype-ref');
topEnv['objectCreate'] = function (ctx, prototype) {
  const obj = {};
  obj[prototypeRef] = prototype;

  return obj;
};
topEnv['objectGet'] = function (ctx, obj, key) {
  let head = obj;

  while (head !== null) {
    if (head[key]) {
      return head[key];
    } else {
      head = obj[prototypeRef];
    }
  }

  return null;
};
topEnv['objectSet'] = function (ctx, obj, key, val) {
  obj[key] = val;
};

topEnv['bind'] = function (ctx, fn, context) {
  return function (_, ...args) {
    return fn(context, ...args);
  }
};

// js里面的 a.f() 其实是两个过程，getter跟apply，并且这两个过程对开发者而言是一个过程。
// 这里根本没有办法通过objectGet来实现a.f()， objectGet相当于js里的 `a.f`。
// 所以，这里通过objectGetApply，来实现a.f()这样的操作
topEnv['objectGetApply'] = function (ctx, obj, key, ...args) {
    let fn = topEnv['objectGet'](null, obj, key)
    if (fn === null) {
        throw Error('undefined can not be apply');
    }

    return fn(obj, ...args);
};

topEnv['call'] = function(_, ctx, fn, ...args) {
    return fn(ctx, ...args)
}

topEnv['new'] = function(ctx, constructor, ...args) {
    const instance = {};
    if (!constructor.prototype) {
        constructor.prototype = {};
    }
    instance[prototypeRef] = constructor.prototype;
    constructor(instance, ...args);

    return instance;
};

topEnv['instanceof'] = function(ctx, ins, constructor) {
  ins = ins[prototypeRef];
  while (ins !== null) {
    if (ins === constructor.prototype) {
      return true;
    } else {
      ins = ins[prototypeRef];
    }
  }

  return false;
};


function sleep(second) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, second * 1000);
  });
}

async function run(...args) {
  let env = Object.create(topEnv);
  let program = args.join('\n');
  program = program.split('\n').map(line => {
    const commentIndex = line.search('//');
    if (commentIndex !== -1) {
      return line.slice(0, commentIndex);
    } else {
      return line;
    }
  }).join('\n');

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

module.exports = run;
