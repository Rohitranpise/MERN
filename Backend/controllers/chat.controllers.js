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


const createGroupChat = async (req, res) => {

    if (!req.body.users || !req.body.name) {
        res.status(400).send({ message: 'please fill all the fields' })
        return;
    }

    let users = JSON.parse(req.body.users)

    if (users.length < 2) {
        res.status(400).send(`more than two users required!`)
        return
    }

    users.push(req.user)

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
        })

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
        res.status(200).json(fullGroupChat)
        return;
    } catch (error) {
        res.status(400).send(error)
        return;
    }
}


const renameGroup = async (req, res) => {
    const { chatId, chatName } = req.body

    const upadatedChat = await Chat.findByIdAndUpdate(chatId,
        {
            chatName
        }, { new: true })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")

    if (!upadatedChat) {
        res.status(404)
        throw new Error(`Chat not found`)
    } else {
        res.status(200)
            .json(upadatedChat)
        return;
    }
}


const addToGroup = async (req, res) => {
    const { chatId, userId } = req.body

    const addTo = await Chat.findByIdAndUpdate(chatId,
        { $push: { users: userId } },
        { new: true })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
    if (!addTo) {
        res.status(404)
        throw new Error(`Chat not found`)
    } else {
        res.status(200)
            .json(addTo)
        return;
    }
}


const removeFromGroup = async (req, res) => {
    const { chatId, userId } = req.body

    const removeTo = await Chat.findByIdAndUpdate(chatId,
        { $pull: { users: userId } },
        { new: true })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
    if (!removeTo) {
        res.status(404)
        throw new Error(`Chat not found`)
    } else {
        res.status(200)
            .json(removeTo)
        return;
    }
}

module.exports = {
    accessChat,
    fetchChats,
    createGroupChat,
    renameGroup,
    addToGroup,
    removeFromGroup,
}