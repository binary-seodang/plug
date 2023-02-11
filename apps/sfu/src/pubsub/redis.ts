import type {
  RedisModules,
  RedisFunctions,
  RedisScripts,
  RedisClientOptions,
} from '@redis/client'
import { createClient, RedisClientType, RedisDefaultModules } from 'redis'
export type redisOption = RedisClientOptions<
  RedisModules,
  RedisFunctions,
  RedisScripts
>
export type redisConnection = RedisClientType<
  RedisDefaultModules & RedisModules,
  RedisFunctions,
  RedisScripts
>

export interface PubSub {
  publicher: redisConnection
  subscriber: redisConnection
}

class redisCreator {
  constructor(private readonly option?: redisOption) {}

  create() {
    return createClient(this.option)
  }
}

export default redisCreator
