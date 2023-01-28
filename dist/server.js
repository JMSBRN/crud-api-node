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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const process_1 = require("process");
const dotenv_1 = __importDefault(require("dotenv"));
const utils_1 = require("./utils");
const user = __importStar(require("./users"));
const { getUsers, createUser, updateUser, deleteUser } = user;
dotenv_1.default.config();
const { PORT } = process_1.env;
const port = PORT || 5000;
const server = () => {
    (0, http_1.createServer)((req, res) => {
        switch (req.method) {
            case 'GET':
                getUsers(req, res);
                break;
            case 'POST':
                createUser(req, res);
                break;
            case 'PUT':
                updateUser();
                break;
            case 'DELETE':
                deleteUser();
                break;
            default:
                (0, utils_1.setResponseNotFound)(res);
                break;
        }
    }).listen(port, () => {
        process_1.stdout.write(`server running on port Localhost :${port}`);
    });
};
exports.default = server;
