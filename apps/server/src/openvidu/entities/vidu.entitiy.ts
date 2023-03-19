import {
  Directive,
  Field,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql'

import { IsArray, IsBoolean, IsEnum, IsNumber, IsString } from 'class-validator'
import { TimeStamp } from 'common/scalar/timestamp.scalar'
import {
  MediaMode,
  RecordingMode,
  Recording,
  RecordingLayout,
  VideoCodec,
  OpenViduRole,
  ConnectionProperties,
} from 'openvidu-node-client'
registerEnumType(MediaMode, { name: 'MediaMode' })
registerEnumType(RecordingMode, { name: 'RecordingMode' })
registerEnumType(Recording.OutputMode, { name: 'RecordingOutputMode' })
registerEnumType(RecordingLayout, { name: 'RecordingLayout' })
registerEnumType(VideoCodec, { name: 'VideoCodec' })
registerEnumType(OpenViduRole, { name: 'OpenViduRole' })

@ObjectType()
class MediaNode {
  @Field(() => String)
  @IsString()
  id: string
}

export class RecordingProperties {
  @Field(() => String, { nullable: true })
  @IsString()
  /**
   * Name of the Recording. The video file will be named after this property.
   * You can access this same value in your clients on recording events
   * (`recordingStarted`, `recordingStopped`)
   */
  name?: string

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  /**
   * Whether or not to record audio. Cannot be set to false at the same time as {@link RecordingProperties.hasVideo}
   *
   * Default to true
   */
  hasAudio?: boolean

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  /**
   * Whether or not to record video. Cannot be set to false at the same time as {@link RecordingProperties.hasAudio}
   *
   * Default to true
   */
  hasVideo?: boolean

  @Field(() => Recording.OutputMode, { nullable: true })
  @IsEnum(Recording.OutputMode)
  /**
   * The mode of recording: COMPOSED for a single archive in a grid layout or INDIVIDUAL for one archive for each stream
   *
   * Default to {@link Recording.OutputMode.COMPOSED}
   */
  outputMode?: Recording.OutputMode

  @Field(() => RecordingLayout, { nullable: true })
  @IsEnum(RecordingLayout)
  /**
   * The layout to be used in the recording.<br>
   * Will only have effect if {@link RecordingProperties.outputMode} is set to {@link Recording.OutputMode.COMPOSED} or {@link Recording.OutputMode.COMPOSED_QUICK_START}
   *
   * Default to {@link RecordingLayout.BEST_FIT}
   */
  recordingLayout?: RecordingLayout

  @Field(() => String, { nullable: true })
  @IsString()
  /**
   * Recording video file resolution. Must be a string with format "WIDTHxHEIGHT",
   * being both WIDTH and HEIGHT the number of pixels between 100 and 1999.<br>
   * Will only have effect if {@link RecordingProperties.outputMode} is set to {@link Recording.OutputMode.COMPOSED} or {@link Recording.OutputMode.COMPOSED_QUICK_START}
   * and {@link RecordingProperties.hasVideo} is set to true. For {@link Recording.OutputMode.INDIVIDUAL} all individual video files will have the native resolution of the published stream.
   *
   * Default to "1280x720"
   */
  resolution?: string

  @Field(() => Int)
  @IsNumber()
  /**
   * Recording video file frame rate.<br>
   * Will only have effect if {@link RecordingProperties.outputMode} is set to {@link Recording.OutputMode.COMPOSED} or {@link Recording.OutputMode.COMPOSED_QUICK_START}
   * and {@link RecordingProperties.hasVideo} is set to true. For {@link Recording.OutputMode.INDIVIDUAL} all individual video files will have the native frame rate of the published stream.
   *
   * Default to 25
   */
  frameRate?: number

  @Field(() => Int)
  @IsNumber()
  /**
   * The amount of shared memory reserved for the recording process in bytes.
   * Will only have effect if {@link RecordingProperties.outputMode} is set to {@link Recording.OutputMode.COMPOSED} or {@link Recording.OutputMode.COMPOSED_QUICK_START}
   * and {@link RecordingProperties.hasVideo} is set to true. Property ignored for INDIVIDUAL recordings and audio-only recordings.
   * Minimum 134217728 (128MB).
   *
   * Default to 536870912 (512 MB)
   */
  shmSize?: number

  @Field(() => String, { nullable: true })
  @IsString()
  /**
   * The relative path to the specific custom layout you want to use.<br>
   * Will only have effect if {@link RecordingProperties.outputMode} is set to {@link Recording.OutputMode.COMPOSED} or {@link Recording.OutputMode.COMPOSED_QUICK_START}
   * and {@link RecordingProperties.recordingLayout} is set to {@link RecordingLayout.CUSTOM}<br>
   * See [Custom recording layouts](/en/stable/advanced-features/recording#custom-recording-layouts) to learn more.
   */
  customLayout?: string

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  /**
   * Whether to ignore failed streams or not when starting the recording. This property only applies if {@link RecordingProperties.outputMode} is set to {@link Recording.OutputMode.INDIVIDUAL}.
   * For this type of recordings, when calling {@link OpenVidu.startRecording} by default all the streams available at the moment the recording process starts must be healthy
   * and properly sending media. If some stream that should be sending media is broken, then the recording process fails after a 10s timeout. In this way your application is notified
   * that some stream is not being recorded, so it can retry the process again.
   *
   * But you can disable this rollback behavior and simply ignore any failed stream, which will be susceptible to be recorded in the future if media starts flowing as expected at any point.
   * The downside of this behavior is that you will have no guarantee that all streams present at the beginning of a recording are actually being recorded.
   *
   * Default to false
   */
  ignoreFailedStreams?: boolean

  @Field(() => MediaNode, { nullable: true })
  /**
   * **This feature is part of OpenVidu
   * <a href="https://docs.openvidu.io/en/2.23.0/openvidu-pro/" style="display: inline-block; background-color: rgb(0, 136, 170); color: white; font-weight: bold; padding: 0px 5px; margin: 0 2px 0 2px; border-radius: 3px; font-size: 13px; line-height:21px; text-decoration: none; font-family: Montserrat, sans-serif">PRO</a>
   * and
   * <a href="https://docs.openvidu.io/en/2.23.0/openvidu-enterprise/" style="display: inline-block; background-color: rgb(156, 39, 176); color: white; font-weight: bold; padding: 0px 5px; margin: 0 2px 0 2px; border-radius: 3px; font-size: 13px; line-height:21px; text-decoration: none; font-family: Montserrat, sans-serif">ENTERPRISE</a>
   * editions**
   *
   * The Media Node where to host the recording. The default option if this property is not defined is the same
   * Media Node hosting the Session to record. This object defines the following properties as Media Node selector:
   * - `id`: Media Node unique identifier
   */
  mediaNode?: {
    id: string
  }
}
export class Publisher {
  @Field(() => String)
  @IsString()
  streamId: string

  @Field(() => Int)
  @IsNumber()
  createdAt: number

  @Field(() => Boolean)
  @IsBoolean()
  hasAudio: boolean

  @Field(() => Boolean)
  @IsBoolean()
  hasVideo: boolean

  @Field(() => Boolean)
  @IsBoolean()
  audioActive: boolean
  @Field(() => Boolean)
  @IsBoolean()
  videoActive: boolean

  @Field(() => Int)
  @IsNumber()
  frameRate: number

  @Field(() => String)
  @IsString()
  typeOfVideo: string

  @Field(() => String)
  @IsString()
  videoDimensions: string
}

export class Connection {
  /**
   * Identifier of the Connection. You can call methods {@link Session.forceDisconnect}
   * or {@link Session.updateConnection} passing this property as parameter
   */
  @Field(() => String)
  @IsString()
  connectionId: string
  /**
   * Returns the status of the Connection. Can be:
   * - `pending`: if the Connection is waiting for any user to use
   * its internal token to connect to the session, calling method
   * [Session.connect](https://docs.openvidu.io/en/stable/api/openvidu-browser/classes/Session.html#connect)
   * in OpenVidu Browser.
   * - `active`: if the internal token of the Connection has already
   * been used by some user to connect to the session, and it cannot be used
   * again.
   */
  @Field(() => String)
  @IsString()
  status: string
  /**
   * Timestamp when the Connection was created, in UTC milliseconds (ms since Jan 1, 1970, 00:00:00 UTC)
   */
  @Field(() => Int)
  @IsNumber()
  createdAt: number
  /**
   * Timestamp when the Connection was taken by a user (passing from status "pending" to "active")
   * in UTC milliseconds (ms since Jan 1, 1970, 00:00:00 UTC)
   */
  @Field(() => Int)
  @IsNumber()
  activeAt: number
  /**
   * <a href="https://docs.openvidu.io/en/stable/openvidu-pro/" style="display: inline-block; background-color: rgb(0, 136, 170); color: white; font-weight: bold; padding: 0px 5px; margin-right: 5px; border-radius: 3px; font-size: 13px; line-height:21px; font-family: Montserrat, sans-serif">PRO</a>
   * Geo location of the Connection, with the following format: `"CITY, COUNTRY"` (`"unknown"` if it wasn't possible to locate it)
   */
  @Field(() => String)
  @IsString()
  location: string
  /**
   * IP of the Connection, as seen by OpenVidu Server
   */
  @Field(() => String)
  @IsString()
  ip: string
  /**
   * A complete description of the platform used by the participant to connect to the session
   */
  @Field(() => String)
  @IsString()
  platform: string
  /**
   * Data associated to the Connection on the client-side. This value is set with second parameter of method
   * [Session.connect](/en/stable/api/openvidu-browser/classes/Session.html#connect) in OpenVidu Browser
   */
  @Field(() => String)
  @IsString()
  clientData: string
  /**
   * The {@link ConnectionProperties} assigned to the Connection
   */

  connectionProperties: ConnectionProperties
  /**
   * Token associated to the Connection. This is the value that must be sent to the client-side to be consumed in OpenVidu Browser
   * method [Session.connect](https://docs.openvidu.io/en/stable/api/openvidu-browser/classes/Session.html#connect).
   */
  @Field(() => String)
  @IsString()
  token: string
  /**
   * Array of Publisher objects this particular Connection is publishing to the Session (each Publisher object has one Stream, uniquely
   * identified by its `streamId`). You can call {@link Session.forceUnpublish} passing any of this values as parameter
   */
  publishers: Publisher[]
  /**
   * Array of streams (their `streamId` properties) this particular Connection is subscribed to. Each one always corresponds to one
   * Publisher of some other Connection: each string of this array must be equal to one {@link Publisher.streamId} of other Connection
   */
  @Field(() => [String])
  @IsArray()
  subscribers: string[]
  /**
   * @hidden deprecated. Inside ConnectionProperties
   */
  @Field(() => OpenViduRole, { nullable: true })
  @IsEnum(OpenViduRole)
  role?: OpenViduRole
  /**
   * @hidden deprecated. Inside ConnectionProperties
   */
  @Field(() => String)
  @IsString()
  serverData?: string
}

export interface SessionProperties {
  mediaMode?: MediaMode
  recordingMode?: RecordingMode
  defaultRecordingProperties?: RecordingProperties
  customSessionId?: string
  mediaNode?: {
    id: string
  }
  forcedVideoCodec?: VideoCodec
  allowTranscoding?: boolean
}

@ObjectType()
@Directive('@key(fields: "sessionId")')
export class ViduSession {
  @Field(() => String)
  @IsString()
  sessionId: string

  @Field(() => TimeStamp)
  @IsNumber()
  createdAt: number
}

@ObjectType()
export class ViduToken {
  @Field(() => String)
  token?: string
}
