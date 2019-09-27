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