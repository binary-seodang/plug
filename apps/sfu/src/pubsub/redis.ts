import type {
  RedisModules,
  RedisFunctions,
  RedisScripts,
  RedisClientOptions,
} from '@redis/client'
import { createClient } from 'redis'
export type redisOption = RedisClientOptions<
  RedisModules,
  RedisFunctions,
  RedisScripts
>

class redisCreator {
  constructor(private readonly option?: redisOption) {}

  create() {
    return createClient(this.option)
  }
}

export default redisCreator
