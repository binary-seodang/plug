import { CoreDTO } from 'common/dtos/core.entites'
import { User as PrismaUser, UserRole } from '@prisma/client'
import {
  InputType,
  ObjectType,
  Field,
  registerEnumType,
  Directive,
} from '@nestjs/graphql'
import { IsString, IsEnum, IsOptional } from 'class-validator'

registerEnumType(UserRole, { name: 'UserRole' })

@InputType('UserInputType', { isAbstract: true })
@Directive('@key(fields: "id")')
@ObjectType()
export class User extends CoreDTO implements PrismaUser {
  @Field(() => String)
  @IsString()
  nickname: string

  @Field(() => UserRole, { nullable: true, defaultValue: UserRole.Client })
  @IsEnum(UserRole)
  @IsOptional()
  role: UserRole | null

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  sessionId: string | null
}
