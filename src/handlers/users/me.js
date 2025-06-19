function getMe(req, res) {
    res.status(200).json({ message: "Getting Me!" });
}

function patchMe(req, res) {
    res.status(200).json({ message: "Patching Me!" });
}

function deleteMe(req, res) {
    res.status(200).json({ message: "Deleting Me!" });
}

module.exports = {
    getMe, patchMe, deleteMe
}