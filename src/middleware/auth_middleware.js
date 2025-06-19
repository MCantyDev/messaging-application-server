const jwtService = require('../services/jwt_service');
const database = require('../database');

async function authMiddleware(req, res, next) {
    const accessToken = req.cookies.access_token;

    if (!accessToken) {
        return await handleRefreshToken(req, res, next);
    };

    try {
        const decodedAccessToken = jwtService.verifyAccessToken(accessToken);
        req.accessTokenPayload = decodedAccessToken;
        return next();
    } catch (err) {
        return await handleRefreshToken(req, res, next);
    };
}

async function handleRefreshToken(req, res, next) {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
        return res.status(401).json({ error: "Unauthorised" });
    };

    try {
        const decodedRefreshToken = jwtService.verifyRefreshToken(refreshToken);
        req.refreshTokenPayload = decodedRefreshToken;

        // Check if the user exists in the database
        const tokenRecord = await database.RefreshToken.findOne({
            where: { token: refreshToken, revoked: false }
        });

        // If no token record is found, return an error
        if (!tokenRecord) {
            return res.status(401).json({ error: "Invalid or revoked refresh token" });
        }

        // Generate new access token
        const newAccessToken = jwtService.generateAccessToken({
            id: decodedRefreshToken.id,
            username: decodedRefreshToken.username
        });

        res.cookie('access_token', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict'
        });

        req.accessTokenPayload = jwtService.verifyAccessToken(newAccessToken);
        return next();
    } catch (err) {
        return res.status(401).json({ error: "Unauthorised" });
    };
};

module.exports = {
    authMiddleware
};
