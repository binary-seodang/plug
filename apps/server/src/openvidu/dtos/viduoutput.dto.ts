import { Field, ObjectType } from '@nestjs/graphql'
import { CoreOutput } from 'common/dtos/core.entites'
import { ViduSession } from 'openvidu/entities/vidu.entitiy'
@ObjectType()
export class ViduSessionOutput extends CoreOutput {
  @Field(() => ViduSession, { nullable: true })
  session?: ViduSession
}
@ObjectType()
export class ViduTokenOutput extends CoreOutput {
  @Field(() => String, { nullable: true })
  token?: string
}
