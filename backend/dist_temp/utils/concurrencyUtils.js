"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processInBatches = void 0;
const tslib_1 = require("tslib");
const processInBatches = (items_1, processFn_1, ...args_1) => tslib_1.__awaiter(void 0, [items_1, processFn_1, ...args_1], void 0, function* (items, processFn, concurrencyLimit = 3, retries = 3, initialDelay = 1000) {
    const results = [];
    const activePromises = [];
    let currentIndex = 0;
    const executeWithRetries = (item) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        let attempt = 0;
        let delay = initialDelay;
        while (attempt <= retries) {
            try {
                return yield processFn(item);
            }
            catch (error) {
                attempt++;
                if (attempt > retries) {
                    throw error;
                }
                console.warn(`Error processing item "${item}" (Attempt ${attempt}/${retries}). Retrying in ${delay}ms...`);
                yield new Promise((resolve) => setTimeout(resolve, delay));
                delay *= 2;
            }
        }
        throw new Error(`Failed to process item "${item}" after ${retries} retries.`);
    });
    const worker = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        while (currentIndex < items.length) {
            const index = currentIndex++;
            try {
                results[index] = yield executeWithRetries(items[index]);
            }
            catch (error) {
                results[index] = error;
            }
        }
    });
    for (let i = 0; i < concurrencyLimit; i++) {
        activePromises.push(worker());
    }
    yield Promise.all(activePromises);
    return results.filter((result) => !(result instanceof Error));
});
exports.processInBatches = processInBatches;
