const passwordUtility = require('../utils/password_utility');
const database = require('../database');

const jwtService = require('../services/jwt_service');
const jwtConfig = require('../../config/jwt-config');

async function signup(req, res) {
    // Checking if the database connection is established
    // This is important to ensure that we can interact with the database
    if (!database || !database.sequelize) {
        return res.status(500).json({ error: "Database connection not established" });
    }

    // Extracting user details from the request body
    const requiredFields = ['firstName', 'lastName', 'username', 'email', 'password'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
        return res.status(400).json({ error: "Missing required fields: " + missingFields.join(', ') });
    }

    // Hashing the password
    let hashedPassword;
    try {
        hashedPassword = await passwordUtility.hashPassword(req.body.password);
    } catch (error) {
        return res.status(500).json({ error: "Error hashing password: " + error.message });
    }

    // Creating a new user in the database using a transaction
    let user;
    try {
        const result = await database.sequelize.transaction(async t => {
            user = await database.User.create({
                first_name: req.body.firstName,
                last_name: req.body.lastName,
                username: req.body.username,
                email: req.body.email,
                password_hashed: hashedPassword
            }, { transaction: t });
        })
    } catch (err) {
        return res.status(500).json({ error: err.errors ? err.errors.map(e => e.message).join(', ') : "Error creating user" });
    }

    // Generate JWT tokens (access and refresh)
    let access, refresh;
    try { 
        access = jwtService.generateAccessToken({ id: user.id, username: user.username });
        refresh = jwtService.generateRefreshToken({ id: user.id, username: user.username });
    } catch (err) {
        return res.status(500).json({ error: "Error generating tokens: " + err.message });
    }

    // Save Refresh Token in the database
    try {
        const result = await database.sequelize.transaction(async t => {
            const token = await database.RefreshToken.create({
                user_id: user.id,
                token: refresh,
                issued_at: new Date(),
                expires_at: new Date(Date.now() + jwtConfig.REFRESH_EXPIRATION * 1000),
                revoked: false
            }, { transaction: t });
            return token;
        });
    } catch (err) {
        return res.status(500).json({ error: "Error saving refresh token: " + err.message });
    }

    // Set the JWT tokens in cookies
    res.cookie('access_token', access, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
    });
    res.cookie('refresh_token', refresh, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
    });
    
    // If user creation is successful, return a success message
    res.status(200).json({ message: "Creating new user: " + user.username });
}

async function login(req, res) {
    // Checking if the database connection is established
    // This is important to ensure that we can interact with the database
    if (!database || !database.sequelize) {
        return res.status(500).json({ error: "Database connection not established" });
    }

    // Extracting login details from the request body
    const requiredFields = ['username', 'password'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
        return res.status(400).json({ error: "Missing required fields: " + missingFields.join(', ') });
    }

    // Find the User by (unique) Username
    let user;
    try {
        user = await database.User.findOne({
            where: { 
                username: req.body.username,
                // Ensure the user is not soft-deleted
                deleted: false,
                deleted_at: null,
            }
        });
    } catch (error) {
        return res.status(500).json({ error: "Error finding user: " + error.message });
    }

    // If user not found, return an error
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    // Verify the password
    let isPasswordValid;
    try {
        isPasswordValid = await passwordUtility.verifyPassword(req.body.password, user.password_hashed);
    } catch (error) {
        return res.status(500).json({ error: "Error verifying password: " + error.message });
    }

    if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid password" });
    }

    // Generate JWT tokens (access and refresh) here if needed
    let access, refresh;
    try { 
        access = jwtService.generateAccessToken({ id: user.id, username: user.username });
        refresh = jwtService.generateRefreshToken({ id: user.id, username: user.username });
    } catch (err) {
        return res.status(500).json({ error: "Error generating tokens: " + err.message });
    }

    // Save Refresh Token in the database
    try {
        const result = await database.sequelize.transaction(async t => {
            const token = await database.RefreshToken.create({
                user_id: user.id,
                token: refresh,
                issued_at: new Date(),
                expires_at: new Date(Date.now() + jwtConfig.REFRESH_EXPIRATION * 1000),
                revoked: false
            }, { transaction: t });
            return token;
        });
    } catch (err) {
        return res.status(500).json({ error: "Error saving refresh token: " + err.message });
    }

    // Set the JWT tokens in cookies
    // 'httpOnly' prevents client-side scripts from accessing the cookies
    // 'secure' ensures cookies are sent over HTTPS only in production
    // 'sameSite' helps prevent CSRF attacks
    res.cookie('access_token', access, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
    });
    res.cookie('refresh_token', refresh, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
    });


    // If login is successful, return a success message
    res.status(200).json({ 
        message: "User logged in successfully as " + user.username,
    });
}

async function logout(req, res) {
    // Checking if the database connection is established
    if (!database || !database.sequelize) {
        return res.status(500).json({ error: "Database connection not established" });
    }

    // Find the refresh token in the database
    let tokenRecord;
    try {
        tokenRecord = await database.RefreshToken.findOne({
            where: { user_id: req.accessTokenPayload.id, token: req.cookies.refresh_token, revoked: false }
        });
    } catch (error) {
        return res.status(500).json({ error: "Error finding refresh token: " + error.message });
    }

    // If no token record is found, return an error
    if (!tokenRecord) {
        return res.status(404).json({ error: "Refresh token not found or already revoked" });
    }

    // // Revoke the refresh token in the database
    try {
        await database.sequelize.transaction(async t => {
            await database.RefreshToken.update(
                { revoked: true },
                { where: { id: tokenRecord.id },  transaction: t  }
            );
        });
    } catch (error) {
        return res.status(500).json({ error: "Error revoking refresh token: " + error.message });
    }

    // Clear the cookies
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    // // If logout is successful, return a success message
    res.status(200).json({ message: "Logging out of user: " + req.accessTokenPayload.username });
}

module.exports = {
    signup, login, logout
}