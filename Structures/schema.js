class Schema {
    constructor(data = {}) {
        // add all datas to the schema
        for(const [key, value] of Object.entries(data)) {
            this[key] = value;
        }
        // format the things.
        this.id = isNaN(data.id) ? `NG` : Number(data.id);
        if(data.cluster) this.cluster = isNaN(data.cluster) ? "NG" : Number(data.cluster);
        this.status = isNaN(data.status) ? 5 : data.status;
        this.cpu = isNaN(data.cpu) ? NaN : data.cpu;
        this.ram = typeof data.ram === "undefined" ? NaN : data.ram;
        this.ping = isNaN(data.ping) ? NaN : data.ping;
        this.message = data.message || `No Data-Message Recieved`;
        this.guildcount = isNaN(data.guildcount) ? NaN : data.guildcount;
        this.membercount = typeof data.membercount === "undefined" ? NaN : data.membercount;
        this.guildids = typeof data.guildids === "undefined" ? NaN : data.guildids;
        this.upsince = isNaN(data.upsince) ? 0 : data.upsince;
    }
    toObject() {
        return this;
    }
}
module.exports = Schema;
