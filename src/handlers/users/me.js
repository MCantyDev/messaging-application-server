const { where } = require('sequelize');
const database = require('../../database');

async function getMe(req, res) {
    try {
        // Assuming req.accessTokenPayload contains the user ID
        const userId = req.accessTokenPayload.id;

        // Fetching user details from the database
        const user = await database.User.findOne({
            where: { id: userId },
            attributes: ['id', 'username', 'email']
        });
        
        // If user is not found, return a 404 error
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Return the user details
        res.status(200).json({
            id: user.id,
            username: user.username,
            email: user.email
        });
    } catch (err) {
        console.error("Error in getMe handler:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

function patchMe(req, res) {
    res.status(200).json({ message: "Patching Me!" });
}

async function deleteMe(req, res) {
    try {
        // Assuming req.accessTokenPayload contains the user ID
        const userId = req.accessTokenPayload.id;

        // Fetching user details from the database
        const user = await database.User.findByPk(userId);
        
        // User Must Exist so no need to check for existence
        // Delete the user from the database
        await user.softDelete();

        // Clear the cookies
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');

        // Return a success message
        res.status(200).json({ message: "User - " + req.accessTokenPayload.username + " - deleted successfully" });

    } catch (err) {
        console.error("Error in getMe handler:", err);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = {
    getMe, patchMe, deleteMe
}