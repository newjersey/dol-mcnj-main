"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const contactController_1 = require("../controllers/contactController");
const contactValidation_1 = require("../middleware/contactValidation");
const router = express_1.default.Router();
router.post("/", contactValidation_1.validateContactForm, contactController_1.submitContactForm);
exports.default = router;
