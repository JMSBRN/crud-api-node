"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUsers = void 0;
const uuid_1 = require("uuid");
const utils_1 = require("./utils");
const users_json_1 = __importDefault(require("./data/users.json"));
const users = users_json_1.default;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const baseUrl = (_a = req.url) === null || _a === void 0 ? void 0 : _a.substring(0, req.url.lastIndexOf('/') + 1);
    const id = (_b = req.url) === null || _b === void 0 ? void 0 : _b.split('/')[3];
    const regexp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
    if (req.url === '/api/users') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(users));
        res.end();
    }
    else if (baseUrl === '/api/users/' && regexp.test(id || '')) {
        const newArr = [];
        res.writeHead(200, { 'Content-Type': 'application/json' });
        users.forEach((el) => {
            if (el.id === id) {
                newArr.push(el);
            }
        });
        if (newArr.length) {
            res.write(JSON.stringify(newArr));
        }
        else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify({ title: 'ERROR', message: 'User not Found' }));
            res.end();
        }
        res.end();
    }
    else {
        if (!regexp.test(id || '')) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify({ title: 'ERROR', message: 'UUID not valid' }));
            res.end();
            return;
        }
        (0, utils_1.setResponseNotFound)(res);
    }
});
exports.getUsers = getUsers;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.url === '/api/users') {
        let body = '';
        req
            .on('data', (data) => {
            body += data.toString();
        })
            .on('end', () => {
            try {
                const user = JSON.parse(body);
                user.id = (0, uuid_1.v4)();
                users.push(user);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end();
            }
            catch (error) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.write('Bad Post Data.  Is your data a proper JSON?\n');
                res.end();
            }
        });
    }
    else {
        (0, utils_1.setResponseNotFound)(res);
    }
});
exports.createUser = createUser;
const updateUser = () => __awaiter(void 0, void 0, void 0, function* () { });
exports.updateUser = updateUser;
const deleteUser = () => __awaiter(void 0, void 0, void 0, function* () { });
exports.deleteUser = deleteUser;
