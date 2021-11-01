const fs = require("fs");
const path = require("path");

const session_path = path.join(__dirname, "session")
const virtex_path = path.join(__dirname, "virtex")

const config = {
    session_path,
    virtex_path,
}

module.exports = config