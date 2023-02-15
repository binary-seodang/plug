"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
exports.__esModule = true;
var protoloader = require("@grpc/proto-loader");
var grpc = require("@grpc/grpc-js");
var path = require("path");
// const protoPath = path.join(__dirname, "protos/plug.proto")
var packageDef = protoloader.loadSync(path.join(__dirname, "protos/plug.proto"));
var proto = grpc.loadPackageDefinition(packageDef);
__exportStar(require("./types/plug/Plug"), exports);
__exportStar(require("./types/plug/Signal"), exports);
exports["default"] = proto;
