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
 * @prop {number} id 
 * @prop {number} [cluster] 
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
 * @prop {string} status 
 * @prop {string} color 
 * @prop {string} cpu
 * @prop { { rss:string, heapUsed:string } } ram
 * @prop {string} ping
 * @prop {string} guildcount
 * @prop {string[]} guildids
 * @prop {string} membercount
 * @prop {number} upsince
 * @prop {number} lastupdated
 * @prop {number} id 
 * @prop {string} message 
 */

/**
 * @typedef {Object} prettyShardsData
 * @prop {number} id 
 * @prop {number} [cluster] 
 * @prop {string} color 
 * @prop {string} status 
 * @prop {string} cpu
 * @prop { { rss:string, heapUsed:string } } ram
 * @prop {string} ping
 * @prop {string} guildcount
 * @prop {string[]} guildids
 * @prop {string} membercount
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