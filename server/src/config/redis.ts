import * as redis from 'redis';

export const redisClient = redis?.createClient({
    url:"redis://redis_db:6379",
})

redisClient?.on('connect', () => {
    console.log('Connected to Redis')
})

redisClient?.on('error', (err) => {
    console.log(err)
})