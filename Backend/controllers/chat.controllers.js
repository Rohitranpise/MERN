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
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } },
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
    } else {
        let chatData = {
            chatName: 'sender',
            isGroupChat: false,
            users: [req.user._id, userId]
        }

        try {
            const createdChat = await Chat.create(chatData)

            const FullChat = await Chat.findOne({ _id: createdChat._id }).populate("users", "-password")
            res.status(200).send(FullChat)
            return;
        } catch (error) {
            res.status(400)
            throw new Error(error.message)
        }
    }
}

const fetchChats = async (req, res) => {
    try {
        Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
            .then(async (result) => {
                result = await User.populate(result, {
                    path: "latestMessage.sender",
                    select: "name pic email"
                })
                res.status(200).send(result)
            })
        return;
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
}

module.exports = {
    accessChat,
    fetchChats,
}