class FormData {
    constructor(data) {
        this.shard = new Map();
    }
    _patch(newdata) {
        this.shard.set(newdata.id, {
            ...newdata,
            lastupdated: Date.now()
        })
    }

    shardData(shardId, options = {}) {
        if (options.all) return [...this.shard.values()]
        return this.shard.get(shardId)
    }

    totalData() {
        const rawdata = [...this.shard.values()];
        let status = 0;
        let cpu = 0;
        let ram = { rss: 0, heapUsed: 0 };
        let ping = 0;
        let guildcount = 0;
        let membercount = 0;
        let guildids = [];
        let upsince = 0;
        let lastupdated = 0;
        for (let i = 0; i < rawdata.length; i++) {
            status += Number(rawdata[i].status);
            cpu += Number(rawdata[i].cpu);
            ram.rss += Number(rawdata[i].ram.rss);
            ram.heapUsed += Number(rawdata[i].ram.heapUsed);
            ping += Number(rawdata[i].ping);
            guildcount += Number(rawdata[i].guildcount);
            upsince += Number(rawdata[i].upsince)
            lastupdated += Number(rawdata[i].lastupdated);
            guildids.push(...(rawdata[i].guildids || []));
            membercount += Number(rawdata[i].membercount);
        }
        if (!rawdata.length) status = 5;
        if (status > 7) status = 9;
        ram.rss = Math.floor(ram.rss / rawdata.length * 100) / 100;
        ram.heapUsed = Math.floor(ram.heapUsed / rawdata.length * 100) / 100;
        return { 
            status: status, 
            cpu: Math.floor(cpu / rawdata.length * 100) / 100, 
            ram, 
            ping: Math.floor(ping / rawdata.length * 100) / 100, 
            guildcount,
            membercount,
            upsince: Math.floor(upsince / rawdata.length * 100) / 100, 
            lastupdated: Math.floor(lastupdated / rawdata.length * 100) / 100,
            guildids,  
        }
    }

    humanize(rawdata) {
        if (Array.isArray(rawdata)) {
            const result = [];
            for (let i = 0; i < rawdata.length; i++) {
                result.push(this.humanize(rawdata[i]))
            }
            return result;
        }
        let color;
        let status;
        let cpu;
        let ram = {};
        let ping;
        let guildcount;
        let membercount;
        let guildids = rawdata.guildids;
        if (rawdata.status === 0) {
            status = 'Online';
            color = 'green';
        }
        if (0 < rawdata.status && rawdata.status < 5) {
            if (rawdata.status === 1) status = 'Connecting';
            if (rawdata.status === 2) status = 'Reconnecting';
            if (rawdata.status === 3) status = 'Idling';
            if (rawdata.status === 4) status = 'Nearly';
            color = 'yellow';
        }
        if (rawdata.status === 5) {
            status = 'Disconnected';
            color = 'red';
        }
        if (rawdata.status > 5) {
            if (rawdata.status === 6) status = 'Waiting for Guilds';
            if (rawdata.status === 7) status = 'Identifying';
            if (rawdata.status === 8) status = 'Resuming';
            if (rawdata.status === 9) status = 'System Disconnected';
            color = 'grey';
        }

        cpu = `${rawdata.cpu}%`;
        ram.rss = `${rawdata.ram.rss} MB`;
        ram.heapUsed = `${rawdata.ram.heapUsed} MB`
        ping = `${rawdata.ping} ms`;
        guildcount = `${rawdata.guildcount} Guilds`;
        membercount = `${rawdata.membercount} Members`;
        const upsince = Number(rawdata.upsince)
        const lastupdated = Number(rawdata.lastupdated)
        return {
            status, 
            color, 
            cpu, 
            ram, 
            ping, 
            guildcount, 
            membercount, 
            upsince, 
            lastupdated, 
            guildids, 
            id: rawdata.id,
            message: rawdata.message
        }
    }
}
module.exports = FormData;
