// e1: 回调地狱
function callBackVersion() {
  setTimeout(() => {
    console.log('1s');
    setTimeout(() => {
      console.log('2s');
      setTimeout(() => {
        console.log('3s');
        setTimeout(() => {
          console.log('4s');
        }, 1000);
      }, 1000);
    }, 1000);
  }, 1000);
}

// callBackVersion();


// e2: 我故意把e1的每一个异步操作都写成一样的操作，这样你就很容易看出来一层套一层的回调，
// 完全可以转化为递归。你可能会说，那如果每一个异步
function recursionVersion() {
  function afterOneSecond(currSecond) {
    setTimeout(() => {
      const second = currSecond + 1;
      console.log(second + 's');

      if (second < 4) {
        afterOneSecond(second)
      } else {
        // exit recursion
      }
    }, 1000);
  }
  afterOneSecond(0);
}
// recursionVersion();


// e3.1: use for-loop to re-implement e2, wrong version
function forLoopVersion1() {
  for (let i = 1; i <= 4; i++) {
    console.log(i + 's');
  }
}
// forLoopVersion1();

// e3.2: correct version
function forLoopVersion2() {
  const asyncFns = [1, 2, 3, 4]
    .map(i => {
      return (cb) => {
        return () => {
          setTimeout(() => {
            console.log(i + 's');
            if (cb) {
              cb()
            }
          }, 1000);
        }
      };
    });

  // const cbFor4 = null;
  // const cbFor3 = asyncFns[3](cbFor4);
  // const cbFor2 = asyncFns[2](cbFor3);
  // const cbFor1 = asyncFns[1](cbFor2);
  // const cbFor0 = asyncFns[0](cbFor1);

  let cb = null;
  for (let i = 3; i >= 0; i--) {
    const asyncFn = asyncFns[i];
    cb = asyncFn(cb);
  }
  cb();
}
// forLoopVersion2();


// e4. async chain, 铺平了异步调用，统一了异步与异步之间的数据传递接口
// 为什么asyncChain一定要从后往前遍历？这个我现在还描述不好，大概前一个异步总是依赖后一个异步。如果从前往后遍历
// 的话，依赖问题总是无法解决，因为你在遍历前一个的时候，后一个并没有遍历到。
// 但是，如果改成从后往前遍历的话，就解决了这种依赖问题。因为后一个已经遍历到了，它可以作为依赖。
// 那么铺平的异步调用，如何向promise演进呢？
// promise做了什么事情？1. 铺平异步调用；2. 向外暴露了异步状态 3. 统一异步与异步之间的传值、异常传递
// 我们现在已经做到了第一点，接下来，我们先把第三点也实现了
function asyncChain(fns) {
  const headFn = fns.reduceRight((next, fn) => {
    const newNext = (val) => fn(val, next);
    return newNext;
  }, () => {});
  headFn();
}

// asyncChain([
//   (val, next) => setTimeout(() => {
//     console.log('1s');
//     next(1);
//   }, 1000),
//   (val, next) => setTimeout(() => {
//     val = val + 1;
//     console.log(val + 's');
//     next(val);
//   }, 1000),
//   (val, next) => setTimeout(() => {
//     val = val + 1;
//     console.log(val + 's');
//     next(val);
//   }, 1000),
//   (val, next) => setTimeout(() => {
//     val = val + 1;
//     console.log(val + 's');
//     next(val);
//   }, 1000),
// ]);


// e5.1 async chain to promise: basic
// 这一版，我先用面向对象的方式实现asyncChain，采用promise的then作为链式连接点。
class AsyncOperator {
    constructor(fn, immediatelyFire = true) {
        this.nextOperator = null;
        this.fn = fn;
        if (immediatelyFire) {
            this.onPreviousResolved(undefined);
        }
    }

    // 这个函数相当于上一个版本的newNext，本质上是上一个异步操作的回调函数
    onPreviousResolved(val) {
        this.fn(val, this.onCurrentResolved.bind(this));
    }

    onCurrentResolved(val) {
        if (this.nextOperator) {
            this.nextOperator.onPreviousResolved(val);
        }
    }

    then(fn) {
        this.nextOperator = new AsyncOperator(fn, false)
        return this.nextOperator;
    }
}


// new AsyncOperator((_, next) => {
//     setTimeout(() => {
//         const val = 1;
//         console.log(val + 's');
//         next(val);
//     }, 1000)
// }).then((val, next) => {
//     setTimeout(() => {
//         val = val + 1;
//         console.log(val + 's');
//         next(val);
//     }, 1000)
// }).then((val, next) => {
//     setTimeout(() => {
//         val = val + 1;
//         console.log(val + 's');
//         next(val);
//     }, 1000)
// });


// 可以看到，上面所实现的AsyncOperator跟promise的能力还是相去甚远的。尤其是一个AsyncOperator不能像promise对象那样，
// 可以多次then，并且不能在异步操作完成后(resolve被调用之后)，继续then。所以，我们来改造一下，以弥补这些空缺。
// e5.2 async chain to promise: support multiple then
class AsyncOperator2 {
    constructor(fn, immediatelyFire = true) {
        this.nextOperators = []; // next operator变成一个数组，这样就可以多次then了。
        this.fn = (val, resolve) => fn(resolve);
        this.val = undefined; // val 用来存储this.fn的执行结果。这样，即便异步操作已经完成，后续的then也能拿到this.fn的执行结果
        this.isCurrentResolved = false;
        if (immediatelyFire) {
            this.onPreviousResolved(undefined);
        }
    }

    setAsyncFn(fn) {
        this.fn = fn;
    }

    onPreviousResolved(val) {
        this.fn(val, this.onCurrentResolved.bind(this));
    }

    onCurrentResolved(val) {
        this.isCurrentResolved = true;
        this.val = val;
        this.nextOperators.forEach(nextOperator => nextOperator.onPreviousResolved(val));
    }

    then(fn) {
        let nextOperator = null;
        if (this.isCurrentResolved) {
            // 如果当前异步操作已经完成，那么new完之后，直接触发onPreviousResolved
            nextOperator = new AsyncOperator2(fn, false)
            nextOperator.onPreviousResolved(this.val);
        } else {
            // 如果当前异步操作还未完成，那么new一个延迟执行的异步操作
            // 以待完成时调用
            nextOperator = new AsyncOperator2(fn, false)
            this.nextOperators.push(nextOperator);
        }
        return nextOperator;
    }
}


const personP = new AsyncOperator2((_, next) => {
    setTimeout(() => {
        const person = {
            id: 1,
            name: 'KK',
            age: 35
        }
        next(person)
    }, 1000);
});

personP.then((person, next) => {
    console.log(person);
    next();
})

personP.then((person, next) => {
    // use person.id to get other data
    setTimeout(() => {
        const blogs = [1, 2, 3, 4].map(id => ({
            id,
            author: person
        }));
        next(blogs)
    }, 1000);
}).then((blogs) => {
    console.log(blogs);
})


// 我们在personP异步操作完成之后，再去then它，看是否依然可以获取它的值
setTimeout(() => {
    personP.then((person) => {
        console.log('after 3s, get person data:');
        console.log(person);
    });
}, 3000);