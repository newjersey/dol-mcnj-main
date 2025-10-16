"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encryptPII = encryptPII;
exports.decryptPII = decryptPII;
exports.encryptSearchablePII = encryptSearchablePII;
exports.generateSearchHash = generateSearchHash;
exports.decryptLegacyPII = decryptLegacyPII;
exports.validateKMSKey = validateKMSKey;
const tslib_1 = require("tslib");
const crypto = tslib_1.__importStar(require("crypto"));
const client_kms_1 = require("@aws-sdk/client-kms");
const piiSafety_1 = require("./piiSafety");
const logger = (0, piiSafety_1.createSafeLogger)(console.log);
const kmsClient = new client_kms_1.KMSClient({
    region: process.env.AWS_REGION || "us-east-1",
    logger: undefined,
});
const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
function encryptPII(plaintext, kmsKeyId, operationId) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const opId = operationId || crypto.randomUUID();
        try {
            if (!plaintext || typeof plaintext !== 'string') {
                throw new Error("Invalid plaintext data");
            }
            if (!kmsKeyId) {
                throw new Error("KMS Key ID is required");
            }
            logger.info("Generating data key for PII encryption", { operationId: opId });
            const dataKeyCommand = new client_kms_1.GenerateDataKeyCommand({
                KeyId: kmsKeyId,
                KeySpec: "AES_256"
            });
            const { Plaintext: dataKey, CiphertextBlob } = yield kmsClient.send(dataKeyCommand);
            if (!dataKey || !CiphertextBlob) {
                throw new Error("Failed to generate data key");
            }
            const iv = crypto.randomBytes(IV_LENGTH);
            const cipher = crypto.createCipheriv(ALGORITHM, dataKey, iv);
            let encrypted = cipher.update(plaintext, 'utf8', 'base64');
            encrypted += cipher.final('base64');
            const tag = cipher.getAuthTag();
            dataKey.fill(0);
            const result = {
                encryptedData: encrypted,
                encryptedKey: Buffer.from(CiphertextBlob).toString('base64'),
                iv: iv.toString('base64'),
                tag: tag.toString('base64'),
                keyId: kmsKeyId,
                algorithm: ALGORITHM,
                version: 1
            };
            (0, piiSafety_1.auditPIIOperation)('CREATE', 'EMAIL', true, undefined, {
                operationId: opId,
                keyId: kmsKeyId,
                algorithm: ALGORITHM
            });
            logger.info("PII encryption successful", {
                operationId: opId,
                dataLength: plaintext.length,
                algorithm: ALGORITHM
            });
            return result;
        }
        catch (error) {
            (0, piiSafety_1.auditPIIOperation)('CREATE', 'EMAIL', false, undefined, {
                operationId: opId,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            logger.error("PII encryption failed", error, { operationId: opId });
            if (error instanceof Error &&
                (error.message.includes("Invalid plaintext") ||
                    error.message.includes("KMS Key ID is required"))) {
                throw error;
            }
            throw new Error("Encryption operation failed");
        }
    });
}
function decryptPII(encryptedData, operationId) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const opId = operationId || crypto.randomUUID();
        try {
            if (!encryptedData || typeof encryptedData !== 'object') {
                throw new Error("Invalid encrypted data structure");
            }
            const { encryptedData: data, encryptedKey, iv, tag, keyId, algorithm, version } = encryptedData;
            if (!data || !encryptedKey || !iv || !tag || !keyId || !algorithm) {
                throw new Error("Missing required encryption components");
            }
            if (algorithm !== ALGORITHM) {
                throw new Error(`Unsupported encryption algorithm: ${algorithm}`);
            }
            if (version !== 1) {
                throw new Error(`Unsupported encryption version: ${version}`);
            }
            logger.info("Decrypting data key for PII decryption", { operationId: opId });
            const decryptCommand = new client_kms_1.DecryptCommand({
                CiphertextBlob: Buffer.from(encryptedKey, 'base64'),
                KeyId: keyId
            });
            const { Plaintext: dataKey } = yield kmsClient.send(decryptCommand);
            if (!dataKey) {
                throw new Error("Failed to decrypt data key");
            }
            try {
                const decipher = crypto.createDecipheriv(algorithm, dataKey, Buffer.from(iv, 'base64'));
                decipher.setAuthTag(Buffer.from(tag, 'base64'));
                let decrypted = decipher.update(data, 'base64', 'utf8');
                decrypted += decipher.final('utf8');
                dataKey.fill(0);
                (0, piiSafety_1.auditPIIOperation)('READ', 'EMAIL', true, undefined, {
                    operationId: opId,
                    keyId: keyId,
                    algorithm: algorithm,
                    decryptionMethod: 'standard-no-aad'
                });
                logger.info("PII decryption successful (no AAD)", {
                    operationId: opId,
                    algorithm: algorithm
                });
                return decrypted;
            }
            catch (standardError) {
                logger.info("Standard decryption (no AAD) failed, trying legacy decryption with AAD", {
                    operationId: opId,
                    error: standardError instanceof Error ? standardError.message : String(standardError)
                });
                try {
                    const legacyDecipher = crypto.createDecipheriv(algorithm, dataKey, Buffer.from(iv, 'base64'));
                    legacyDecipher.setAAD(Buffer.from(opId));
                    legacyDecipher.setAuthTag(Buffer.from(tag, 'base64'));
                    let legacyDecrypted = legacyDecipher.update(data, 'base64', 'utf8');
                    legacyDecrypted += legacyDecipher.final('utf8');
                    dataKey.fill(0);
                    (0, piiSafety_1.auditPIIOperation)('READ', 'EMAIL', true, undefined, {
                        operationId: opId,
                        keyId: keyId,
                        algorithm: algorithm,
                        decryptionMethod: 'legacy-with-aad'
                    });
                    logger.info("Legacy PII decryption successful (with AAD)", {
                        operationId: opId,
                        algorithm: algorithm
                    });
                    return legacyDecrypted;
                }
                catch (legacyWithAADError) {
                    logger.info("Legacy decryption with AAD failed, trying without AAD", {
                        operationId: opId,
                        error: legacyWithAADError instanceof Error ? legacyWithAADError.message : String(legacyWithAADError)
                    });
                    try {
                        const legacyNoAADDecipher = crypto.createDecipheriv(algorithm, dataKey, Buffer.from(iv, 'base64'));
                        legacyNoAADDecipher.setAuthTag(Buffer.from(tag, 'base64'));
                        let legacyDecrypted = legacyNoAADDecipher.update(data, 'base64', 'utf8');
                        legacyDecrypted += legacyNoAADDecipher.final('utf8');
                        dataKey.fill(0);
                        (0, piiSafety_1.auditPIIOperation)('READ', 'EMAIL', true, undefined, {
                            operationId: opId,
                            keyId: keyId,
                            algorithm: algorithm,
                            decryptionMethod: 'legacy-no-aad'
                        });
                        logger.info("Legacy PII decryption successful (no AAD)", {
                            operationId: opId,
                            algorithm: algorithm
                        });
                        return legacyDecrypted;
                    }
                    catch (legacyNoAADError) {
                        dataKey.fill(0);
                        logger.error("All decryption attempts failed", {
                            operationId: opId,
                            standardError: standardError instanceof Error ? standardError.message : String(standardError),
                            legacyWithAADError: legacyWithAADError instanceof Error ? legacyWithAADError.message : String(legacyWithAADError),
                            legacyNoAADError: legacyNoAADError instanceof Error ? legacyNoAADError.message : String(legacyNoAADError)
                        });
                        throw standardError;
                    }
                }
            }
        }
        catch (error) {
            (0, piiSafety_1.auditPIIOperation)('READ', 'EMAIL', false, undefined, {
                operationId: opId,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            logger.error("PII decryption failed", error, { operationId: opId });
            if (error instanceof Error &&
                (error.message.includes("Invalid encrypted data") ||
                    error.message.includes("Missing required encryption") ||
                    error.message.includes("Unsupported encryption"))) {
                throw error;
            }
            throw new Error("Decryption operation failed");
        }
    });
}
function encryptSearchablePII(plaintext, kmsKeyId, operationId) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const opId = operationId || crypto.randomUUID();
        try {
            const searchKey = crypto.pbkdf2Sync(process.env.SEARCH_SALT || 'default-search-salt', plaintext.toLowerCase().trim(), 100000, 32, 'sha256');
            const searchHash = crypto.createHmac('sha256', searchKey)
                .update(plaintext.toLowerCase().trim())
                .digest('base64');
            const encrypted = yield encryptPII(plaintext, kmsKeyId, opId);
            searchKey.fill(0);
            const result = {
                encrypted,
                searchHash
            };
            logger.info("Searchable PII encryption successful", {
                operationId: opId,
                hasSearchHash: !!searchHash
            });
            return result;
        }
        catch (error) {
            logger.error("Searchable PII encryption failed", error, { operationId: opId });
            throw new Error("Searchable encryption operation failed");
        }
    });
}
function generateSearchHash(plaintext) {
    try {
        const searchKey = crypto.pbkdf2Sync(process.env.SEARCH_SALT || 'default-search-salt', plaintext.toLowerCase().trim(), 100000, 32, 'sha256');
        const searchHash = crypto.createHmac('sha256', searchKey)
            .update(plaintext.toLowerCase().trim())
            .digest('base64');
        searchKey.fill(0);
        return searchHash;
    }
    catch (error) {
        logger.error("Search hash generation failed", error);
        throw new Error("Search hash generation failed");
    }
}
function decryptLegacyPII(encryptedData, fallbackOperationId) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const opId = fallbackOperationId || crypto.randomUUID();
        try {
            if (!encryptedData || typeof encryptedData !== 'object') {
                throw new Error("Invalid encrypted data structure");
            }
            const { encryptedData: data, encryptedKey, iv, tag, keyId, algorithm, version } = encryptedData;
            if (!data || !encryptedKey || !iv || !tag || !keyId || !algorithm) {
                throw new Error("Missing required encryption components");
            }
            if (algorithm !== ALGORITHM) {
                throw new Error(`Unsupported encryption algorithm: ${algorithm}`);
            }
            if (version !== 1) {
                throw new Error(`Unsupported encryption version: ${version}`);
            }
            logger.info("Decrypting data key for legacy PII decryption", { operationId: opId });
            const decryptCommand = new client_kms_1.DecryptCommand({
                CiphertextBlob: Buffer.from(encryptedKey, 'base64'),
                KeyId: keyId
            });
            const { Plaintext: dataKey } = yield kmsClient.send(decryptCommand);
            if (!dataKey) {
                throw new Error("Failed to decrypt data key");
            }
            const aadAttempts = [
                Buffer.from(opId),
                null,
                Buffer.from(''),
                Buffer.from('default-operation-id'),
                Buffer.from('encryption-operation'),
                Buffer.from('00000000-0000-0000-0000-000000000000'),
                Buffer.from('11111111-1111-1111-1111-111111111111'),
                Buffer.from('signup-operation'),
                Buffer.from('encrypt-pii'),
                Buffer.from('data-encryption'),
            ];
            const derivedAADs = [
                Buffer.from(encryptedKey, 'base64').slice(0, 16),
                Buffer.from(keyId),
                Buffer.from(iv, 'base64'),
                Buffer.from(crypto.createHash('sha256').update(data).digest('hex').substring(0, 36)),
            ];
            const allAADAttempts = [...aadAttempts, ...derivedAADs];
            for (let i = 0; i < allAADAttempts.length; i++) {
                try {
                    const aad = allAADAttempts[i];
                    const decipher = crypto.createDecipheriv(algorithm, dataKey, Buffer.from(iv, 'base64'));
                    if (aad !== null) {
                        decipher.setAAD(aad);
                    }
                    decipher.setAuthTag(Buffer.from(tag, 'base64'));
                    let decrypted = decipher.update(data, 'base64', 'utf8');
                    decrypted += decipher.final('utf8');
                    dataKey.fill(0);
                    (0, piiSafety_1.auditPIIOperation)('READ', 'EMAIL', true, undefined, {
                        operationId: opId,
                        keyId: keyId,
                        algorithm: algorithm,
                        legacyDecryption: true,
                        aadAttempt: i,
                        aadType: i < aadAttempts.length ? 'standard' : 'derived'
                    });
                    logger.info("Legacy PII decryption successful", {
                        operationId: opId,
                        algorithm: algorithm,
                        aadAttempt: i,
                        aadType: i < aadAttempts.length ? 'standard' : 'derived'
                    });
                    return decrypted;
                }
                catch (_a) {
                    logger.info(`AAD attempt ${i} failed, trying next approach`, {
                        operationId: opId,
                        attempt: i,
                        aadType: i < aadAttempts.length ? 'standard' : 'derived'
                    });
                    continue;
                }
            }
            dataKey.fill(0);
            throw new Error("All decryption attempts failed - data may be corrupted or use unsupported encryption parameters");
        }
        catch (error) {
            (0, piiSafety_1.auditPIIOperation)('READ', 'EMAIL', false, undefined, {
                operationId: opId,
                error: error instanceof Error ? error.message : 'Unknown error',
                legacyDecryption: true
            });
            logger.error("Legacy PII decryption failed", error, { operationId: opId });
            if (error instanceof Error &&
                (error.message.includes("Invalid encrypted data") ||
                    error.message.includes("Missing required encryption") ||
                    error.message.includes("Unsupported encryption"))) {
                throw error;
            }
            throw new Error("Legacy decryption operation failed");
        }
    });
}
function validateKMSKey(kmsKeyId) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            const testCommand = new client_kms_1.GenerateDataKeyCommand({
                KeyId: kmsKeyId,
                KeySpec: "AES_256"
            });
            const result = yield kmsClient.send(testCommand);
            if (result.Plaintext) {
                result.Plaintext.fill(0);
            }
            return !!(result.CiphertextBlob);
        }
        catch (error) {
            logger.error("KMS key validation failed", error, { keyId: kmsKeyId });
            return false;
        }
    });
}
