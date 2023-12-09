const Chat = require("../models/chat.model");
const User = require("../models/user.model");

const accessChat = async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        console.log(`userId is not sent`)
        res.status(400).send(`error`)
    }

    let isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $req: req.user._id } } },
            { users: { $elemMatch: { $req: userId } } },
        ]
    })
        .populate("users", "-password")
        .populate("latestMessage")

    isChat = await User.populate(isChat, {
        path: 'latestMessage.sender',
        select: 'name pic email'
    })

    if (isChat.length > 0) {
        res.send(isChat[0])
        return;
    }
}


module.exports = {
    accessChat,
}