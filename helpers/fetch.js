// parsing data
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const fetchJson = async (url, post = false) => new Promise(async (resolve, reject) => {
    const request = await fetch(url, {
        headers: { "User-Agent": "okhttp/4.5.0" },
        method: post ? "POST" : "GET",
    })
    if ([
        200,
    ].some(v => request.status === v)) {
        const data = await request.json();
        data._status = request.status;
        // console.log({ request, data });
        resolve(data);
    } else {
        resolve({
            _status: request.status,
            message: request.statusText,
        })
    }
})

module.exports = {
    fetch,
    fetchJson,
}