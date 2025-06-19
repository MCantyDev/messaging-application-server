function getFriends(req, res) {
    res.status(200).json({ message: "Friends List!!!!" });
}

function addFriend(req, res) {
    const friend = req.body.friend;

    res.status(200).json({ message: "Sending Friend Request to " + friend });
}

function deleteFriend(req, res) {
    const friend = req.params.friend;

    res.status(200).json({ messages: "Removing Friend: " + friend });
}

module.exports = {
    getFriends, addFriend, deleteFriend
}