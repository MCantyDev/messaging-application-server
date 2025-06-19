// Password Hashing Utility
const bcrypt = require('bcrypt');

/**
 * Hashes a password using bcrypt.
 * @param {string} password - The password to hash.
 * @return {Promise<string>} - The hashed password.
 * @throws {Error} - If hashing fails.
 * @example
 * const hashedPassword = await hashPassword('mySecurePassword');
 */

async function hashPassword(password) {
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        throw new Error('Error hashing password: ' + error.message);
    };
};

/**
 * Verifies a password against a hashed password.
 * @param {string} password - The plain text password to verify.
 * @param {string} hashedPassword - The hashed password to compare against.
 * @return {Promise<boolean>} - True if the password matches, false otherwise.
 * @throws {Error} - If verification fails.
 * @example 
 * const isMatch = await verifyPassword('mySecurePassword', hashedPassword);
 */
async function verifyPassword(password, hashedPassword) {
    try {
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
    } catch (error) {
        throw new Error('Error verifying password: ' + error.message);
    };
};

module.exports = {
    hashPassword,
    verifyPassword
};