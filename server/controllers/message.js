import Message from "../models/Message.js";


export const createMessage = async (req, res) => {
  const newMessage = new Message(req.body);
  try {
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json(err);
  }
};


export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      chatId: req.params.chatId,
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
};