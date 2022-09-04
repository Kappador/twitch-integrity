const proxyAgent = require('proxy-agent');
const randomUseragent = require('random-useragent');
const needle = require('needle');

mdoules.exports.getIntegrity = function (token, proxyObject = null) {
    return new Promise(resolve, reject => {
        let agent = false;
        if (proxyObject) {
            if (!proxyObject.type) {
                return reject({ error: true, message: "Proxy type is not defined" });
            }

            if (!proxyObject.host) {
                return reject({ error: true, message: "Proxy host is not defined" });
            }

            let proxy;
            switch (proxyObject.type.toLowerCase()) {
                case "http":
                    proxyObject.type = "http://";
                    break;
                case "https":
                    proxyObject.type = "https://";
                    break;
                case "socks4":
                    proxyObject.type = "socks4://";
                    break;
                case "socks5":
                    proxyObject.type = "socks5://";
                    break;
                default:
                    return reject({ error: true, message: "Proxy type is not defined" });
            }

            if (!proxyObject.port) {
                proxy = proxyObject.type + proxyObject.host;
            } else {
                proxy = proxyObject.type + proxyObject.host + ":" + proxyObject.port;
            }

            if (proxyObject.username && proxyObject.password) {
                proxy = proxyObject.username + ":" + proxyObject.password + "@" + proxy;
            }

            agent = proxyAgent(proxy);
        }

        needle("post", "https://gql.twitch.tv/integrity", {}, {
            headers: getTwitchHeader(token),
            agent: agent,
            json: true
        }).then((res) => {
            if (res.statusCode != 200) {
                return reject({ error: true, message: "Failed to generate integrity" });
            }
            if (res.body.error) {
                return reject({ error: true, message: res.body.message });
            }
            return resolve({ error: false, token: res.body.token, device: deviceId, userAgent: userAgent });
        }).catch((err) => {
            return reject({ error: true, message: err });
        });
    });
}

function getTwitchHeader(token = null, integrity = null) {
    const header = {
        Accept: "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US",
        "Client-ID": "kimne78kx3ncx6brgo4mv6wki5h1ko",
        "Client-Integrity": integrity.token,
        Connection: "keep-alive",
        "Content-Type": "text/plain; charset=UTF-8",
        "Device-ID": integrity.device ?? "".concat(Math.random().toString(36).substring(2, 15), Math.random().toString(36).substring(2, 15)),
        Origin: "https://www.twitch.tv",
        Referer: "https://www.twitch.tv/",
        Authorization: token ? "OAuth " + token : null,
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-site",
        "Sec-GPC": "1",
        "User-Agent": integrity.userAgent ?? randomUseragent.getRandom(),
    };
    return header;
}