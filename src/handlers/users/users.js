function searchByUsername(req, res) {
    const username = req.params.username;

    res.status(200).json({ message: "Searching for user: " + username });
}

module.exports = {
    searchByUsername
}