"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setResponseNotFound = void 0;
const setResponseNotFound = (res) => {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({ title: 'NO FOUND', message: 'Route not found' }));
    res.end();
};
exports.setResponseNotFound = setResponseNotFound;
exports.default = exports.setResponseNotFound;
