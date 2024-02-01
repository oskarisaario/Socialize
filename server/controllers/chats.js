import Chat from "../models/Chat.js";



export const createChat = async (req, res) => {
  try {
    const newChat = new Chat({
      members: [req.body.senderId, req.body.receiverId]
    });
    const savedChat = await newChat.save();
    res.status(201).json(savedChat);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};


export const getChats = async (req, res) => {
  try {
    const chat = await Chat.find({
      members: { $in:[req.params.userId]}
    });
    res.status(200).json(chat);
  } catch (err) {
    res.status(404).json(err);
  }
};


export const getChat = async (req, res) => {
  try {
    const chat = await Chat.findOne({
      members: { $all: [req.params.userId, req.params.otherUserId] },
    })
    res.status(200).json(chat);
  } catch (err) {
    res.status(500).json(err);
  }
};