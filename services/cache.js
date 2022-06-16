const mongoose = require('mongoose');
const redis= require('redis');
const util = require('util');

const redisUri = 'redis://redis:123456@13.250.105.20:6380';
const redisClient = redis.createClient(redisUri);
redisClient.get = util.promisify(redisClient.get);
redisClient.hget = util.promisify(redisClient.hget);
redisClient.set = util.promisify(redisClient.set);
redisClient.hset = util.promisify(redisClient.hset);

mongoose.Query.prototype.cache = function (options = {}) {
    this.useCache = true;
    this.cacheKey = JSON.stringify(options || '');
    return this;
}

const exec = mongoose.Query.prototype.exec;
mongoose.Query.prototype.exec = async function () {
    if(!this.useCache) {
        return exec.apply(this, arguments);
    }
    const cacheOptionsKey = JSON.stringify({...this.getQuery(),...this.getOptions(), collection: this.model.collection.name});
    const cachedValue = await redisClient.hget(this.cacheKey, cacheOptionsKey);
    if(cachedValue) {
        const cachedValueParsed = JSON.parse(cachedValue);
        return Array.isArray(cachedValueParsed) 
        ? cachedValueParsed.map(data => new this.model(data)) 
        : new this.model(cachedValueParsed);
    }

    const result = await exec.apply(this, arguments);
    redisClient.hset(this.cacheKey, cacheOptionsKey, JSON.stringify(result));
    return result;
}

module.exports = {
    clearHash (hashKey) {
        redisClient.del(JSON.stringify(hashKey));
    }
}