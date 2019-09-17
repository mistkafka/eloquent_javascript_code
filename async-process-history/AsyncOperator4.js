//
// 搞定了then之后，我们接下来应该开始处理错误传值问题了。
// 我觉得这个问题是从讨论回调地狱开始，就被忽略的一个问题。我感觉，这时候直接想
// 在AsyncOperator上实现promise式的错误处理机制，可能会有点困难。这里简单梳理一下。
//
// nodejs的错误传值风格。nodejs最开始是把错误当作回调函数的第一个参数传递给回调的，而第二个参数才是
// 真正的值。设回调的签名长这样：(err, val) => void。所以，如果出现的错误，那么很自然的，val肯定不会
// 是那你所希望的值，大部分情况下如果你不handle err不为null的情况，那么你的逻辑基本也会报错。
//
// 回调地狱、异步调用链都可以采用这样的方式来处理异常传递。不过promise并不是这样做的。
// promise比这种方式更严格、方便：
// 1. 更严格在于：promise里抛出异常了，链的后续节点真的不会被执行，除非被handle住；
// 2. 更方便在于：promise采用值、异常分离处理，并且异常可以延后几个节点在catch；
//
// 我们来尝试实现这个机制。
//
// 思路：很显然，关键点在于isCurrentResolved，这个变量要做一些扩展，不能只有两种状态。onPreviousResolved也要有一层扩展，不能只是处理resolve的情况

class MyPromise {
    constructor(fn) {
        this.nextNodes = [];
        this.status = 'pending';
        this.val = undefined;
        this.err = undefined;
        this.resolveFn = undefined;
        this.rejectFn = undefined;

        if (fn) {
            try {
                fn(this.onCurrentResolved.bind(this), this.onCurrentRejected.bind(this));
            } catch (err) {
                this.onCurrentRejected(err);
            }
        }
    }

    onPreviousResolved(val) { 
        if (!this.resolveFn) {
            this.onCurrentResolved(val);
            return;
        }
        this.executeHook(val, this.resolveFn);
    }

    onPreviousRejected(err) {
        if (!this.rejectFn) {
            this.onCurrentRejected(err);
            return;
        }

        this.executeHook(err, this.rejectFn);
    }

    executeHook(valOrErr, hook) {
        try {
            const result = hook.call(this, valOrErr);
            if (result instanceof MyPromise) {
                result.then(val => this.onCurrentResolved(val));
            } else {
                this.onCurrentResolved(result);
            }
        } catch (err) {
            this.onCurrentRejected(err);
        }
    }

    onCurrentResolved(val) {
        this.status = 'resolved';
        this.val = val;
        this.nextNodes.forEach(node => node.onPreviousResolved(val))
    }

    onCurrentRejected(err) {
        this.status = 'rejected';
        this.err = err;
        this.nextNodes.forEach(node => node.onPreviousRejected(err))
    }

    then(thenFn) {
        const p = new MyPromise();
        p.resolveFn = thenFn;
        this.handleRegisterHook(p);
        return p;
    }

    catch(catchFn) {
        const p = new MyPromise();
        p.rejectFn = catchFn;
        this.handleRegisterHook(p);
        return p;
    }

    handleRegisterHook(p) {
        switch (this.status) {
            case 'resolved':
                p.onPreviousResolved(this.val);
                break;
            case 'rejected':
                p.onPreviousRejected(this.err);
                break;
            case 'pending':
            default:
                this.nextNodes.push(p);
        }
    }
}

MyPromise.resolve = function(value) {
    const promise = new MyPromise();
    promise.value = value;
    promise.status = 'resolved';

    return promise;
}

MyPromise.reject = function(err) {
    const promise = new MyPromise();
    promise.err = err;
    promise.status = 'rejected';

    return promise;
}

MyPromise.all = function (promises) {
    let pendingCount = promises.length;
    let datas = new Array(pendingCount);
    return new MyPromise((resolve, reject) => {
        promises.forEach((promise, index) => {
            promise.then(val => {
                datas[index] = val;
                pendingCount = pendingCount - 1;
                if (pendingCount === 0) {
                    resolve(datas);
                }
            }).catch(err => reject(err));
        });
    });
}

MyPromise.all = function (promises) {
    let pendingCount = promises.length;
    let datas = new Array(pendingCount);
    return new MyPromise((resolve, reject) => {
        promises.forEach((promise, index) => {
            promise.then(val => {
                datas[index] = val;
                pendingCount = pendingCount - 1;
                if (pendingCount === 0) {
                    resolve(datas);
                }
            }).catch(err => reject(err));
        });
    });
}
MyPromise.race = function (promises) {
    return new MyPromise((resolve, reject) => {
        promises.forEach((promise, index) => {
            promise.then(val => resolve(val)).catch(err => reject(err));
        });
    });
}

const personP = new MyPromise((resolve) => {
    setTimeout(() => {
        const person = {
            id: 1,
            name: 'KK',
            age: 35
        }
        resolve(person)
    }, 1000);
});

personP.then((person) => {
    console.log(person);
    console.log('I throw an error');
    throw new Error('the error');
    return person;
}).then(person => {
    console.log('can i recive the person?');
}).catch(err => {
    console.log('I catched an error: ' + err.message);
    console.log('and will return a promise');

    return new MyPromise((resolve, reject) => {
        setTimeout(() => {
            resolve('the data from catch');
        }, 3000);
    });
}).then(data => {
    console.log('what can i get from data?');
    console.log('the data is: ' + data);
});

personP.then((person) => {
    // use person.id to get other data
    return new MyPromise((resolve) => {
        setTimeout(() => {
            const blogs = [1, 2, 3, 4].map(id => ({
                id,
                author: person
            }));
            resolve(blogs);
        }, 1000);
    });
}).then((blogs) => {
    console.log(JSON.stringify(blogs, null, 2));
})


// 我们在personP异步操作完成之后，再去then它，看是否依然可以获取它的值
setTimeout(() => {
    personP.then((person) => {
        console.log('after 3s, get person data:');
        console.log(person);
    });
}, 3000);


// 搞定，非常的work。