







new Promise((resolve, reject) => {
    throw new Error('hehe');
}).then(val => {
    console.log("do it");
}).catch(err => {
    console.log('i catched error');
    return 'hi';
}).then(() => {
    console.log('will i be executed?')
})