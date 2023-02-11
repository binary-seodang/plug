import { IsString } from 'class-validator'

export class CreateConnectionDto {
  @IsString()
  channelId: string

  @IsString()
  sessionId: string

  @IsString()
  type: string
}
