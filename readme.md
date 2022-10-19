# Discord Sharding Stats

<img src="https://cdn.discordapp.com/attachments/911938193308385360/1030495533858566194/1665586951553.png">

*An automated Sharding Stats Dashboard-Server Manager, with which you can host your **Shard Stats** __externally__!*

- Included Clustering Stats
- Works with discord.js and discord.js sharding
- Works with Eris and discord-hybrid-sharding(preferred)
- Works with any other discord lib, via the [customPoster](https://github.com/tga098/sharding-stats/blob/v2.1.0/exampleDatas/customPoster.md) Option


# Installation
Go to your nodejs terminal and run this command

```
npm install --save sharding-stats@latest
```
# Dependency
Express 
```
npm install express@latest
```
# Getting started

First of all, you have to create a new File, which can be named `server.js`,etc.

In the `server.js` File you will need to insert the Code below

Scroll down for Api References

**File: `server.js`**

```js
const Stats = require('sharding-stats');
const express = require("express");
const app = express();

const StatsServer = new Stats.Server(app, {
    selfHost: false, // set it to true, to "self-host" the stats websites via your APP, by doing StatsServer.getStatsData(); | Data is sent via: "POST /stats" - that endpoint will be automatically assigned by the Server, if your app is a valid APP Server
    bannedUsers: [],
    bot: {
        name: "Your Discord Bot Name",
        icon: "Your Discord Bot Avatar URL",
        website: "Your Website URL",
        client_id: "Discord Bot ID",
        client_secret: "Discord Bot Client_Secret (Not Token)"
    },
    stats_uri: "http://localhost:3000/", //Base URL. Can be IP:PORT or Domains behind a proxy or just a Domain.
                                         // https://domain.com | https://repository.username.repl.co | https://server.stats-of-me.xyz
    redirect_uri: "http://localhost:3000/login", //Landing Page
    owners: ["Bot_Owner1", "Bot_Owner2"],//developer/Owner discord id
    authorizationkey: "Your Password for verifying requests from clients",
});

StatsServer.on('error', console.log)//if any error log it

app.listen(3000, () => {
  console.log("Application started, listening on port 3000!");
});

function receiveStatsDataManually() {
    return StatsServer.getStatsData(); // { raw, pretty }; // (raw|pretty).(shards|total);
}
```

# How to get Parameters

**Go to the Discord Developer Portal and to Authorization and insert your redirect_uri there**
![](https://media.discordapp.net/attachments/756591979097227295/871290682201997332/unknown.png?width=1025&height=383)

Now go to the stats_uri link or your choosen link and you should be redirected to the Dashboard with no Data.

# Pushing Data of your Client on the Dashboard

Follow the upper step before doing this step.

Open your `bot.js` File, where you login in the Client and insert this:

- If you are on [**ERIS** check out this Example](https://github.com/tga098/sharding-stats/blob/v2.1.0/exampleDatas/customPoster.md#poster-example-for-eris)

**File: `bot.js`** 

```js
const Stats = require('sharding-stats');

const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [ GatewayIntentBits.Guilds ] });//Creating your discord client

// send stats without cluster data
const Poster = new Stats.Client(client, {
    stats_uri: 'http://localhost:3000/',
    authorizationkey: "Your Password for verifying requests | Same as in Server.js",
})
/* YOUR BOT CODE STUFF */
client.login(`Your_Bot_Token`)

You can start now start your Dashboard with node server.js.

```

**WAIT!**

- What if you want to post your own Shard Data with the opportunity to send **MORE** and **CUSTOMICED** Data?
- Or what if you use a different client, than discord.js ?
- you can do everything yourself, check out: [customPoster](https://github.com/tga098/sharding-stats/blob/v2.1.0/exampleDatas/customPoster.md)

When you start your bot with or without Sharding, the Dashboard should show some information such as Status, Ram, Cpu, Ping, Guildcount and more data of each Shard and of all guilds in total.

# API References:

### new Server(EXPRESS_APP, config) && new Client(DISCORD_CLIENT, config)
| Config Options | Default | Description |Data Type |
| -------------- | ------------- |-------------- |-------------- |
|  bot.name      | 'required' | The Discord Bot Name |[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)|
|  bot.icon      | 'required' | The icon url for the html page |[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)|
|  bot.website   | 'required' | The Bot Website on the Footer |[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)|
|  bot.client_id | 'required' | [The Discord Bot ID](https://support.heateor.com/discord-client-id-discord-client-secret/ )          |[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)|
| bot.client_secret | 'required' | [The Discord Bot's Client Secret (Not Token)](https://support.heateor.com/discord-client-id-discord-client-secret/ )          |[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)|
| stats_uri      | 'required' | The Base Dashboard Link |[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)|
| bannedUsers      | 'optional' | Array of User ids, which are banned from the API Server |[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)|
| selfHost      | 'false' | Boolean, if true, then only the post:/stats will be added to your app for the backend functionality |[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)|
| redirect_uri   | 'required' | The Discord Bot Redirect Url after authorization |[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)|
| scope          | ['indentify'] |Scopes, which should be used for authorization   |[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)|
| owners         |'required' | Array of Bot Owners, which can access the Dashboard |[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)|
| postinterval   | 5000ms | The Post Interval of the new Client data |[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)|
| login_path     | '/' | The Path, where you can authorize yourself for accessing the Dashboard |[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)|
| authorizationkey | 'required' | A random chosen Password/Key, which is used for verifying requests. |[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)|
| markShardsDeadafter | 5000ms | How long to wait until the Shard is marked as dead on the Dashboard, when no new Data has been recieved |[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)|


**Have fun! and feel free to contribute/suggest or contact me on my <a href="https://discord.gg/efJyjc2h26">Discord Server</a> or DM me `TGA 3.5#8563`**
# Examples 

 - [See usefull example Data which gets returned by `StatsServer.getStatsData()`](https://github.com/tga098/sharding-stats/blob/v2.1.0/exampleDatas/statsDataReturnData.md)

 - [See the **self Hosting** Example](https://github.com/tga098/sharding-stats/blob/v2.1.0/exampleDatas/selfHostingExampel.md)

 - [See the **custom Data Posting** Example](https://github.com/tga098/sharding-stats/blob/v2.1.0/exampleDatas/customPoster.md)

# Bugs, Glitches and Issues
If you encounter any problems, feel free to <a href="https://github.com/meister03/discord-live-stats/issues">open up an issue</a> in our github repository or <a href="https://discord.gg/efJyjc2h26">join our discord server</a>!

# Credits
Partial Credits goes to [ADMIN LTE](https://adminlte.io/) for a good Starter Template, CSS and the Plugins...
Partial Credits goes to [@meister03](https://github.com/meister03/Discord-Live-Stats/) for creating the first Version

# Contributers
- Thanks to all Contributer 
- Special Thanks goes to [@tomato6966](https://github.com/Tomato6966) for contributing
# How to Contribute 
- If you have any idea and you want to contribute [here](https://github.com/tga098/sharding-stats/pulls)
- If your pull do not get checked or get response then   do not  ping us on discord or in pr 
