

<details>

<summary>

## Raw shards Data
```js
const data = StatsServer.getStatsData();
console.log(data.raw.shards);
```

 - click to see the results
</summary>

```js
[
  {
    id: 2,
    cluster: 2,
    status: 0,
    cpu: 11.11,
    ram: { rss: 140.13, heapUsed: 48.5 }, // that's in mB : "heapUsed/rss"
    ping: 24,
    message: ' Heartbeat acknowledged, latency of 24ms.',
    guildcount: 18,
    membercount: 193,
    guildids: [ '905816495592972328',  '940088352944836648', '...' ],
    upsince: 1543496,
    lastupdated: 1665682261212
  },
  {
    id: 0,
    status: 0,
    cpu: 4.82,
    ram: { rss: 125.38, heapUsed: 45.86 }, // that's in mB : "heapUsed/rss"
    ping: 8,
    message: ' Heartbeat acknowledged, latency of 8ms.',
    guildcount: 12,
    membercount: 156,
    guildids: [ '985648714779590686',  '985648787949236224', '...' ],
    upsince: 1553621,
    lastupdated: 1665682266029
  },
  {
    id: 1,
    cluster: 1,
    status: 0,
    cpu: 3.8,
    ram: { rss: 159.39, heapUsed: 73.05 }, // that's in mB : "heapUsed/rss"
    ping: 10,
    message: ' Heartbeat acknowledged, latency of 10ms.',
    guildcount: 11,
    membercount: 20408,
    guildids: [ '985648714779590686',  '985648787949236224', '...' ],
    upsince: 1537351,
    lastupdated: 1665682266115
  }
]
```

</details>


<details>

<summary>

## Raw total Data
```js
const data = StatsServer.getStatsData();
console.log(data.raw.total);
```

 - click to see the results
</summary>

```js
const data = {
  status: 0, // 0 == Ready aka everything is good ;)
  cpu: 5.39, // in percent: 5.39%
  ram: { rss: 141.76, heapUsed: 55.79 }, // in mb : heapUsed/rss
  ping: 12, // in ms
  guildcount: 41,
  membercount: 20758,
  guildids: [
    '907183056287330315',  '921366076078579712',
    '985648761466392626',  '985648882061045811',
    '985648944988188692',  '985649409662517258', '...',  
  ],
  upsince: 1721502.33, // in ms
  lastupdated: 1665682441128.66, // timestamp in ms.ns
}
```

</details>

<details>

<summary>

## Pretty shards Data

```js
const data = StatsServer.getStatsData();
console.log(data.pretty.shards);
```

 - click to see the results
</summary>

```js
[
  {
    status: 'Online',
    color: 'green',
    cpu: '0%',
    ram: { rss: '124.39 MB', heapUsed: '49.37 MB' },
    ping: '9 ms',
    guildcount: '12 Guilds',
    membercount: '156 Members',
    upsince: 1113577,
    lastupdated: 1665681825986,
    guildids: [ '905816495592972328',  '940088352944836648', '...' ],
    id: 0,
    message: ' Heartbeat acknowledged, latency of 9ms.'
  },
  {
    status: 'Online',
    color: 'green',
    cpu: '7.41%',
    ram: { rss: '158.92 MB', heapUsed: '66.2 MB' },
    ping: '12 ms',
    guildcount: '11 Guilds',
    membercount: '20408 Members',
    upsince: 1097333,
    lastupdated: 1665681826098,
    guildids: [ '940221247218909244',  '985203714119839785', '...' ],
    id: 1,
    message: ' Heartbeat acknowledged, latency of 12ms.'
  },
  {
    status: 'Online',
    color: 'green',
    cpu: '6.17%',
    ram: { rss: '128.12 MB', heapUsed: '50.29 MB' },
    ping: '10 ms',
    guildcount: '18 Guilds',
    membercount: '193 Members',
    upsince: 1108441,
    lastupdated: 1665681826148,
    guildids: [ '985648714779590686',  '985648787949236224', '...' ],
    id: 2,
    message: ' Heartbeat acknowledged, latency of 10ms.'
  }
]
```

</details>


<details>

<summary>

## Pretty total Data
```js
const data = StatsServer.getStatsData();
console.log(data.pretty.total);
```

 - click to see the results
</summary>

```js
const data = {
  status: 'Online',
  color: 'green',
  cpu: '3.36%',
  ram: { rss: '141.89 MB', heapUsed: '56.89 MB' },
  ping: '11.33 ms',
  guildcount: '41 Guilds',
  membercount: '20757 Members',
  upsince: 1966521.66,
  lastupdated: 1665682686153,
  guildids: [
    '907183056287330315',  '921366076078579712',
    '985648761466392626',  '985648882061045811',
    '985648944988188692',  '985649409662517258', '...'
  ],
  id: undefined,
  message: undefined
}
```

</details>
