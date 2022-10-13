const fetch = require('node-fetch');
const os = require('node-os-utils');
class Client {
    constructor(client, config) {
        this.client = client;
        this.config = config;
        this.shardMessage = new Map();
        this._validateOptions();
        this.deleteCachedShardStatus();
        this._attachEvents();
        this._autopost();
    }

    async post() {
        const shards = [...this.client.ws.shards.values()]
        const guilds = [...this.client.guilds.cache.values()]

        for (let i = 0; i < shards.length; i++) {
            const filteredGuilds = guilds ? guilds.filter(x => x.shardId === shards[i].id) : [];
            /* // example data
            {
                id: 0,
                status: 0,
                ping: 10,
                cpu: 3.45,
                ram: { rss: 385, heapUsed: 185 }
                membercount: 30446,
                guildcount: 444,
                guildids: [ '907888291725053965',  '957913119861129217',  '868774602451607572', '...' ],
                upsince: 8879483,
                cluster: 0, // only gets added, if you have clustering ;)
            },
            */
           const ram = this.getRamUsageinMB();
           const cpu = await this.receiveCPUUsage();
           const upsince = this.client.uptime;
           const message = (this.shardMessage.get(shards[i] ? shards[i].id : NaN) || `No Message Available`);
           const body = {
                id: shards[i] ? shards[i].id : NaN,
                status: shards[i] ? shards[i].status : 5,
                cpu, ram,
                message,
                ping: shards[i] ? shards[i].ping : NaN,
                membercount: filteredGuilds.map(x => x.memberCount || x.members?.cache?.size || 0).reduce((a, b) => a + b, 0),
                guildcount: filteredGuilds.filter(x => x.shardId === shards[i].id).filter(Boolean).length,
                guildids: filteredGuilds.filter(x => x.shardId === shards[i].id).map(x => x?.id).filter(Boolean),
                upsince,
            };
            if (typeof this.client?.cluster?.id !== "undefined") body.cluster = `${this.client.cluster.id}`;
            fetch(`${this.config.stats_uri}stats`, {
                method: 'POST',
                headers: {
                    'Authorization': Buffer.from(this.config.authorizationkey).toString('base64'),
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body),
            }).then(res => res.json()).then((m) => this._handleMessage(m)).catch((e) => console.error(new Error(e)))
        }
    }
    async receiveCPUUsage() {
        try {
            return await os.cpu.usage(100);
        } catch {
            return 0
        }
    }
    getRamUsageinMB() {
        const { rss, heapUsed } = process.memoryUsage();
        return {
            rss: Math.floor(rss / 1024 / 1024 * 100) / 100,
            heapUsed: Math.floor(heapUsed / 1024 / 1024 * 100) / 100
        }
    }    
    deleteCachedShardStatus() {
        return fetch(`${this.config.stats_uri}deleteShards`, {
            method: 'POST',
            headers: {
                'Authorization': Buffer.from(this.config.authorizationkey).toString('base64'),
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ kill: true, shards: 'all' }),
        }).catch((e) => e)
    }

    _autopost() {
        setInterval(() => {
            this.post()
        }, this.config.postinterval)
    }

    _attachEvents() {
        this.client.on('debug', (message) => {
            if (message.includes(`Shard`)) {
                const shards = [...this.client.ws.shards.values()]
                for (let i = 0; i < shards.length; i++) {
                    if (message.includes(`[WS => Shard ${shards[i].id}]`)) {
                        this.shardMessage.set(shards[i].id, message.replace(`[WS => Shard ${shards[i].id}]`, ''))
                    }
                }
            }
        })
    }

    _handleMessage(message) {
        if (!message.kill) return;
        if (message.shard === undefined) return;
        if (this.client.ws.shards.has(message.shard)) return this.client.ws.shards.get(message.shard).destroy();
        return false;
    }

    _validateOptions() {
        if (!this.config.authorizationkey) throw new Error('Pls provide your choosen Authorization Key for verifying Requests.');
        if (this.config.postinterval && isNaN(this.config.postinterval)) throw new Error('The PostInterval is not a valid Time. Provide the Interval in milliseconds');
        if (!this.config.postinterval) this.config.postinterval = 5000;
        if (!this.config.stats_uri || typeof this.config.stats_uri !== "string") throw new Error("Pls provide your base stats_uri, e.g: http://localhost:3333, or http:192.168.0.1:3333");
        if(!this.config.stats_uri?.endsWith?.("/")) this.config.stats_uri += "/";
    }
}
module.exports = Client;

