const fs = require("fs");
const path = require("path");

const config = require("../config");

async function writeSession(name_file, content) {
    return await fs.writeFileSync(path.join(config.session_path, name_file + ".json"), JSON.stringify(content, null, '\t')); // nyimpen sesi baru
}

async function clearAllSession(list) {
    const files = await fs.readdirSync(config.session_path);
    for (const file of files) {
        await fs.unlink(path.join(config.session_path, file), err => {
            if (err) throw err;
        });
    }
    list(files)
}

function listFileFromDir(directoryPath, onResult) {
    let list = [], file = [], folder = [];
    Promise.all(fs.readdirSync(directoryPath).map(file_folder => {
        const promise = new Promise((resolve, reject) => {
            const stats = fs.statSync(path.join(directoryPath, file_folder));
            resolve({
                isDirectory: stats.isDirectory(),
                name: path.join(directoryPath, file_folder),
            })
        });
        return promise.then(function (result) {
            list.push(result); //ok
        });
    })).then(function () {
        // console.log(list); // debug
        file = list.filter(val => {
            if (!val.isDirectory) {
                return true
            }
            return false
        }).map(val => {
            return val.name
        });
        folder = list.filter(val => {
            if (val.isDirectory) {
                return true
            }
            return false
        }).map(val => {
            return val.name
        });
        // result
        onResult({
            file,
            folder,
        });
    });
}

module.exports = {
    writeSession,
    clearAllSession,
    listFileFromDir,
}