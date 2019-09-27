// generator的用法

function* fib() {
    yield 1;
    let f_2 = 0;
    let f_1 = 1;
    let f_0 = 1;
    while (f_0 < 10) {
        f_0 = f_1 + f_2;
        f_2 = f_1;
        f_1 = f_0;
        yield f_0;
    }
}

const aFib = fib();
console.log(aFib.next().value);
console.log(aFib.next().value);
console.log(aFib.next().value);
console.log(aFib.next().value);
console.log(aFib.next().value);
console.log(aFib.next().value);
console.log(aFib.next().value);
console.log(aFib.next().value);
console.log(aFib.next().value);
console.log(aFib.next().value);
console.log(aFib.next().value);


// 如何实现一个generator呢？
// 这方面的文章我之前看过，是一篇关于facebook regenerator的源码解析。所以，这里也谈不上独立思考了～ 只能把它复述一遍。
//
// generator是一种新的语法，这跟promise不一样，promise你可以基于现有语法而实现出来，而generator不行，所以这是一个编译解析的范畴。
// 在思考如何让Egg language之前，我们先尝试实现一个符合generator接口的“generator”，就拿上面的斐波那契数列来说。

//
// fib2的返回值跟fib一样
function fib2() {
    let f_2 = 0;
    let f_1 = 1;
    let f_0 = 1;

    let callTimes = 0;
    return {
        next() {
            if (callTimes === 0) {
                return {
                    value: 1,
                    done: false
                }
            } else if (f_0 < 1000000) {
                f_0 = f_1 + f_2;
                f_2 = f_1;
                f_1 = f_0;
                return {
                    value: f_0,
                    done: false
                }
            } else {
                return {
                    value: undefined,
                    done: true
                }
            }
        }
    }
}

function fib3() {
    let f_2;
    let f_1;
    let f_0;

    let step = 1;

    return {
        next() {
            while (true) {
                switch (step) {
                    case 1:
                        step = 2;
                        return {
                            value: 1,
                            done: false
                        };
                    case 2:
                        step = 3;
                        f_2 = 0;
                        f_1 = 1;
                        f_0 = 1;
                        break;
                    case 3:
                        if (f_0 > 10) {
                            step = 4;
                            break;
                        }
                        f_0 = f_1 + f_2;
                        f_2 = f_1;
                        f_1 = f_0;
                        return {
                            value: f_0,
                            done: false
                        };
                    case 4:
                        return {
                            value: undefined,
                            done: true
                        };
                }
            }
        }
    }
}

//
// 我们继续改造几个

// 生成偶自然数的generator
function* oddNatures() {
    // step 1
    let n = 0;

    // step 2
    while (true) {
        // step 2.1 ->  3
        if (n % 2 === 0) {
            yield n;
        }

        // step 2.2 -> 4
        n = n + 1;
    }


    // step 5, final
}

function* example(n) {

  // block 1
  let test = 'whatever';
  yield test;

  if (n % 2 === 0) { // block 2

    // block 3
    n = n + 1;
    yield n;

    // block 4
    n = n + 2;
    yield n;

    // block 5
    n = n + 3;
    yield n;
  } else {

    // block 6
    n = n + 1;
    yield n;
  }

  while(n < 100) {  // block 7

    // block 8
    n = n + 1;
    yield n;

    // block 9
    n = n + 2;
  }
}

function oddNatures2(n) {
    let n;

    let step = 1;
    return {
        next() {
            while (true) {
                switch (step) {
                    case 1:
                        n = 0;
                        step = 2;
                        break;
                    case 2:
                        step = 3;
                        break;
                    case 3:
                        step = 4;
                        if (n % 2 === 0) {
                            return {
                                value: n,
                                done: false
                            };
                        }
                        break;
                    case step 4:
                        step = 3;
                        n = n + 1;
                        break;
                    case 5:
                        return {
                            value: undefined,
                            done: true
                        };
                }
            }
        }
    };
}

function randomInt() {
    const n = Math.random() * 100;
    return Number.parseInt(n);
}


// 让我们写一个很绕的生成器，然后手工转换
function* crazyNumbers() {
    // step 1
    let n = 0;
    yield randomInt();

    // step 2
    while (n < 1000) {

        // step 2.1
        if (n % 2 === 1) {
            yield n; // 2.1.1
        } else  {
            yield randomInt() + n; // 2.1.2
        }

        // step 2.2
        n = n + 1;
    }

    // step 3
    n = 1;

    // step 4
    while (n < 1000) {
        // step 4.1
        if (n % 3 === 0) {
            yield randomInt() + n; // step 4.1.1
        } else {
            yield n; //  step 4.1.2
        }

        // step 4.2
        n = n + 2;
    }

    // step 5
    yield 1000;

    // step 6
}

function crazyNumbersG() {
    let n;
    let step = '1';

    return {
        next() {
            while (true) {
                switch (step) {
                    case '1':
                        step = 2;
                        n = 0;
                        return {
                            value: randomInt(),
                            done: false
                        };
                    case '2':
                        if (n < 1000) {
                            step = '2.1';
                        } else {
                            step = '3';
                        }
                        break;
                    case '2.1':
                        if (n % 2 === 1) {
                            step = '2.1.1';
                        } else {
                            step = '2.1.2';
                        }
                        break;
                    case '2.1.1':
                        step = '2.2';
                        return {
                            value: n,
                            done: false
                        };
                    case '2.1.2':
                        step = '2.2';
                        return {
                            value: randomInt() + n,
                            done: false
                        };
                    case '2.2':
                        step = '2';
                        n = n + 1;
                        break;
                    case '3':
                        step = '4'
                        n = 1;
                        break;
                }
            }
        }
    }
}



//
// 一开始要给Egg language添加Generator的时候，完全不知所措。我总感觉没办法处理嵌套问题、
// 不知道怎么处理上下文问题。
//
// 我还想过是不是能有一种方法真的可以让evaluate一个表达式树的时候暂停，然后再恢复执行。但是没有想到什么方法可以做到。
//
// 最后，只能硬着头皮尝试用上面的方法来实现。
// 我决定先从最简单的例子入手，不考虑嵌套、if、while语句等问题。
//
// 写完了～ 有几个关键点要说一下。
// 1. 如何处理变量？
// 2. 如何切分代码块？：按照上面所说的，根据yield、while、if来切分代码块是没错的。特别多说一句，if跟while的判断内容单独成为一个代码块（上面就是这么做的）。
// 3. 如何给代码块编label？
// 4. 如何把代码块链接起来？
//
// 1. 如何处理变量？ 上面我们手动转换的例子中都会把generator里面用到变量提取处理，在解释器层面如何做这件事情呢？答案是不需要做！因为你在实现解释器的时候，"权限"更大，
//    你只需要控制好每次执行了哪些语句就行了。至于变量，已经自然的体现在env里了。
//
// 2. 如何切分代码块？完全按照上面所说的，根据yield、while、if来切分代码块就行了。特别多说一句，if跟while的判断内容单独成为一个代码块（上面就是这么做的）。
//
// 3. 如何给代码块编label？思考这个问题的时候，我回过头来观察上面的例子。摸索了一下后发现3个关键点：
//      1) 用1、2、3数字或者用'1.1'、'1.2'这样带有嵌套结构信息的编号不是重点，重点在于编号的顺序。它应该依照程序执行的解释顺序来进行，也就是说遇到可以递归遍历的节点（if、while），
//      则需要优先往下遍历。这样在我们后面处理链接代码块的时候，就会比较自然。
//      2) 不需要写switch语句，switch的本质是一个mapping逻辑，但是这里我们是在实现一个解释器，只需要控制喂什么代码块给解释器就好了。这一点，跟"如何处理变量？"的原因是一样的。但是mapping逻辑还是要有的。
//      3) 我们可以用递增的数字来编代码块，把代码块存储在数组里，数组本身就起到了上面提到的mapping逻辑的作用（你可以根据代码块的index来获取到要执行的代码块，本质上跟switch-case一样）。
//
// 4. 如何把代码块的链接起来？
//    根据上面提到的如何给代码块编号，我们先来编一个号：
//        function* example(n) {
//
//          // block 1
//          let test = 'whatever';
//          yield test;
//
//          if (n % 2 === 0) { // block 2
//
//            // block 3
//            n = n + 1;
//            yield n;
//
//            // block 4
//            n = n + 2;
//            yield n;
//
//            // block 5
//            n = n + 3;
//            yield n;
//          } else {
//
//            // block 6
//            n = n + 1;
//            yield n;
//          }
//
//          while(n < 100) {  // block 7
//
//            // block 8
//            n = n + 1;
//            yield n;
//
//            // block 9
//            n = n + 2;
//          }
//
//          // block 10 （程序结束了）
//        }
//
//    你希望这段程序怎么执行？如果没有if跟while，那么程序一定是按顺序执行的。也就是说，代码块1执行完毕后，执行代码块2... ..
//    我们试试用顺序执行的方式以此执行代码块，看看哪些地方错了？
//    1. block 2执行完 *不一定* 会执行block 3，也可能执行block 6
//    2. block 5执行完一定不能执行block 6，而是要去执行block 7
//
//    3. block 7执行完 *不一定* 会执行block8，也可能执行block 10
//    4. block 9执行完一定不能执行block10，也可能执行block7
//
//    看来顺序执行在大多数时候，是没有错的，我们只需要纠正上面4种情况就可以了。所以，我们让代码块先顺序链接，然后再特殊处理if、while就可以了。结合这个例子，具体说明如下：
//
//    遇到if语句。
//      1) 记录条件语句的代码块。(block 2)
//      2) 给条件为真的代码分块、编号，记录这里面的最后一个代码块。(block 5)
//      3) 给条件为假的代码分块、编号，记录整个if语句后面一个代码块的编号。(编号为7)
//      4) 将block 5链接到block 7
//      5) 改造block 2，让它条件语句为真时链接到它的下一个代码块，也就是block 3；条件语句为假时，链接到block 5的下一个代码块，也就是block 6
//
//    语句while语句与此同理。
//
//    具体实现代码见: EggCompiler.js
