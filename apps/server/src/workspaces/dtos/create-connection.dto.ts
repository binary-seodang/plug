import { Field } from '@nestjs/graphql'
import { IsString } from 'class-validator'

export class CreateConnectionDto {
  @Field(() => String)
  @IsString()
  channelId: string

  @Field(() => String)
  @IsString()
  sessionId: string
}
