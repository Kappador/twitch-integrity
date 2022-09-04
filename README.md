# Twitch GQL Integrity Generator
Simplifies the process of obtaining the integrity token for Twitch's GraphQL API.

## Getting Started

Install the module with: `npm install twitch-integrity`

```javascript
const twitchIntegrity = require('twitch-integrity');

let token = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
let integrity;
try {
    integrity = await twitchIntegrity.getIntegrity(token);
} catch (e) {
    console.log(e);
}
```

## Example Result
```javascript
{
    "error": false,
    "token": "v4.public.e30=",
    "device": "289b553fe214137b",
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
    "oauth": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

## Example Usage
```javascript
const needle = require('needle');
const twitchIntegrity = require('twitch-integrity');

let token = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
let integrity;
try {
    integrity = await twitchIntegrity.getIntegrity(token);
} catch (e) {
    console.log(e);
}

needle("post", "https://gql.twitch.tv/gql", {
    "operationName": "FollowButton_FollowUser",
    "variables": {
        "input": {
            "targetID": "655929360",
            "disableNotifications": false
        }
    },
    "extensions": {
        "persistedQuery": {
            "version": 1,
            "sha256Hash": "51956f0c469f54e60211ea4e6a34b597d45c1c37b9664d4b62096a1ac03be9e6"
        }
    }
}, {
    headers: {
        ...
        "Client-Integrity": integrity.token,
        "Authorization": "OAuth " + integrity.oauth, // I am using the oauth token from the result, it ensures that the correct oauth token is used
        "Client-ID": "kimne78kx3ncx6brgo4mv6wki5h1ko",
        ...
    },
});
```
## Example Usage utilizing any http.Agent
```javascript
const needle = require('needle');
const twitchIntegrity = require('twitch-integrity');
const proxyAgent = require('proxy-agent');

let token = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
let agent = new proxyAgent("http://your.proxy:port");
let integrity = await twitchIntegrity.getIntegrity(token, agent);

needle("post", "https://gql.twitch.tv/gql", {
    "operationName": "FollowButton_FollowUser",
    "variables": {
        "input": {
            "targetID": "655929360",
            "disableNotifications": false
        }
    },
    "extensions": {
        "persistedQuery": {
            "version": 1,
            "sha256Hash": "51956f0c469f54e60211ea4e6a34b597d45c1c37b9664d4b62096a1ac03be9e6"
        }
    }
}, {
    headers: {
        ...
        "Client-Integrity": integrity.token,
        "Authorization": "OAuth " + integrity.oauth, // I am using the oauth token from the result, it ensures that the correct oauth token is used
        "Client-ID": "kimne78kx3ncx6brgo4mv6wki5h1ko",
        ...
    },
    agent: agent
});
```

## Documentation

#### `twitchIntegrity.getIntegrity()`

Generates an anonymous integrity token

Example Result:
```javascript
{
    error: false,
    token: "v4.public.e30=",
    device: "289b553fe214137b",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/
    oauth: null
}
```

#### `twitchIntegrity.getIntegrity(token, agent)`

- `token` - Twitch OAuth token
- `agent` - Optional http.Agent to use for the request

Example Result:
```javascript
{
    "error": false,
    "token": "v4.public.e30=",
    "device": "289b553fe214137b",
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
    "oauth": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

#### `twitchIntegrity.getIntegrity(token, agent, deviceId)`

- `token` - Twitch OAuth token
- `agent` - Optional http.Agent to use for the request
- `deviceId` - Optional device id to use for the request

Example Result:
```javascript
{
    "error": false,
    "token": "v4.public.e30=",
    "device": "289b553fe214137b",
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
    "oauth": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

#### `twitchIntegrity.getIntegrity(token, agent, deviceId, userAgent)`

- `token` - Twitch OAuth token
- `agent` - Optional http.Agent to use for the request
- `deviceId` - Optional device id to use for the request
- `userAgent` - Optional user agent to use for the request

Example Result:
```javascript
{
    "error": false,
    "token": "v4.public.e30=",
    "device": "289b553fe214137b",
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
    "oauth": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```