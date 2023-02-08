/* eslint-disable */
import * as _m0 from "protobufjs/minimal";

export const protobufPackage = "sfu";

export interface Signal {
  /** offer, answer, icecandidate */
  type: string;
  sessionId: string;
  /** for offer / answer */
  sdp: string;
  /** for icecandidate */
  candidate: string;
  channelId: string;
  fromSessionId: string;
}

export interface LeaveParams {
  channelId: string;
  sessionId: string;
}

export interface Empty {
}

function createBaseSignal(): Signal {
  return { type: "", sessionId: "", sdp: "", candidate: "", channelId: "", fromSessionId: "" };
}

export const Signal = {
  encode(message: Signal, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.type !== "") {
      writer.uint32(10).string(message.type);
    }
    if (message.sessionId !== "") {
      writer.uint32(18).string(message.sessionId);
    }
    if (message.sdp !== "") {
      writer.uint32(26).string(message.sdp);
    }
    if (message.candidate !== "") {
      writer.uint32(34).string(message.candidate);
    }
    if (message.channelId !== "") {
      writer.uint32(42).string(message.channelId);
    }
    if (message.fromSessionId !== "") {
      writer.uint32(50).string(message.fromSessionId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Signal {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSignal();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.type = reader.string();
          break;
        case 2:
          message.sessionId = reader.string();
          break;
        case 3:
          message.sdp = reader.string();
          break;
        case 4:
          message.candidate = reader.string();
          break;
        case 5:
          message.channelId = reader.string();
          break;
        case 6:
          message.fromSessionId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Signal {
    return {
      type: isSet(object.type) ? String(object.type) : "",
      sessionId: isSet(object.sessionId) ? String(object.sessionId) : "",
      sdp: isSet(object.sdp) ? String(object.sdp) : "",
      candidate: isSet(object.candidate) ? String(object.candidate) : "",
      channelId: isSet(object.channelId) ? String(object.channelId) : "",
      fromSessionId: isSet(object.fromSessionId) ? String(object.fromSessionId) : "",
    };
  },

  toJSON(message: Signal): unknown {
    const obj: any = {};
    message.type !== undefined && (obj.type = message.type);
    message.sessionId !== undefined && (obj.sessionId = message.sessionId);
    message.sdp !== undefined && (obj.sdp = message.sdp);
    message.candidate !== undefined && (obj.candidate = message.candidate);
    message.channelId !== undefined && (obj.channelId = message.channelId);
    message.fromSessionId !== undefined && (obj.fromSessionId = message.fromSessionId);
    return obj;
  },

  create<I extends Exact<DeepPartial<Signal>, I>>(base?: I): Signal {
    return Signal.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Signal>, I>>(object: I): Signal {
    const message = createBaseSignal();
    message.type = object.type ?? "";
    message.sessionId = object.sessionId ?? "";
    message.sdp = object.sdp ?? "";
    message.candidate = object.candidate ?? "";
    message.channelId = object.channelId ?? "";
    message.fromSessionId = object.fromSessionId ?? "";
    return message;
  },
};

function createBaseLeaveParams(): LeaveParams {
  return { channelId: "", sessionId: "" };
}

export const LeaveParams = {
  encode(message: LeaveParams, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.channelId !== "") {
      writer.uint32(10).string(message.channelId);
    }
    if (message.sessionId !== "") {
      writer.uint32(18).string(message.sessionId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LeaveParams {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLeaveParams();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.channelId = reader.string();
          break;
        case 2:
          message.sessionId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): LeaveParams {
    return {
      channelId: isSet(object.channelId) ? String(object.channelId) : "",
      sessionId: isSet(object.sessionId) ? String(object.sessionId) : "",
    };
  },

  toJSON(message: LeaveParams): unknown {
    const obj: any = {};
    message.channelId !== undefined && (obj.channelId = message.channelId);
    message.sessionId !== undefined && (obj.sessionId = message.sessionId);
    return obj;
  },

  create<I extends Exact<DeepPartial<LeaveParams>, I>>(base?: I): LeaveParams {
    return LeaveParams.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<LeaveParams>, I>>(object: I): LeaveParams {
    const message = createBaseLeaveParams();
    message.channelId = object.channelId ?? "";
    message.sessionId = object.sessionId ?? "";
    return message;
  },
};

function createBaseEmpty(): Empty {
  return {};
}

export const Empty = {
  encode(_: Empty, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Empty {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEmpty();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): Empty {
    return {};
  },

  toJSON(_: Empty): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<Empty>, I>>(base?: I): Empty {
    return Empty.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Empty>, I>>(_: I): Empty {
    const message = createBaseEmpty();
    return message;
  },
};

export interface SFU {
  call(request: Signal): Promise<Signal>;
  /**
   * rpc ClientIcecandidate(Signal) returns (Empty) {}
   * rpc ListenSignal(Empty) returns (stream Signal) {}
   * rpc Answer(Signal) returns (Empty) {}
   */
  Leave(request: LeaveParams): Promise<Empty>;
}

export class SFUClientImpl implements SFU {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || "sfu.SFU";
    this.rpc = rpc;
    this.call = this.call.bind(this);
    this.Leave = this.Leave.bind(this);
  }
  call(request: Signal): Promise<Signal> {
    const data = Signal.encode(request).finish();
    const promise = this.rpc.request(this.service, "call", data);
    return promise.then((data) => Signal.decode(new _m0.Reader(data)));
  }

  Leave(request: LeaveParams): Promise<Empty> {
    const data = LeaveParams.encode(request).finish();
    const promise = this.rpc.request(this.service, "Leave", data);
    return promise.then((data) => Empty.decode(new _m0.Reader(data)));
  }
}

interface Rpc {
  request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
