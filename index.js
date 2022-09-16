const randomUseragent = require('random-useragent');
const needle = require('needle');

module.exports.getIntegrity = function (token = null, agent = false, deviceId = null, userAgent = null) {
    return new Promise((resolve, reject) => {

        const header = getTwitchHeader(token, null, deviceId, userAgent);
        needle("post", "https://gql.twitch.tv/integrity", {}, {
            headers: header,
            agent: agent,
            json: true
        }).then((res) => {
            if (res.statusCode != 200) {
                return reject({ error: true, message: "Failed to generate integrity" });
            }
            if (res.body.error) {
                return reject({ error: true, message: res.body.message });
            }
            return resolve({ error: false, token: res.body.token, device: header["Device-ID"], userAgent: header["User-Agent"], oauth: token });
        }).catch((err) => {
            return reject({ error: true, message: err });
        });
    });
}

function getTwitchHeader(token = null, integrity = null, deviceId = null, userAgent = null) {
    const header = {
        Accept: "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US",
        "Client-ID": "kimne78kx3ncx6brgo4mv6wki5h1ko",
        "Client-Integrity": integrity ?? null,
        Connection: "keep-alive",
        "Content-Type": "text/plain; charset=UTF-8",
        "Device-ID": deviceId ?? "".concat(Math.random().toString(36).substring(2, 15), Math.random().toString(36).substring(2, 15)),
        Origin: "https://www.twitch.tv",
        Referer: "https://www.twitch.tv/",
        Authorization: token ? "OAuth ".concat(token) : null,
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-site",
        "Sec-GPC": "1",
        "User-Agent": userAgent ?? randomUseragent.getRandom(),
    };
    return header;
}