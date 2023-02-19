import * as protoloader from "@grpc/proto-loader"
import * as grpc from "@grpc/grpc-js"
import * as path from "path"
import { ProtoGrpcType } from "./types/plug"
// const protoPath = path.join(__dirname, "protos/plug.proto")
const packageDef = protoloader.loadSync(
  path.join(__dirname, "protos/plug.proto")
)

const proto: ProtoGrpcType = grpc.loadPackageDefinition(packageDef) as any
export * from "./types/plug/Plug"
export * from "./types/plug/Signal"
export * from "./types/plug/LeaveParams"

export default proto
