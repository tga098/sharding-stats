const statuses = {
    "0": "Online",
    "1": "Connecting",
    "2": "Reconnecting",
    "3": "Idling",
    "4": "Nearly",
    "5": "Disconnected",
    "6": "Waiting for Guilds",
    "7": "Identifying",
    "8": "Resuming",
    "9": "System Disconnected",
};

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
        const returnData = {
            status: 0, cpu: 0, ram: { rss: 0, heapUsed: 0 }, ping: 0, guildcount: 0, membercount: 0, upsince: 0, lastupdated: 0, guildids: [],  
        }
        for (const data of rawdata) {
            returnData.status += Number(data.status);
            returnData.cpu += Number(data.cpu);
            returnData.ram.rss += Number(data.ram.rss);
            returnData.ram.heapUsed += Number(data.ram.heapUsed);
            returnData.ping += Number(data.ping);
            returnData.guildcount += Number(data.guildcount);
            returnData.upsince += Number(data.upsince)
            returnData.lastupdated += Number(data.lastupdated);
            returnData.guildids.push(...(data.guildids || []));
            returnData.membercount += Number(data.membercount);
        }
        return this.formatReturnRawData(returnData, rawdata), returnData;
    }

    formatReturnRawData(returnData, rawdata) {
        if (!rawdata.length) returnData.status = 5;
        if (returnData.status > 7) returnData.status = 9;

        returnData.ram.rss = Math.floor(returnData.ram.rss / rawdata.length * 100) / 100;
        returnData.ram.heapUsed = Math.floor(returnData.ram.heapUsed / rawdata.length * 100) / 100;
        returnData.cpu = Math.floor(returnData.cpu / rawdata.length * 100) / 100;
        returnData.upsince = Math.floor(returnData.upsince / rawdata.length);
        returnData.lastupdated = Math.floor(returnData.lastupdated / rawdata.lastupdated);
        return true;
    }
    getStatusColor(status) {
        if (status === 0) return "green";
        else if (0 < status && status < 5) return "yellow";
        else if (status === 5) return "red";
        else if (status > 5) return "grey";
        else return "black";
    }
    humanize(rawdata) {
        if (Array.isArray(rawdata)) return rawdata.map(this.humanize);
        const returnData = { 
            status: statuses[rawdata.status],
            color: this.getStatusColor(rawdata.status),
            cpu: `${rawdata.cpu}%`, 
            ram: { rss: `${rawdata?.ram?.rss || NaN} MB`, heapUsed: `${rawdata?.ram?.heapUsed || NaN} MB` }, 
            ping: `${rawdata.ping} ms`, 
            guildcount: `${rawdata.guildcount} Guilds`,
            membercount: `${rawdata.membercount} Members`, 
            upsince: Number(rawdata.upsince), 
            lastupdated: Number(rawdata.lastupdated), 
            guildids: rawdata.guildids, 
            id: rawdata.id,
            message: rawdata.message,
        }
    }
}
module.exports = FormData;
