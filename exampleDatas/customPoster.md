1. create the sharding stats **server.js**

**File: `server.js`**

```js
const Stats = require('sharding-stats');
const express = require("express");
const app = express();

const StatsServer = new Stats.Server(app, {
    selfHost: false, // set it to true, to "self-host" the stats websites via your APP, by doing StatsServer.getStatsData(); | Data is sent via: "POST /stats" - that endpoint will be automatically assigned by the Server, if your app is a valid APP Server
    bannedUsers: [],
    bot: {
        name: "Your Bot Name",
        icon: "Your Discord Bot Avatar URL",
        website: "Your Website URL",
        client_id: "Discord Bot ID",
        client_secret: "Discord Bot Client_Secret (Not Token)"
    },
    stats_uri: "http://localhost:3000/", //Base URL
    redirect_uri: "http://localhost:3000/login", //Landing Page
    owners: ["Bot_Owner1", "Bot_Owner2"],
    authorizationkey: "Your Password for verifying requests",
});

StatsServer.on('error', console.log)

app.listen(3000, () => { console.log("Application started, listening on port 3000!"); });
```

 - Wanna host the Statuspage yourself? [See the **self Hosting** Example](https://github.com/tga098/sharding-stats/blob/v1.0.0/exampleDatas/selfHostingExampel.md)


Now to the client data-posting:


```js
const Stats = require('sharding-stats');

const statsClient = new Stats.Client(client, {
    // this variable is IMPORTANT
    customPoster: true, // use your custom post stats function
    stats_uri: 'http://localhost:3333/',
    authorizationkey: "password",
})

// define when, and how often to post stats
setInterval(() => postStats(), 2000);
// function to post stats
async function postStats() {
  // all shards of that client-process
  const shards = [...this.client.ws.shards.values()];
  // all guilds of that cluster
  const guilds = [...this.client.guilds.cache.values()];
  for (let i = 0; i < shards.length; i++) {
    // get all guilds in that shard
    const filteredGuilds = guilds ? guilds
       .filter(x => x.shardId === shards[i].id)
       .filter(Boolean)
      : [];
    const body = {
      id: shards[i] ? shards[i].id : NaN,
      cluster: client.cluster?.id,
      status: shards[i] ? shards[i].status : 5,
      cpu: await statsClient.receiveCPUUsage(), 
      ram: statsClient.getRamUsageinMB(),
      message: "latest shard debug message",
      ping: shards[i] ? shards[i].ping : NaN,
      membercount: filteredGuilds.map(x => x.memberCount || x.members?.cache?.size || 0).reduce((a, b) => a + b, 0),
      guildcount: filteredGuilds.length,
      guildids: filteredGuilds.map(x => x?.id),
      upsince: statsClient.uptime,
    };
    await statsClient.sendPostData(body); // it's important to call this "PER SHARD"
  }
}
```

You can transform that function `postStats` to what ever u need,

You can even send custom data, just add it to the body!

**Poster Example for [Eris](https://npmjs.com/eris)**

```js
const Stats = require('sharding-stats');

const statsClient = new Stats.Client(client, {
    // this variable is IMPORTANT
    customPoster: true, // use your custom post stats function
    stats_uri: 'http://localhost:3333/',
    authorizationkey: "password",
})

// define when, and how often to post stats
setInterval(() => postStats(), 2000);
// function to post stats
async function postStats() {
    // coming soon
}
```