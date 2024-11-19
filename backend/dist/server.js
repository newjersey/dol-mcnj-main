"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const app_1 = tslib_1.__importDefault(require("./app"));
const port = Number(process.env.PORT || 8080);
app_1.default.listen(port, () => {
    console.log("Express server started on port: " + port);
});
