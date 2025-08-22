"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const signUpController_1 = require("../controllers/signUpController");
const signUpValidations_1 = require("../middleware/signUpValidations");
const router = express_1.default.Router();
router.post("/", signUpValidations_1.validateSignupForm, signUpController_1.submitSignupForm);
exports.default = router;
