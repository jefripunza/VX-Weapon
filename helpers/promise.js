
async function createPromise(array_awal, onPrebuild, onResult, onError) {
    let array_save = [];
    await Promise.all(array_awal.map(async function (rows) {
        let promise = new Promise(async function (resolve, reject) {
            //and want to push it to an array
            await onPrebuild(rows, res => {
                resolve(res)
            }, rej => {
                reject(rej)
            });
        });
        return await promise.then(function (result) {
            array_save.push(result); //ok
        }).catch(async error => {
            await onError(error);
        });
    })).then(async function () {
        // result
        await onResult(array_save);
    });
}

const simulateAsyncPause = async (delay) => await new Promise(async resolve => {
    await setTimeout(async () => await resolve(), delay);
});

module.exports = {
    createPromise,
    simulateAsyncPause,
}