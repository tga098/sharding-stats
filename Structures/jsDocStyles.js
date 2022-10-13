/**
 * @typedef {Object} rawTotalData
 * @prop {number} status 
 * @prop {number} cpu
 * @prop { { rss:number, heapUsed:number } } ram
 * @prop {number} ping
 * @prop {number} guildcount
 * @prop {string[]} guildids
 * @prop {number} membercount
 * @prop {number} upsince
 * @prop {number} lastupdated
 */
/**
 * @typedef {Object} rawShardsData
 * @prop {number} status 
 * @prop {number} cpu
 * @prop { { rss:number, heapUsed:number } } ram
 * @prop {number} ping
 * @prop {number} guildcount
 * @prop {string[]} guildids
 * @prop {number} membercount
 * @prop {number} upsince
 * @prop {number} lastupdated
 */
/**
 * @typedef {Object} prettyTotalData
 * @prop {number} status 
 * @prop {number} cpu
 * @prop { { rss:number, heapUsed:number } } ram
 * @prop {number} ping
 * @prop {number} guildcount
 * @prop {string[]} guildids
 * @prop {number} membercount
 * @prop {number} upsince
 * @prop {number} lastupdated
 */

/**
 * @typedef {Object} prettyShardsData
 * @prop {number} status 
 * @prop {number} cpu
 * @prop { { rss:number, heapUsed:number } } ram
 * @prop {number} ping
 * @prop {number} guildcount
 * @prop {string[]} guildids
 * @prop {number} membercount
 * @prop {number} upsince
 * @prop {number} lastupdated
 */
/**
 * @typedef {Object} rawObject
 * @prop {rawShardsData[]} shards
 * @prop {rawTotalData} shards
 * 
*/
/**
 * @typedef {Object} prettyObject
 * @prop {prettyShardsData[]} shards
 * @prop {prettyTotalData} shards
 * 
*/

/**
 * @typedef {Object} StatsDataReturnData
 * @prop {rawObject} raw
 * @prop {prettyObject} pretty
 */

 module.exports.unused = {};