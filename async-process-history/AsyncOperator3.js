// 是不是感觉越来越明朗了？
// 我们还有三个问题没有处理：
//   1. 错误传递； 
//   2. then跟promise保持一致，返回值就是val，不需要调用next 
//   3. 一些琐碎的helper，如Promise.resolve/reject/all/any
// 琐碎的问题，先放着。错误传递前面一直没考虑，现在也先放着。我们继续让处理正常传值的问题 -- 不用每次调用next
//
// promise的then里，如何写异步操作？返回promise。所以，如果我们不使用注入的回调(next函数)来进行传值，而是采用返回值
// ，那么原先then里面的异步操作，就需要用promise包裹起来
class AsyncOperator3 {
    constructor(fn, isHeadPromise = true) {
        this.nextOperators = [];
        this.val = undefined;
        this.isCurrentResolved = false;
        if (isHeadPromise) {
            this.fn = (_, resolve) => fn(resolve); // 对于第一个promise，不需要val，我们给它包裹一下
            this.onPreviousResolved(undefined);
        } else {
            this.fn = fn;
        }
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
            // 这里将fn包裹成我们所需要的fn
            nextOperator = new AsyncOperator3((val, next) => {
                const result = fn(val);
                if (result instanceof AsyncOperator3) {
                    result.then(val => next(val));
                } else {
                    next(result);
                }
            }, false)
            nextOperator.onPreviousResolved(this.val);
        } else {
            nextOperator = new AsyncOperator3((val, next) => {
                const result = fn(val);
                if (result instanceof AsyncOperator3) {
                    result.then(val => next(val));
                } else {
                    next(result);
                }
            }, false);
            this.nextOperators.push(nextOperator);
        }
        return nextOperator;
    }
}


const personP = new AsyncOperator3((resolve) => {
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
})

personP.then((person) => {
    // use person.id to get other data
    return new AsyncOperator3((resolve) => {
        setTimeout(() => {
            const blogs = [1, 2, 3, 4].map(id => ({
                id,
                author: person
            }));
            resolve(blogs);
        }, 1000);
    });
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