function signup(req, res) {
    const username = req.body.username; 

    res.status(200).json({ message: "Creating new user: " + username });
}

function login(req, res) {
    const username = req.body.username; 
    
    res.status(200).json({ message: "Logging in to user: " + username });
}

function logout(req, res) {
    const username = req.body.username; 
    
    res.status(200).json({ message: "Logging out of user: " + username });
}

module.exports = {
    signup, login, logout
}