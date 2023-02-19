// Original file: protos/plug.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { Empty as _plug_Empty, Empty__Output as _plug_Empty__Output } from '../plug/Empty';
import type { LeaveParams as _plug_LeaveParams, LeaveParams__Output as _plug_LeaveParams__Output } from '../plug/LeaveParams';
import type { Signal as _plug_Signal, Signal__Output as _plug_Signal__Output } from '../plug/Signal';

export interface PlugClient extends grpc.Client {
  Answer(argument: _plug_Signal, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_plug_Empty__Output>): grpc.ClientUnaryCall;
  Answer(argument: _plug_Signal, metadata: grpc.Metadata, callback: grpc.requestCallback<_plug_Empty__Output>): grpc.ClientUnaryCall;
  Answer(argument: _plug_Signal, options: grpc.CallOptions, callback: grpc.requestCallback<_plug_Empty__Output>): grpc.ClientUnaryCall;
  Answer(argument: _plug_Signal, callback: grpc.requestCallback<_plug_Empty__Output>): grpc.ClientUnaryCall;
  answer(argument: _plug_Signal, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_plug_Empty__Output>): grpc.ClientUnaryCall;
  answer(argument: _plug_Signal, metadata: grpc.Metadata, callback: grpc.requestCallback<_plug_Empty__Output>): grpc.ClientUnaryCall;
  answer(argument: _plug_Signal, options: grpc.CallOptions, callback: grpc.requestCallback<_plug_Empty__Output>): grpc.ClientUnaryCall;
  answer(argument: _plug_Signal, callback: grpc.requestCallback<_plug_Empty__Output>): grpc.ClientUnaryCall;
  
  ClientIcecandidate(argument: _plug_Signal, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_plug_Empty__Output>): grpc.ClientUnaryCall;
  ClientIcecandidate(argument: _plug_Signal, metadata: grpc.Metadata, callback: grpc.requestCallback<_plug_Empty__Output>): grpc.ClientUnaryCall;
  ClientIcecandidate(argument: _plug_Signal, options: grpc.CallOptions, callback: grpc.requestCallback<_plug_Empty__Output>): grpc.ClientUnaryCall;
  ClientIcecandidate(argument: _plug_Signal, callback: grpc.requestCallback<_plug_Empty__Output>): grpc.ClientUnaryCall;
  clientIcecandidate(argument: _plug_Signal, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_plug_Empty__Output>): grpc.ClientUnaryCall;
  clientIcecandidate(argument: _plug_Signal, metadata: grpc.Metadata, callback: grpc.requestCallback<_plug_Empty__Output>): grpc.ClientUnaryCall;
  clientIcecandidate(argument: _plug_Signal, options: grpc.CallOptions, callback: grpc.requestCallback<_plug_Empty__Output>): grpc.ClientUnaryCall;
  clientIcecandidate(argument: _plug_Signal, callback: grpc.requestCallback<_plug_Empty__Output>): grpc.ClientUnaryCall;
  
  Leave(argument: _plug_LeaveParams, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_plug_LeaveParams__Output>): grpc.ClientUnaryCall;
  Leave(argument: _plug_LeaveParams, metadata: grpc.Metadata, callback: grpc.requestCallback<_plug_LeaveParams__Output>): grpc.ClientUnaryCall;
  Leave(argument: _plug_LeaveParams, options: grpc.CallOptions, callback: grpc.requestCallback<_plug_LeaveParams__Output>): grpc.ClientUnaryCall;
  Leave(argument: _plug_LeaveParams, callback: grpc.requestCallback<_plug_LeaveParams__Output>): grpc.ClientUnaryCall;
  leave(argument: _plug_LeaveParams, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_plug_LeaveParams__Output>): grpc.ClientUnaryCall;
  leave(argument: _plug_LeaveParams, metadata: grpc.Metadata, callback: grpc.requestCallback<_plug_LeaveParams__Output>): grpc.ClientUnaryCall;
  leave(argument: _plug_LeaveParams, options: grpc.CallOptions, callback: grpc.requestCallback<_plug_LeaveParams__Output>): grpc.ClientUnaryCall;
  leave(argument: _plug_LeaveParams, callback: grpc.requestCallback<_plug_LeaveParams__Output>): grpc.ClientUnaryCall;
  
  ListenSignal(argument: _plug_Empty, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_plug_Signal__Output>;
  ListenSignal(argument: _plug_Empty, options?: grpc.CallOptions): grpc.ClientReadableStream<_plug_Signal__Output>;
  listenSignal(argument: _plug_Empty, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_plug_Signal__Output>;
  listenSignal(argument: _plug_Empty, options?: grpc.CallOptions): grpc.ClientReadableStream<_plug_Signal__Output>;
  
  call(argument: _plug_Signal, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_plug_Signal__Output>): grpc.ClientUnaryCall;
  call(argument: _plug_Signal, metadata: grpc.Metadata, callback: grpc.requestCallback<_plug_Signal__Output>): grpc.ClientUnaryCall;
  call(argument: _plug_Signal, options: grpc.CallOptions, callback: grpc.requestCallback<_plug_Signal__Output>): grpc.ClientUnaryCall;
  call(argument: _plug_Signal, callback: grpc.requestCallback<_plug_Signal__Output>): grpc.ClientUnaryCall;
  call(argument: _plug_Signal, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_plug_Signal__Output>): grpc.ClientUnaryCall;
  call(argument: _plug_Signal, metadata: grpc.Metadata, callback: grpc.requestCallback<_plug_Signal__Output>): grpc.ClientUnaryCall;
  call(argument: _plug_Signal, options: grpc.CallOptions, callback: grpc.requestCallback<_plug_Signal__Output>): grpc.ClientUnaryCall;
  call(argument: _plug_Signal, callback: grpc.requestCallback<_plug_Signal__Output>): grpc.ClientUnaryCall;
  
}

export interface PlugHandlers extends grpc.UntypedServiceImplementation {
  Answer: grpc.handleUnaryCall<_plug_Signal__Output, _plug_Empty>;
  
  ClientIcecandidate: grpc.handleUnaryCall<_plug_Signal__Output, _plug_Empty>;
  
  Leave: grpc.handleUnaryCall<_plug_LeaveParams__Output, _plug_LeaveParams>;
  
  ListenSignal: grpc.handleServerStreamingCall<_plug_Empty__Output, _plug_Signal>;
  
  call: grpc.handleUnaryCall<_plug_Signal__Output, _plug_Signal>;
  
}

export interface PlugDefinition extends grpc.ServiceDefinition {
  Answer: MethodDefinition<_plug_Signal, _plug_Empty, _plug_Signal__Output, _plug_Empty__Output>
  ClientIcecandidate: MethodDefinition<_plug_Signal, _plug_Empty, _plug_Signal__Output, _plug_Empty__Output>
  Leave: MethodDefinition<_plug_LeaveParams, _plug_LeaveParams, _plug_LeaveParams__Output, _plug_LeaveParams__Output>
  ListenSignal: MethodDefinition<_plug_Empty, _plug_Signal, _plug_Empty__Output, _plug_Signal__Output>
  call: MethodDefinition<_plug_Signal, _plug_Signal, _plug_Signal__Output, _plug_Signal__Output>
}
