import { PrismaModule } from 'prisma/prisma.module'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SenderModule } from './sender/sender.module'
import { GrpcModule } from './grpc/grpc.module'
import joi from 'joi'
import { PubSubModule } from 'pubsub/pubsub.module'
import { SessionModule } from 'session/session.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'development'
          ? '.env.development'
          : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      validationSchema: joi.object({
        PORT: joi.string().required(),
        AUTH_KEY: joi.string().required(),
        REDIS_HOST: joi.string().required(),
        REDIS_URL: joi.string().required(),
        REDIS_PASSWORD: joi.string().required(),
        JWT_PRIVATE_KEY: joi.string().required(),
        JWT_PUBLIC_KEY: joi.string().required(),
      }),
    }),
    SenderModule,
    GrpcModule,
    PrismaModule,
    SessionModule,
    PubSubModule.forRoot({
      url: process.env.REDIS_URL,
      password: '1234',
    }),
    // GraphQLModule.forRoot<ApolloDriverConfig>({
    //   driver: ApolloDriver,
    //   autoSchemaFile: true,
    // }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
