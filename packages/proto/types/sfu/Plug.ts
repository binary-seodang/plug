// Original file: protos/plug.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { Empty as _sfu_Empty, Empty__Output as _sfu_Empty__Output } from '../sfu/Empty';
import type { LeaveParams as _sfu_LeaveParams, LeaveParams__Output as _sfu_LeaveParams__Output } from '../sfu/LeaveParams';
import type { Signal as _sfu_Signal, Signal__Output as _sfu_Signal__Output } from '../sfu/Signal';

export interface PlugClient extends grpc.Client {
  Answer(argument: _sfu_Signal, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_sfu_Empty__Output>): grpc.ClientUnaryCall;
  Answer(argument: _sfu_Signal, metadata: grpc.Metadata, callback: grpc.requestCallback<_sfu_Empty__Output>): grpc.ClientUnaryCall;
  Answer(argument: _sfu_Signal, options: grpc.CallOptions, callback: grpc.requestCallback<_sfu_Empty__Output>): grpc.ClientUnaryCall;
  Answer(argument: _sfu_Signal, callback: grpc.requestCallback<_sfu_Empty__Output>): grpc.ClientUnaryCall;
  answer(argument: _sfu_Signal, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_sfu_Empty__Output>): grpc.ClientUnaryCall;
  answer(argument: _sfu_Signal, metadata: grpc.Metadata, callback: grpc.requestCallback<_sfu_Empty__Output>): grpc.ClientUnaryCall;
  answer(argument: _sfu_Signal, options: grpc.CallOptions, callback: grpc.requestCallback<_sfu_Empty__Output>): grpc.ClientUnaryCall;
  answer(argument: _sfu_Signal, callback: grpc.requestCallback<_sfu_Empty__Output>): grpc.ClientUnaryCall;
  
  ClientIcecandidate(argument: _sfu_Signal, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_sfu_Empty__Output>): grpc.ClientUnaryCall;
  ClientIcecandidate(argument: _sfu_Signal, metadata: grpc.Metadata, callback: grpc.requestCallback<_sfu_Empty__Output>): grpc.ClientUnaryCall;
  ClientIcecandidate(argument: _sfu_Signal, options: grpc.CallOptions, callback: grpc.requestCallback<_sfu_Empty__Output>): grpc.ClientUnaryCall;
  ClientIcecandidate(argument: _sfu_Signal, callback: grpc.requestCallback<_sfu_Empty__Output>): grpc.ClientUnaryCall;
  clientIcecandidate(argument: _sfu_Signal, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_sfu_Empty__Output>): grpc.ClientUnaryCall;
  clientIcecandidate(argument: _sfu_Signal, metadata: grpc.Metadata, callback: grpc.requestCallback<_sfu_Empty__Output>): grpc.ClientUnaryCall;
  clientIcecandidate(argument: _sfu_Signal, options: grpc.CallOptions, callback: grpc.requestCallback<_sfu_Empty__Output>): grpc.ClientUnaryCall;
  clientIcecandidate(argument: _sfu_Signal, callback: grpc.requestCallback<_sfu_Empty__Output>): grpc.ClientUnaryCall;
  
  Leave(argument: _sfu_LeaveParams, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_sfu_Empty__Output>): grpc.ClientUnaryCall;
  Leave(argument: _sfu_LeaveParams, metadata: grpc.Metadata, callback: grpc.requestCallback<_sfu_Empty__Output>): grpc.ClientUnaryCall;
  Leave(argument: _sfu_LeaveParams, options: grpc.CallOptions, callback: grpc.requestCallback<_sfu_Empty__Output>): grpc.ClientUnaryCall;
  Leave(argument: _sfu_LeaveParams, callback: grpc.requestCallback<_sfu_Empty__Output>): grpc.ClientUnaryCall;
  leave(argument: _sfu_LeaveParams, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_sfu_Empty__Output>): grpc.ClientUnaryCall;
  leave(argument: _sfu_LeaveParams, metadata: grpc.Metadata, callback: grpc.requestCallback<_sfu_Empty__Output>): grpc.ClientUnaryCall;
  leave(argument: _sfu_LeaveParams, options: grpc.CallOptions, callback: grpc.requestCallback<_sfu_Empty__Output>): grpc.ClientUnaryCall;
  leave(argument: _sfu_LeaveParams, callback: grpc.requestCallback<_sfu_Empty__Output>): grpc.ClientUnaryCall;
  
  ListenSignal(argument: _sfu_Empty, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_sfu_Signal__Output>;
  ListenSignal(argument: _sfu_Empty, options?: grpc.CallOptions): grpc.ClientReadableStream<_sfu_Signal__Output>;
  listenSignal(argument: _sfu_Empty, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_sfu_Signal__Output>;
  listenSignal(argument: _sfu_Empty, options?: grpc.CallOptions): grpc.ClientReadableStream<_sfu_Signal__Output>;
  
  call(argument: _sfu_Signal, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_sfu_Signal__Output>): grpc.ClientUnaryCall;
  call(argument: _sfu_Signal, metadata: grpc.Metadata, callback: grpc.requestCallback<_sfu_Signal__Output>): grpc.ClientUnaryCall;
  call(argument: _sfu_Signal, options: grpc.CallOptions, callback: grpc.requestCallback<_sfu_Signal__Output>): grpc.ClientUnaryCall;
  call(argument: _sfu_Signal, callback: grpc.requestCallback<_sfu_Signal__Output>): grpc.ClientUnaryCall;
  call(argument: _sfu_Signal, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_sfu_Signal__Output>): grpc.ClientUnaryCall;
  call(argument: _sfu_Signal, metadata: grpc.Metadata, callback: grpc.requestCallback<_sfu_Signal__Output>): grpc.ClientUnaryCall;
  call(argument: _sfu_Signal, options: grpc.CallOptions, callback: grpc.requestCallback<_sfu_Signal__Output>): grpc.ClientUnaryCall;
  call(argument: _sfu_Signal, callback: grpc.requestCallback<_sfu_Signal__Output>): grpc.ClientUnaryCall;
  
}

export interface PlugHandlers extends grpc.UntypedServiceImplementation {
  Answer: grpc.handleUnaryCall<_sfu_Signal__Output, _sfu_Empty>;
  
  ClientIcecandidate: grpc.handleUnaryCall<_sfu_Signal__Output, _sfu_Empty>;
  
  Leave: grpc.handleUnaryCall<_sfu_LeaveParams__Output, _sfu_Empty>;
  
  ListenSignal: grpc.handleServerStreamingCall<_sfu_Empty__Output, _sfu_Signal>;
  
  call: grpc.handleUnaryCall<_sfu_Signal__Output, _sfu_Signal>;
  
}

export interface PlugDefinition extends grpc.ServiceDefinition {
  Answer: MethodDefinition<_sfu_Signal, _sfu_Empty, _sfu_Signal__Output, _sfu_Empty__Output>
  ClientIcecandidate: MethodDefinition<_sfu_Signal, _sfu_Empty, _sfu_Signal__Output, _sfu_Empty__Output>
  Leave: MethodDefinition<_sfu_LeaveParams, _sfu_Empty, _sfu_LeaveParams__Output, _sfu_Empty__Output>
  ListenSignal: MethodDefinition<_sfu_Empty, _sfu_Signal, _sfu_Empty__Output, _sfu_Signal__Output>
  call: MethodDefinition<_sfu_Signal, _sfu_Signal, _sfu_Signal__Output, _sfu_Signal__Output>
}
