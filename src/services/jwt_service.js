const jwt = require('jsonwebtoken');
const config = require('../../config/jwt-config');

// JWT Access Token Generation
/**
 * Generates a JWT access token.
 * @param {Object} payload - The payload to include in the token.
 * @return {string} - The generated JWT access token.
 * @throws {Error} - If token generation fails.
 * @example
 * const token = generateAccessToken({ id: user.id, username: user.username });
 */
function generateAccessToken(payload) {
    try {
        const token = jwt.sign(payload, config.ACCESS_KEY, {
            expiresIn: Number(config.ACCESS_EXPIRATION),
            issuer: config.ISSUER,
            audience: config.AUDIENCE,
            algorithm: config.ALGORITHM,
        });
        return token;
    } catch (error) {
        throw new Error('Error generating access token: ' + error.message);
    }
};

// JWT Refresh Token Generation
/**
 * Generates a JWT refresh token.
 * @param {Object} payload - The payload to include in the token.
 * @return {string} - The generated JWT refresh token.
 * @throws {Error} - If token generation fails.
 * @example
 * const refreshToken = generateRefreshToken({ id: user.id, username: user.username });
 */
function generateRefreshToken(payload) {
    try {
        const token = jwt.sign(payload, config.REFRESH_KEY, {
            expiresIn: Number(config.REFRESH_EXPIRATION),
            issuer: config.ISSUER,
            audience: config.AUDIENCE,
            algorithm: config.ALGORITHM,
        });
        return token;
    } catch (error) {
        throw new Error('Error generating refresh token: ' + error.message);
    }
}

// JWT Token Verification
/**
 * Verifies a JWT token.
 * @param {string} token - The JWT token to verify.
 * @return {Object} - The decoded payload if the token is valid.
 * @throws {Error} - If token verification fails or the token is invalid.
 * @example
 * const decoded = verifyToken(token);
 */
function verifyAccessToken(token,) {
    try {
        const decoded = jwt.verify(token, config.ACCESS_KEY, {
            issuer: config.ISSUER,
            audience: config.AUDIENCE,
            algorithms: [config.ALGORITHM],
        });
        return decoded;
    } catch (error) {
        throw new Error('Error verifying token: ' + error.message);
    };
};

/**
 * Verifies a JWT refresh token.
 * @param {string} token - The JWT refresh token to verify.
 * @return {Object} - The decoded payload if the token is valid.
 * @throws {Error} - If token verification fails or the token is invalid.
 * @example
 * const decoded = verifyRefreshToken(token);
 */
function verifyRefreshToken(token) {
    try {
        const decoded = jwt.verify(token, config.REFRESH_KEY, {
            issuer: config.ISSUER,
            audience: config.AUDIENCE,
            algorithms: [config.ALGORITHM],
        });
        return decoded;
    } catch (error) {
        throw new Error('Error verifying refresh token: ' + error.message);
    };
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
}